import type { ContactRequest } from '../types';
import { createEncryptedFetch, type ApiFetch } from './payloadCrypto';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
/** The engine's payload public key (logged by reverion_engine at startup). */
const PAYLOAD_PUBLIC_KEY = import.meta.env.VITE_PAYLOAD_PUBLIC_KEY as string | undefined;
/** On unless set to "false" — the escape hatch for an engine without `/x`. */
const PAYLOAD_TUNNEL = import.meta.env.VITE_PAYLOAD_TUNNEL !== 'false';

/**
 * With VITE_PAYLOAD_PUBLIC_KEY set, request and response bodies are sealed to
 * the engine's key (see payloadCrypto.ts). Without it this is plain fetch,
 * which an engine with PAYLOAD_ENCRYPTION_REQUIRED=true refuses.
 */
const engineFetch: ApiFetch = PAYLOAD_PUBLIC_KEY
    ? createEncryptedFetch(PAYLOAD_PUBLIC_KEY, API_BASE, { tunnel: PAYLOAD_TUNNEL })
    : (path, init) => fetch(`${API_BASE}${path}`, init);

interface ContactRequestForm {
    name: string;
    email: string;
    company: string;
    service: string;
    budget: string;
    description: string;
    timeline: string;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await engineFetch(path, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers as Record<string, string> },
    });

    const text = await res.text();
    // Handler errors are JSON ({ error }); middleware rejections are plain text.
    const data = (() => {
        try { return text ? JSON.parse(text) : undefined; } catch { return undefined; }
    })();

    if (res.status === 429) {
        throw new Error('Too many requests. Please wait a few minutes and try again.');
    }
    if (!res.ok) {
        throw new Error(data?.error ?? (text || `Request failed (${res.status})`));
    }
    return data as T;
}

/** The form is sealed to the engine's key by engineFetch, then emailed by reverion_mailer. */
export async function submitContactRequest(form: ContactRequestForm): Promise<void> {
    await apiFetch<{ success: boolean }>('/auth/contact', {
        method: 'POST',
        body: JSON.stringify(form),
    });
}

export async function fetchContactRequests(): Promise<ContactRequest[]> {
    const rows = await apiFetch<Record<string, unknown>[]>('/contacts');
    return rows.map(mapRow);
}

export async function updateRequestStatus(
    id: string,
    status: ContactRequest['status']
): Promise<void> {
    await apiFetch(`/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}

export async function deleteContactRequest(id: string): Promise<void> {
    await apiFetch(`/contacts/${id}`, { method: 'DELETE' });
}

export async function clearAllContactRequests(): Promise<void> {
    await apiFetch('/contacts', { method: 'DELETE' });
}

function mapRow(row: Record<string, unknown>): ContactRequest {
    return {
        id: row.id as string,
        name: row.name as string,
        email: row.email as string,
        company: (row.company as string) ?? '',
        service: (row.service as string) ?? '',
        budget: (row.budget as string) ?? '',
        description: row.description as string,
        timeline: (row.timeline as string) ?? '',
        status: (row.status as ContactRequest['status']) ?? 'new',
        createdAt: (row.created_at as string) ?? new Date().toISOString(),
    };
}

import type { ContactRequest } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

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
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers as Record<string, string> },
        ...options,
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Request failed (${res.status})`);
    }

    return res.json();
}

export async function submitContactRequest(form: ContactRequestForm): Promise<ContactRequest> {
    const row = await apiFetch<Record<string, unknown>>('/auth/contact', {
        method: 'POST',
        body: JSON.stringify(form),
    });
    return mapRow(row);
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

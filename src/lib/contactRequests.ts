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

    const data = await res.json();
    if (data && typeof data === 'object' && 'payload' in data && typeof data.payload === 'string') {
        return (await decryptPayload(data.payload)) as T;
    }
    return data as T;
}

async function encryptPayload(data: unknown): Promise<string> {
    const enc = new TextEncoder();
    // Using the same 32-byte secret key expected by the backend
    const keyBytes = enc.encode("super_secure_key_32_bytes_length");

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = enc.encode(JSON.stringify(data));

    const encryptedBuf = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encodedData
    );

    const encryptedBytes = new Uint8Array(encryptedBuf);
    const combined = new Uint8Array(iv.length + encryptedBytes.length);
    combined.set(iv);
    combined.set(encryptedBytes, iv.length);

    let binary = '';
    for (let i = 0; i < combined.length; i++) {
        binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
}

async function decryptPayload(encryptedBase64: string): Promise<any> {
    const enc = new TextEncoder();
    const keyBytes = enc.encode("super_secure_key_32_bytes_length");

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );

    const binary = atob(encryptedBase64);
    const combined = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        combined[i] = binary.charCodeAt(i);
    }

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decryptedBuf = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        ciphertext
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decryptedBuf));
}

export async function submitContactRequest(form: ContactRequestForm): Promise<ContactRequest> {
    const encrypted = await encryptPayload(form);

    const row = await apiFetch<Record<string, unknown>>('/auth/contact', {
        method: 'POST',
        body: JSON.stringify({ payload: encrypted }),
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

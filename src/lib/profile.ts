import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export interface ProfileData {
    id: string;
    name: string;
    email: string;
    role: string | null;
    company: string | null;
    phone: string | null;
}

export interface UpdateProfilePayload {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    role?: string;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function fetchProfile(): Promise<ProfileData> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/profile`, { headers });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Failed to load profile (${res.status})`);
    }
    return res.json();
}

export async function updateProfile(data: UpdateProfilePayload): Promise<ProfileData> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Failed to update profile (${res.status})`);
    }
    return res.json();
}

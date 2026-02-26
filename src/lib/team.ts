import { supabase } from './supabase';
import type { TeamMember } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/team`, { headers });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Failed to load team members (${res.status})`);
    }
    const data = await res.json();
    return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        jobTitle: item.job_title || 'Employee',
        status: item.status,
    }));
}

export async function updateTeamMemberStatus(id: string, status: 'applicant' | 'active' | 'inactive'): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/team/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Failed to update member status (${res.status})`);
    }
}

export async function removeTeamMember(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/team/${id}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Failed to remove team member (${res.status})`);
    }
}

export async function fetchMyTeamStatus(): Promise<{ status: string | null; is_admin: boolean; job_title?: string | null }> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/team/me`, { headers });
        if (!res.ok) {
            return { status: null, is_admin: false, job_title: null }; // Fail silently for non-team users
        }
        return res.json();
    } catch {
        return { status: null, is_admin: false, job_title: null };
    }
}

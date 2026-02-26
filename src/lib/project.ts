import { supabase } from './supabase';
import type { DashboardProject } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function fetchProjects(): Promise<DashboardProject[]> {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/projects`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch projects');
    }

    return res.json();
}

export async function createProject(name: string, clientEmail: string): Promise<DashboardProject> {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, client_email: clientEmail })
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create project');
    }

    return res.json();
}

export interface PostUpdatePayload {
    date: string;
    phase_id: number;
    content: string;
    author: 'client' | 'developer';
    milestones?: { label: string; date: string; done: boolean }[];
    deliverables?: { name: string; status: string }[];
    progress?: number;
}

export async function postProjectUpdate(projectId: string, payload: PostUpdatePayload): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/projects/${projectId}/updates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        throw new Error('Failed to post project update');
    }
}

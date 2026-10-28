import type { ApiErrorResponse } from './types.js';

const PROD_HOSTS = ['salmanchik.com', 'slmnchk.github.io'];

export const API_BASE_URL: string = PROD_HOSTS.includes(window.location.hostname)
    ? 'https://api.salmanchik.com'
    : '/api';


export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, init);

    if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as ApiErrorResponse | null;
        throw new Error(errorBody?.message ?? `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
}

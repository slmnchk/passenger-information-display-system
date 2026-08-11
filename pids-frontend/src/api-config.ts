import type { ApiErrorResponse } from './types.js';

export const API_BASE_URL: string =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8080'
        : 'https://api.salmanchik.com';


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

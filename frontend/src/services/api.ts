import type { Method } from "../types/Method";

const API_URL = import.meta.env.VITE_API_URL;

export async function api(path: string, method: Method = 'GET', body?: unknown) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}`);        
    }
    return data;
}
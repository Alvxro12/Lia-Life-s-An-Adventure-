// utils/api.ts
"use client";

import { AuthToken } from "./auth";

export async function api<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {

    const token = AuthToken.get();

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...options,
        headers,
    });

    // Token inválido → redirigir a login
    if (res.status === 401) {
        AuthToken.clear();
        window.location.href = "/login";
        throw new Error("No autorizado");
    }

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "Error en la solicitud");
    }

    return res.json() as Promise<T>;
}

// utils/auth.ts
"use client";

export const AuthToken = {
    set(token: string) {
        localStorage.setItem("lia_token", token);
    },
    get() {
        return localStorage.getItem("lia_token");
    },
    clear() {
        localStorage.removeItem("lia_token");
    },
};

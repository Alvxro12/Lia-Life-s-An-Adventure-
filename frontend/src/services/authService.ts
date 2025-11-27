// services/authService.ts
import { api } from "@/utils/api";
import { AuthToken } from "@/utils/auth";

export const AuthService = {
    async login(email: string, password: string) {
        const res = await api<{ access_token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        
        AuthToken.set(res.access_token);
        return res;
    },

    async register(name: string, email: string, password: string) {
        return api("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });
    },

    logout() {
        AuthToken.clear();
        window.location.href = "/login";
    }
};

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";
import { AuthToken } from "@/utils/auth";

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
        await AuthService.register(name, email, password);
        router.push("/login");
    } catch (err: any) {
        alert(err.message);
    }
}


    return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-background text-text">
            <div className="w-full max-w-sm bg-card border border-accent/20 rounded-xl p-6 shadow-lg">

                <h1 className="text-2xl font-serif text-accent mb-6 text-center">
                    Crear cuenta
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm">Nombre</label>
                        <input
                            type="text"
                            className="rounded-md border border-accent/30 bg-background px-3 py-2 text-sm outline-none focus:border-accent transition"
                            placeholder="Tu nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm">Email</label>
                        <input
                            type="email"
                            className="rounded-md border border-accent/30 bg-background px-3 py-2 text-sm outline-none focus:border-accent transition"
                            placeholder="tucorreo@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm">Contraseña</label>
                        <input
                            type="password"
                            className="rounded-md border border-accent/30 bg-background px-3 py-2 text-sm outline-none focus:border-accent transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-accent text-accent-foreground py-2 text-sm font-medium hover:bg-accent/80 transition"
                    >
                        {loading ? "Creando..." : "Crear cuenta"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-text/70">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="text-accent hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}

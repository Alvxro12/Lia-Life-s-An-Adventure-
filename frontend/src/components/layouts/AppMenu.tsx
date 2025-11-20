"use client";

import Link from "next/link";
import { NAV_LINKS, NAV_ACTIONS } from "@/data/navigation";
import { useRouter} from "next/navigation";

interface AppMenuProps {
    variant: "landing" | "workspace";
    open: boolean;
    setOpen: (v: boolean) => void;
}

export function AppMenu({ variant, open, setOpen }: AppMenuProps) {
    const links = NAV_LINKS[variant];
    const action = NAV_ACTIONS[variant];
    const router = useRouter();
    // Si el drawer está cerrado -> no renderiza nada
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-lg px-8 pt-24">

            {/* Botón cerrar */}
            <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="absolute top-6 right-6 text-accent text-3xl"
            >
                ✕
            </button>

            {/* Navegación */}
            <nav className="flex flex-col gap-6 text-text/90 text-lg font-sans">

                {/* Links dinámicos */}
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="hover:text-accent transition"
                    >
                        {link.label}
                    </Link>
                ))}

                {/* Acción logout (solo en workspace) */}
                {variant === "workspace" && action && (
                    <button
                        onClick={() => {
                            router.push("/");
                            setOpen(false);
                        }}
                        className="flex items-center gap-2 text-red-400 hover:text-red-500 transition"
                    >
                        <action.icon className="h-5 w-5" />
                        {action.label}
                    </button>
                )}
            </nav>
        </div>
    );
}

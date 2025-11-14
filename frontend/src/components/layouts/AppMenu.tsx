"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_LINKS, NAV_ACTIONS } from "@/data/navigation";

interface AppMenuProps {
    variant: "landing" | "workspace";
    open: boolean;
    setOpen: (v: boolean) => void;
    isMobile?: boolean;
}

export function AppMenu({ variant, open, setOpen, isMobile }: AppMenuProps) {
    const links = NAV_LINKS[variant];
    const action = NAV_ACTIONS[variant];

    // versión móvil (drawer)
    if (isMobile) {
        if (!open) return null; // si no está abierto, no renderiza nada

        return (
            <div className="fixed inset-0 z-50 flex flex-col items-start justify-start bg-background/95 backdrop-blur-lg px-8 pt-24">
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

                    {/* Acción logout solo en dashboard */}
                    {variant === "workspace" && action && (
                        <button
                            onClick={() => console.log("Cerrar sesión")}
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

    // versión escritorio (sidebar)
    return (
        <aside className="hidden lg:flex flex-col justify-between w-52 border-r bg-card p-4">
            <nav className="space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition"
                        )}
                    >
                        {"icon" in link && link.icon && (
                            <link.icon className="h-5 w-5" />
                        )}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            {variant === "workspace" && action && (
                <button
                    onClick={() => console.log("Cerrar sesión")}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:text-red-500 transition"
                >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                </button>
            )}
        </aside>
    );
}

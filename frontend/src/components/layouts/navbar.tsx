"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { HamburgerButton } from "@/components/ui/hamburger-button";
import Link from "next/link";
import { AppMenu } from "@/components/layouts/AppMenu";

export function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Detecta si estamos bajo el app router privado.
    // 🔎 Importante: las rutas protegidas viven en /workspace, no en /dashboard.
    // Si volvemos a renombrar la sección privada, recuerda ajustar este prefijo.
    const isWorkspace = pathname.startsWith("/workspace");

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-card backdrop-blur-md border-b border-accent/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Link href="/" className="font-serif text-accent text-xl">
                        LIA
                    </Link>

                    {/* Enlaces desktop (solo landing) */}
                    {!isWorkspace && (
                        <div className="hidden md:flex gap-6 font-sans text-text/80">
                            <Link href="#features" className="hover:text-accent transition">
                                Características
                            </Link>
                            <Link href="#about" className="hover:text-accent transition">
                                Sobre LIA
                            </Link>
                            <Link href="/workspace" className="hover:text-accent transition">
                                Iniciar Sesión
                            </Link>
                        </div>
                    )}

                    {/* Hamburguesa universal */}
                    <div className="md:hidden">
                        <HamburgerButton open={open} setOpen={setOpen} />
                    </div>
                </div>
            </nav>

            {/* Drawer unificado */}
            <AppMenu
                variant={isWorkspace ? "workspace" : "landing"}
                open={open}
                setOpen={setOpen}
                isMobile
            />
        </>
    );
}

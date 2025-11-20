"use client";

import { useState } from "react";
import Link from "next/link";
import { HamburgerButton } from "@/components/ui/hamburger-button";
import { AppMenu } from "@/components/layouts/AppMenu";

export function NavbarPublic() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 z-50 flex h-16 w-full items-center border-b border-accent/10 bg-card/95 backdrop-blur-md">
                <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-10 mx-auto">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-serif text-xl text-accent"
                    >
                        LIA
                    </Link>

                    {/* Links desktop */}
                    <div className="hidden items-center gap-6 font-sans text-sm text-text/80 md:flex ml-40">
                        <Link
                            href="#features"
                            className="transition hover:text-accent"
                        >
                            Características
                        </Link>
                        <Link
                            href="#about"
                            className="transition hover:text-accent"
                        >
                            Sobre LIA
                        </Link>
                        <Link
                            href="#about"
                            className="transition hover:text-accent"
                        >
                            Contactanos
                        </Link>
                    </div>

                    <div className="hidden items-center gap-6 font-sans text-sm text-text/80 md:flex">
                        <Link
                            href="/login"
                            className="rounded-md border border-accent/40 px-3 py-1.5 text-accent transition hover:bg-accent hover:text-accent-foreground"
                        >
                            Iniciar sesión
                        </Link>
                        {/* Aquí ya apuntas a /login (cuando exista) */}
                        <Link
                            href="/register"
                            className="rounded-md border border-accent/40 px-3 py-1.5 text-accent transition hover:bg-accent hover:text-accent-foreground"
                        >
                            Regístrate
                        </Link>
                    </div>

                    {/* Hamburguesa mobile */}
                    <div className="flex md:hidden">
                        <HamburgerButton open={open} setOpen={setOpen} />
                    </div>
                </div>
            </nav>

            {/* Drawer mobile (usa la config de NAV_LINKS.landing) */}
            <AppMenu
                variant="landing"
                open={open}
                setOpen={setOpen}
            />
        </>
    );
}

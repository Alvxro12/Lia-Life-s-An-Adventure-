"use client";

import Link from "next/link";
import {User, LogOut } from "lucide-react";
import { HamburgerButton } from "@/components/ui/hamburger-button";
import { WorkspaceSearchBar } from "@/components/workspace/actionBar";
import { useRouter } from "next/navigation";

export function NavbarPrivate({
    onToggleSidebar,
}: {
    onToggleSidebar: () => void;
}) {
    const router = useRouter();
    return (
        <nav className="w-full h-14 border-b border-accent/10 bg-card/95 backdrop-blur-md flex items-center px-4 gap-4">

            {/* Izquierda */}
            <Link href="/" className="font-serif text-lg text-accent shrink-0">
                LIA
            </Link>

            {/* Centro */}
            <div className="flex-1 mx-4">
                <WorkspaceSearchBar
                    onCreate={() => console.log("Crear")}
                    onSearchChange={(value) => console.log("Buscar:", value)}
                />
            </div>

            {/* Derecha (acciones desktop) */}
            <div className="hidden md:flex items-center gap-4">
                <Link href="/profile" className="text-text/70 hover:text-accent">
                    <User className="h-5 w-5" />
                </Link>

                <button
                    onClick={() => {
                        router.push("/");
                    }}
                    className="text-red-400 hover:text-red-500"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
            {/* Mobile */}
            <div className="md:hidden">
                <HamburgerButton
                    open={false}
                    setOpen={() => {}}
                    onToggleSidebar={onToggleSidebar}
                />
            </div>

        </nav>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { Home, Book, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const options = [
    { href: "/workspace", icon: Home, label: "Workspaces" },
    // estos los activas más adelante:
    // { href: "/profile", icon: Settings, label: "Perfil" },
    // { href: "/settings", icon: Book, label: "Ajustes" },
];


export function SidebarLIA() {
    const pathname = usePathname();

    return (
        <div
            className={cn(
                "flex flex-col justify-between w-full h-full p-4 transition-all duration-300",
            )}
        >
            {/* Navegación */}
            <nav className="space-y-2 w-full">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    const active = pathname === opt.href;
                    return (
                        <Link
                            key={opt.href}
                            href={opt.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition",
                                active && "bg-accent text-accent-foreground",
                            )}
                        >
                            <Icon className="h-7 w-4" />
                            {<span>{opt.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Zona inferior */}
            <div className="space-y-3 w-full">
                <Button
                    variant="default"
                    className={cn(
                        "w-full flex items-center justify-start gap-2 bg-transparent text-white hover:bg-accent hover:text-accent-foreground",
                    )}
                >
                    <LogOut className="h-4 w-4" />
                    {<span>Salir</span>}
                </Button>
            </div>
        </div>
    );
}

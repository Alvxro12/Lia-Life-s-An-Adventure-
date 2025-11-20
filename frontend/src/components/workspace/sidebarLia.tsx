"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS, NAV_ACTIONS } from "@/data/navigation";

export function SidebarLIA() {
    const pathname = usePathname();
    const links = NAV_LINKS.workspace;        // ← fuente de verdad   // ← logout

    return (
        <div className="flex h-full w-full flex-col justify-between p-4">
            
            {/* Navegación */}
            <nav className="space-y-2 w-full">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition",
                                active && "bg-accent text-accent-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

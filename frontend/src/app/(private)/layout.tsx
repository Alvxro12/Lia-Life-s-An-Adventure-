"use client";

import { useState, useEffect } from "react";
import { AppMenu } from "@/components/layouts/AppMenu";
import { NavbarPrivate } from "@/components/layouts/navbarPrivate";
import { SidebarLIA } from "@/components/workspace/sidebarLia";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Cierra el menú móvil automáticamente en desktop (>= 1024px)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="h-screen flex flex-col bg-background text-text">
            
            {/* 🔹 Navbar fijo */}
            <NavbarPrivate onToggleSidebar={() => setMobileOpen(!mobileOpen)} />

            <div className="flex flex-1">
                
                {/* 💻 Sidebar fijo (solo escritorio) */}
                <aside className="hidden lg:block w-52 border-r bg-card">
                    <SidebarLIA />
                </aside>

                {/* 📱 Drawer móvil */}
                <AppMenu
                    variant="workspace"
                    open={mobileOpen}
                    setOpen={setMobileOpen}
                />

                {/* 🌍 Contenido principal */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

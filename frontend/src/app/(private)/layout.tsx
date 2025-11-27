"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppMenu } from "@/components/layouts/AppMenu";
import { NavbarPrivate } from "@/components/layouts/navbarPrivate";
import { SidebarLIA } from "@/components/workspace/sidebarLia";
import { AuthToken } from "@/utils/auth";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [ready, setReady] = useState(false);

    // 🛡️ Auth Guard
    useEffect(() => {
        const token = AuthToken.get();

        if (!token) {
            router.replace("/login");
            return;
        }

        setReady(true);
    }, []);

    // 📱 Cerrar sidebar en desktop
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
        <>
            {/* AQUI va la condición, NO antes */}
            {!ready ? (
                <div className="w-full h-screen bg-background"></div>
            ) : (
                <div className="h-screen flex flex-col bg-background text-text">
                    <NavbarPrivate onToggleSidebar={() => setMobileOpen(!mobileOpen)} />

                    <div className="flex flex-1">
                        <aside className="hidden lg:block w-52 border-r bg-card">
                            <SidebarLIA />
                        </aside>

                        <AppMenu
                            variant="workspace"
                            open={mobileOpen}
                            setOpen={setMobileOpen}
                        />

                        <main className="flex-1 overflow-y-auto">{children}</main>
                    </div>
                </div>
            )}
        </>
    );
}

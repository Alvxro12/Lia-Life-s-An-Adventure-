"use client";

import { useState, useEffect } from "react";
import { AppMenu } from "@/components/layouts/AppMenu";
import { HamburgerButton } from "@/components/ui/hamburger-button";
import { Navbar } from "@/components/layouts/navbar"; // 🔹 importa tu Navbar

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
        <div className="h-screen flex flex-col">
            {/* 🔹 Navbar fijo arriba */}
            <Navbar />
            {/* 🔹 Estructura principal */}
            <div className="flex pt-16 h-full"> 
                {/* 4rem = altura del navbar */}
                {/* 💻 Sidebar fijo (escritorio) */}
                <AppMenu variant="workspace" open={false} setOpen={() => {}} />
                {/* 📱 Drawer lateral (móvil) */}
                <AppMenu variant="workspace" open={open} setOpen={setOpen} isMobile />
                {/* 🌍 Contenido principal */}
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
        </> 
    );
}

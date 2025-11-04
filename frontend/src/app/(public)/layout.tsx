import { Navbar } from "@/components/layouts/navbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* 🔹 Navbar visible solo en rutas públicas */}
            <Navbar />

            {/* 🔹 Contenido principal */}
            <main className="min-h-screen pt-16">{children}</main>

            {/* 🔹 Footer opcional */}
            {/* <Footer /> */}
        </>
    );
}

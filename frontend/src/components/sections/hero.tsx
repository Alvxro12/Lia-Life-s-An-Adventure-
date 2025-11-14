"use client";

import { Container } from "@/components/ui/container";

export function HeroSection() {
    // 🔹 Scroll suave hacia la siguiente sección
    const scrollToMissions = () => {
        const target = document.getElementById("missions");
        if (target) target.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col justify-start items-center text-center bg-cover bg-center sm:bg-top pt-16"
            style={{
                backgroundImage: "url('/imagen_ampliada.png')", // coloca aquí la versión ampliada
            }}
        >
            {/* Capa de oscurecimiento suave para legibilidad */}
            <div className="absolute inset-0" />

            <Container className="relative z-10 flex flex-col items-center">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-4 drop-shadow-md">
                    Tu aventura comienza aquí
                </h1>

                <p className="text-base sm:text-lg text-text/90 max-w-2xl mx-auto mb-12">
                    Despliega tu pergamino, traza tus misiones y conviértete en el héroe de tu propia historia.
                </p>

                {/* Flecha animada */}
                <button
                    onClick={scrollToMissions}
                    aria-label="Desplazar hacia misiones"
                    className="text-accent text-4xl animate-bounce transition hover:scale-110"
                >
                    ↓
                </button>
            </Container>
        </section>
    );
}

import { Container } from "@/components/ui/container";

export default function HomePage() {
    return (
        <section
            className="flex flex-col items-center justify-center text-center py-20 px-4"
            aria-labelledby="hero-title"
        >
            <Container>
                <h1
                    id="hero-title"
                    className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-4"
                >
                    Bienvenido a tu aventura
                </h1>

                <p className="text-base sm:text-lg text-text/80 max-w-2xl mx-auto mb-8">
                    LIA transforma tus metas diarias en misiones, y tu progreso
                    personal en experiencia de héroe.
                </p>

                <button
                    className="h-10 px-6 rounded-xl bg-accent text-black font-medium hover:bg-accent/90 transition"
                >
                    Comienza tu viaje
                </button>
            </Container>
        </section> 
    );
}

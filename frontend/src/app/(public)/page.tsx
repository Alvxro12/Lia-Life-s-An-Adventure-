import { Navbar } from "@/components/layouts/navbar";
import {HeroSection} from "@/components/sections/hero"

export default function HomePage() {
    return (
        <section className="pt-16">
        <Navbar></Navbar>
            <main>
                <HeroSection />
            </main>
        </section>
    );
}

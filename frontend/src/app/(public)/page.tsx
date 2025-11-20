import { NavbarPublic } from "@/components/layouts/navbarPublic";
import {HeroSection} from "@/components/sections/hero"

export default function HomePage() {
    return (
        <section className="pt-16">
        <NavbarPublic></NavbarPublic>
            <main>
                <HeroSection />
            </main>
        </section>
    );
}

import "./globals.css";
import type { Metadata } from "next";
import { Lora, Merriweather } from "next/font/google";

const lora = Lora({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const merriweather = Merriweather({
    subsets: ["latin"],
    variable: "--font-serif",
    display: "swap",
});

export const metadata: Metadata = {
    title: "LIA — Lifes An Adventure!",
    description:
        "Convierte tu vida en una aventura. LIA combina productividad y RPG en una experiencia única.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="es"
            className={`dark ${lora.variable} ${merriweather.variable}`}
        >
            <body className="bg-background text-text font-sans antialiased">
                {children}
            </body>
        </html>
    );
}

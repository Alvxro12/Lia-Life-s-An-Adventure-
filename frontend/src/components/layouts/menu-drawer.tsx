"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MenuDrawerProps {
    open: boolean;
    setOpen: (v: boolean) => void;
}

export function MenuDrawer({ open, setOpen }: MenuDrawerProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="menu"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="fixed inset-0 z-50 flex flex-col items-start justify-start bg-background/95 backdrop-blur-lg px-8 pt-24"
                >
                    {/* Botón cerrar */}
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Cerrar menú"
                        className="absolute top-6 right-6 text-accent text-3xl"
                    >
                        ✕
                    </button>

                    {/* Enlaces */}
                    <nav className="flex flex-col gap-6 text-text/90 text-lg font-sans">
                    <h2 className="text-accent">Lia</h2>
                        {[
                            { href: "#features", label: "Características" },
                            { href: "#about", label: "Sobre LIA" },
                            { href: "#login", label: "Iniciar Sesión" },
                            { href: "#register", label: "Únete a la aventura" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className="hover:text-accent transition"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

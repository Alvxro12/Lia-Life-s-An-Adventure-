"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface HamburgerButtonProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    onToggleSidebar?: () => void;
}

export function HamburgerButton({ open, setOpen, onToggleSidebar }: HamburgerButtonProps) {

    function handleClick() {
        setOpen(!open);                     // anima el botón
        onToggleSidebar?.();                // abre/cierra el sidebar desde el layout
    }

    return (
        <button
            onClick={handleClick}
            aria-expanded={open}
            aria-label="Abrir menú"
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-accent/30 bg-background hover:bg-accent/10 transition-colors"
        >
            <motion.div
                key={open ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                {open ? (
                    <X className="w-6 h-6 text-accent" />
                ) : (
                    <Menu className="w-6 h-6 text-accent" />
                )}
            </motion.div>
        </button>
    );
}

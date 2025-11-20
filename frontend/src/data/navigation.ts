// src/data/navigation.ts
import type { LucideIcon } from "lucide-react";
import { Home, Book, Settings, LogOut } from "lucide-react";

/** Tipos base */
export type BaseLink = {
    href: string;
    label: string;
};

export type workspaceLink = BaseLink & {
    icon: LucideIcon; // los links del dashboard sí llevan ícono
};

export type NavAction = {
    label: string;
    icon: LucideIcon;
    action: "logout"; // puedes ampliar este union a futuro
};

/** Links públicos (landing) y privados (dashboard) */
export const NAV_LINKS: {
    landing: BaseLink[];
    workspace: workspaceLink[];
} = {
    landing: [
        { href: "#features", label: "Características" },
        { href: "#about", label: "Sobre LIA" },
        { href: "/login", label: "Iniciar Sesión" },
        { href: "/register", label: "Regístrate" },
    ],
    workspace: [
        { href: "/workspace", icon: Home, label: "Inicio" },
        { href: "/home", icon: Book, label: "Tableros" },
    ],
};

/** Acciones (separadas de los links) */
export const NAV_ACTIONS: {
    landing: null;              // no hay acciones en la landing
    workspace: NavAction;       // acción disponible en dashboard
} = {
    landing: null,
    workspace: {
        label: "Salir",
        icon: LogOut,
        action: "logout",
    },
};

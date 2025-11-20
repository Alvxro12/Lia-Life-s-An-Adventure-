"use client";

import { Search } from "lucide-react";

interface WorkspaceSearchBarProps {
    onCreate?: () => void;
    onSearchChange?: (value: string) => void;
}

export function WorkspaceSearchBar({
    onCreate,
    onSearchChange,
}: WorkspaceSearchBarProps) {
    return (
        <div className="flex w-full items-center justify-center gap-3">
            
            {/* 🔍 Buscar */}
            <div className="flex items-center w-full rounded-md border border-accent/20 bg-background px-3 py-2 max-w-lg hover:border-accent/40 transition">
                <Search className="h-4 w-4 text-text/60 mr-2" />
                <input
                    type="text"
                    placeholder="Buscar"
                    className="w-full bg-transparent text-sm outline-none text-text placeholder:text-text/50"
                    onChange={(e) => onSearchChange?.(e.target.value)}
                />
            </div>

            {/* 🟦 Crear */}
            <button
                onClick={onCreate}
                className="hidden sm:flex rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/80 transition"
            >
                Crear
            </button>
        </div>
    );
}

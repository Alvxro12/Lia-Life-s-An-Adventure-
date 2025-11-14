"use client";

import { useWorkspaces } from "@/hooks/useWorkSpace";
import type { Board } from "@/types/workspace";

export function useBoards(workspaceId: string) {
    const { workspaces } = useWorkspaces();

    // Buscar el workspace activo
    const workspace = workspaces.find((w) => w.id === workspaceId);

    // Si no existe, devolvemos lista vacía para evitar errores
    const boards: Board[] = workspace?.boards ?? [];

    return {
        boards,
        workspace, // opcional pero útil en muchos casos
    };
}

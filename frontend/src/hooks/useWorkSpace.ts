"use client";

import { useCallback } from "react";
import { useLiaStore } from "@/store/UseLiaStore";

/**
 * Hook fino que encapsula el acceso al Zustand store.
 *
 * 🚨 Riesgo detectado: si en el futuro migramos a datos remotos (React Query / SWR)
 * este hook será el punto único a reemplazar, evitando que componentes importen
 * directamente el store. Mantener este wrapper evita acoplar UI a la implementación.
 */
export function useWorkspaces() {
    const workspaces = useLiaStore((state) => state.workspaces);
    const createWorkspace = useLiaStore((state) => state.createWorkspace);

    const getWorkspace = useCallback(
        (id: string) => workspaces.find((workspace) => workspace.id === id),
        [workspaces],
    );

    return {
        workspaces,
        getWorkspace,
        createWorkspace,
    };
}

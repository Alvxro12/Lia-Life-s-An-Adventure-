import type { LiaState } from "@/store/UseLiaStore";
import type { Workspace } from "@/types/workspace";

import { findWorkspace } from "@/services/_helpers";

type SetFn = (partial: Partial<LiaState>) => void;
type GetFn = () => LiaState;

/**
 * SERVICE: Maneja la creación, edición y eliminación de Workspaces.
 */
export const WorkspaceService = {
    /**
     * Crea un nuevo workspace.
     */
    create(
        data: { name: string; description?: string },
        set: SetFn,
        get: GetFn
    ) {
        const { workspaces } = get();

        const newWorkspace: Workspace = {
            id: `w${Date.now()}`,
            name: data.name,
            description: data.description ?? "",
            boards: [],
        };

        set({
            workspaces: [...workspaces, newWorkspace],
        });
    },

    /**
     * Actualiza propiedades de un workspace (nombre, descripción, etc.)
     */
    update(workspaceId: string, changes: Partial<Workspace>, set: SetFn, get: GetFn) {
        const { workspaces } = get();

        set({
            workspaces: workspaces.map((w) =>
                w.id === workspaceId ? { ...w, ...changes } : w
            ),
        });
    },

    /**
     * Elimina un workspace y todos sus boards.
     */
    delete(workspaceId: string, set: SetFn, get: GetFn) {
        const { workspaces } = get();

        set({
            workspaces: workspaces.filter((w) => w.id !== workspaceId),
        });
    },
};

import type { LiaState } from "@/store/UseLiaStore";
import type { Board } from "@/types/workspace";

import { findWorkspace } from "@/services/_helpers";

type SetFn = (partial: Partial<LiaState>) => void;
type GetFn = () => LiaState;

/**
 * SERVICE: Maneja boards dentro de un workspace.
 */
export const BoardService = {
    /**
     * Crea un nuevo board dentro de un workspace.
     */
    create(workspaceId: string, name: string, set: SetFn, get: GetFn) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const newBoard: Board = {
            id: `b${Date.now()}`,
            name,
            lists: [],
        };

        ws.boards.push(newBoard);
        set({ workspaces: updated });
    },

    /**
     * Actualiza atributos del board (nombre, etc.)
     */
    update(
        workspaceId: string,
        boardId: string,
        changes: Partial<Board>,
        set: SetFn,
        get: GetFn
    ) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        ws.boards = ws.boards.map((b) =>
            b.id === boardId ? { ...b, ...changes } : b
        );

        set({ workspaces: updated });
    },

    /**
     * Elimina un board del workspace.
     */
    delete(workspaceId: string, boardId: string, set: SetFn, get: GetFn) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        ws.boards = ws.boards.filter((b) => b.id !== boardId);

        set({ workspaces: updated });
    },
};

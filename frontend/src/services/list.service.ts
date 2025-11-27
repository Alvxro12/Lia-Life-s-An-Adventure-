import type { LiaState } from "@/store/UseLiaStore";
import type { BoardList } from "@/types/workspace";

import { arrayMove } from "@dnd-kit/sortable";
import { findWorkspace, findBoard } from "@/services/_helpers";

type SetFn = (partial: Partial<LiaState>) => void;
type GetFn = () => LiaState;

/**
 * SERVICE: Maneja listas dentro de cada board.
 */
export const ListService = {
    /**
     * Crea una nueva lista dentro de un board.
     */
    create(
        workspaceId: number,
        boardId: number,
        payload: { id: number; title: string; tasks?: any[] },
        set: SetFn,
        get: GetFn
    ) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const board = findBoard(ws, boardId);
        if (!board) return;

        const newList: BoardList = {
            id: payload.id,
            title: payload.title,
            tasks: payload.tasks ?? [],
        };

        board.lists.push(newList);
        set({ workspaces: updated });
    },

    /**
     * Actualiza una lista
     */
    update(
        workspaceId: number,
        boardId: number,
        listId: number,
        changes: Partial<BoardList>,
        set: SetFn,
        get: GetFn
    ) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const board = findBoard(ws, boardId);
        if (!board) return;

        board.lists = board.lists.map((l) =>
            l.id === listId ? { ...l, ...changes } : l
        );

        set({ workspaces: updated });
    },

    /**
     * Elimina una lista completa
     */
    delete(workspaceId: number, boardId: number, listId: number, set: SetFn, get: GetFn) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const board = findBoard(ws, boardId);
        if (!board) return;

        board.lists = board.lists.filter((l) => l.id !== listId);

        set({ workspaces: updated });
    },

    /**
     * Mueve una lista dentro del board (drag & drop)
     */
    move(
        workspaceId: number,
        boardId: number,
        oldIndex: number,
        newIndex: number,
        set: SetFn,
        get: GetFn
    ) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const board = findBoard(ws, boardId);
        if (!board) return;

        board.lists = arrayMove(board.lists, oldIndex, newIndex);

        set({ workspaces: updated });
    },
};

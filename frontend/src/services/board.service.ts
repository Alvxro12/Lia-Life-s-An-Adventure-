import { api } from "@/utils/api";
import type { LiaState } from "@/store/UseLiaStore";
import type { Board, BoardList } from "@/types/workspace";

import { findWorkspace } from "@/services/_helpers";

type SetFn = (partial: Partial<LiaState>) => void;
type GetFn = () => LiaState;

/** Normaliza board tal como viene del backend */
function normalizeBoard(raw: any): Board {
    return {
        id: Number(raw.id),
        title: raw.title,
        description: raw.description ?? "",
        order: raw.order ?? 0,
        lists: (raw.lists ?? []).map((l: any) => ({
            id: Number(l.id),
            title: l.title,
            order: l.order,
            tasks: (l.tasks ?? []).map((t: any) => ({
                id: Number(t.id),
                title: t.title,
                description: t.description ?? "",
                status: t.status,
                order: t.order,
                xpReward: t.xpReward,
            })),
        })) as BoardList[],
    };
}

export const BoardService = {

    /** 🚀 Cargar todos los boards del workspace */
    async loadForWorkspace(workspaceId: number, set: SetFn, get: GetFn) {
        const data = await api(`/boards/workspace/${workspaceId}`, {
            method: "GET",
        });

        const boards: Board[] = (data as any[]).map(normalizeBoard);

        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        ws.boards = boards;
        set({ workspaces: updated });
    },

    /** ➕ Crear un board real */
    async create(workspaceId: number, title: string, set: SetFn, get: GetFn) {
        const created = await api("/boards", {
            method: "POST",
            body: JSON.stringify({
                title,
                workspaceId: Number(workspaceId),
            }),
        });

        const newBoard = normalizeBoard(created);

        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        ws.boards.push(newBoard);
        set({ workspaces: updated });
    },

    /** ✏️ Actualizar board */
    async update(
        workspaceId: number,
        boardId: number,
        changes: Partial<Board>,
        set: SetFn,
        get: GetFn
    ) {
        const updatedBoard = await api(`/boards/${boardId}`, {
            method: "PATCH",
            body: JSON.stringify({
                title: changes.title,
                description: changes.description,
                order: changes.order,
            }),
        });

        const newBoard = normalizeBoard(updatedBoard);

        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        ws.boards = ws.boards.map((b) => (b.id === boardId ? newBoard : b));

        set({ workspaces: updated });
    },

    /** 🗑️ Eliminar board */
    async delete(workspaceId: number, boardId: number, set: SetFn, get: GetFn) {
        await api(`/boards/${boardId}`, {
            method: "DELETE",
        });

        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        ws.boards = ws.boards.filter((b) => b.id !== boardId);

        set({ workspaces: updated });
    },
};

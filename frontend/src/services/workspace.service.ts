import { api } from "@/utils/api";
import type { LiaState } from "@/store/UseLiaStore";
import type { Workspace, Board } from "@/types/workspace";

type SetFn = (partial: Partial<LiaState>) => void;
type GetFn = () => LiaState;

// Normaliza un workspace del backend → tipo del front
function normalizeWorkspace(raw: any): Workspace {
    return {
        id: Number(raw.id),
        name: raw.name,
        description: raw.description ?? "",
        // Por ahora no recibimos boards en /workspaces, los dejamos vacíos
        boards: (raw.boards ?? []) as Board[],
    };
}

export const WorkspaceService = {
    /** Cargar TODOS los workspaces del usuario desde el backend */
    async loadAll(set: SetFn) {
        const data = await api("/workspaces", {
            method: "GET",
        });

        const workspaces: Workspace[] = (data as any[]).map(normalizeWorkspace);

        set({ workspaces });
    },

    /** Crear un workspace nuevo en el backend y mezclarlo en el store */
    async create(
        payload: { name: string; description?: string },
        set: SetFn,
        get: GetFn
    ) {
        const created = await api("/workspaces", {
            method: "POST",
            body: JSON.stringify({
                name: payload.name,
                description: payload.description ?? "",
            }),
        });

        const ws = normalizeWorkspace(created);
        const prev = get().workspaces;

        set({ workspaces: [...prev, ws] });
    },

    /** Actualizar un workspace (nombre / descripción) */
    async update(
        workspaceId: number,
        changes: Partial<Pick<Workspace, "name" | "description">>,
        set: SetFn,
        get: GetFn
    ) {
        const updated = await api(`/workspaces/${workspaceId}`, {
            method: "PATCH",
            body: JSON.stringify({
                name: changes.name,
                description: changes.description,
            }),
        });

        const wsUpdated = normalizeWorkspace(updated);
        const prev = get().workspaces;

        set({
            workspaces: prev.map((w) =>
                w.id === workspaceId ? wsUpdated : w
            ),
        });
    },

    /** Eliminar un workspace */
    async delete(
        workspaceId: number,
        set: SetFn,
        get: GetFn
    ) {
        await api(`/workspaces/${workspaceId}`, {
            method: "DELETE",
        });

        const prev = get().workspaces;
        set({
            workspaces: prev.filter((w) => w.id !== workspaceId),
        });
    },
};

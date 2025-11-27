import type { LiaState } from "@/store/UseLiaStore";
import type { Task } from "@/types/workspace";

import { findWorkspace, findBoard, findList } from "@/services/_helpers";

type SetFn = (partial: Partial<LiaState>) => void;
type GetFn = () => LiaState;

/**
 * SERVICE: Maneja operaciones sobre tareas individuales.
 */
export const TaskService = {
    /**
     * Crea una task dentro de una lista.
     */
    create(
        workspaceId: number,
        boardId: number,
        listId: number,
        payload: { id: number; title: string; xp?: number },
        set: SetFn,
        get: GetFn
    ) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const board = findBoard(ws, boardId);
        if (!board) return;

        const list = findList(board, listId);
        if (!list) return;

        const newTask: Task = {
            id: payload.id,
            title: payload.title,
            xp: payload.xp ?? 10,
            completed: false,
        };

        list.tasks.push(newTask);
        set({ workspaces: updated });
    },

    /**
     * Cambia el estado completed de una task
     */
    toggle(workspaceId: number, boardId: number, listId: number, taskId: number, set: SetFn, get: GetFn) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const board = findBoard(ws, boardId);
        if (!board) return;

        const list = findList(board, listId);
        if (!list) return;

        list.tasks = list.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );

        set({ workspaces: updated });
    },

    /**
     * Edita título de una tarea
     */
    updateTitle(workspaceId: number, boardId: number, listId: number, taskId: number, newTitle: string, set: SetFn, get: GetFn) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const board = findBoard(ws, boardId);
        if (!board) return;

        const list = findList(board, listId);
        if (!list) return;

        list.tasks = list.tasks.map((t) =>
            t.id === taskId ? { ...t, title: newTitle } : t
        );

        set({ workspaces: updated });
    },


    //Actualizar descripcion en el modal de la task
    updateDescription(
    workspaceId: number,
    boardId: number,
    listId: number,
    taskId:     number,
    description: string,
    set: SetFn,
    get: GetFn
) {
    const { workspaces } = get();
    const updated = structuredClone(workspaces);

    const ws = findWorkspace(updated, workspaceId);
    if (!ws) return;

    const board = findBoard(ws, boardId);
    if (!board) return;

    const list = findList(board, listId);
    if (!list) return;

    list.tasks = list.tasks.map((t) =>
        t.id === taskId ? { ...t, description } : t
    );

    set({ workspaces: updated });
},

    /**
     * Elimina una task
     */
    delete(workspaceId: number, boardId: number, listId: number, taskId: number, set: SetFn, get: GetFn) {   
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const board = findBoard(ws, boardId);
        if (!board) return;

        const list = findList(board, listId);
        if (!list) return;

        list.tasks = list.tasks.filter((t) => t.id !== taskId);

        set({ workspaces: updated });
    },

    /**
     * Mueve tasks entre listas o dentro de la misma lista (drag & drop)
     */
    move(
        workspaceId: number,
        boardId: number,
        sourceListId: number,
        destListId: number,
        sourceIndex: number,
        destIndex: number,
        set: SetFn,
        get: GetFn
    ) {
        const { workspaces } = get();
        const updated = structuredClone(workspaces);

        const ws = findWorkspace(updated, workspaceId);
        if (!ws) return;

        const board = findBoard(ws, boardId);
        if (!board) return;

        const srcList = findList(board, sourceListId);
        const dstList = findList(board, destListId);
        if (!srcList || !dstList) return;

        const [task] = srcList.tasks.splice(sourceIndex, 1);
        if (!task) return;

        dstList.tasks.splice(destIndex, 0, task);

        set({ workspaces: updated });
    },
};

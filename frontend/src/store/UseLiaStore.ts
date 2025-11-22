import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Workspace, Board, BoardList, Task } from "@/types/workspace";
import { mockWorkspaces } from "@/data/mock";

/** Services por dominio */
import { WorkspaceService } from "@/services/workspace.service";
import { BoardService } from "@/services/board.service";
import { ListService } from "@/services/list.service";
import { TaskService } from "@/services/task.service";

/* ------------------------------------------------------------------ */
/* 🧩 Tipos auxiliares para creación desde el frontend                 */
/* ------------------------------------------------------------------ */

/**
 * Payload para crear una nueva lista (column) desde el frontend.
 * Coincide con lo que espera el ListService.
 */
export type NewBoardList = {
    id: string;
    title: string;
    tasks?: Task[];
};

/**
 * Payload para crear una nueva task desde el frontend.
 * Coincide con lo que espera el TaskService.
 */
export type NewTask = {
    id: string;
    title: string;
    xp?: number;
};

/* ------------------------------------------------------------------ */
/* 🧱 Estado base del store (LiaState)                                 */
/* ------------------------------------------------------------------ */

export type LiaState = {
    /** Lista de workspaces del usuario (cada uno con boards, listas y tasks) */
    workspaces: Workspace[];
};

/* ------------------------------------------------------------------ */
/* 🧠 Interfaz del Store (acciones disponibles)                        */
/* ------------------------------------------------------------------ */

interface LiaStore extends LiaState {
    /* ============ WORKSPACES ============ */

    /** Crea un nuevo workspace vacío */
    createWorkspace: (name: string, description?: string) => void;

    /** Actualiza datos de un workspace (nombre, descripción, etc.) */
    updateWorkspace: (
        workspaceId: string,
        changes: Partial<Workspace>
    ) => void;

    /** Elimina un workspace y todo lo que cuelga de él */
    deleteWorkspace: (workspaceId: string) => void;

    /* ============ BOARDS ============ */

    /** Crea un board dentro de un workspace */
    createBoard: (workspaceId: string, name: string) => void;

    /** Actualiza atributos de un board (nombre, etc.) */
    updateBoard: (
        workspaceId: string,
        boardId: string,
        changes: Partial<Board>
    ) => void;

    /** Elimina un board de un workspace */
    deleteBoard: (workspaceId: string, boardId: string) => void;

    /* ============ LISTS (COLUMNS) ============ */

    /** Crea una lista (columna) en un board */
    createList: (
        workspaceId: string,
        boardId: string,
        payload: NewBoardList
    ) => void;

    /** Actualiza propiedades de una lista (título, etc.) */
    updateList: (
        workspaceId: string,
        boardId: string,
        listId: string,
        changes: Partial<BoardList>
    ) => void;

    /** Elimina una lista completa de un board */
    deleteList: (workspaceId: string, boardId: string, listId: string) => void;

    /** Reordena listas dentro de un board (drag & drop) */
    moveList: (
        workspaceId: string,
        boardId: string,
        oldIndex: number,
        newIndex: number
    ) => void;

    /* ============ TASKS ============ */

    /** Crea una tarea dentro de una lista */
    createTask: (
        workspaceId: string,
        boardId: string,
        listId: string,
        payload: NewTask
    ) => void;

    /** Marca una tarea como completada / no completada */
    toggleTask: (
        workspaceId: string,
        boardId: string,
        listId: string,
        taskId: string
    ) => void;

    /** Actualiza el título de una tarea */
    updateTaskTitle: (
        workspaceId: string,
        boardId: string,
        listId: string,
        taskId: string,
        newTitle: string
    ) => void;


    updateTaskDescription: (
    workspaceId: string,
    boardId: string,
    listId: string,
    taskId: string,
    desc: string
) => void;



    /** Elimina una tarea de una lista */
    deleteTask: (
        workspaceId: string,
        boardId: string,
        listId: string,
        taskId: string
    ) => void;

    /** Mueve una tarea entre listas o dentro de la misma lista (drag & drop) */
    moveTask: (
        workspaceId: string,
        boardId: string,
        sourceListId: string,
        destListId: string,
        sourceIndex: number,
        destIndex: number
    ) => void;
}

/* ------------------------------------------------------------------ */
/* 🏪 Store principal (Zustand + persist)                              */
/* ------------------------------------------------------------------ */

export const useLiaStore = create<LiaStore>()(
    persist(
        (set, get) => ({
            /* ---------------------- Estado inicial ---------------------- */
            workspaces: [],

            /* ===================== WORKSPACES ====================== */

            /**
             * Crea un workspace sin boards.
             */
            createWorkspace: (name, description = "") =>
                WorkspaceService.create({ name, description }, set, get),

            /**
             * Actualiza campos de un workspace (nombre, descripción, etc.).
             */
            updateWorkspace: (workspaceId, changes) =>
                WorkspaceService.update(workspaceId, changes, set, get),

            /**
             * Elimina un workspace completo (y sus boards).
             */
            deleteWorkspace: (workspaceId) =>
                WorkspaceService.delete(workspaceId, set, get),

            /* ======================== BOARDS ======================== */

            /**
             * Crea un board dentro de un workspace.
             */
            createBoard: (workspaceId, name) =>
                BoardService.create(workspaceId, name, set, get),

            /**
             * Actualiza atributos de un board (por ahora, típicamente el nombre).
             */
            updateBoard: (workspaceId, boardId, changes) =>
                BoardService.update(workspaceId, boardId, changes, set, get),

            /**
             * Elimina un board del workspace.
             */
            deleteBoard: (workspaceId, boardId) =>
                BoardService.delete(workspaceId, boardId, set, get),

            /* =================== LISTS (COLUMNS) =================== */

            /**
             * Crea una nueva lista dentro de un board.
             * Se usa para crear columnas tipo "Por hacer", "En progreso", etc.
             */
            createList: (workspaceId, boardId, payload) =>
                ListService.create(workspaceId, boardId, payload, set, get),

            /**
             * Actualiza una lista (por ejemplo, renombrar el título).
             */
            updateList: (workspaceId, boardId, listId, changes) =>
                ListService.update(workspaceId, boardId, listId, changes, set, get),

            /**
             * Elimina por completo una lista (columna) y sus tareas.
             */
            deleteList: (workspaceId, boardId, listId) =>
                ListService.delete(workspaceId, boardId, listId, set, get),

            /**
             * Reordena listas dentro de un mismo board (drag & drop horizontal).
             */
            moveList: (workspaceId, boardId, oldIndex, newIndex) =>
                ListService.move(workspaceId, boardId, oldIndex, newIndex, set, get),

            /* ========================= TASKS ========================= */

            /**
             * Crea una nueva tarea dentro de una lista.
             */
            createTask: (workspaceId, boardId, listId, payload) =>
                TaskService.create(workspaceId, boardId, listId, payload, set, get),

            /**
             * Invierte el estado "completed" de una tarea.
             */
            toggleTask: (workspaceId: string, boardId: string, listId: string, taskId: string
        ) =>
            TaskService.toggle(workspaceId, boardId, listId, taskId, set, get),


            /**
             * Actualiza solo el título de una tarea.
             */
            updateTaskTitle: (workspaceId: string, boardId: string, listId: string, taskId: string, newTitle: string
            ) =>TaskService.updateTitle(workspaceId, boardId, listId, taskId, newTitle, set, get),

            updateTaskDescription: (
                workspaceId: string,
                boardId: string,
                listId: string,
                taskId: string,
                desc: string
            ) =>
                TaskService.updateDescription(
                    workspaceId,
                    boardId,
                    listId,
                    taskId,
                    desc,
                    set,
                    get
                ),


            /**
             * Elimina una tarea específica de una lista.
             */
            deleteTask: (workspaceId: string, boardId: string, listId: string, taskId: string
            ) => TaskService.delete(workspaceId, boardId, listId, taskId, set, get),

            /**
             * Mueve una tarea entre listas o dentro de la misma lista según índices.
             */
            moveTask: (
                workspaceId,
                boardId,
                sourceListId,
                destListId,
                sourceIndex,
                destIndex
            ) =>
                TaskService.move(
                    workspaceId,
                    boardId,
                    sourceListId,
                    destListId,
                    sourceIndex,
                    destIndex,
                    set,
                    get
                ),
        }),
        {
            name: "lia-data",
            /**
             * Al rehidratar desde localStorage:
             *  - Si no hay workspaces guardados, usamos mockWorkspaces
             *    para que el usuario siempre vea algo al entrar por primera vez.
             */
            onRehydrateStorage: () => (state) => {
                if (state && state.workspaces.length === 0) {
                    state.workspaces = mockWorkspaces;
                }
            },
        }
    )
);

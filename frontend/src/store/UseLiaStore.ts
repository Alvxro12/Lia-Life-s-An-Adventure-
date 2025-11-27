import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Workspace, Board, BoardList, Task } from "@/types/workspace";
import { WorkspaceService } from "@/services/workspace.service";
import { BoardService } from "@/services/board.service";
import { ListService } from "@/services/list.service";
import { TaskService } from "@/services/task.service";

export type LiaState = {
    workspaces: Workspace[];
};

interface LiaStore extends LiaState {
    /* Workspaces */
    loadWorkspacesFromApi: () => Promise<void>;
    createWorkspace: (name: string, description?: string) => Promise<void>;
    updateWorkspace: (workspaceId: number, changes: Partial<Workspace>) => Promise<void>;
    deleteWorkspace: (workspaceId: number) => Promise<void>;

    /* Boards */
    loadBoards: (workspaceId: number) => Promise<void>;
    createBoard: (workspaceId: number, title: string) => Promise<void>;
    updateBoard: (workspaceId: number, boardId: number, changes: Partial<Board>) => Promise<void>;
    deleteBoard: (workspaceId: number, boardId: number) => Promise<void>;

    /* Lists */
    createList: (workspaceId: number, boardId: number, payload: BoardList) => Promise<void>;
    updateList: (workspaceId: number, boardId: number, listId: number, changes: Partial<BoardList>) => Promise<void>;
    deleteList: (workspaceId: number, boardId: number, listId: number) => Promise<void>;
    moveList: (workspaceId: number, boardId: number, oldIndex: number, newIndex: number) => Promise<void>;

    /* Tasks */
    createTask: (workspaceId: number, boardId: number, listId: number, payload: Task) => Promise<void>;
    toggleTask: (workspaceId: number, boardId: number, listId: number, taskId: number) => Promise<void>;
    updateTaskTitle: (workspaceId: number, boardId: number, listId: number, taskId: number, newTitle: string) => Promise<void>;
    updateTaskDescription: (workspaceId: number, boardId: number, listId: number, taskId: number, desc: string) => Promise<void>;
    deleteTask: (workspaceId: number, boardId: number, listId: number, taskId: number) => Promise<void>;
    moveTask: (workspaceId: number, boardId: number, sourceListId: number, destListId: number, sourceIndex: number, destIndex: number) => Promise<void>;
}

export const useLiaStore = create<LiaStore>()(
    persist(
        (set, get) => ({
            workspaces: [],

            /* WORKSPACES */
            loadWorkspacesFromApi: async () => {
                await WorkspaceService.loadAll(set);
            },

            createWorkspace: async (name, description = "") => {
                await WorkspaceService.create({ name, description }, set, get);
            },

            updateWorkspace: async (workspaceId, changes) => {
                await WorkspaceService.update(workspaceId, changes, set, get);
            },

            deleteWorkspace: async (workspaceId) => {
                await WorkspaceService.delete(workspaceId, set, get);
            },

            /* BOARDS */
            loadBoards: async (workspaceId) => {
                await BoardService.loadForWorkspace(workspaceId, set, get);
            },

            createBoard: async (workspaceId, title) => {
                await BoardService.create(workspaceId, title, set, get);
            },

            updateBoard: async (workspaceId, boardId, changes) => {
                await BoardService.update(workspaceId, boardId, changes, set, get);
            },

            deleteBoard: async (workspaceId, boardId) => {
                await BoardService.delete(workspaceId, boardId, set, get);
            },

            /* LISTS */
            createList: async (workspaceId, boardId, payload) =>
                ListService.create(workspaceId, boardId, payload, set, get),

            updateList: async (workspaceId, boardId, listId, changes) =>
                ListService.update(workspaceId, boardId, listId, changes, set, get),

            deleteList: async (workspaceId, boardId, listId) =>
                ListService.delete(workspaceId, boardId, listId, set, get),

            moveList: async (workspaceId, boardId, oldIndex, newIndex) =>
                ListService.move(workspaceId, boardId, oldIndex, newIndex, set, get),

            /* TASKS */
            createTask: async (workspaceId, boardId, listId, payload) =>
                TaskService.create(workspaceId, boardId, listId, payload, set, get),

            toggleTask: async (workspaceId, boardId, listId, taskId) =>
                TaskService.toggle(workspaceId, boardId, listId, taskId, set, get),

            updateTaskTitle: async (workspaceId, boardId, listId, taskId, newTitle) =>
                TaskService.updateTitle(workspaceId, boardId, listId, taskId, newTitle, set, get),

            updateTaskDescription: async (workspaceId, boardId, listId, taskId, desc) =>
                TaskService.updateDescription(workspaceId, boardId, listId, taskId, desc, set, get),

            deleteTask: async (workspaceId, boardId, listId, taskId) =>
                TaskService.delete(workspaceId, boardId, listId, taskId, set, get),

            moveTask: async (workspaceId, boardId, sourceListId, destListId, sourceIndex, destIndex) =>
                TaskService.move(workspaceId, boardId, sourceListId, destListId, sourceIndex, destIndex, set, get),
        }),
        {
            name: "lia-data",
        }
    )
);

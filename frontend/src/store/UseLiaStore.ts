import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Workspace, Board, BoardList, Task } from "@/types/workspace";
import { mockWorkspaces } from "@/data/mock";

interface LiaStore {
    workspaces: Workspace[];

    createWorkspace: (name: string, description?: string) => void;
    createBoard: (workspaceId: string, name: string) => void;
    createList: (workspaceId: string, boardId: string, title: string) => void;

    createTask: (
        workspaceId: string,
        boardId: string,
        listId: string,
        title: string
    ) => void;

    toggleTask: (
        workspaceId: string,
        boardId: string,
        listId: string,
        taskId: string
    ) => void;

    updateTaskTitle: (
        workspaceId: string,
        boardId: string,
        listId: string,
        taskId: string,
        title: string
    ) => void;

    deleteTask: (
        workspaceId: string,
        boardId: string,
        listId: string,
        taskId: string
    ) => void;

    moveTask: (
        workspaceId: string,
        boardId: string,
        sourceListId: string,
        destListId: string,
        sourceIndex: number,
        destIndex: number
    ) => void;
}

/**
 * ⚙️ Store temporal basado en Zustand + persist.
 * Cuando conectemos con el backend deberíamos reemplazar cada mutación por llamadas API
 * y sincronizar el estado mediante React Query o websockets.
 */
export const useLiaStore = create<LiaStore>()(
    persist(
        (set, get) => ({
            workspaces: mockWorkspaces,

            /* --------------------- CREATE WORKSPACE --------------------- */
            createWorkspace: (name, description = "") => {
                const newWorkspace: Workspace = {
                    id: `w${Date.now()}`,
                    name,
                    description,
                    boards: [],
                };

                set((state) => ({
                    workspaces: [...state.workspaces, newWorkspace],
                }));
            },

            /* ------------------------ CREATE BOARD ------------------------ */
            createBoard: (workspaceId, name) => {
                set((state) => ({
                    workspaces: state.workspaces.map((ws) => {
                        if (ws.id !== workspaceId) return ws;

                        const newBoard: Board = {
                            id: `b${Date.now()}`,
                            name,
                            lists: [],
                        };

                        return {
                            ...ws,
                            boards: [...ws.boards, newBoard],
                        };
                    }),
                }));
            },

            /* ------------------------ CREATE LIST ------------------------- */
            createList: (workspaceId, boardId, title) => {
                set((state) => ({
                    workspaces: state.workspaces.map((ws) => {
                        if (ws.id !== workspaceId) return ws;

                        return {
                            ...ws,
                            boards: ws.boards.map((board) => {
                                if (board.id !== boardId) return board;

                                const newList: BoardList = {
                                    id: `l${Date.now()}`,
                                    title,
                                    tasks: [],
                                };

                                return {
                                    ...board,
                                    lists: [...board.lists, newList],
                                };
                            }),
                        };
                    }),
                }));
            },

            /* ------------------------ CREATE TASK ------------------------- */
            createTask: (workspaceId, boardId, listId, title) => {
                set((state) => ({
                    workspaces: state.workspaces.map((ws) => {
                        if (ws.id !== workspaceId) return ws;

                        return {
                            ...ws,
                            boards: ws.boards.map((board) => {
                                if (board.id !== boardId) return board;

                                return {
                                    ...board,
                                    lists: board.lists.map((list) => {
                                        if (list.id !== listId) return list;

                                        const newTask: Task = {
                                            id: `t${Date.now()}`,
                                            title,
                                            completed: false,
                                            xp: 10,
                                        };

                                        return {
                                            ...list,
                                            tasks: [...list.tasks, newTask],
                                        };
                                    }),
                                };
                            }),
                        };
                    }),
                }));
            },

            /* -------------------------- TOGGLE TASK ------------------------- */
            toggleTask: (workspaceId, boardId, listId, taskId) => {
                set((state) => ({
                    workspaces: state.workspaces.map((ws) => {
                        if (ws.id !== workspaceId) return ws;

                        return {
                            ...ws,
                            boards: ws.boards.map((board) => {
                                if (board.id !== boardId) return board;

                                return {
                                    ...board,
                                    lists: board.lists.map((list) => {
                                        if (list.id !== listId) return list;

                                        return {
                                            ...list,
                                            tasks: list.tasks.map((task) =>
                                                task.id === taskId
                                                    ? {
                                                        ...task,
                                                        completed: !task.completed,
                                                    }
                                                    : task
                                            ),
                                        };
                                    }),
                                };
                            }),
                        };
                    }),
                }));
            },

            /* ---------------------- UPDATE TASK TITLE ------------------------ */
            updateTaskTitle: (workspaceId, boardId, listId, taskId, title) => {
                set((state) => ({
                    workspaces: state.workspaces.map((ws) => {
                        if (ws.id !== workspaceId) return ws;

                        return {
                            ...ws,
                            boards: ws.boards.map((board) => {
                                if (board.id !== boardId) return board;

                                return {
                                    ...board,
                                    lists: board.lists.map((list) => {
                                        if (list.id !== listId) return list;

                                        return {
                                            ...list,
                                            tasks: list.tasks.map((task) =>
                                                task.id === taskId
                                                    ? { ...task, title }
                                                    : task
                                            ),
                                        };
                                    }),
                                };
                            }),
                        };
                    }),
                }));
            },

            /* -------------------------- DELETE TASK ------------------------- */
            deleteTask: (workspaceId, boardId, listId, taskId) => {
                set((state) => ({
                    workspaces: state.workspaces.map((ws) => {
                        if (ws.id !== workspaceId) return ws;

                        return {
                            ...ws,
                            boards: ws.boards.map((board) => {
                                if (board.id !== boardId) return board;

                                return {
                                    ...board,
                                    lists: board.lists.map((list) => {
                                        if (list.id !== listId) return list;

                                        return {
                                            ...list,
                                            tasks: list.tasks.filter(
                                                (task) => task.id !== taskId
                                            ),
                                        };
                                    }),
                                };
                            }),
                        };
                    }),
                }));
            },

            /* -------------------------- MOVE TASK ---------------------------- */
            moveTask: (
                workspaceId,
                boardId,
                sourceListId,
                destListId,
                sourceIndex,
                destIndex
            ) => {
                set((state) => ({
                    workspaces: state.workspaces.map((ws) => {
                        if (ws.id !== workspaceId) return ws;

                        return {
                            ...ws,
                            boards: ws.boards.map((board) => {
                                if (board.id !== boardId) return board;

                                const lists = [...board.lists];

                                const sourceListIndex = lists.findIndex(
                                    (l) => l.id === sourceListId
                                );
                                const destListIndex = lists.findIndex(
                                    (l) => l.id === destListId
                                );

                                if (sourceListIndex === -1 || destListIndex === -1) {
                                    return board;
                                }

                                const sourceTasks = [...lists[sourceListIndex].tasks];
                                const [movedTask] = sourceTasks.splice(sourceIndex, 1);

                                if (!movedTask) return board;

                                if (sourceListId === destListId) {
                                    sourceTasks.splice(destIndex, 0, movedTask);

                                    lists[sourceListIndex] = {
                                        ...lists[sourceListIndex],
                                        tasks: sourceTasks,
                                    };

                                    return { ...board, lists };
                                }

                                const destTasks = [...lists[destListIndex].tasks];
                                destTasks.splice(destIndex, 0, movedTask);

                                lists[sourceListIndex] = {
                                    ...lists[sourceListIndex],
                                    tasks: sourceTasks,
                                };

                                lists[destListIndex] = {
                                    ...lists[destListIndex],
                                    tasks: destTasks,
                                };

                                return { ...board, lists };
                            }),
                        };
                    }),
                }));
            },
        }),
        { name: "lia-data" }
    )
);

"use client";
import React from "react";
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLiaStore } from "@/store/UseLiaStore";
import type { BoardList } from "@/types/workspace";
import { TaskCardPreview } from "@/components/tasks/taskCardPreview";
import { horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { ListColumn } from "@/components/boards/listColumns";
import { GapSlot } from "@/components/boards/gapSlot";
import { ColumnSlot } from "@/components/boards/ColumnSlot";
import { ColumnsManager } from "@/components/boards/columnsManager"

export default function BoardPage() {
    const params = useParams();
    const workspaceId = params.workspaceId as string;
    const boardId = params.boardId as string;

    const moveTask = useLiaStore((s) => s.moveTask);
    const workspace = useLiaStore((s) => s.workspaces.find((w) => w.id === workspaceId));
    const board = workspace?.boards.find((b) => b.id === boardId);

    const [tempLists, setTempLists] = useState<BoardList[]>([]);
    const [activeTask, setActiveTask] = useState<any>(null);
    const [activeList, setActiveList] = useState<string | null>(null);
    
    const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            delay: 100,      // Trello-style HOLD
            tolerance: 5,    // evitar drags accidentales
        },
    })
);


    useEffect(() => {
        if (!board) return;
        setTempLists(board.lists.map((l) => ({ ...l, tasks: [...l.tasks] })));
    }, [board?.id]);

    // Buscar lista por ID
    const findListByTaskId = (taskId: string) => {
        return tempLists.find((l) => l.tasks.some((t) => t.id === taskId));
    };

    const findTask = (taskId: string) => {
        for (const list of tempLists) {
            const task = list.tasks.find((t) => t.id === taskId);
            if (task) return task;
        }
        return null;
    };

    // Cuando empieza el drag
    function handleDragStart(event: any) {
        const id = String(event.active.id);

        const task = findTask(id);

        if (task) {
            // Es una TASK
            setActiveTask(task);
            setActiveList(null);
        } else {
            // Es una LISTA
            setActiveTask(null);
            setActiveList(id);
        }
    }


    // Cuando termina el drag
    function handleDragEnd(event: any) {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) {
            setActiveList(null);
            return;
        }

        const activeId = String(active.id);
        const overId = String(over.id);

        if (activeId === overId) {
            setActiveList(null);
            return;
        }

        // 1️⃣ CASO: MOVER LISTAS
        if (activeList) {
            const overList = tempLists.find((l) => l.id === overId);

            // Solo permitimos drops sobre LISTAS, no sobre TASKS
            if (!overList) {
                setActiveList(null);
                return;
            }

            const oldIndex = tempLists.findIndex((l) => l.id === activeId);
            const newIndex = tempLists.findIndex((l) => l.id === overList.id);

            if (oldIndex === -1 || newIndex === -1) {
                setActiveList(null);
                return;
            }

            const reOrdered = arrayMove(tempLists, oldIndex, newIndex);
            setTempLists(reOrdered);

            requestAnimationFrame(() => {
                useLiaStore.getState().moveList(workspaceId, boardId, oldIndex, newIndex);
            });

            setActiveList(null);
            return;
        }

        // 2️⃣ CASO: MOVER TAREAS
        const fromList = findListByTaskId(activeId);
        if (!fromList) return;

        let toList =
            findListByTaskId(overId) ||
            tempLists.find((l) => l.id === overId);

        if (!toList) return;

        const listsCopy = structuredClone(tempLists);

        const fromListIndex = listsCopy.findIndex((l) => l.id === fromList.id);
        const toListIndex = listsCopy.findIndex((l) => l.id === toList!.id);

        const fromTasks = listsCopy[fromListIndex].tasks;
        const toTasks = listsCopy[toListIndex].tasks;

        const oldIndex = fromTasks.findIndex((t) => t.id === activeId);

        let newIndex = toTasks.findIndex((t) => t.id === overId);
        if (newIndex === -1) {
            newIndex = toTasks.length;
        }

        if (fromList.id === toList.id) {
            listsCopy[fromListIndex].tasks = arrayMove(fromTasks, oldIndex, newIndex);
        } else {
            const [moved] = fromTasks.splice(oldIndex, 1);
            toTasks.splice(newIndex, 0, moved);
        }

        setTempLists(listsCopy);

        requestAnimationFrame(() => {
            moveTask(workspaceId, boardId, fromList.id, toList.id, oldIndex, newIndex);
        });
    }




            function handleCreateList() {
                const newList = {
                    id: crypto.randomUUID(),
                    title: `Lista ${tempLists.length + 1}`,
                    tasks: [],
                };

                useLiaStore.getState().createList(workspaceId, boardId, newList);

                const state = useLiaStore.getState();
                const workspaceUpdated = state.workspaces.find((w) => w.id === workspaceId);
                if (!workspaceUpdated) return;

                const boardUpdated = workspaceUpdated.boards.find((b) => b.id === boardId);
                if (!boardUpdated) return;

                const clonedLists = boardUpdated.lists.map((l) => ({
                    ...l,
                    tasks: [...l.tasks],
                }));

                setTempLists(clonedLists);
            }


        // Añadir tarea a una lista
            function handleAddTask(listId: string) {
                const newTask = {
                    id: crypto.randomUUID(),
                    title: "Nueva tarea",
                    xp: 10,
                };

                // 1) Actualizamos el store (fuente de la verdad)
                useLiaStore.getState().createTask(workspaceId, boardId, listId, newTask);

                // 2) Leemos el estado ACTUALIZADO desde el store
                const state = useLiaStore.getState();
                const workspaceUpdated = state.workspaces.find((w) => w.id === workspaceId);
                if (!workspaceUpdated) return;

                const boardUpdated = workspaceUpdated.boards.find((b) => b.id === boardId);
                if (!boardUpdated) return;

                // 3) Reseteamos tempLists en base al board real
                const clonedLists = boardUpdated.lists.map((l) => ({
                    ...l,
                    tasks: [...l.tasks],
                }));

                setTempLists(clonedLists);
            }

    return (
        <section className="relative w-full" style={{ height: "calc(100vh - 218px)" }}>
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <ColumnsManager>
                    <SortableContext items={tempLists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
                        {tempLists.map((list) => (
                            <React.Fragment key={list.id}>
                                
                                <GapSlot />

                                <ColumnSlot 
                                    id={list.id}
                                    title={list.title}
                                    tasks={list.tasks}
                                    onAddTask={() => handleAddTask(list.id)}
                                />
                                <GapSlot />
                            </React.Fragment>
                        ))}
                    </SortableContext>
                    {/* botón añadir lista */}
                    <button className="inline-block w-64 h-fit rounded-lg bg-accent/10 border border-accent/30 px-4 py-3 text-sm font-medium text-accent text-left hover:bg-accent/20 transition" onClick={handleCreateList}>
                        + Añadir lista
                    </button>
                </ColumnsManager>
                {/* Overlay visual */}
                <DragOverlay>
                    {activeTask && <TaskCardPreview task={activeTask} />}
                    {activeList && (() => {
                        const list = tempLists.find((l) => l.id === activeList);
                        if (!list) return null;
                        return (
                            <ListColumn
                                id={list.id}
                                title={list.title}
                                tasks={list.tasks}
                                onAddTask={() => handleAddTask(list.id)}
                                dragHandleProps={{}}
                            />
                        );
                    })()}
                </DragOverlay>
            </DndContext>
        </section>
    );
}

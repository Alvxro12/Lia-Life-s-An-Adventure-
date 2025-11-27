"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    rectIntersection,
    type CollisionDetection,
} from "@dnd-kit/core";

import {
    SortableContext,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useLiaStore } from "@/store/UseLiaStore";
import type { BoardList } from "@/types/workspace";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

import { TaskCardPreview } from "@/components/tasks/taskCardPreview";
import { ListColumn } from "@/components/boards/listColumns";
import { GapSlot } from "@/components/boards/gapSlot";
import { ColumnSlot } from "@/components/boards/ColumnSlot";
import { ColumnsManager } from "@/components/boards/columnsManager";


// ==================================================================
// ⭐ COLISIÓN HORIZONTAL — versión final compatible con TS
// ==================================================================
const flatColumnCollision: CollisionDetection = ({
    active,
    collisionRect,
    droppableRects,
    droppableContainers,
    pointerCoordinates,
}) => {
    if (!collisionRect) return [];

    const viewHeight =
        typeof window !== "undefined" ? window.innerHeight : 1500;

    // Aplanamos la altura → evita que columnas grandes dominen colisión
    const flatRect = {
        ...collisionRect,
        top: 0,
        bottom: viewHeight,
        height: viewHeight,
    };

    return rectIntersection({
        active,
        collisionRect: flatRect,
        droppableRects,
        droppableContainers,
        pointerCoordinates,
    });
};


// ==================================================================
// COMPONENTE PRINCIPAL
// ==================================================================
export default function BoardPage() {

    const params = useParams();
    const router = useRouter();

    const workspaceId = Number(params.workspaceId);
    const boardId = Number(params.boardId);

    const loadBoards = useLiaStore((s) => s.loadBoards);

    const workspace = useLiaStore((s) =>
        s.workspaces.find((w) => Number(w.id) === workspaceId)
    );
    const board = workspace?.boards.find((b) => b.id === boardId);

    const [loading, setLoading] = useState(true);
    const [tempLists, setTempLists] = useState<BoardList[]>([]);
    const [activeTask, setActiveTask] = useState<any>(null);
    const [activeList, setActiveList] = useState<number | null>(null);


    // Sensor estilo Trello
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { delay: 100, tolerance: 5 },
        })
    );


    // ==================================================================
    // LOAD DATA
    // ==================================================================
    useEffect(() => {
        async function load() {
            await loadBoards(workspaceId);
            setLoading(false);
        }
        load();
    }, [workspaceId]);


    useEffect(() => {
        if (!board) return;
        setTempLists(board.lists.map((l) => ({ ...l, tasks: [...l.tasks] })));
    }, [board?.id, board?.lists]);


    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center text-accent">
                Cargando tablero...
            </div>
        );
    }

    if (!board) {
        return (
            <div className="p-10 text-center text-red-400">
                No se encontró este tablero.
            </div>
        );
    }


    // ==================================================================
    // HELPERS
    // ==================================================================
    const findListByTaskId = (taskId: number) =>
        tempLists.find((l) => l.tasks.some((t) => t.id === taskId));

    const findTask = (taskId: number) => {
        for (const list of tempLists) {
            const t = list.tasks.find((t) => t.id === taskId);
            if (t) return t;
        }
        return null;
    };


    // ==================================================================
    // DRAG START
    // ==================================================================
    function handleDragStart(e: DragStartEvent) {
        const rawId = String(e.active.id);

        if (rawId.startsWith("task-")) {
            const id = Number(rawId.replace("task-", ""));
            const task = findTask(id);
            setActiveTask(task);
            setActiveList(null);
        }

        else if (rawId.startsWith("list-")) {
            const id = Number(rawId.replace("list-", ""));
            setActiveList(id);
            setActiveTask(null);
        }
    }


    // ==================================================================
    // DRAG END
    // ==================================================================
    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e;

        setActiveTask(null);
        setActiveList(null);

        if (!over) return;

        const rawActive = String(active.id);
        const rawOver = String(over.id);

        // ============================
        // MOVE LISTS
        // ============================
        if (rawActive.startsWith("list-") && rawOver.startsWith("list-")) {
            const activeId = Number(rawActive.replace("list-", ""));
            const overId = Number(rawOver.replace("list-", ""));

            const oldIndex = tempLists.findIndex((l) => l.id === activeId);
            const newIndex = tempLists.findIndex((l) => l.id === overId);
            if (oldIndex === -1 || newIndex === -1) return;

            const reordered = [...tempLists];
            const [removed] = reordered.splice(oldIndex, 1);
            reordered.splice(newIndex, 0, removed);

            setTempLists(reordered);

            useLiaStore.getState().moveList(workspaceId, boardId, oldIndex, newIndex);
            return;
        }

        // ============================
        // MOVE TASKS
        // ============================
        if (rawActive.startsWith("task-")) {
            const activeId = Number(rawActive.replace("task-", ""));
            const overId = Number(rawOver.replace("task-", ""));

            const fromList = findListByTaskId(activeId);
            if (!fromList) return;

            let toList =
                findListByTaskId(overId) ||
                tempLists.find((l) => l.id === overId);

            if (!toList) return;

            const clone = structuredClone(tempLists);

            const fromIndex = clone.findIndex((l) => l.id === fromList.id);
            const toIndex = clone.findIndex((l) => l.id === toList.id);

            const fromTasks = clone[fromIndex].tasks;
            const toTasks = clone[toIndex].tasks;

            const oldTaskIndex = fromTasks.findIndex((t) => t.id === activeId);
            let newTaskIndex = toTasks.findIndex((t) => t.id === overId);
            if (newTaskIndex === -1) newTaskIndex = toTasks.length;

            if (fromList.id === toList.id) {
                const [moved] = fromTasks.splice(oldTaskIndex, 1);
                fromTasks.splice(newTaskIndex, 0, moved);
            } else {
                const [moved] = fromTasks.splice(oldTaskIndex, 1);
                toTasks.splice(newTaskIndex, 0, moved);
            }

            setTempLists(clone);

            useLiaStore
                .getState()
                .moveTask(workspaceId, boardId, fromList.id, toList.id, oldTaskIndex, newTaskIndex);
        }
    }


    // ==================================================================
    // CREATE LIST
    // ==================================================================
    function handleCreateList() {
        const newList = {
            id: Date.now(),
            title: `Lista ${tempLists.length + 1}`,
            tasks: [],
        };

        useLiaStore.getState().createList(workspaceId, boardId, newList);

        const ws = useLiaStore.getState().workspaces.find((w) => w.id === workspaceId);
        const b = ws?.boards.find((b) => b.id === boardId);
        if (!b) return;

        setTempLists(b.lists.map((l) => ({ ...l, tasks: [...l.tasks] })));
    }


    // ==================================================================
    // ADD TASK
    // ==================================================================
    function handleAddTask(listId: number) {
        const newTask = {
            id: Date.now(),
            title: "Nueva tarea",
            xp: 10,
            completed: false,
        };

        useLiaStore.getState().createTask(workspaceId, boardId, listId, newTask);

        const ws = useLiaStore.getState().workspaces.find((w) => w.id === workspaceId);
        const b = ws?.boards.find((b) => b.id === boardId);
        if (!b) return;

        setTempLists(b.lists.map((l) => ({ ...l, tasks: [...l.tasks] })));
    }



    // ==================================================================
    // RENDER
    // ==================================================================
    return (
        <section
            className="relative w-full"
            style={{ height: "calc(100vh - 218px)" }}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={flatColumnCollision}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <ColumnsManager>
                    <SortableContext
                        items={tempLists.map((l) => `list-${l.id}`)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {tempLists.map((list) => (
                            <React.Fragment key={`list-${list.id}`}>
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

                    <button
                        className="inline-block w-64 h-fit rounded-lg bg-accent/10 border border-accent/30 px-4 py-3 text-sm font-medium text-accent text-left hover:bg-accent/20"
                        onClick={handleCreateList}
                    >
                        + Añadir lista
                    </button>
                </ColumnsManager>

                <DragOverlay>
                    {activeTask && <TaskCardPreview task={activeTask} />}
                    {activeList &&
                        (() => {
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

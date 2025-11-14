"use client";

import { useParams } from "next/navigation";
import { useLists } from "@/hooks/useList";
import { useLiaStore } from "@/store/UseLiaStore";

import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd";


export default function BoardPage() {
    const params = useParams();

    const createList = useLiaStore((s) => s.createList);    
    const createTask = useLiaStore((s) => s.createTask);
    const toggleTask = useLiaStore((s) => s.toggleTask);
    const deleteTask = useLiaStore((s) => s.deleteTask);
    const updateTaskTitle = useLiaStore((s) => s.updateTaskTitle);
    const moveTask = useLiaStore((s) => s.moveTask);

    const idParam = params.id;
    const boardParam = params.boardId;

    const workspaceId = Array.isArray(idParam) ? idParam[0] : idParam ?? "";
    const boardId = Array.isArray(boardParam) ? boardParam[0] : boardParam ?? "";

    const { board, lists } = useLists(workspaceId, boardId);


    // ⭐ Drag & Drop handler
    function handleDragEnd(result: DropResult) {
        const { source, destination } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        moveTask(
            workspaceId,
            boardId,
            source.droppableId,
            destination.droppableId,
            source.index,
            destination.index
        );
    }


    // Crear tarea
    function handleAddTask(listId: string, currentCount: number) {
        const title = `Tarea ${currentCount + 1}`;
        createTask(workspaceId, boardId, listId, title);
    }


    return (
        <DragDropContext onDragEnd={handleDragEnd}> 

            <section className="p-6 space-y-6">
                <h1 className="text-xl font-semibold tracking-wide text-accent">
                    {board?.name}
                </h1>

                {/* LISTAS */}
                <div className="grid grid-flow-col auto-cols-[280px] gap-4 overflow-x-auto">

                    {lists.map((list) => (
                        <Droppable key={list.id} droppableId={list.id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-card/30 border border-accent/20 rounded-xl p-4 space-y-3"
                                >
                                    <h2 className="font-semibold text-sm text-foreground mb-1">
                                        {list.title}
                                    </h2>

                                    {/* ⭐ TASKS draggable */}
                                    {list.tasks.map((task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={task.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="rounded-lg bg-background/40 border border-accent/20 px-3 py-2 text-xs text-foreground flex justify-between items-center mb-2"
                                                >
                                                    {/* toggle completado */}
                                                    <div
                                                        onClick={() =>
                                                            toggleTask(
                                                                workspaceId,
                                                                boardId,
                                                                list.id,
                                                                task.id
                                                            )
                                                        }
                                                        className={`cursor-pointer ${
                                                            task.completed
                                                                ? "line-through opacity-60"
                                                                : ""
                                                        }`}
                                                    >
                                                        {task.title}
                                                    </div>

                                                    {/* acciones */}
                                                    <div className="flex gap-2 items-center">
                                                        <button
                                                            onClick={() => {
                                                                const title = prompt(
                                                                    "Nuevo título:",
                                                                    task.title
                                                                );
                                                                if (title) {
                                                                    updateTaskTitle(
                                                                        workspaceId,
                                                                        boardId,
                                                                        list.id,
                                                                        task.id,
                                                                        title
                                                                    );
                                                                }
                                                            }}
                                                            className="text-[10px] text-accent hover:underline"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                deleteTask(
                                                                    workspaceId,
                                                                    boardId,
                                                                    list.id,
                                                                    task.id
                                                                )
                                                            }
                                                            className="text-[10px] text-red-400 hover:underline"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}

                                    {provided.placeholder}

                                    {/* Agregar tarea */}
                                    <button
                                        onClick={() =>
                                            handleAddTask(list.id, list.tasks.length)
                                        }
                                        className="text-[11px] text-accent hover:underline"
                                    >
                                        + Nueva tarea
                                    </button>
                                </div>
                            )}
                        </Droppable>
                    ))}

                    {/* Crear nueva lista */}
                    <div
                        onClick={() =>
                            createList(
                                workspaceId,
                                boardId,
                                `Lista ${lists.length + 1}`
                            )
                        }
                        className="border border-dashed border-accent/40 rounded-xl p-4 cursor-pointer hover:bg-accent/10"
                    >
                        + Nueva lista
                    </div>
                </div>
            </section>

        </DragDropContext>
    );
}

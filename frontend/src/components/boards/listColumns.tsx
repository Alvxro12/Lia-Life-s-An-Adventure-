"use client";

import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable, useDndMonitor, UniqueIdentifier } from "@dnd-kit/core";
import { GripVertical, Pencil } from "lucide-react";
import { SortableTaskCard } from "./taskCard";
import type { Task } from "@/types/workspace";
import { useState } from "react";



type Props = {
    id: string;
    title: string;
    tasks: Task[];
    onAddTask: (listId: string) => void;
    onUpdateTitle?: (listId: string, newTitle: string) => void;
    dragHandleProps: any; // viene del SortableListColumn
    activeTaskId?: string | null; // ← AÑADIR ESTO

};

export function ListColumn({
    id,
    title,
    tasks,
    onAddTask,
    onUpdateTitle,
    dragHandleProps,
}: Props) {
    const { setNodeRef, isOver } = useDroppable({ id });

    const [editing, setEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);

    const [overTaskId, setOverTaskId] = useState<UniqueIdentifier | null>(null);
        useDndMonitor({
            onDragOver(event) {
                const { over } = event;
                setOverTaskId(over?.id ?? null);
            },
        });


    return (
        <div className="flex flex-col h-full bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden">

            {/* HEADER */}
            <div
                className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-[#1A1A1A]"
            >
                <div className="flex items-center gap-2">
                    {/* Drag handle */}
                    <button {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-accent/70">
                        <GripVertical size={16} />
                    </button>

                    {/* Title */}
                    {editing ? (
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={() => {
                                setEditing(false);
                                onUpdateTitle?.(id, newTitle);
                            }}
                            className="bg-transparent border-b border-accent/50 focus:outline-none text-accent text-sm"
                            autoFocus
                        />
                    ) : (
                        <span
                            onClick={() => setEditing(true)}
                            className="text-sm font-semibold text-accent cursor-pointer"
                        >
                            {title}
                        </span>
                    )}
                </div>

                <button onClick={() => setEditing(true)} className="text-accent/70 hover:text-accent transition">
                    <Pencil size={14} />
                </button>
            </div>

            <div className="h-4"/>

            {/* BODY */}
            <ul
                ref={setNodeRef}
                className={`flex-1 px-3 pb-3 overflow-y-auto transition-colors space-y-2 ${
                    isOver ? "bg-accent/10" : ""
                }`}
            >
                <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={rectSortingStrategy}
                >
                    {tasks.map((task) => (
                        <li key={task.id} className="list-none">
                            <SortableTaskCard task={task} />
                        </li>
                    ))}

                    {tasks.length === 0 && (
                        <li className="h-12 flex items-center justify-center text-white/40 text-xs border border-dashed border-white/10 mt-2 rounded">
                            Suelta una tarea aquí
                        </li>
                    )}
                </SortableContext>
            </ul>


            {/* FOOTER */}
            <button
                onClick={() => onAddTask(id)}
                className="px-3 py-2 text-xs text-accent/70 hover:text-accent hover:bg-accent/10 transition"
            >
                + Añadir tarea
            </button>
        </div>
    );
}

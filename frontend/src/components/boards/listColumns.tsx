"use client";

import { useState } from "react";
import type { Task } from "@/types/workspace";
import { SortableTaskCard } from "@/components/tasks/sortableTaskCard";

type Props = {
    id: string;
    title: string;
    tasks: Task[];
    onAddTask: (listId: string) => void;
    onUpdateTitle?: (listId: string, newTitle: string) => void;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
};

export function ListColumn({
    id,
    title,
    tasks,
    onAddTask,
    onUpdateTitle,
    dragHandleProps
}: Props) {
    
    const [editing, setEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);

    return (
        <div className="flex flex-col max-h-full w-full rounded-xl bg-[#1A1A1A] border border-white/10">

            {/* HEADER */}
            <div className="
                flex-none px-3 py-2 border-b border-white/10 flex items-center justify-between
                shadow-[0_2px_4px_rgba(0,0,0,0.25)]
                cursor-grab active:cursor-grabbing"
                {...dragHandleProps}
            >
                {/* TÍTULO — editable */}
                <div
                    className="flex-1 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation(); // evita activar drag
                        setEditing(true);
                    }}
                >
                    {editing ? (
                        <input
                            autoFocus
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={() => {
                                setEditing(false);
                                if (onUpdateTitle) onUpdateTitle(id, newTitle);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setEditing(false);
                                    if (onUpdateTitle) onUpdateTitle(id, newTitle);
                                }
                            }}
                            className="w-full bg-transparent border-b border-accent/50 focus:outline-none text-accent text-sm"
                        />
                    ) : (
                        <span className="text-sm font-semibold text-accent">{title}</span>
                    )}
                </div>
            </div>

            {/* BODY */}
            <ul className="flex-1 min-h-0 overflow-y-auto px-3 mt-2 pb-3 space-y-2">
                {tasks.map(task => (
                    <li key={task.id} className="list-none">
                        <SortableTaskCard task={task} />
                    </li>
                ))}
            </ul>

            {/* FOOTER */}
            <button
                onClick={() => onAddTask(id)}
                className="flex-none px-3 py-2 text-xs text-accent/70 hover:text-accent hover:bg-accent/10 transition"
            >
                + Añadir tarea
            </button>
        </div>
    );
}

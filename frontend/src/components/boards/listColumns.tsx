"use client";

import type { Task } from "@/types/workspace";

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
    return (
        <div className="flex flex-col max-h-full w-full rounded-xl bg-[#1A1A1A] border border-white/10">
            
            {/* HEADER (fijo, no scrollea) */}
            <div
                className="flex-none px-3 py-2 border-b border-white/10 flex items-center justify-between cursor-grab active:cursor-grabbing"
                {...dragHandleProps}
            >
                <span className="text-sm font-semibold text-accent">{title}</span>
            </div>

            {/* BODY (scroll dinámico) */}
            <ul className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-2">
                {tasks.map(task => (
                    <li key={task.id} className="list-none">
                        {/* Aquí va tu <SortableTaskCard task={task} /> */}
                    </li>
                ))}
            </ul>

            {/* FOOTER (fijo) */}
            <button
                onClick={() => onAddTask(id)}
                className="flex-none px-3 py-2 text-xs text-accent/70 hover:text-accent hover:bg-accent/10 transition"
            >
                + Añadir tarea
            </button>
        </div>
    );
}

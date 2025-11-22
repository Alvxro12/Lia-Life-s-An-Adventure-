"use client";

import type { Task } from "@/types/workspace";
import { SortableTaskCard } from "@/components/boards/taskCard"; // usa la misma tarjeta visual

type Props = {
    id: string;
    title: string;
    tasks: Task[];
};

export function ListColumnPreview({ title, tasks }: Props) {
    return (
        <div
            className="
                min-w-64 max-w-64
                h-[calc(100vh-180px)]
                flex flex-col
                bg-[#1A1A1A]
                border border-white/10
                rounded-xl
                shadow-xl
                overflow-hidden
            "
        >
            <div className="px-3 py-2 border-b border-white/10 font-semibold text-accent">
                {title}
            </div>

            <div className="flex-1 px-3 py-3 overflow-hidden">
                {/* no scrollear en preview */}
                {tasks.slice(0, 6).map(t => (
                    <div key={t.id} className="mb-2">
                        <SortableTaskCard task={t} />
                    </div>
                ))}
            </div>

            <div className="px-3 py-2 text-xs text-accent/70">
                + Añadir tarea
            </div>
        </div>
    );
}

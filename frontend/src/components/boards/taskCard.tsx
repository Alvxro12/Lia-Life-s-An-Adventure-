"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskModal } from "@/components/tasks/taskModal";

type Props = {
    task: any;
};

export function SortableTaskCard({ task }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
    });

    const [isOpen, setIsOpen] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    };

    function handleClick() {
        // Abrir modal si no está arrastrando
        if (!isDragging) {
            setIsOpen(true);
        }
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onClick={handleClick}
                className={`
                    mb-2 rounded-lg px-3 py-2 text-sm border select-none cursor-pointer
                    ${isDragging
                        ? "bg-[#2d2d2d] border-white/20 shadow-2xl scale-[1.03]"
                        : "bg-[#242424] border-white/10 text-[#EAE6D9]"
                    }
                `}
            >
                {task.title}
            </div>

            {isOpen && (
                <TaskModal
                    task={task}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}

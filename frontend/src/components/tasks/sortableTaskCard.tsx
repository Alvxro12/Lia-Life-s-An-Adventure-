"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskModal } from "@/components/tasks/taskModal";
import { useLiaStore } from "@/store/UseLiaStore";

type Props = { task: any; };

export function SortableTaskCard({ task }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
    const [isOpen, setIsOpen] = useState(false);
    const [showSparkle, setShowSparkle] = useState(false);
    const [localCompleted, setLocalCompleted] = useState(task.completed);


function handleToggleCompleted(e: React.ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();

    // 1) UI inmediata (optimistic)
    setLocalCompleted(e.target.checked);

    // 2) Actualizar store sin esperar UI
    useLiaStore.getState().toggleTask(
        task.workspaceId,
        task.boardId,
        task.listId,
        task.id
    );

    // 3) Brillito solo al completar
    if (e.target.checked && !task.completed) {
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 500);
    }
}


    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1, zIndex: isDragging ? 50 : 0 };

    return (
        <>
            <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`w-full rounded-[10px] px-3 py-2 text-sm border select-none cursor-pointer transition-all duration-150 ${isDragging ? "bg-[#2d2d2d] border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.6)] scale-[1.03]" : "bg-[#242424] border-white/10 text-[#EAE6D9] hover:bg-[#2a2a2a] hover:shadow-[0_2px_8px_rgba(0,0,0,0.45)]"}`}>
                <div className="flex items-center justify-between">
                    
                    {/* Título editable */}
                    <span onClick={() => setIsOpen(true)} className="flex-1 cursor-pointer">{task.title}</span>

                    {/* Toggle completado */}
                    <input 
                        type="checkbox"
                        className="ml-2 cursor-pointer"
                        checked={localCompleted}
                        onChange={handleToggleCompleted}
                    />

                </div>
                {showSparkle && <span className="lia-sparkle"></span>}
            </div>


            {isOpen && <TaskModal task={task} onClose={() => setIsOpen(false)} />}
        </>
    );
}

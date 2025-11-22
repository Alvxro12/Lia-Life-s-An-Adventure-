"use client";

import { useState } from "react";
import { X, Trash2, CheckCircle } from "lucide-react";
import { useLiaStore } from "@/store/UseLiaStore";

type Props = {
    task: {
        id: string;
        title: string;
        xp?: number;
        completed: boolean;
        description?: string;
        workspaceId: string;
        boardId: string;
        listId: string;
    };
    onClose: () => void;
};

export function TaskModal({ task, onClose }: Props) {

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");

    const updateTitle = useLiaStore((s) => s.updateTaskTitle);
    const updateDesc = useLiaStore((s) => s.updateTaskDescription);
    const deleteTask = useLiaStore((s) => s.deleteTask);
    const toggleTask = useLiaStore((s) => s.toggleTask);

    function handleSave() {
        if (title !== task.title) {
            updateTitle(task.workspaceId, task.boardId, task.listId, task.id, title);
        }
        if (description !== task.description) {
            updateDesc(task.workspaceId, task.boardId, task.listId, task.id, description);
        }
        onClose();
    }

    function handleDelete() {
        deleteTask(task.workspaceId, task.boardId, task.listId, task.id);
        onClose();
    }

    function handleToggle() {
        toggleTask(task.workspaceId, task.boardId, task.listId, task.id);
    }

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            
            <div className="bg-[#1e1e1e] w-full max-w-lg rounded-xl border border-white/10 p-6 shadow-2xl relative">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent text-xl font-semibold text-accent focus:outline-none border-b border-transparent focus:border-accent/40 transition"
                    />
                    
                    <button onClick={onClose} className="text-accent/60 hover:text-accent transition ml-3">
                        <X size={22}/>
                    </button>
                </div>

                {/* COMPLETED BUTTON */}
                <button 
                    onClick={handleToggle}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition mb-4 
                    ${task.completed ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-accent/20 text-accent hover:bg-accent/30"}`}
                >
                    <CheckCircle size={18}/> 
                    {task.completed ? "Marcada como completada" : "Marcar como completada"}
                </button>

                {/* DESCRIPTION */}
                <div className="space-y-2">
                    <h3 className="text-sm text-accent/80 font-semibold">Descripción</h3>

                    <textarea
                        className="w-full h-32 bg-[#111] border border-white/10 rounded-lg p-3 text-sm text-[#EAE6D9] focus:outline-none focus:border-accent/40 resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Añadir una descripción..."
                    />
                </div>

                {/* XP DISPLAY */}
                <div className="mt-4 text-sm text-accent/70">XP otorgada: <span className="text-accent font-semibold">{task.xp ?? 10} XP</span></div>

                {/* FOOTER ACTIONS */}
                <div className="mt-6 flex justify-between items-center">
                    
                    <button 
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                    >
                        <Trash2 size={16}/> Eliminar
                    </button>

                    <button 
                        onClick={handleSave}
                        className="px-5 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition font-medium"
                    >
                        Guardar cambios
                    </button>

                </div>

            </div>
        </div>
    );
}

"use client";

import { X } from "lucide-react";

type Props = {
    task: {
        id: string;
        title: string;
        xp?: number;
        description?: string;
    };
    onClose: () => void;
};

export function TaskModal({ task, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e1e1e] w-full max-w-lg rounded-xl border border-white/10 p-6 shadow-2xl relative">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-accent">
                        {task.title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-accent/60 hover:text-accent transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm text-accent/70">Descripción</h3>
                        <p className="text-[#EAE6D9] text-sm mt-1">
                            {task.description ?? "Sin descripción."}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm text-accent/70">XP</h3>
                        <p className="text-[#EAE6D9] text-sm mt-1">
                            {task.xp ?? 10} XP
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition"
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
}

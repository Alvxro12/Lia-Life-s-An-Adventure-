"use client";

import { useRouter } from "next/navigation";
import { useLiaStore } from "@/store/UseLiaStore";
import { RecentBoards } from "@/components/workspace/recentBoards";

export default function WorkspacesPage() {
    const router = useRouter();

    const workspaces = useLiaStore((s) => s.workspaces);
    const createWorkspace = useLiaStore((s) => s.createWorkspace);

    // 🔥 TODO: cuando conectes backend, esto viene de ahí
    const recentBoards = [
    { id:"1", name:"Proyecto", workspaceId:"w1" }
]; // mock por ahora
    const invited = []; // mock por ahora

    return (
        <section className="p-6 space-y-12">

        <RecentBoards boards={recentBoards} />
            {/* 🟠 Tus Workspaces */}
            <div>
                <h2 className="text-lg font-semibold text-accent mb-3">
                    Tus Workspaces
                </h2>

                <div className="space-y-10">
                    {workspaces.map(ws => (
                        <div key={ws.id}>

                            {/* Header del workspace */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-md bg-accent/20 flex items-center justify-center font-bold">
                                    {ws.name[0]}
                                </div>
                                <h3 className="text-base font-medium">{ws.name}</h3>
                            </div>

                            {/* Boards del workspace */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                
                                {ws.boards.map(board => (
                                    <div 
                                        key={board.id}
                                        onClick={() => router.push(`/workspace/${ws.id}/${board.id}`)}
                                        className="h-28 rounded-xl bg-card/20 border border-accent/20 hover:bg-card/30 cursor-pointer flex items-end p-2"
                                    >
                                        <span className="text-xs text-foreground">
                                            {board.name}
                                        </span>
                                    </div>
                                ))}

                                {/* Crear nuevo board */}
                                <div
                                    onClick={() => {
                                        // Creamos workspace > boards > lists según tu store
                                        const newName = prompt("Nombre del tablero:");
                                        if (newName) {
                                            useLiaStore.getState().createBoard(ws.id, newName);
                                        }
                                    }}
                                    className="h-28 rounded-xl border border-dashed border-accent/30 flex items-center justify-center text-sm cursor-pointer hover:bg-accent/10"
                                >
                                    + Crear tablero nuevo
                                </div>
                            </div>

                        </div>
                    ))}

                    {/* Crear workspace */}
                    <button
                        onClick={() => createWorkspace(`Workspace ${workspaces.length + 1}`)}
                        className="border border-dashed border-accent/30 rounded-xl p-4 text-left text-sm hover:bg-accent/10 w-full"
                    >
                        + Crear un nuevo Workspace
                    </button>

                </div>
            </div>

            {/* 💜 Invitados (si hay) */}
            {invited.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-accent mb-3">
                        Workspaces donde eres invitado
                    </h2>
                    ...
                </div>
            )}
        </section>
    );
}

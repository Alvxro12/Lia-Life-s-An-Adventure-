"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiaStore } from "@/store/UseLiaStore";
import { RecentBoards } from "@/components/workspace/recentBoards";

export default function WorkspacesPage() {
    const router = useRouter();

    const workspaces = useLiaStore((s) => s.workspaces);
    const createWorkspace = useLiaStore((s) => s.createWorkspace);
    const loadWorkspacesFromApi = useLiaStore((s) => s.loadWorkspacesFromApi);
    const loadBoards = useLiaStore((s) => s.loadBoards);

    // 1) Cargar workspaces
    useEffect(() => {
        loadWorkspacesFromApi().catch(console.error);
    }, []);

    // 2) Cuando cambien los workspaces, cargo sus boards
    useEffect(() => {
        async function fetchBoards() {
            for (const ws of workspaces) {
                await loadBoards(ws.id); // <------ 🔥 ESTA ES LA CLAVE
            }
        }
        if (workspaces.length > 0) fetchBoards();
    }, [workspaces]);

    return (
        <section className="p-6 space-y-12">

            <RecentBoards boards={[]} />

            <h2 className="text-lg font-semibold text-accent mb-3">Tus Workspaces</h2>

            <div className="space-y-10">
                {workspaces.map((ws) => (
                    <div key={ws.id}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-md bg-accent/20 flex items-center justify-center font-bold">
                                {ws.name[0]}
                            </div>
                            <h3 className="text-base font-medium">{ws.name}</h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {(ws.boards ?? []).map((board) => (
                                <div
                                    key={board.id}
                                    onClick={() => router.push(`/workspace/${ws.id}/${board.id}`)}
                                    className="h-28 rounded-xl bg-card/20 border border-accent/20 hover:bg-card/30 cursor-pointer flex items-end p-2"
                                >
                                    <span className="text-xs text-foreground">
                                        {board.title}
                                    </span>
                                </div>
                            ))}

                            {/* crear board */}
                            <div
                                onClick={() => {
                                    const name = prompt("Nombre del tablero:");
                                    if (name)
                                        useLiaStore.getState().createBoard(ws.id, name);
                                }}
                                className="h-28 rounded-xl border border-dashed border-accent/30 flex items-center justify-center text-sm cursor-pointer hover:bg-accent/10"
                            >
                                + Crear tablero nuevo
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => {
                        const name = prompt("Nombre del nuevo workspace:");
                        if (name) createWorkspace(name);
                    }}
                    className="border border-dashed border-accent/30 rounded-xl p-4 text-left text-sm hover:bg-accent/10 w-full"
                >
                    + Crear un nuevo Workspace
                </button>
            </div>
        </section>
    );
}

// (private)/workspace/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useLiaStore } from "@/store/UseLiaStore";

export default function WorkspacesPage() {
    const workspaces = useLiaStore((s) => s.workspaces);
    const createWorkspace = useLiaStore((s) => s.createWorkspace);
    const router = useRouter();

    return (
        <section className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-accent">Tus Workspaces</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workspaces.map(ws => (
                    <div
                        key={ws.id}
                        onClick={() => router.push(`/workspace/${ws.id}`)}
                        className="cursor-pointer bg-card/30 hover:bg-card/40 border border-accent/20 rounded-xl p-4 shadow-sm transition"
                    >
                        <h3 className="text-base font-medium text-foreground">
                            {ws.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {ws.boards.length} board{ws.boards.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                ))}

                <button
                    onClick={() => createWorkspace(`Nuevo mundo #${workspaces.length + 1}`)}
                    className="border border-dashed border-accent/30 rounded-xl p-4"
                >
                    + Crear nuevo Workspace
                </button>

            </div>
        </section>
    );
}

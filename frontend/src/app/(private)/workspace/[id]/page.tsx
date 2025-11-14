"use client";

import { useParams } from "next/navigation";
import { HeaderProfile } from "@/components/workspace/headerProfile";
import { BoardsGrid } from "@/components/workspace/grid-boards";
import { useWorkspaces } from "@/hooks/useWorkSpace";

export default function WorkspaceView() {
    const { id } = useParams();
    const workspaceId = Array.isArray(id) ? id[0] : id ?? "";
    const { getWorkspace } = useWorkspaces();

    const currentWorkspace = workspaceId ? getWorkspace(workspaceId) : undefined;

    // ❗️Si no encontramos el workspace significa que el store aún no hidrató (persist) o el ID es inválido.
    // Evitamos romper el árbol y devolvemos un fallback mínimo para mantener la navegación estable.
    if (!currentWorkspace) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No pudimos cargar el workspace solicitado. Verifica el enlace o sincroniza el store.
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="border-b">
                <HeaderProfile workspaceName={currentWorkspace.name} />
            </div>

            <div className="flex-1 px-6 py-8">
                <BoardsGrid workspaceId={workspaceId} />
            </div>
        </div>
    );
}

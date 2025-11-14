"use client";

import { useParams } from "next/navigation";
import { HeaderProfile } from "@/components/workspace/headerProfile";
import { BoardsGrid } from "@/components/workspace/grid-boards";
import { useWorkspaces } from "@/hooks/useWorkSpace";

export default function WorkspaceView() {
    const { id } = useParams();
    const workspaceId = Array.isArray(id) ? id[0] : id ?? "";
    const { workspaces } = useWorkspaces();


    const currentWorkspace = workspaces.find(ws => ws.id === id);

    return (
        <div className="h-full w-full flex flex-col">
            <div className="border-b">
                <HeaderProfile workspaceName={currentWorkspace?.name} />
            </div>

            <div className="flex-1 px-6 py-8">
                <BoardsGrid workspaceId={workspaceId} />
            </div>
        </div>
    );
}

"use client";

import { useRouter } from "next/navigation";


interface BoardCardProps {
    boardId: string;
    boardName: string;
    workspaceId: string;
}

export function BoardCard({ boardId, boardName, workspaceId }: BoardCardProps) {
    const router = useRouter();

    const openBoard = () => {
        router.push(`/workspace/${workspaceId}/boards/${boardId}`); 
    };

    return (
        <div
            onClick={openBoard}
            className="rounded-lg border border-accent/30 bg-card hover:bg-card/80 shadow-sm transition-colors p-4 cursor-pointer"
        >
            <h3 className="text-sm font-medium">{boardName}</h3>
            <p className="text-xs text-accent/70">
                Haz click para entrar a tus misiones.
            </p>
        </div>
    );
}

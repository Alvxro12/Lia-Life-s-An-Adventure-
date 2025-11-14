"use client";

import { useBoards } from "@/hooks/useBoard";
import { BoardCard } from "./BoardCard";
import { useLiaStore } from "@/store/UseLiaStore";

interface BoardsGridProps {
    workspaceId: string;
}

export function BoardsGrid({ workspaceId }: BoardsGridProps) {
    const createBoard = useLiaStore((s) => s.createBoard);
    const { boards, workspace } = useBoards(workspaceId);

    // ⚠️ Si no existe el workspace mostramos un placeholder pero mantenemos la UI lista para hidratarse.
    if (!workspace) {
        return (
            <section className="space-y-6">
                <h2 className="text-lg font-semibold tracking-wide text-accent">
                    Tableros de misión
                </h2>
                <p className="text-sm text-muted-foreground">
                    Cargando información del workspace...
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <h2 className="text-lg font-semibold tracking-wide text-accent">
                Tableros de misión
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {boards.map((board) => (
                    <BoardCard
                        key={board.id}
                        boardId={board.id}
                        boardName={board.name}
                        workspaceId={workspaceId}
                    />
                ))}

                {/* Botón para crear tablero */}
                <div
                    onClick={() => createBoard(workspaceId, `Misión ${boards.length + 1}`)}
                    className="border border-dashed border-accent/30 rounded-xl p-4 cursor-pointer hover:bg-accent/10"
                >
                    + Crear nuevo tablero
                </div>

            </div>
        </section>
    );
}

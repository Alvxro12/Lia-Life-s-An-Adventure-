"use client";

import { useLiaStore } from "@/store/UseLiaStore";
import type { BoardList } from "@/types/workspace";

export function useLists(workspaceId: string, boardId: string) {
    const workspaces = useLiaStore((s) => s.workspaces); // ✔ AHORA LEE EL STORE

    const workspace = workspaces.find((w) => w.id === workspaceId);
    const board = workspace?.boards.find((b) => b.id === boardId);

    const lists: BoardList[] = board?.lists ?? [];

    return {
        board,
        lists
    };
}

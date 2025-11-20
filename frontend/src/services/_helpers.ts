import type { Workspace, Board, BoardList } from "@/types/workspace";

/**
 * Busca un workspace por ID.
 */
export function findWorkspace(
    workspaces: Workspace[],
    id: string
): Workspace | undefined {
    return workspaces.find((w) => w.id === id);
}

/**
 * Busca un board dentro de un workspace
 */
export function findBoard(
    workspace: Workspace,
    id: string
): Board | undefined {
    return workspace.boards.find((b) => b.id === id);
}

/**
 * Busca una lista dentro de un board
 */
export function findList(
    board: Board,
    id: string
): BoardList | undefined {
    return board.lists.find((l) => l.id === id);
}

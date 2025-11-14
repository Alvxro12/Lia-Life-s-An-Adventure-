export interface Task {
    id: string;
    title: string;
    completed: boolean;
    xp: number;
}

export interface BoardList {
    id: string;
    title: string;
    tasks: Task[];
}

export interface Board {
    id: string;
    name: string;
    lists: BoardList[];
}

export interface Workspace {
    id: string;
    name: string;
    description?: string; // 👈 opcional, pero la solemos usar
    boards: Board[];
}

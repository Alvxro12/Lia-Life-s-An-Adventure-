export interface Workspace {
    id: number;
    name: string;
    description?: string;
    boards: Board[];
}

export interface Board {
    id: number;
    title: string;
    description: string;
    order: number;
    lists: BoardList[];
}

export interface BoardList {
    id: number;
    title: string;
    tasks: Task[];
}

export interface Task {
    id: number;
    title: string;
    completed: boolean;
    xp: number;
    description?: string;
}

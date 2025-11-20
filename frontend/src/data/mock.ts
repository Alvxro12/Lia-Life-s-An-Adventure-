import type { Workspace } from "@/types/workspace";

export const mockWorkspaces: Workspace[] = [
    {
        id: "w1",
        name: "Santuario del Código",
        description: "El taller donde se forjan las ideas",
        boards: [
            {
                id: "b1",
                name: "Misión: Refactorización Arcana",
                lists: [
                    {
                        id: "l1",
                        title: "Por hacer",
                        tasks: [
                            {
                                id: "t1",
                                title: "Reescribir hooks",
                                completed: false,
                                xp: 10
                            },
                            {
                                id: "t2",
                                title: "Reescribir  2.0",
                                completed: false,
                                xp: 10
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "w2",
        name: "Templo del Conocimiento",
        description: "Donde estudias pa volverte sabio",
        boards: [
            {
                id: "b2",
                name: "Misión: Estudiar TypeScript",
                lists: []
            }
        ]
    }
];

export const mockData = {
    workspaces: mockWorkspaces
};

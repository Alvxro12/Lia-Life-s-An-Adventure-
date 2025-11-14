"use client";

import { useState } from "react";
import { mockData } from "@/data/mock";
import type { Workspace } from "@/types/workspace";

export function useWorkspaces() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>(mockData.workspaces);

    function getWorkspace(id: string) {
        return workspaces.find((w) => w.id === id);
    }

    function createWorkspace(name: string, description = "") {
        const newWorkspace: Workspace = {
            id: `w${Date.now()}`,
            name,
            description,
            boards: []
        };

        setWorkspaces((prev) => [...prev, newWorkspace]);
        return newWorkspace;
    }

    return {
        workspaces,
        getWorkspace,
        createWorkspace
    };
}

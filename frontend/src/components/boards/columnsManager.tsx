// ColumnsManager.tsx
"use client";

import React from "react";

type ColumnsManagerProps = {
    children: React.ReactNode;
};

export function ColumnsManager({ children }: ColumnsManagerProps) {
    return (
        <ul className="inline-flex whitespace-nowrap overflow-x-auto overflow-y-hidden h-full px-4 py-2">
            {children}
        </ul>
    );
}

// ColumnSlot.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListColumn } from "@/components/boards/listColumns";
import type { Task } from "@/types/workspace";

type ColumnSlotProps = {
    id: number;
    title: string;
    tasks: Task[];
    onAddTask: (listId: number) => void;
    onUpdateTitle?: (listId: number, newTitle: string) => void;
};

export function ColumnSlot(props: ColumnSlotProps) {
    const virtualId = `list-${props.id}`;

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
    } = useSortable({
        id: virtualId,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            key={virtualId}
            ref={setNodeRef}
            style={style}
            className="inline-block align-top w-64 h-full relative pointer-events-none"
        >
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none" />

            <div className="relative w-full h-full pointer-events-auto">
                <ListColumn
                    {...props}
                    dragHandleProps={{ ...attributes, ...listeners }}
                />
            </div>
        </li>
    );
}

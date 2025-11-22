// ColumnSlot.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListColumn } from "@/components/boards/listColumns"; // usa tu componente real
import type { Task } from "@/types/workspace";

type ColumnSlotProps = {
    id: string;
    title: string;
    tasks: Task[];
    onAddTask: (listId: string) => void;
    onUpdateTitle?: (listId: string, newTitle: string) => void;
};

export function ColumnSlot(props: ColumnSlotProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
    } = useSortable({
        id: props.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
<li
    ref={setNodeRef}
    style={style}
    className="inline-block align-top w-64 h-full relative pointer-events-none"
>

    <div className="absolute top-0 left-0 w-full h-full pointer-events-none" />
    
    <div className="relative w-full h-auto pointer-events-auto">
        {/* contenido visual */}
        <ListColumn {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
</li>

    );
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListColumn } from "./listColumns";
import type { Task } from "@/types/workspace";

type Props = {
    id: string;
    title: string;
    tasks: Task[];
    onAddTask: (listId: string) => void;
    onUpdateTitle?: (listId: string, newTitle: string) => void;
};

export function SortableListColumn(props: Props) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`min-w-64 max-w-64 flex flex-col rounded-xl ${
                isDragging ? "opacity-50" : ""
            }`}
        >
            <ListColumn
                {...props}
                dragHandleProps={{ ...listeners, ...attributes }}
            />
        </div>
    );
}

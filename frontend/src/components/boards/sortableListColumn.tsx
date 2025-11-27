"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListColumn } from "./listColumns";
import type { Task } from "@/types/workspace";

type Props = {
    id: number;
    title: string;
    tasks: Task[];
    onAddTask: (listId: number) => void;
    onUpdateTitle?: (listId: number, newTitle: string) => void;
};

export function SortableListColumn(props: Props) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div className="h-full flex flex-col pointer-events-auto">
        <li
            ref={setNodeRef}
            style={style}
            className="
                list-none
                flex
                justify-center
            "
        >
            {/* ⬅️ wrapper FLEXIBLE dentro del hitbox */}

                <ListColumn
                    {...props}
                    dragHandleProps={{ ...attributes, ...listeners }}
                />
        </li>
            </div>
    );
}

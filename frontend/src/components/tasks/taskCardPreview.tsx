"use client";

type Props = {
    task: any;
};

export function TaskCardPreview({ task }: Props) {
    return (
        <div
            className="
                mb-2 rounded-lg px-3 py-2 text-sm border 
                bg-[#242424] border-white/10 text-[#EAE6D9]
                shadow-xl
            "
        >
            {task.title}
        </div>
    );
}

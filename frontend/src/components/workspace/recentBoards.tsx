"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface RecentBoard {
    id: string;
    name: string;
    image?: string;
    workspaceId: string;
}

interface Props {
    boards: RecentBoard[];
}

export function RecentBoards({ boards }: Props) {
    const router = useRouter();

    if (!boards || boards.length === 0) return null;

    return (
        <section>
            <h2 className="text-lg font-semibold text-accent mb-3">
                Últimos tableros visitados
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((board) => (
                    <div
                        key={board.id}
                        onClick={() =>
                            router.push(`/workspace/${board.workspaceId}/${board.id}`)
                        }
                        className={cn(
                            "relative h-28 rounded-xl border border-accent/20 cursor-pointer overflow-hidden group",
                            board.image ? "bg-cover bg-center" : "bg-card/30"
                        )}
                        style={
                            board.image
                                ? { backgroundImage: `url(${board.image})` }
                                : {}
                        }
                    >
                        {/* overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />

                        {/* nombre */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white bg-black/40 group-hover:bg-black/60 transition">
                            {board.name}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

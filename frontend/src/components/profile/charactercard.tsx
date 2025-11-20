import Image from "next/image";

interface Props {
    name: string;
    level: number;
    xp: number;
    nextLevelXP: number;
}

export function CharacterCard({ name, level, xp, nextLevelXP }: Props) {

    const percent = Math.min((xp / nextLevelXP) * 100, 100);

    return (
        <div className="border border-accent/20 bg-card rounded-xl p-6 flex items-center gap-6">

            {/* Avatar (placeholder por ahora) */}
            <div className="w-20 h-20 rounded-full bg-accent/20 overflow-hidden">
                <Image 
                    src="/avatar-placeholder.png"
                    alt="Avatar"
                    width={80}
                    height={80}
                />
            </div>

            {/* Info */}
            <div className="flex-1">
                <h2 className="text-xl font-medium">{name}</h2>
                <p className="text-sm text-text/70">Nivel {level}</p>

                {/* XP bar */}
                <div className="mt-3 w-full h-2 bg-accent/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-accent"
                        style={{ width: `${percent}%` }} 
                    />
                </div>

                <p className="text-xs mt-1 text-text/60">
                    {xp} / {nextLevelXP} XP
                </p>
            </div>

        </div>
    );
}

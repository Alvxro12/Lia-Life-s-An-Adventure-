interface Props {
    missionsCompleted: number;
    tasksCompleted: number;
    streak: number;
}

export function ProfileStats({
    missionsCompleted,
    tasksCompleted,
    streak
}: Props) {
    return (
        <div className="border border-accent/20 bg-card rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Estadísticas</h3>

            <ul className="space-y-2 text-sm text-text">
                <li>🗡 Misiones completadas: {missionsCompleted}</li>
                <li>📌 Tareas completadas: {tasksCompleted}</li>
                <li>🔥 Racha activa: {streak} días</li>
            </ul>
        </div>
    );
}

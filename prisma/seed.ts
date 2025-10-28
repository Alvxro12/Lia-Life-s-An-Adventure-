import { PrismaClient, Role, WorkspaceRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 🔒 Crear admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@lia.com' },
        update: {},
        create: {
            name: 'Administrador',
            email: 'admin@lia.com',
            password: hashedPassword,
            level: 99,
            xp: 9999,
            role: Role.ADMIN,
        },
    });

    // 🏠 Crear Workspace asociado al admin
    const workspace = await prisma.workspace.create({
        data: {
            name: 'LIA HQ',
            description: 'Workspace principal de desarrollo',
            ownerId: admin.id,
            members: {
                create: [
                    {
                        userId: admin.id,
                        role: WorkspaceRole.OWNER,
                    },
                ],
            },
        },
    });

    // 📋 Crear Board de ejemplo dentro del workspace
    const board = await prisma.board.create({
        data: {
            title: 'Misión Principal',
            description: 'Primer tablero de ejemplo',
            workspaceId: workspace.id, // ✅ obligatorio ahora
            userId: admin.id, // sigue existiendo en tu schema (para referencia)
        },
    });

    // ✅ Crear una tarea asociada a ese board
    const task = await prisma.task.create({
        data: {
            title: 'Completa tu primera misión',
            description: 'Arrastra y suelta esta tarea a "Completadas"',
            xpReward: 50,
            boardId: board.id,
        },
    });

    // ⭐ Registrar progreso del admin
    await prisma.progress.create({
        data: {
            xpEarned: 50,
            userId: admin.id,
            taskId: task.id,
        },
    });

    console.log('🌱 Seed completada correctamente.');
    console.log('   Usuario: admin@lia.com / admin123');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

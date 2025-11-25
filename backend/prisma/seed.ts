import { PrismaClient, Role, WorkspaceRole, TaskStatus } from '@prisma/client';
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
            level: 1,
            xp: 0,
            role: Role.ADMIN,
        },
    });

    // 🏠 Crear Workspace
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

    // 📋 Crear Board
    const board = await prisma.board.create({
        data: {
            title: 'Misión Principal',
            description: 'Primer tablero de ejemplo',
            workspaceId: workspace.id,
            userId: admin.id,
            order: 0,
        },
    });

    // 📑 Crear Listas (Todo, Doing, Done)
    const todo = await prisma.list.create({
        data: {
            title: 'Por hacer',
            order: 0,
            boardId: board.id,
        },
    });

    const doing = await prisma.list.create({
        data: {
            title: 'En progreso',
            order: 1,
            boardId: board.id,
        },
    });

    const done = await prisma.list.create({
        data: {
            title: 'Completadas',
            order: 2,
            boardId: board.id,
        },
    });

    // 📝 Tasks asociadas a listas
    const task1 = await prisma.task.create({
        data: {
            title: 'Completa tu primera misión',
            description: 'Arrastra esta tarea a Completadas.',
            xpReward: 50,
            status: TaskStatus.TO_DO,
            listId: todo.id,
            order: 0,
        },
    });

    const task2 = await prisma.task.create({
        data: {
            title: 'Explora el tablero',
            xpReward: 30,
            status: TaskStatus.IN_PROGRESS,
            listId: doing.id,
            order: 0,
        },
    });

    const task3 = await prisma.task.create({
        data: {
            title: 'Bienvenido a LIA 🎉',
            xpReward: 10,
            status: TaskStatus.DONE,
            listId: done.id,
            order: 0,
        },
    });

    // ⭐ Registrar progreso (solo para la tarea 3)
    await prisma.progress.create({
        data: {
            xpEarned: 10,
            userId: admin.id,
            taskId: task3.id,
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

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    // Crear una tarea dentro de un board
    async create(dto: CreateTaskDto) {
        const board = await this.prisma.board.findUnique({
            where: { id: dto.boardId },
            include: { workspace: { include: { members: true } } },
        });
        if (!board) throw new NotFoundException('Board no encontrado');

        const isMember = board.workspace.members.some((m) => m.userId === dto.userId);
        if (!isMember) throw new ForbiddenException('No perteneces a este workspace');

        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                boardId: dto.boardId,
            },
        });
    }

    // Listar tareas de un board
    async findAll(boardId: number, userId: number) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            include: { workspace: { include: { members: true } } },
        });
        if (!board) throw new NotFoundException('Board no encontrado');

        const isMember = board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No perteneces a este workspace');

        return this.prisma.task.findMany({
            where: { boardId },
            orderBy: { order: 'asc' },
        });
    }

    // Actualizar tarea (nombre, descripción, estado, etc.)
    async update(id: number, dto: UpdateTaskDto) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Tarea no encontrada');

        return this.prisma.task.update({
            where: { id },
            data: dto,
        });
    }

    // Mover una tarea (entre boards o columnas)
    async move(id: number, dto: MoveTaskDto, userId: number) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: { board: { include: { workspace: { include: { members: true } } } } },
        });
        if (!task) throw new NotFoundException('Tarea no encontrada');

        const isMember = task.board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No perteneces a este workspace');

        return this.prisma.task.update({
            where: { id },
            data: {
                boardId: dto.boardId ?? task.boardId,
                status: dto.status ?? task.status,
                order: dto.order ?? task.order,
            },
        });
    }

    // Eliminar tarea
    async remove(id: number, userId: number) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: { board: { include: { workspace: { include: { members: true } } } } },
        });
        if (!task) throw new NotFoundException('Tarea no encontrada');

        const isMember = task.board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No perteneces a este workspace');

        return this.prisma.task.delete({ where: { id } });
    }

    // Completar una tarea y sumar XP al usuario
    async complete(id: number, userId: number) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        if (!task) throw new NotFoundException('Tarea no encontrada');

        await this.prisma.task.update({
            where: { id },
            data: { status: TaskStatus.DONE },
        });

        await this.prisma.progress.create({
            data: {
                xpEarned: task.xpReward,
                userId,
                taskId: id,
            },
        });

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: task.xpReward },
            },
        });

        return { message: 'Tarea completada', xpGanado: task.xpReward };
    }
}

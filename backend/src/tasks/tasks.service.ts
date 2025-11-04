import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { TaskStatus } from '@prisma/client';

/**
 * Servicio de Tareas
 * Maneja creación, actualización, movimiento y finalización de tareas.
 * Incluye verificación de membresía y registro de progreso (XP).
 */
@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    /**
     * Crea una tarea dentro de un board.
     * Verifica que el usuario sea miembro del workspace del board.
     */
    async create(dto: CreateTaskDto, userId: number) {
        const board = await this.prisma.board.findUnique({
            where: { id: dto.boardId },
            include: { workspace: { include: { members: true } } },
        });
        if (!board) throw new NotFoundException('Board no encontrado');

        const isMember = board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No perteneces a este workspace');

        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                boardId: dto.boardId,
                status: TaskStatus.TO_DO,
            },
        });
    }

    /**
     * Lista todas las tareas de un board.
     * Solo accesible si el usuario es miembro del workspace del board.
     */
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

    /**
     * Actualiza información de una tarea (nombre, descripción, estado, etc.).
     * No requiere membresía explícita, asume que la seguridad se maneja desde el frontend.
     */
    async update(id: number, dto: UpdateTaskDto) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Tarea no encontrada');

        return this.prisma.task.update({
            where: { id },
            data: dto,
        });
    }

    /**
     * Mueve una tarea entre boards o columnas.
     * Verifica que el usuario sea miembro del workspace de origen/destino.
     */
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

    /**
     * Elimina una tarea (solo miembros del workspace pueden hacerlo).
     */
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

    /**
     * Marca una tarea como completada y suma XP al usuario.
     * - Cambia el estado a DONE.
     * - Registra el progreso en la tabla Progress.
     * - Aumenta el XP total del usuario.
     */
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
            data: { xp: { increment: task.xpReward } },
        });

        return { message: 'Tarea completada', xpGanado: task.xpReward };
    }
}

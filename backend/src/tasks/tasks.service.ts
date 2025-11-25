import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    /** Crear tarea dentro de una lista */
    async create(dto: CreateTaskDto, userId: number) {
        const list = await this.prisma.list.findUnique({
            where: { id: dto.listId },
            include: { 
                board: { 
                    include: { 
                        workspace: { include: { members: true } } 
                    } 
                } 
            },
        });

        if (!list) throw new NotFoundException('Lista no encontrada');

        const isMember = list.board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No tienes acceso');

        const lastOrder = await this.prisma.task.count({
            where: { listId: dto.listId }
        });

        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                listId: dto.listId,
                status: TaskStatus.TO_DO,
                order: lastOrder,
            },
        });
    }

    /** Listar todas las tasks de una lista */
    async findAll(listId: number, userId: number) {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
            include: { 
                board: { 
                    include: { 
                        workspace: { include: { members: true } } 
                    } 
                } 
            },
        });

        if (!list) throw new NotFoundException('Lista no encontrada');

        const isMember = list.board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No tienes acceso');

        return this.prisma.task.findMany({
            where: { listId },
            orderBy: { order: 'asc' },
        });
    }

    /** Actualizar task */
    async update(id: number, dto: UpdateTaskDto) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Tarea no encontrada');

        return this.prisma.task.update({
            where: { id },
            data: dto,
        });
    }

    /** Mover task entre listas o dentro de la misma lista */
    async move(id: number, dto: MoveTaskDto, userId: number) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: { 
                list: { 
                    include: { 
                        board: { include: { workspace: { include: { members: true } } } } 
                    } 
                } 
            },
        });

        if (!task) throw new NotFoundException('Tarea no encontrada');

        const isMember = task.list.board.workspace.members.some(m => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No tienes acceso');

        return this.prisma.task.update({
            where: { id },
            data: {
                listId: dto.newListId,
                order: dto.newOrder,
            },
        });
    }

    /** Eliminar task */
    async remove(id: number, userId: number) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: { 
                list: { 
                    include: { 
                        board: { include: { workspace: { include: { members: true } } } } 
                    } 
                } 
            },
        });

        if (!task) throw new NotFoundException('Task no encontrada');

        const isMember = task.list.board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No tienes acceso');

        return this.prisma.task.delete({ where: { id } });
    }

    /** Completar task y sumar XP */
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

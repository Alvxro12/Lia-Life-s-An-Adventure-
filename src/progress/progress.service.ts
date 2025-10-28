import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { FilterProgressDto } from './dto/filter-progress.dto';

@Injectable()
export class ProgressService {
    constructor(private prisma: PrismaService) {}

    // Registrar progreso manualmente (solo para pruebas o admin)
    async create(dto: CreateProgressDto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        const task = await this.prisma.task.findUnique({ where: { id: dto.taskId } });

        if (!user) throw new NotFoundException('Usuario no encontrado');
        if (!task) throw new NotFoundException('Tarea no encontrada');

        await this.prisma.user.update({
            where: { id: dto.userId },
            data: { xp: { increment: dto.xpEarned } },
        });

        return this.prisma.progress.create({
            data: {
                xpEarned: dto.xpEarned,
                userId: dto.userId,
                taskId: dto.taskId,
            },
        });
    }

    // Consultar todo el progreso
    async findAll(filter: FilterProgressDto) {
        return this.prisma.progress.findMany({
            where: {
                userId: filter.userId,
                taskId: filter.taskId,
            },
            include: {
                user: { select: { id: true, name: true, xp: true, level: true } },
                task: { select: { id: true, title: true, xpReward: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Consultar resumen de progreso de un usuario
    async getSummary(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, xp: true, level: true },
        });

        if (!user) throw new NotFoundException('Usuario no encontrado');

        const totalTasks = await this.prisma.progress.count({ where: { userId } });
        const totalXP = user.xp;
        const nextLevelXP = user.level * 100;

        return {
            userId: user.id,
            name: user.name,
            xpActual: totalXP,
            levelActual: user.level,
            siguienteNivel: `${nextLevelXP - totalXP} XP restantes`,
            tareasCompletadas: totalTasks,
        };
    }
}

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-boards.dto';

/**
 * Servicio de Boards
 * Gestiona la creación, consulta, actualización y eliminación de tableros dentro de un workspace.
 * Verifica membresía del usuario antes de permitir acceso o cambios.
 */
@Injectable()
export class BoardsService {
    constructor(private prisma: PrismaService) {}

    /**
     * Crea un nuevo board dentro de un workspace.
     * - Verifica que el usuario sea miembro del workspace.
     */
    async create(dto: CreateBoardDto, userId: number) {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId: dto.workspaceId, userId },
        });

        if (!member) throw new ForbiddenException('No perteneces a este workspace');

        return this.prisma.board.create({
            data: {
                title: dto.title,
                description: dto.description,
                workspaceId: dto.workspaceId,
                order: dto.order ?? 0,
                userId,
            },
        });
    }

    /**
     * Retorna todos los boards de un workspace si el usuario es miembro.
     */
    async findAll(workspaceId: number, userId: number) {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId, userId },
        });
        if (!member) throw new ForbiddenException('Sin acceso a este workspace');

        return this.prisma.board.findMany({
            where: { workspaceId },
            include: { tasks: true },
            orderBy: { updatedAt: 'desc' },
        });
    }

    /**
     * Retorna un board específico con sus tareas.
     * - Solo si el usuario pertenece al workspace.
     */
    async findOne(id: number, userId: number) {
        const board = await this.prisma.board.findUnique({
            where: { id },
            include: { workspace: true, tasks: true },
        });
        if (!board) throw new NotFoundException('Board no encontrado');

        const member = await this.prisma.workspaceMember.findFirst({
            where: { userId, workspaceId: board.workspaceId },
        });
        if (!member) throw new ForbiddenException('No perteneces a este workspace');

        return board;
    }

    /**
     * Actualiza un board (nombre, descripción, orden).
     */
    async update(id: number, dto: UpdateBoardDto) {
        const board = await this.prisma.board.findUnique({ where: { id } });
        if (!board) throw new NotFoundException('Board no encontrado');

        return this.prisma.board.update({
            where: { id },
            data: dto,
        });
    }

    /**
     * Elimina un board si el usuario pertenece al workspace.
     */
    async remove(id: number, userId: number) {
        const board = await this.prisma.board.findUnique({
            where: { id },
        });
        if (!board) throw new NotFoundException('Board no encontrado');

        const member = await this.prisma.workspaceMember.findFirst({
            where: { userId, workspaceId: board.workspaceId },
        });
        if (!member) throw new ForbiddenException('No perteneces a este workspace');

        return this.prisma.board.delete({ where: { id } });
    }
}

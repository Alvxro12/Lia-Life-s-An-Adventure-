import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-boards.dto';

@Injectable()
export class BoardsService {
    constructor(private prisma: PrismaService) {}

    /** Crear Board dentro de un workspace */
    async create(dto: CreateBoardDto, userId: number) {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId: dto.workspaceId, userId },
        });

        if (!member) throw new ForbiddenException('No perteneces a este workspace');

        // ❌ YA NO EXISTE order EN BOARD → eliminamos count
        return this.prisma.board.create({
            data: {
                title: dto.title,
                description: dto.description,
                workspaceId: dto.workspaceId,
                userId,
            },
        });
    }

    /** Listar todos los boards de un workspace */
    async findAll(workspaceId: number, userId: number) {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId, userId },
        });

        if (!member) throw new ForbiddenException('Sin acceso a este workspace');

        return this.prisma.board.findMany({
            where: { workspaceId },
            include: {
                lists: {
                    include: {
                        tasks: {
                            orderBy: { order: 'asc' }, // ✔ tasks sí tienen order
                        },
                    },
                    orderBy: { order: 'asc' }, // ✔ listas sí tienen order
                },
            },
            // ❌ orderBy: { order: 'asc' } — se elimina
        });
    }

    /** Obtener un board con sus listas y tareas */
    async findOne(id: number, userId: number) {
        const board = await this.prisma.board.findUnique({
            where: { id },
            include: {
                workspace: true,
                lists: {
                    include: {
                        tasks: {
                            orderBy: { order: 'asc' },
                        },
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!board) throw new NotFoundException('Board no encontrado');

        const member = await this.prisma.workspaceMember.findFirst({
            where: { userId, workspaceId: board.workspaceId },
        });

        if (!member) throw new ForbiddenException('No perteneces a este workspace');

        return board;
    }

    /** Actualizar board */
    async update(id: number, dto: UpdateBoardDto) {
        const board = await this.prisma.board.findUnique({ where: { id } });
        if (!board) throw new NotFoundException('Board no encontrado');

        return this.prisma.board.update({
            where: { id },
            data: dto,
        });
    }

    /** Eliminar board */
    async remove(id: number, userId: number) {
        const board = await this.prisma.board.findUnique({ where: { id } });
        if (!board) throw new NotFoundException('Board no encontrado');

        const member = await this.prisma.workspaceMember.findFirst({
            where: { userId, workspaceId: board.workspaceId },
        });

        if (!member) throw new ForbiddenException('No perteneces a este workspace');

        return this.prisma.board.delete({ where: { id } });
    }
}

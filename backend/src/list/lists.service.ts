import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ReorderListDto } from './dto/reorder-list.dto';

@Injectable()
export class ListsService {
    constructor(private prisma: PrismaService) {}

    /** Crear lista */
    async create(dto: CreateListDto, userId: number) {
        const board = await this.prisma.board.findUnique({
            where: { id: dto.boardId },
            include: { workspace: { include: { members: true } } }
        });

        if (!board) throw new NotFoundException("Board no encontrado");

        const isMember = board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException("No perteneces a este workspace");

        const lastOrder = await this.prisma.list.count({
            where: { boardId: dto.boardId }
        });

        return this.prisma.list.create({
            data: {
                title: dto.title,
                boardId: dto.boardId,
                order: lastOrder
            }
        });
    }

    /** Listar listas */
    async findAll(boardId: number, userId: number) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            include: { workspace: { include: { members: true } } }
        });

        if (!board) throw new NotFoundException("Board no encontrado");

        const isMember = board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException("No tienes acceso");

        return this.prisma.list.findMany({
            where: { boardId },
            include: { tasks: true },
            orderBy: { order: "asc" }
        });
    }

    /** Actualizar lista */
    async update(id: number, dto: UpdateListDto) {
        return this.prisma.list.update({
            where: { id },
            data: dto
        });
    }

    /** Eliminar lista */
    async remove(id: number, userId: number) {
        const list = await this.prisma.list.findUnique({
            where: { id },
            include: { board: { include: { workspace: { include: { members: true } } } } }
        });

        if (!list) throw new NotFoundException("Lista no encontrada");

        const isMember = list.board.workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException("No tienes acceso");

        return this.prisma.list.delete({ where: { id } });
    }

    /** Reordenar listas */
    async reorder(dto: ReorderListDto) {
        const updateOps = dto.items.map((item) =>
            this.prisma.list.update({
                where: { id: item.id },
                data: { order: item.order }
            })
        );

        await this.prisma.$transaction(updateOps);

        return { message: "Reordenamiento exitoso" };
    }
}

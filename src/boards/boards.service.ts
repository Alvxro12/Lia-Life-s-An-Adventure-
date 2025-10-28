import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-boards.dto';

@Injectable()
export class BoardsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateBoardDto) {
        // Verificar membresía del usuario en el workspace
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId: dto.workspaceId, userId: dto.userId },
        });

        if (!member) throw new ForbiddenException('No perteneces a este workspace');

        return this.prisma.board.create({
            data: {
                title: dto.title,
                description: dto.description,
                workspaceId: dto.workspaceId,
                userId: dto.userId,
            },
        });
    }

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

    async update(id: number, dto: UpdateBoardDto) {
        const board = await this.prisma.board.findUnique({ where: { id } });
        if (!board) throw new NotFoundException('Board no encontrado');

        return this.prisma.board.update({
            where: { id },
            data: dto,
        });
    }

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
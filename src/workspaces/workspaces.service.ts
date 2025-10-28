import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspaces.dto';
import { UpdateWorkspaceDto } from './dto/update-workspaces.dto';

@Injectable()
export class WorkspacesService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateWorkspaceDto) {
        // Verificar que no exista un workspace con el mismo nombre para ese owner
        const exists = await this.prisma.workspace.findFirst({
            where: { name: dto.name, ownerId: dto.ownerId },
        });
        if (exists) throw new ForbiddenException('Ya existe un workspace con ese nombre');

        return this.prisma.workspace.create({
            data: {
                name: dto.name,
                description: dto.description,
                ownerId: dto.ownerId,
                members: {
                    create: {
                        userId: dto.ownerId,
                        role: 'OWNER',
                    },
                },
            },
            include: { members: true },
        });
    }

    async findAll(userId: number) {
        // Retorna los workspaces donde el usuario es miembro
        return this.prisma.workspace.findMany({
            where: { members: { some: { userId } } },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true, role: true } } },
                },
            },
        });
    }

    async findOne(id: number, userId: number) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true, role: true } } },
                },
            },
        });
        if (!workspace) throw new NotFoundException('Workspace no encontrado');

        const isMember = workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No tienes acceso a este workspace');

        return workspace;
    }

    async update(id: number, userId: number, dto: UpdateWorkspaceDto) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id },
            include: { members: true },
        });
        if (!workspace) throw new NotFoundException('Workspace no encontrado');

        const isOwner = workspace.members.some(
            (m) => m.userId === userId && m.role === 'OWNER',
        );
        if (!isOwner) throw new ForbiddenException('Solo el OWNER puede modificar este workspace');

        return this.prisma.workspace.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: number, userId: number) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id },
            include: { members: true },
        });
        if (!workspace) throw new NotFoundException('Workspace no encontrado');

        const isOwner = workspace.members.some(
            (m) => m.userId === userId && m.role === 'OWNER',
        );
        if (!isOwner) throw new ForbiddenException('Solo el OWNER puede eliminar este workspace');

        return this.prisma.workspace.delete({ where: { id } });
    }
}

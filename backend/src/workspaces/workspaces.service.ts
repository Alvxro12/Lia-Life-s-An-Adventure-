import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspaces.dto';
import { UpdateWorkspaceDto } from './dto/update-workspaces.dto';

/**
 * Servicio de Workspaces
 * Encargado de crear, consultar, actualizar y eliminar espacios de trabajo.
 * Aplica validaciones de pertenencia y rol (OWNER vs MEMBER).
 */
@Injectable()
export class WorkspacesService {
    constructor(private prisma: PrismaService) {}

    /**
     * Crea un nuevo workspace.
     * - Verifica que no exista otro con el mismo nombre para el mismo usuario.
     * - Asigna automáticamente al usuario autenticado como OWNER.
     */
    async create(dto: CreateWorkspaceDto, userId: number) {
        const exists = await this.prisma.workspace.findFirst({
            where: { name: dto.name, ownerId: userId },
        });
        if (exists) throw new ForbiddenException('Ya existe un workspace con ese nombre');

        return this.prisma.workspace.create({
            data: {
                name: dto.name,
                description: dto.description,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: 'OWNER',
                    },
                },
            },
            include: { members: true },
        });
    }

    /**
     * Retorna todos los workspaces donde el usuario autenticado es miembro.
     */
    async findAll(userId: number) {
        return this.prisma.workspace.findMany({
            where: { members: { some: { userId } } },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true, role: true } } },
                },
            },
        });
    }

    /**
     * Retorna un workspace específico solo si el usuario es miembro.
     */
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

        // Verifica membresía
        const isMember = workspace.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException('No tienes acceso a este workspace');

        return workspace;
    }

    /**
     * Actualiza un workspace (solo si el usuario autenticado es OWNER).
     */
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

    /**
     * Elimina un workspace (solo si el usuario autenticado es OWNER).
     */
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

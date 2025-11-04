import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

/**
 * Servicio de Usuarios
 * Gestiona la lectura, actualización y eliminación de usuarios.
 * No maneja autenticación ni contraseñas (eso se delega a AuthService).
 */

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Retorna todos los usuarios registrados.
     * (Ideal para vistas administrativas o debugging.)
     */

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                xp: true,
                level: true,
            },
        });
    }

    /**
     * Busca un usuario por su correo electrónico.
     * Se usa internamente por AuthService durante el login.
     */

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    /**
     * Busca un usuario por ID (para vistas de perfil o debugging).
     */

    async findById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                xp: true,
                level: true,
            },
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    /**
     * Actualiza datos básicos de perfil (nombre o avatar).
     * No modifica contraseñas ni roles.
     */

    async update(id: number, data: Partial<{ name: string; avatar?: string }>) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                xp: true,
                level: true,
                avatar: true,
            },
        });
    }

    /**
     * Elimina un usuario de la base de datos.
     * ⚠️ Debería estar protegido por RolesGuard ('ADMIN') una vez activemos los roles.
     */
    
    async delete(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}

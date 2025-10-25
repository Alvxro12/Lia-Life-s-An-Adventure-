import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    // Crear un nuevo usuario
    async create(data: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN' }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role ?? 'USER',
        },
    });
}

    // Buscar todos los usuarios
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

    // Buscar un usuario por email (útil para login)
    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    // Buscar un usuario por ID
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

async update(id: number, data: Partial<{ name: string; password: string }>) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const updateData: any = { ...data };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                xp: true,
                level: true,
            },
        });
    }

    // Eliminar un usuario
    async delete(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}

import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
//import { RolesGuard } from '../auth/roles.guard'; // 🚧 (pendiente post-MVP)
//import { Roles } from '../auth/decorators/roles.decorator'; // 🚧 (pendiente post-MVP)
import { User } from '../auth/decorator/user.decorator';

/**
 * Controlador de Usuarios
 * Gestiona endpoints públicos y protegidos relacionados con la información del usuario.
 */
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Retorna todos los usuarios registrados.
     * 🔒 Este endpoint debería estar restringido a ADMIN (una vez activemos RolesGuard).
     */
    //@UseGuards(RolesGuard)
    //@Roles('ADMIN') // 🚧 Se activará post-MVP
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    /**
     * Retorna el perfil del usuario autenticado o de un ID específico (según permisos).
     */
    @Get(':id')
    async findById(@Param('id') id: string, @User('id') userId: number) {
        // Por ahora permite ver cualquier ID, luego se puede limitar a owner o ADMIN
        return this.usersService.findById(Number(id));
    }

    /**
     * Actualiza el perfil del usuario autenticado.
     */
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @User('id') userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        // Si se quiere asegurar que solo se edite su propio perfil:
        if (Number(id) !== userId) {
            // Aquí podrías lanzar ForbiddenException si no eres admin o el mismo user
        }
        return this.usersService.update(Number(id), updateUserDto);
    }

    /**
     * Elimina un usuario por ID.
     * 🔒 Este endpoint se reservará para ADMIN cuando implementemos RolesGuard.
     */
//*  @UseGuards(RolesGuard)
   //@Roles('ADMIN') // 🚧 Pendiente de activación post-MVP
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.usersService.delete(Number(id));
    }
}

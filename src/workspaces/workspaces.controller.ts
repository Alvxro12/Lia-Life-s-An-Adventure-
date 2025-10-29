import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspaces.dto';
import { UpdateWorkspaceDto } from './dto/update-workspaces.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../auth/decorator/user.decorator';

/**
 * Controlador de Workspaces
 * Gestiona endpoints CRUD para los espacios de trabajo.
 * Todas las rutas están protegidas por JWT.
 */

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    /**
     * Crea un nuevo workspace para el usuario autenticado.
     * El ID del usuario se obtiene desde el JWT (no del body).
     */
    
    @Post()
    create(@User('id') userId: number, @Body() dto: CreateWorkspaceDto) {
        return this.workspacesService.create(dto, userId);
    }

    /**
     * Retorna todos los workspaces donde el usuario autenticado es miembro.
     */
    @Get()
    findAll(@User('id') userId: number) {
        return this.workspacesService.findAll(userId);
    }

    /**
     * Retorna un workspace específico si el usuario es miembro.
     */
    @Get(':id')
    findOne(@Param('id') id: string, @User('id') userId: number) {
        return this.workspacesService.findOne(Number(id), userId);
    }

    /**
     * Actualiza un workspace si el usuario autenticado es OWNER.
     */
    @Patch(':id')
    update(
        @Param('id') id: string,
        @User('id') userId: number,
        @Body() dto: UpdateWorkspaceDto,
    ) {
        return this.workspacesService.update(Number(id), userId, dto);
    }

    /**
     * Elimina un workspace si el usuario autenticado es OWNER.
     */
    @Delete(':id')
    remove(@Param('id') id: string, @User('id') userId: number) {
        return this.workspacesService.remove(Number(id), userId);
    }
}

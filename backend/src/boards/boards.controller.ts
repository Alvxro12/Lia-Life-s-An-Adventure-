import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-boards.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../auth/decorator/user.decorator';

/**
 * Controlador de Boards
 * Maneja endpoints CRUD para los tableros dentro de un workspace.
 * Todas las rutas están protegidas por JWT.
 */
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    /**
     * Crea un nuevo board dentro de un workspace.
     * - Usa el userId desde el token para validar membresía.
     */
    @Post()
    create(@User('id') userId: number, @Body() dto: CreateBoardDto) {
        return this.boardsService.create(dto, userId);
    }

    /**
     * Lista todos los boards del workspace si el usuario es miembro.
     */
    @Get('workspace/:workspaceId')
    findAll(@Param('workspaceId') workspaceId: string, @User('id') userId: number) {
        return this.boardsService.findAll(Number(workspaceId), userId);
    }

    /**
     * Retorna un board con sus tareas.
     */
    @Get(':id')
    findOne(@Param('id') id: string, @User('id') userId: number) {
        return this.boardsService.findOne(Number(id), userId);
    }

    /**
     * Actualiza datos del board.
     */
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
        return this.boardsService.update(Number(id), dto);
    }

    /**
     * Elimina un board si el usuario pertenece al workspace.
     */
    @Delete(':id')
    remove(@Param('id') id: string, @User('id') userId: number) {
        return this.boardsService.remove(Number(id), userId);
    }
}

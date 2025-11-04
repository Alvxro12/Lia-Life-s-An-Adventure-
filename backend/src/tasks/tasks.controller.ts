import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../auth/decorator/user.decorator';

/**
 * Controlador de Tareas
 * Gestiona endpoints CRUD y XP relacionados con tareas.
 * Todas las rutas están protegidas por JWT.
 */
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@User('id') userId: number, @Body() dto: CreateTaskDto) {
        return this.tasksService.create(dto, userId);
    }

    @Get(':boardId')
    findAll(@Param('boardId') boardId: string, @User('id') userId: number) {
        return this.tasksService.findAll(Number(boardId), userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.update(Number(id), dto);
    }

    @Patch(':id/move')
    move(@Param('id') id: string, @Body() dto: MoveTaskDto, @User('id') userId: number) {
        return this.tasksService.move(Number(id), dto, userId);
    }

    @Patch(':id/complete')
    complete(@Param('id') id: string, @User('id') userId: number) {
        return this.tasksService.complete(Number(id), userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @User('id') userId: number) {
        return this.tasksService.remove(Number(id), userId);
    }
}

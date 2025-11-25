import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../auth/decorator/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    /** Crear una nueva tarea dentro de una lista */
    @Post()
    create(@User('id') userId: number, @Body() dto: CreateTaskDto) {
        return this.tasksService.create(dto, userId);
    }

    /** Obtener tareas de una lista específica */
    @Get('list/:listId')
    findAll(@Param('listId') listId: string, @User('id') userId: number) {
        return this.tasksService.findAll(Number(listId), userId);
    }

    /** Actualizar datos de una tarea */
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.update(Number(id), dto);
    }

    /** Mover una tarea entre listas o dentro de la misma lista */
    @Patch(':id/move')
    move(
        @Param('id') id: string,
        @Body() dto: MoveTaskDto,
        @User('id') userId: number,
    ) {
        return this.tasksService.move(Number(id), dto, userId);
    }

    /** Completar una tarea y sumar XP */
    @Patch(':id/complete')
    complete(@Param('id') id: string, @User('id') userId: number) {
        return this.tasksService.complete(Number(id), userId);
    }

    /** Eliminar una tarea */
    @Delete(':id')
    remove(@Param('id') id: string, @User('id') userId: number) {
        return this.tasksService.remove(Number(id), userId);
    }
}

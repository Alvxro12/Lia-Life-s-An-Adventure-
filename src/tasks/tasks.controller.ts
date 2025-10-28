import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Body() dto: CreateTaskDto) {
        return this.tasksService.create(dto);
    }

    @Get()
    findAll(@Query('boardId') boardId: string, @Query('userId') userId: string) {
        return this.tasksService.findAll(Number(boardId), Number(userId));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.update(Number(id), dto);
    }

    @Patch(':id/move')
    move(@Param('id') id: string, @Body() dto: MoveTaskDto, @Query('userId') userId: string) {
        return this.tasksService.move(Number(id), dto, Number(userId));
    }

    @Patch(':id/complete')
    complete(@Param('id') id: string, @Query('userId') userId: string) {
        return this.tasksService.complete(Number(id), Number(userId));
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Query('userId') userId: string) {
        return this.tasksService.remove(Number(id), Number(userId));
    }
}

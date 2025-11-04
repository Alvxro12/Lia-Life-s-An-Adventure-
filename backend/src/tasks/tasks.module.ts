import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

/**
 * Módulo de Tareas
 * Agrupa la lógica de gestión de tareas y XP.
 */
@Module({
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}

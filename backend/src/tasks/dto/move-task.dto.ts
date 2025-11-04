import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TaskStatus } from '@prisma/client';

/**
 * DTO para mover una tarea entre boards o columnas.
 * Se puede modificar el boardId, el estado o el orden.
 */
export class MoveTaskDto {
    @IsInt()
    boardId: number;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsInt()
    @IsOptional()
    order?: number;
}

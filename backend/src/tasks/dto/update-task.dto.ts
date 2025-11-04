import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '@prisma/client';

/**
 * DTO para actualizar los datos de una tarea.
 * Permite cambios parciales (título, descripción, estado u orden).
 */
export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsInt()
    @IsOptional()
    order?: number;
}

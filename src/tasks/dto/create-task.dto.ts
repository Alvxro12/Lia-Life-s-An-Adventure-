import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO para crear una nueva tarea.
 * El userId ya no se envía desde el cliente: se obtiene desde el token JWT.
 */
export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    boardId: number; // ID del board al que pertenece la tarea
}

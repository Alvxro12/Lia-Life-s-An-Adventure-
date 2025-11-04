import { IsOptional, IsString } from 'class-validator';

/**
 * DTO para actualizar los datos de un Board.
 * Permite modificar el título o la descripción de un tablero existente.
 */
export class UpdateBoardDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;
}

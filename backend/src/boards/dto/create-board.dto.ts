import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO para crear un nuevo Board (tablero).
 * El userId ya no se recibe desde el cliente: 
 * se obtiene automáticamente desde el token JWT del usuario autenticado.
 */
export class CreateBoardDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    workspaceId: number; // ID del workspace al que pertenece el board

    @IsInt()
    @IsOptional()
    order?: number; // opcional, útil para ordenar visualmente los boards
}

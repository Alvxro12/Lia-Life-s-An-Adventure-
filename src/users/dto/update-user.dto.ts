import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO para actualizar información básica del usuario.
 * 
 * Actualmente solo permite modificar el nombre, 
 * pero más adelante se pueden agregar otros campos 
 * (por ejemplo avatar, bio, idioma, etc.).
 */
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    name?: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}

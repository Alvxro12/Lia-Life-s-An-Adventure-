import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    password?: string;
}

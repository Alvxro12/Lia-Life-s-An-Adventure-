import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    name: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido.' })
    email: string;

    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    password: string;

    @IsOptional()
    @IsEnum(['USER', 'ADMIN'])
    role?: 'USER' | 'ADMIN';
}

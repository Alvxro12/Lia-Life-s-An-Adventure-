import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * Módulo de Usuarios
 * Expone endpoints para consultar y actualizar datos de usuario.
 * No maneja autenticación (eso está en AuthModule).
 */
@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // opcional, por si otro módulo necesita usar el servicio
})
export class UsersModule {}

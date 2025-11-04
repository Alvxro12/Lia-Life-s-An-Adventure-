import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';

/**
 * Módulo de Progreso
 * Administra la lógica y endpoints del sistema de XP del usuario.
 */
@Module({
    controllers: [ProgressController],
    providers: [ProgressService],
})
export class ProgressModule {}

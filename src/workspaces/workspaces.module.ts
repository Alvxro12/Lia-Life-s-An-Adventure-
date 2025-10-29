import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';

/**
 * Módulo de Workspaces
 * Agrupa el servicio y controlador de gestión de espacios de trabajo.
 * PrismaService no se importa porque ya está declarado como global.
 */
@Module({
    controllers: [WorkspacesController],
    providers: [WorkspacesService],
    exports: [WorkspacesService],
})
export class WorkspacesModule {}

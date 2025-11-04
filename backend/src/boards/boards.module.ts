import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';

/**
 * Módulo de Boards
 * Agrupa la lógica y endpoints relacionados con tableros de un workspace.
 */
@Module({
    controllers: [BoardsController],
    providers: [BoardsService],
})
export class BoardsModule {}

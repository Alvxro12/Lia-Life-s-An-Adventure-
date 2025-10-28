import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
    controllers: [BoardsController],
    providers: [BoardsService, PrismaService],
})
export class BoardsModule {}

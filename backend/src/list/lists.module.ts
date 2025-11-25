import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
    controllers: [ListsController],
    providers: [ListsService],
    imports: [PrismaModule],
})
export class ListsModule {}

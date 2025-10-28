import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import {PrismaModule} from './common/prisma/prisma.module'
import { WorkspacesModule } from './workspaces/workspaces.module';
import {BoardsModule} from './boards/boards.module'
import {TasksModule} from './tasks/tasks.module'
import {ProgressModule} from './progress/progress.module'

@Module({
  imports: [WorkspacesModule, BoardsModule, TasksModule, ProgressModule, UsersModule, PrismaModule],
})

export class AppModule {}

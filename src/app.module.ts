import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import {PrismaModule} from './common/prisma/prisma.module'

@Module({
  imports: [UsersModule,PrismaModule],
})
export class AppModule {}

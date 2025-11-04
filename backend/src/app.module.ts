import { Module } from '@nestjs/common';

// Módulos de negocio
import { WorkspacesModule } from './workspaces/workspaces.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { ProgressModule } from './progress/progress.module';
import { UsersModule } from './users/users.module';

// Módulos de infraestructura
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

/**
 * AppModule:
 * Módulo raíz del backend. 
 * Conecta todos los módulos funcionales y de infraestructura.
 */
@Module({
  imports: [
    AuthModule,      // Autenticación (login, registro, JWT)
    WorkspacesModule, // Gestión de espacios de trabajo
    BoardsModule,     // Tableros dentro de un workspace
    TasksModule,      // Tareas asociadas a un board
    ProgressModule,   // Seguimiento de XP y progreso
    UsersModule,      // Consultas de usuarios (sin manejo de contraseñas)
    PrismaModule,     // ORM / conexión con base de datos
  ],
})
export class AppModule {}

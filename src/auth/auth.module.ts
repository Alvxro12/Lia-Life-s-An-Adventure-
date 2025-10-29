import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../common/prisma/prisma.module';  // usa tu ruta relativa o alias
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'dev_secret_key',
            signOptions: { expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600 },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService], // opcional, por si otro módulo necesita validar usuarios
})
export class AuthModule {}

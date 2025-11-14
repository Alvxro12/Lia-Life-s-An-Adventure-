import { Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { FilterProgressDto } from './dto/filter-progress.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../auth/decorator/user.decorator';

/**
 * Controlador de Progreso
 * Gestiona los endpoints para consultar y registrar XP del usuario.
 */
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    /**
     * Crea un registro de progreso (solo pruebas/admin).
     * En producción, el progreso se genera automáticamente al completar tareas.
     */
    @Post()
    // ⚠️ Exponer este endpoint sin RolesGuard permite que cualquier usuario manipule su XP.
    // Activa un guard de ADMIN antes de lanzar a producción.
    create(@Body() dto: CreateProgressDto) {
        return this.progressService.create(dto);
    }

    /**
     * Retorna el historial de progreso del usuario autenticado.
     * Puede filtrarse por tarea mediante query param.
     */
    @Get()
    findAll(@User('id') userId: number, @Query() filter: FilterProgressDto) {
        return this.progressService.findAll(userId, filter);
    }

    /**
     * Retorna el resumen de XP y nivel del usuario autenticado.
     */
    @Get('summary')
    getSummary(@User('id') userId: number) {
        return this.progressService.getSummary(userId);
    }
}

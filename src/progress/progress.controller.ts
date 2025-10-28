import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { FilterProgressDto } from './dto/filter-progress.dto';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    // Crear registro de progreso (solo para pruebas)
    @Post()
    create(@Body() dto: CreateProgressDto) {
        return this.progressService.create(dto);
    }

    // Listar progreso (filtro opcional por usuario o tarea)
    @Get()
    findAll(@Query() filter: FilterProgressDto) {
        return this.progressService.findAll(filter);
    }

    // Resumen del usuario
    @Get('summary/:userId')
    getSummary(@Param('userId') userId: string) {
        return this.progressService.getSummary(Number(userId));
    }
}

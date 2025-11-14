import { IsInt, IsOptional } from 'class-validator';

export class FilterProgressDto {
    @IsInt()
    @IsOptional()
    // ⚠️ Actualmente no se debería permitir filtrar por otro userId desde el cliente.
    // Mantenerlo comentado o validarlo con roles cuando implementemos dashboards administrativos.
    userId?: number;

    @IsInt()
    @IsOptional()
    taskId?: number;
}

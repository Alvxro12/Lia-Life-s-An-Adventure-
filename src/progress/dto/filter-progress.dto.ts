import { IsInt, IsOptional } from 'class-validator';

export class FilterProgressDto {
    @IsInt()
    @IsOptional()
    userId?: number;

    @IsInt()
    @IsOptional()
    taskId?: number;
}

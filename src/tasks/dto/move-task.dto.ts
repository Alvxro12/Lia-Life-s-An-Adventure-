import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class MoveTaskDto {
    @IsInt()
    boardId: number;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsInt()
    @IsOptional()
    order?: number;
}

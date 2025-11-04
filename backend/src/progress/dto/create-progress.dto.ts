import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProgressDto {
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    taskId: number;

    @IsInt()
    @IsNotEmpty()
    xpEarned: number;
}

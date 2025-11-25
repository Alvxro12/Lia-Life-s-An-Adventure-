import { IsInt } from 'class-validator';

export class MoveTaskDto {
    @IsInt()
    newListId: number;

    @IsInt()
    newOrder: number;
}

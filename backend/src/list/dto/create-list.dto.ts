import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateListDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    boardId: number;
}

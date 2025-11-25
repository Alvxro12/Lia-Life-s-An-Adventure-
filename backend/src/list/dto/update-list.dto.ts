import { IsOptional, IsString, IsInt } from "class-validator";

export class UpdateListDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsInt()
    order?: number;
}

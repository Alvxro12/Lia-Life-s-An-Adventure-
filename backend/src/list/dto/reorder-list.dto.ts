import { IsArray, ValidateNested, IsInt } from "class-validator";
import { Type } from "class-transformer";

class ListOrderItem {
    @IsInt()
    id: number;

    @IsInt()
    order: number;
}

export class ReorderListDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ListOrderItem)
    items: ListOrderItem[];
}

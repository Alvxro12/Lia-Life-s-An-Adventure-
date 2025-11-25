import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ListsService } from './lists.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../auth/decorator/user.decorator';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ReorderListDto } from './dto/reorder-list.dto';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
    constructor(private readonly listsService: ListsService) {}

    @Patch('reorder')
    reorder(@Body() dto: ReorderListDto) {
        return this.listsService.reorder(dto);
    }

    @Post()
    create(@User('id') userId: number, @Body() dto: CreateListDto) {
        return this.listsService.create(dto, userId);
    }

    @Get(':boardId')
    findAll(@Param('boardId') boardId: string, @User('id') userId: number) {
        return this.listsService.findAll(Number(boardId), userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateListDto) {
        return this.listsService.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @User('id') userId: number) {
        return this.listsService.remove(Number(id), userId);
    }
}

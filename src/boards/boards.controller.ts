import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-boards.dto';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    @Post()
    create(@Body() dto: CreateBoardDto) {
        return this.boardsService.create(dto);
    }

    @Get()
    findAll(@Query('workspaceId') workspaceId: string, @Query('userId') userId: string) {
        return this.boardsService.findAll(Number(workspaceId), Number(userId));
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('userId') userId: string) {
        return this.boardsService.findOne(Number(id), Number(userId));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
        return this.boardsService.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Query('userId') userId: string) {
        return this.boardsService.remove(Number(id), Number(userId));
    }
}

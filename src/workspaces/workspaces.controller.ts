import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspaces.dto';
import { UpdateWorkspaceDto } from './dto/update-workspaces.dto';

@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Post()
    create(@Body() dto: CreateWorkspaceDto) {
        return this.workspacesService.create(dto);
    }

    @Get()
    findAll(@Query('userId') userId: string) {
        return this.workspacesService.findAll(Number(userId));
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('userId') userId: string) {
        return this.workspacesService.findOne(Number(id), Number(userId));
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Query('userId') userId: string,
        @Body() dto: UpdateWorkspaceDto,
    ) {
        return this.workspacesService.update(Number(id), Number(userId), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Query('userId') userId: string) {
        return this.workspacesService.remove(Number(id), Number(userId));
    }
}

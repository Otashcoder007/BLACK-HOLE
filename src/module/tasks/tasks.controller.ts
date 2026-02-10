import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {JwtAuthGuard} from "../../core/jwt.guard";
import {RolesGuard} from "../../core/roles.guard";
import {RolesDecorator} from "../../core/roles.decorator";
import {Roles} from "../../core/enums/roles.enum";

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Create task'})
    @Post()
    create(@Body() dto: CreateTaskDto) {
        return this.tasksService.create(dto);
    }

    @ApiOperation({summary: 'List tasks (pagination)'})
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.tasksService.findAll(page, limit);
    }

    @ApiOperation({summary: 'Get task by id'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.findOne(id);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Update task'})
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
        return this.tasksService.update(id, dto);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Delete task'})
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.remove(id);
    }
}
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

import {LessonsService} from './lessons.service';
import {CreateLessonDto} from './dto/create-lesson.dto';
import {UpdateLessonDto} from './dto/update-lesson.dto';
import {RolesGuard} from "../../core/roles.guard";
import {JwtAuthGuard} from "../../core/jwt.guard";
import {RolesDecorator} from "../../core/roles.decorator";
import {Roles} from "../../core/enums/roles.enum";

@ApiTags('Lessons')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Create lesson'})
    @Post()
    create(@Body() dto: CreateLessonDto) {
        return this.lessonsService.create(dto);
    }

    @ApiOperation({summary: 'List lessons (pagination + q filter)'})
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('q') q?: string) {
        return this.lessonsService.findAll(page, limit, q);
    }

    @ApiOperation({summary: 'Get lesson by id'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.findOne(id);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Update lesson'})
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLessonDto) {
        return this.lessonsService.update(id, dto);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Delete lesson'})
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.remove(id);
    }
}
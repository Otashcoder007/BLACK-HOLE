import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TemplatesService } from './templates.service';
import { CreateTaskCategoryDto } from './dto/create-task-category.dto';
import { CreateTaskTemplateDto } from './dto/create-task-template.dto';
import { UpdateTaskTemplateDto } from './dto/update-task-template.dto';
import {JwtAuthGuard} from "../../core/jwt.guard";
import {RolesGuard} from "../../core/roles.guard";
import {RolesDecorator} from "../../core/roles.decorator";
import {Roles} from "../../core/enums/roles.enum";

@ApiTags('Templates')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('templates')
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) {}

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({ summary: 'Create task category' })
    @Post('categories')
    createCategory(@Body() dto: CreateTaskCategoryDto) {
        return this.templatesService.createCategory(dto);
    }

    @ApiOperation({ summary: 'List categories (pagination + q filter)' })
    @Get('categories')
    listCategories(@Query('page') page?: number, @Query('limit') limit?: number, @Query('q') q?: string) {
        return this.templatesService.listCategories(page, limit, q);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({ summary: 'Create task template' })
    @Post()
    createTemplate(@Body() dto: CreateTaskTemplateDto) {
        return this.templatesService.createTemplate(dto);
    }

    @ApiOperation({ summary: 'List templates (pagination + q filter)' })
    @Get()
    listTemplates(@Query('page') page?: number, @Query('limit') limit?: number, @Query('q') q?: string) {
        return this.templatesService.listTemplates(page, limit, q);
    }

    @ApiOperation({ summary: 'Get template by id' })
    @Get(':id')
    getTemplate(@Param('id', ParseIntPipe) id: number) {
        return this.templatesService.getTemplate(id);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({ summary: 'Update template' })
    @Patch(':id')
    updateTemplate(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskTemplateDto) {
        return this.templatesService.updateTemplate(id, dto);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({ summary: 'Delete template' })
    @Delete(':id')
    deleteTemplate(@Param('id', ParseIntPipe) id: number) {
        return this.templatesService.deleteTemplate(id);
    }
}
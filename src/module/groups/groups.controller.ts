import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';


import {GroupsService} from './groups.service';
import {CreateGroupDto} from './dto/create-group.dto';
import {AddStudentToGroupDto} from './dto/add-student.dto';
import {JwtAuthGuard} from "../../core/jwt.guard";
import {RolesGuard} from "../../core/roles.guard";
import {RolesDecorator} from "../../core/roles.decorator";
import {Roles} from "../../core/enums/roles.enum";

@ApiTags('Groups')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Create group'})
    @Post()
    create(@Body() dto: CreateGroupDto) {
        return this.groupsService.create(dto);
    }

    @ApiOperation({summary: 'List groups (pagination + q filter)'})
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('q') q?: string) {
        return this.groupsService.findAll(page, limit, q);
    }

    @ApiOperation({summary: 'Get group by id'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.groupsService.findOne(id);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Add student to group'})
    @Post(':id/students')
    addStudent(@Param('id', ParseIntPipe) id: number, @Body() dto: AddStudentToGroupDto) {
        return this.groupsService.addStudent(id, dto);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Remove student from group'})
    @Delete(':id/students/:studentId')
    removeStudent(
        @Param('id', ParseIntPipe) id: number,
        @Param('studentId', ParseIntPipe) studentId: number,
    ) {
        return this.groupsService.removeStudent(id, studentId);
    }
}
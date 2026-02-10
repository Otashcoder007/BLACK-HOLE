import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {SubmissionsService} from './submissions.service';
import {CreateSubmissionDto} from './dto/create-submission.dto';
import {UpdateSubmissionDto} from './dto/update-submission.dto';
import {MarkSubmissionDto} from './dto/mark-submission.dto';
import {RolesGuard} from "../../core/roles.guard";
import {JwtAuthGuard} from "../../core/jwt.guard";
import {RolesDecorator} from "../../core/roles.decorator";
import {Roles} from "../../core/enums/roles.enum";
import {CurrentUser} from "../../core/current-user.decorator";

@ApiTags('Submissions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('submissions')
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) {
    }

    @RolesDecorator(Roles.student, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Create submission (student creates own)'})
    @Post()
    create(@Body() dto: CreateSubmissionDto, @CurrentUser() user: any) {
        if (user.role === Roles.student) dto.studentId = user.sub;
        return this.submissionsService.create(dto);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'List submissions (pagination + q filter)'})
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('q') q?: string) {
        return this.submissionsService.findAll(page, limit, q);
    }

    @RolesDecorator(Roles.teacher, Roles.student, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Get submission by id'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.submissionsService.findOne(id);
    }

    @RolesDecorator(Roles.student, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Update submission content (student own only)'})
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubmissionDto, @CurrentUser() user: any) {
        return this.submissionsService.updateOwned(id, dto, user);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Mark submission (teacher)'})
    @Patch(':id/mark')
    mark(@Param('id', ParseIntPipe) id: number, @Body() dto: MarkSubmissionDto) {
        return this.submissionsService.mark(id, dto);
    }

    @RolesDecorator(Roles.teacher, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Delete submission'})
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.submissionsService.remove(id);
    }
}
import {Body, Controller, Get, Param, ParseIntPipe, Post, Res, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags} from '@nestjs/swagger';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import type {Response} from 'express';

import {UploadFileDto} from './dto/upload-file.dto';
import {JwtAuthGuard} from '../../core/jwt.guard';
import {RolesGuard} from '../../core/roles.guard';
import {FilesService} from './file.service';
import {RolesDecorator} from '../../core/roles.decorator';
import {Roles} from '../../core/enums/roles.enum';
import {CurrentUser} from '../../core/current-user.decorator';

function fileName(_: any, file: any, cb: any) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + extname(file.originalname));
}

@ApiTags('Files')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @RolesDecorator(Roles.student, Roles.admin, Roles.superadmin)
    @ApiOperation({summary: 'Upload file for a submission'})
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({destination: './uploads', filename: fileName}),
            limits: {fileSize: 25 * 1024 * 1024}, // 25MB
        }),
    )
    @Post('upload')
    async upload(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadFileDto, @CurrentUser() user: any) {
        const path = `uploads/${file.filename}`;
        return this.filesService.createFileRecord({
            studentId: user.sub,
            lessonId: dto.lessonId,
            submissionId: dto.submissionId,
            path,
            size: file.size,
        });
    }

    @ApiOperation({summary: 'Download file by id'})
    @Get(':id/download')
    async download(@Param('id', ParseIntPipe) id: number, @Res() res: Response, @CurrentUser() user: any) {
        const {file, stream} = await this.filesService.openFileStream(id);

        // owner check for students (admins can download anything)
        if (user.role === Roles.student && file.studentId !== user.sub) {
            return res.status(403).json({message: 'Forbidden'});
        }

        res.setHeader('Content-Length', file.size);
        return stream.pipe(res);
    }
}

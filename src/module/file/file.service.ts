import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {createReadStream} from 'fs';
import {join} from 'path';

import {FileEntity} from '../../entities/file.entity';
import {Submission} from '../../entities/submission.entity';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FileEntity) private readonly filesRepo: Repository<FileEntity>,
        @InjectRepository(Submission) private readonly subRepo: Repository<Submission>,
    ) {
    }

    async createFileRecord(params: {
        studentId: number;
        lessonId: number;
        submissionId: number;
        path: string;
        size: number;
    }) {
        const sub = await this.subRepo.findOne({where: {id: params.submissionId}});
        if (!sub) throw new NotFoundException('Submission not found');
        if (sub.studentId !== params.studentId) throw new ForbiddenException('Not your submission');

        return this.filesRepo.save(this.filesRepo.create(params));
    }

    async getFile(id: number) {
        const file = await this.filesRepo.findOne({where: {id}});
        if (!file) throw new NotFoundException('File not found');
        return file;
    }

    async openFileStream(id: number) {
        const file = await this.getFile(id);
        const abs = join(process.cwd(), file.path);
        return {file, stream: createReadStream(abs)};
    }
}
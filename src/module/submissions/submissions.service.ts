import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Submission} from '../../entities/submission.entity';
import {CreateSubmissionDto} from './dto/create-submission.dto';
import {UpdateSubmissionDto} from './dto/update-submission.dto';
import {MarkSubmissionDto} from './dto/mark-submission.dto';
import {SubmissionStatus} from "../../core/enums/submission-status.enum";
import {makeMeta, normalizePageLimit} from "../../core/pagination";
import {Roles} from "../../core/enums/roles.enum";

@Injectable()
export class SubmissionsService {
    constructor(@InjectRepository(Submission) private readonly subRepo: Repository<Submission>) {
    }

    async create(dto: CreateSubmissionDto) {
        const exists = await this.subRepo.findOne({where: {studentId: dto.studentId, taskId: dto.taskId}});
        if (exists) throw new BadRequestException('Submission already exists for this task');

        return this.subRepo.save(
            this.subRepo.create({
                ...dto,
                content: dto.content ?? null,
                status: SubmissionStatus.pending,
            }),
        );
    }

    async findAll(page?: number, limit?: number, q?: string) {
        const {skip, take, page: p, limit: l} = normalizePageLimit(page, limit);

        const qb = this.subRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.student', 'student')
            .leftJoinAndSelect('s.task', 'task')
            .leftJoinAndSelect('task.lesson', 'lesson')
            .leftJoinAndSelect('task.template', 'template')
            .orderBy('s.id', 'DESC')
            .skip(skip)
            .take(take);

        if (q) qb.andWhere('LOWER(s.content) LIKE LOWER(:q)', {q: `%${q}%`});

        const [data, total] = await qb.getManyAndCount();
        return {data, meta: makeMeta(p, l, total)};
    }

    async findOne(id: number) {
        const sub = await this.subRepo.findOne({
            where: {id},
            relations: {student: true, task: {lesson: true, template: true}, files: true},
        });
        if (!sub) throw new NotFoundException('Submission not found');
        return sub;
    }

    async updateOwned(id: number, dto: UpdateSubmissionDto, user: any) {
        const sub = await this.findOne(id);
        if (user.role === Roles.student && sub.studentId !== user.sub) {
            throw new ForbiddenException('Cannot edit others submissions');
        }
        if (dto.content !== undefined) sub.content = dto.content ?? null;
        return this.subRepo.save(sub);
    }

    async mark(id: number, dto: MarkSubmissionDto) {
        const sub = await this.findOne(id);
        sub.mark = dto.mark ?? null;
        sub.feedback = dto.feedback ?? null;
        sub.status = dto.status;
        return this.subRepo.save(sub);
    }

    async remove(id: number) {
        const res = await this.subRepo.delete({id});
        if (!res.affected) throw new NotFoundException('Submission not found');
        return {ok: true};
    }
}
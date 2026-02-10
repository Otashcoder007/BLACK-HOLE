import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Lesson} from '../../entities/lesson.entity';
import {CreateLessonDto} from './dto/create-lesson.dto';
import {UpdateLessonDto} from './dto/update-lesson.dto';
import {makeMeta, normalizePageLimit} from "../../core/pagination";

@Injectable()
export class LessonsService {
    constructor(@InjectRepository(Lesson) private readonly lessonsRepo: Repository<Lesson>) {
    }

    create(dto: CreateLessonDto) {
        return this.lessonsRepo.save(this.lessonsRepo.create({...dto, startDate: new Date(dto.startDate)}));
    }

    async findAll(page?: number, limit?: number, q?: string) {
        const {skip, take, page: p, limit: l} = normalizePageLimit(page, limit);

        const qb = this.lessonsRepo
            .createQueryBuilder('lesson')
            .leftJoinAndSelect('lesson.group', 'group')
            .orderBy('lesson.id', 'DESC')
            .skip(skip)
            .take(take);

        if (q) qb.andWhere('LOWER(lesson.title) LIKE LOWER(:q)', {q: `%${q}%`});

        const [data, total] = await qb.getManyAndCount();
        return {data, meta: makeMeta(p, l, total)};
    }

    async findOne(id: number) {
        const lesson = await this.lessonsRepo.findOne({
            where: {id},
            relations: {group: true, tasks: {template: true}},
        });
        if (!lesson) throw new NotFoundException('Lesson not found');
        return lesson;
    }

    async update(id: number, dto: UpdateLessonDto) {
        const lesson = await this.findOne(id);
        if (dto.title !== undefined) lesson.title = dto.title;
        if (dto.startDate !== undefined) lesson.startDate = new Date(dto.startDate);
        return this.lessonsRepo.save(lesson);
    }

    async remove(id: number) {
        const res = await this.lessonsRepo.delete({id});
        if (!res.affected) throw new NotFoundException('Lesson not found');
        return {ok: true};
    }
}
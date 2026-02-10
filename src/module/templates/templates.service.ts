import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {TaskCategory} from '../../entities/task-category.entity';
import {TaskTemplate} from '../../entities/task-template.entity';
import {CreateTaskCategoryDto} from './dto/create-task-category.dto';
import {CreateTaskTemplateDto} from './dto/create-task-template.dto';
import {UpdateTaskTemplateDto} from './dto/update-task-template.dto';
import {makeMeta, normalizePageLimit} from "../../core/pagination";

@Injectable()
export class TemplatesService {
    constructor(
        @InjectRepository(TaskCategory) private readonly catRepo: Repository<TaskCategory>,
        @InjectRepository(TaskTemplate) private readonly tplRepo: Repository<TaskTemplate>,
    ) {
    }

    async createCategory(dto: CreateTaskCategoryDto) {
        const exists = await this.catRepo.findOne({where: {title: dto.title}});
        if (exists) throw new BadRequestException('Category title already exists');
        return this.catRepo.save(this.catRepo.create(dto));
    }

    async listCategories(page?: number, limit?: number, q?: string) {
        const {skip, take, page: p, limit: l} = normalizePageLimit(page, limit);

        const qb = this.catRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.templates', 'templates')
            .orderBy('c.id', 'DESC')
            .skip(skip)
            .take(take);

        if (q) qb.andWhere('LOWER(c.title) LIKE LOWER(:q)', {q: `%${q}%`});

        const [data, total] = await qb.getManyAndCount();
        return {data, meta: makeMeta(p, l, total)};
    }

    createTemplate(dto: CreateTaskTemplateDto) {
        return this.tplRepo.save(
            this.tplRepo.create({
                ...dto,
                description: dto.description ?? null,
            }),
        );
    }

    async listTemplates(page?: number, limit?: number, q?: string) {
        const {skip, take, page: p, limit: l} = normalizePageLimit(page, limit);

        const qb = this.tplRepo
            .createQueryBuilder('t')
            .leftJoinAndSelect('t.category', 'category')
            .orderBy('t.id', 'DESC')
            .skip(skip)
            .take(take);

        if (q) qb.andWhere('LOWER(t.title) LIKE LOWER(:q)', {q: `%${q}%`});

        const [data, total] = await qb.getManyAndCount();
        return {data, meta: makeMeta(p, l, total)};
    }

    async getTemplate(id: number) {
        const tpl = await this.tplRepo.findOne({where: {id}, relations: {category: true}});
        if (!tpl) throw new NotFoundException('Template not found');
        return tpl;
    }

    async updateTemplate(id: number, dto: UpdateTaskTemplateDto) {
        const tpl = await this.getTemplate(id);
        if (dto.categoryId !== undefined) tpl.categoryId = dto.categoryId;
        if (dto.title !== undefined) tpl.title = dto.title;
        if (dto.description !== undefined) tpl.description = dto.description ?? null;
        if (dto.content !== undefined) tpl.content = dto.content;
        return this.tplRepo.save(tpl);
    }

    async deleteTemplate(id: number) {
        const res = await this.tplRepo.delete({id});
        if (!res.affected) throw new NotFoundException('Template not found');
        return {ok: true};
    }
}
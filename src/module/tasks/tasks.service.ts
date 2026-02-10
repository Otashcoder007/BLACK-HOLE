import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Task} from '../../entities/task.entity';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {makeMeta, normalizePageLimit} from "../../core/pagination";

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private readonly tasksRepo: Repository<Task>) {
    }

    create(dto: CreateTaskDto) {
        return this.tasksRepo.save(this.tasksRepo.create(dto));
    }

    async findAll(page?: number, limit?: number) {
        const {skip, take, page: p, limit: l} = normalizePageLimit(page, limit);

        const qb = this.tasksRepo
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.lesson', 'lesson')
            .leftJoinAndSelect('task.template', 'template')
            .leftJoinAndSelect('template.category', 'category')
            .orderBy('task.id', 'DESC')
            .skip(skip)
            .take(take);

        const [data, total] = await qb.getManyAndCount();
        return {data, meta: makeMeta(p, l, total)};
    }

    async findOne(id: number) {
        const task = await this.tasksRepo.findOne({
            where: {id},
            relations: {lesson: true, template: {category: true}, submissions: true},
        });
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async update(id: number, dto: UpdateTaskDto) {
        const task = await this.findOne(id);
        if (dto.templateId !== undefined) task.templateId = dto.templateId;
        if (dto.order !== undefined) task.order = dto.order ?? null;
        return this.tasksRepo.save(task);
    }

    async remove(id: number) {
        const res = await this.tasksRepo.delete({id});
        if (!res.affected) throw new NotFoundException('Task not found');
        return {ok: true};
    }
}
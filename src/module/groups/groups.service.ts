import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Group} from '../../entities/group.entity';
import {CreateGroupDto} from './dto/create-group.dto';
import {AddStudentToGroupDto} from './dto/add-student.dto';
import {StudentsGroups} from "../../entities/students-group.entity";
import {makeMeta, normalizePageLimit} from "../../core/pagination";

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group) private readonly groupsRepo: Repository<Group>,
        @InjectRepository(StudentsGroups) private readonly sgRepo: Repository<StudentsGroups>,
    ) {
    }

    create(dto: CreateGroupDto) {
        return this.groupsRepo.save(this.groupsRepo.create(dto));
    }

    async findAll(page?: number, limit?: number, q?: string) {
        const {skip, take, page: p, limit: l} = normalizePageLimit(page, limit);

        const qb = this.groupsRepo
            .createQueryBuilder('g')
            .leftJoinAndSelect('g.teacher', 'teacher')
            .orderBy('g.id', 'DESC')
            .skip(skip)
            .take(take);

        if (q) qb.andWhere('LOWER(g.title) LIKE LOWER(:q)', {q: `%${q}%`});

        const [data, total] = await qb.getManyAndCount();
        return {data, meta: makeMeta(p, l, total)};
    }

    async findOne(id: number) {
        const group = await this.groupsRepo.findOne({
            where: {id},
            relations: {teacher: true, studentsGroups: {student: true}},
        });
        if (!group) throw new NotFoundException('Group not found');
        return group;
    }

    async addStudent(groupId: number, dto: AddStudentToGroupDto) {
        const exists = await this.sgRepo.findOne({where: {groupId, studentId: dto.studentId}});
        if (exists) throw new BadRequestException('Student already in group');

        return this.sgRepo.save(
            this.sgRepo.create({
                groupId,
                studentId: dto.studentId,
                joinedDate: dto.joinedDate,
                isActive: dto.isActive ?? true,
            }),
        );
    }

    async removeStudent(groupId: number, studentId: number) {
        const res = await this.sgRepo.delete({groupId, studentId});
        if (!res.affected) throw new NotFoundException('Student not in group');
        return {ok: true};
    }
}
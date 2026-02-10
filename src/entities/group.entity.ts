import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import type {User} from './user.entity';
import type {Lesson} from './lesson.entity';
import {GroupStatus} from '../core/enums/group-status.enum';
import {StudentsGroups} from './students-group.entity';
import {BaseModel} from '../core/base-model';

@Entity('groups')
export class Group extends BaseModel {
    @Column()
    teacherId: number;

    @ManyToOne('User', {onDelete: 'RESTRICT'})
    @JoinColumn({name: 'teacherId'})
    teacher: User;

    @Column({length: 128})
    title: string;

    @Column('date')
    startDate: string;

    @Column({type: 'enum', enum: GroupStatus, enumName: 'group_status_enum'})
    status: GroupStatus;

    @OneToMany('Lesson', 'group')
    lessons: Lesson[];

    @OneToMany('StudentsGroups', 'group')
    studentsGroups: StudentsGroups[];
}

import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import type {Group} from './group.entity';
import {Task} from './task.entity';
import {FileEntity} from './file.entity';
import {BaseModel} from '../core/base-model';

@Entity('lessons')
export class Lesson extends BaseModel {
    @Column()
    groupId: number;

    @ManyToOne('Group', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'groupId'})
    group: Group;

    @Column({length: 128})
    title: string;

    @Column('date')
    startDate: string;

    @OneToMany(() => Task, t => t.lesson)
    tasks: Task[];

    @OneToMany(() => FileEntity, f => f.lesson)
    files: FileEntity[];
}

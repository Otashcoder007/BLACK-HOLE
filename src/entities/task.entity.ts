import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import type {Lesson} from './lesson.entity';
import type {TaskTemplate} from './task-template.entity';
import type {Submission} from './submission.entity';
import {BaseModel} from '../core/base-model';

@Entity('tasks')
export class Task extends BaseModel {
    @Column()
    lessonId: number;

    @ManyToOne('Lesson', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'lessonId'})
    lesson: Lesson;

    @Column()
    templateId: number;

    @ManyToOne('TaskTemplate', {onDelete: 'RESTRICT'})
    @JoinColumn({name: 'templateId'})
    template: TaskTemplate;

    @Column({nullable: true})
    order: number | null;

    @OneToMany('Submission', 'task')
    submissions: Submission[];
}

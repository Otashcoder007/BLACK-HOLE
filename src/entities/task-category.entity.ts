import {Column, Entity, Index, OneToMany} from 'typeorm';
import type {TaskTemplate} from './task-template.entity';
import {BaseModel} from '../core/base-model';

@Entity('taskCategories')
export class TaskCategory extends BaseModel {
    @Index({unique: true})
    @Column({length: 128, unique: true})
    title: string;

    @OneToMany('TaskTemplate', 'category')
    templates: TaskTemplate[];
}

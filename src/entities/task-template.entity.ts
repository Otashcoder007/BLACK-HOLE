import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import type {TaskCategory} from './task-category.entity';
import type {Task} from './task.entity';
import {BaseModel} from '../core/base-model';

@Entity('taskTemplates')
export class TaskTemplate extends BaseModel {
    @Column()
    categoryId: number;

    @ManyToOne('TaskCategory', {onDelete: 'RESTRICT'})
    @JoinColumn({name: 'categoryId'})
    category: TaskCategory;

    @Column({length: 128})
    title: string;

    @Column({length: 1024, nullable: true})
    description: string | null;

    @Column()
    content: string;

    @OneToMany('Task', 'template')
    tasks: Task[];
}

import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import type {User} from './user.entity';
import type {Lesson} from './lesson.entity';
import type {Submission} from './submission.entity';
import {BaseModel} from '../core/base-model';

@Entity('files')
export class FileEntity extends BaseModel {
    @Column()
    studentId: number;

    @ManyToOne('User', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'studentId'})
    student: User;

    @Column()
    lessonId: number;

    @ManyToOne('Lesson', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'lessonId'})
    lesson: Lesson;

    @Column()
    submissionId: number;

    @ManyToOne('Submission', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'submissionId'})
    submission: Submission;

    @Column({length: 128})
    path: string;

    @Column()
    size: number;
}

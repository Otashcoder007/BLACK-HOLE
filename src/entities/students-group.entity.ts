import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import type {User} from './user.entity';
import type {Group} from './group.entity';
import {BaseModel} from '../core/base-model';

@Entity('students_groups')
@Index(['studentId', 'groupId'], {unique: true})
export class StudentsGroups extends BaseModel {
    @PrimaryColumn()
    studentId: number;

    @PrimaryColumn()
    groupId: number;

    @ManyToOne('User', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'studentId'})
    student: User;

    @ManyToOne('Group', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'groupId'})
    group: Group;

    @Column("timestamp")
    joinedDate: Date;

    @Column({default: true})
    isActive: boolean;
}

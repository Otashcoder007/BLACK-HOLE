import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Group} from './group.entity';
import {Submission} from './submission.entity';
import {Roles} from '../core/enums/roles.enum';
import {Gender} from '../core/enums/gender.enum';
import {StudentsGroups} from './students-group.entity';
import {BaseModel} from '../core/base-model';

@Entity('users')
export class User extends BaseModel {
    @Column({type: 'enum', enum: Roles, enumName: 'roles_enum'})
    role: Roles;

    @Index({unique: true})
    @Column({length: 32, unique: true})
    login: string;

    @Column({length: 255})
    password: string;

    @Column({length: 32})
    firstName: string;

    @Column({length: 32})
    lastName: string;

    @Column({length: 32, nullable: true})
    middleName: string | null;

    @Column({length: 128, nullable: true})
    profileImage: string | null;

    @Column({type: 'date'})
    birthDate: string;

    @Column({type: 'enum', enum: Gender, enumName: 'gender_enum'})
    gender: Gender;

    @OneToMany(() => Group, g => g.teacher)
    teachingGroups: Group[];

    @OneToMany(() => StudentsGroups, sg => sg.student)
    studentGroups: StudentsGroups[];

    @OneToMany(() => Submission, s => s.student)
    submissions: Submission[];
}

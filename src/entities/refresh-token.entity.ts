import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './user.entity';
import {BaseModel} from 'src/core/base-model';

@Entity('refresh_tokens')
@Index(['userId'], {unique: true})
export class RefreshToken extends BaseModel {
    @Column()
    userId: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User;

    @Column({length: 256})
    tokenHash: string;

    @Column('timestamp')
    expiresAt: Date;
}
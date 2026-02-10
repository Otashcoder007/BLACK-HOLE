import {BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export class BaseModel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @DeleteDateColumn({type: "timestamp", nullable: true})
    deletedAt: Date | null;
}

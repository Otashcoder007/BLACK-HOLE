import {ApiProperty} from '@nestjs/swagger';
import {IsDateString, IsEnum, IsInt, IsString, MaxLength} from 'class-validator';
import {GroupStatus} from "../../../core/enums/group-status.enum";

export class CreateGroupDto {
    @ApiProperty({example: 2})
    @IsInt()
    teacherId: number;

    @ApiProperty({example: 'Group A'})
    @IsString()
    @MaxLength(128)
    title: string;

    @ApiProperty({example: '2026-02-10'})
    @IsDateString()
    startDate: string;

    @ApiProperty({enum: GroupStatus})
    @IsEnum(GroupStatus)
    status: GroupStatus;
}
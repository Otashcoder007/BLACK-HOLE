import {ApiProperty} from '@nestjs/swagger';
import {IsDateString, IsInt, IsString, MaxLength} from 'class-validator';

export class CreateLessonDto {
    @ApiProperty({example: 1})
    @IsInt()
    groupId: number;

    @ApiProperty({example: 'Lesson 1'})
    @IsString()
    @MaxLength(128)
    title: string;

    @ApiProperty({example: '2026-02-10T10:00:00.000Z'})
    @IsDateString()
    startDate: string;
}
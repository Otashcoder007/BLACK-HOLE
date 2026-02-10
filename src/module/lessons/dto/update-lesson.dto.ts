import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsDateString, IsOptional, IsString, MaxLength} from 'class-validator';

export class UpdateLessonDto {
    @ApiPropertyOptional({example: 'Lesson 1 updated'})
    @IsOptional()
    @IsString()
    @MaxLength(128)
    title?: string;

    @ApiPropertyOptional({example: '2026-02-10T11:00:00.000Z'})
    @IsOptional()
    @IsDateString()
    startDate?: string;
}
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsInt, IsOptional, IsString} from 'class-validator';

export class CreateSubmissionDto {
    @ApiProperty({example: 55})
    @IsInt()
    studentId: number;

    @ApiProperty({example: 10})
    @IsInt()
    taskId: number;

    @ApiPropertyOptional({example: 'Answer text', nullable: true})
    @IsOptional()
    @IsString()
    content?: string | null;
}
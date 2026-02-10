import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsBoolean, IsDateString, IsInt, IsOptional} from 'class-validator';

export class AddStudentToGroupDto {
    @ApiProperty({example: 10})
    @IsInt()
    studentId: number;

    @ApiProperty({example: '2026-02-10'})
    @IsDateString()
    joinedDate: string;

    @ApiPropertyOptional({default: true})
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
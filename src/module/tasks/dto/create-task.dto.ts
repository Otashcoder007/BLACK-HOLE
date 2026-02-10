import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsInt, IsOptional} from 'class-validator';

export class CreateTaskDto {
    @ApiProperty({example: 1})
    @IsInt()
    lessonId: number;

    @ApiProperty({example: 2})
    @IsInt()
    templateId: number;

    @ApiPropertyOptional({example: 1, nullable: true})
    @IsOptional()
    @IsInt()
    order?: number | null;
}
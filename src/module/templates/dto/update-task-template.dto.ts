import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsInt, IsOptional, IsString, MaxLength} from 'class-validator';

export class UpdateTaskTemplateDto {
    @ApiPropertyOptional({example: 2})
    @IsOptional()
    @IsInt()
    categoryId?: number;

    @ApiPropertyOptional({example: 'Updated title'})
    @IsOptional()
    @IsString()
    @MaxLength(128)
    title?: string;

    @ApiPropertyOptional({example: 'Updated desc', nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(1024)
    description?: string | null;

    @ApiPropertyOptional({example: 'Updated content'})
    @IsOptional()
    @IsString()
    content?: string;
}
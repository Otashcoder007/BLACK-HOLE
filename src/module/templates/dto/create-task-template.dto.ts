import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsInt, IsOptional, IsString, MaxLength} from 'class-validator';

export class CreateTaskTemplateDto {
    @ApiProperty({example: 1})
    @IsInt()
    categoryId: number;

    @ApiProperty({example: 'Solve equations'})
    @IsString()
    @MaxLength(128)
    title: string;

    @ApiPropertyOptional({example: 'Linear equations', nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(1024)
    description?: string | null;

    @ApiProperty({example: 'Template content text/json/markdown...'})
    @IsString()
    content: string;
}
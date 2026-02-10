import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsInt, IsOptional} from 'class-validator';

export class UpdateTaskDto {
    @ApiPropertyOptional({example: 3})
    @IsOptional()
    @IsInt()
    templateId?: number;

    @ApiPropertyOptional({example: 2, nullable: true})
    @IsOptional()
    @IsInt()
    order?: number | null;
}
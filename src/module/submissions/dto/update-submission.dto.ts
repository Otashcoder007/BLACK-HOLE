import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsOptional, IsString} from 'class-validator';

export class UpdateSubmissionDto {
    @ApiPropertyOptional({example: 'Updated answer', nullable: true})
    @IsOptional()
    @IsString()
    content?: string | null;
}
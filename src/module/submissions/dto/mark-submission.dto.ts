import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsEnum, IsInt, IsOptional, IsString, Max, Min} from 'class-validator';
import {SubmissionStatus} from "../../../core/enums/submission-status.enum";

export class MarkSubmissionDto {
    @ApiPropertyOptional({example: 85, nullable: true})
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    mark?: number | null;

    @ApiPropertyOptional({example: 'Good job', nullable: true})
    @IsOptional()
    @IsString()
    feedback?: string | null;

    @ApiProperty({enum: SubmissionStatus, example: SubmissionStatus.marking})
    @IsEnum(SubmissionStatus)
    status: SubmissionStatus;
}
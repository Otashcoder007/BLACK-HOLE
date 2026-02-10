import {ApiProperty} from '@nestjs/swagger';
import {IsInt} from 'class-validator';

export class UploadFileDto {
    @ApiProperty({example: 1})
    @IsInt()
    lessonId: number;

    @ApiProperty({example: 10})
    @IsInt()
    submissionId: number;
}
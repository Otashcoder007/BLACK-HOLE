import {ApiProperty} from '@nestjs/swagger';
import {IsString, MaxLength} from 'class-validator';

export class CreateTaskCategoryDto {
    @ApiProperty({example: 'Homework'})
    @IsString()
    @MaxLength(128)
    title: string;
}
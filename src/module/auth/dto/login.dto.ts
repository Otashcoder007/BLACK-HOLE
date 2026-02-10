import {ApiProperty} from '@nestjs/swagger';
import {IsString, MaxLength, MinLength} from 'class-validator';

export class LoginDto {
    @ApiProperty({example: 'otash007'})
    @IsString()
    @MaxLength(32)
    login: string;

    @ApiProperty({example: 'StrongPass123!'})
    @IsString()
    @MinLength(6)
    @MaxLength(128)
    password: string;
}
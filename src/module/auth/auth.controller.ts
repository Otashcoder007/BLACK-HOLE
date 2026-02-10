import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

import {AuthService} from './auth.service';
import {LoginDto} from './dto/login.dto';
import {RefreshDto} from './dto/refresh.dto';
import {AuthResponseDto} from './dto/auth-response.dto';
import {JwtAuthGuard} from "../../core/jwt.guard";
import {CurrentUser} from "../../core/current-user.decorator";


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {
    }

    @ApiOperation({summary: 'Login (access + refresh)'})
    @Post('login')
    login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        return this.auth.login(dto);
    }

    @ApiOperation({summary: 'Refresh (rotates refresh token)'})
    @Post('refresh')
    refresh(@Body() dto: RefreshDto): Promise<AuthResponseDto> {
        return this.auth.refresh(dto.refreshToken);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({summary: 'Logout (revoke refresh token)'})
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@CurrentUser() user: any) {
        return this.auth.logout(user.sub);
    }
}
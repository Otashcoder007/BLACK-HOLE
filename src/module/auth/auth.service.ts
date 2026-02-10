import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as argon2 from 'argon2';

import {User} from '../../entities/user.entity';
import {RefreshToken} from '../../entities/refresh-token.entity';
import {LoginDto} from './dto/login.dto';
import {signAccess, signRefresh, verifyRefresh} from "../../core/jwt.util";
import {jwtConstants} from "../../core/jwt.constants";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly usersRepo: Repository<User>,
        @InjectRepository(RefreshToken) private readonly rtRepo: Repository<RefreshToken>,
    ) {
    }

    async login(dto: LoginDto) {
        const user = await this.usersRepo.findOne({where: {login: dto.login}});
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const ok = await argon2.verify(user.password, dto.password);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        const accessToken = signAccess({sub: user.id, login: user.login, role: user.role});
        const refreshToken = signRefresh({sub: user.id});

        const tokenHash = await argon2.hash(refreshToken);
        const expiresAt = new Date(Date.now() + jwtConstants.refreshTtlSec * 1000);

        const existing = await this.rtRepo.findOne({where: {userId: user.id}});
        if (existing) {
            existing.tokenHash = tokenHash;
            existing.expiresAt = expiresAt;
            await this.rtRepo.save(existing);
        } else {
            await this.rtRepo.save(this.rtRepo.create({userId: user.id, tokenHash, expiresAt}));
        }

        return {accessToken, refreshToken};
    }

    async refresh(refreshToken: string) {
        let payload: { sub: number };
        try {
            payload = verifyRefresh(refreshToken);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const record = await this.rtRepo.findOne({where: {userId: payload.sub}});
        if (!record) throw new UnauthorizedException('Refresh denied');
        if (record.expiresAt.getTime() < Date.now()) throw new UnauthorizedException('Refresh expired');

        const ok = await argon2.verify(record.tokenHash, refreshToken);
        if (!ok) throw new UnauthorizedException('Refresh denied');

        const user = await this.usersRepo.findOne({where: {id: payload.sub}});
        if (!user) throw new UnauthorizedException('User not found');

        const newAccess = signAccess({sub: user.id, login: user.login, role: user.role});
        const newRefresh = signRefresh({sub: user.id});

        record.tokenHash = await argon2.hash(newRefresh);
        record.expiresAt = new Date(Date.now() + jwtConstants.refreshTtlSec * 1000);
        await this.rtRepo.save(record);

        return {accessToken: newAccess, refreshToken: newRefresh};
    }

    async logout(userId: number) {
        await this.rtRepo.delete({userId});
        return {ok: true};
    }
}
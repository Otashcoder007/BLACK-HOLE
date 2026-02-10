import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {verifyAccess} from "./jwt.util";


@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const header = req.headers.authorization as string | undefined;

        if (!header) throw new UnauthorizedException('Missing Authorization header');

        const [type, token] = header.split(' ');
        if (type !== 'Bearer' || !token) throw new UnauthorizedException('Invalid Authorization format');

        try {
            req.user = verifyAccess(token);
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
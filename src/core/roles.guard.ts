import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {Roles} from "./enums/roles.enum";
import {ROLES_KEY} from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(ctx: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);

        if (!required || required.length === 0) return true;

        const req = ctx.switchToHttp().getRequest();
        const role = req.user?.role as Roles | undefined;

        if (!role || !required.includes(role)) {
            throw new ForbiddenException('Forbidden: insufficient role');
        }
        return true;
    }
}
import * as jwt from 'jsonwebtoken';
import {jwtConstants} from './jwt.constants';

export type AccessPayload = {sub: number; login: string; role: string};
export type RefreshPayload = {sub: number};

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null;
}

function toNumber(v: unknown): number | null {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
    return null;
}

function assertAccessPayload(decoded: unknown): asserts decoded is AccessPayload {
    if (!isObject(decoded)) throw new Error('Invalid token payload');

    const subNum = toNumber(decoded.sub);
    if (subNum === null) throw new Error('Invalid token payload: sub');

    if (typeof decoded.login !== 'string' || decoded.login.length === 0) {
        throw new Error('Invalid token payload: login');
    }

    if (typeof decoded.role !== 'string' || decoded.role.length === 0) {
        throw new Error('Invalid token payload: role');
    }

    (decoded as any).sub = subNum;
}

function assertRefreshPayload(decoded: unknown): asserts decoded is RefreshPayload {
    if (!isObject(decoded)) throw new Error('Invalid token payload');

    const subNum = toNumber(decoded.sub);
    if (subNum === null) throw new Error('Invalid token payload: sub');

    (decoded as any).sub = subNum;
}

export function signAccess(payload: AccessPayload) {
    return jwt.sign(payload, jwtConstants.accessSecret, {expiresIn: jwtConstants.accessTtlSec});
}

export function signRefresh(payload: RefreshPayload) {
    return jwt.sign(payload, jwtConstants.refreshSecret, {expiresIn: jwtConstants.refreshTtlSec});
}

export function verifyAccess(token: string): AccessPayload {
    const decoded = jwt.verify(token, jwtConstants.accessSecret);
    assertAccessPayload(decoded);
    return decoded;
}

export function verifyRefresh(token: string): RefreshPayload {
    const decoded = jwt.verify(token, jwtConstants.refreshSecret);
    assertRefreshPayload(decoded);
    return decoded;
}

export const jwtConstants = {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh_secret',
    accessTtlSec: Number(process.env.JWT_ACCESS_TTL ?? 900),        // 15m
    refreshTtlSec: Number(process.env.JWT_REFRESH_TTL ?? 1209600),  // 14d
};
export type PageMeta = {
    page: number;
    limit: number;
    total: number;
    pages: number;
};

export function normalizePageLimit(page?: any, limit?: any) {
    const p = Math.max(1, Number(page ?? 1));
    const l = Math.min(100, Math.max(1, Number(limit ?? 20)));
    return {page: p, limit: l, skip: (p - 1) * l, take: l};
}

export function makeMeta(page: number, limit: number, total: number): PageMeta {
    return {page, limit, total, pages: Math.ceil(total / limit)};
}
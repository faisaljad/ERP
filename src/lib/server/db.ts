import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function initPrisma() {
    return new PrismaClient({
        log: ['error']
    });
}

// Use a Proxy to defer instantiation until the very first database query.
// This prevents build-time crashes where DATABASE_URL may not be available.
export const prisma = globalForPrisma.prisma ?? new Proxy({} as PrismaClient, {
    get(target, prop: string | symbol) {
        if (prop === '__esModule' || prop === 'default' || prop === 'then' || typeof prop === 'symbol') {
            return Reflect.get(target, prop);
        }

        if (!globalForPrisma.prisma) {
            globalForPrisma.prisma = initPrisma();
        }

        return (globalForPrisma.prisma as any)[prop];
    }
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
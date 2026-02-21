import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function initPrisma() {
    // Read from standard Node environment, or bypass if evaluating under SvelteKit Vite build
    const connectionString = process.env.DATABASE_URL || process.env.STORAGE_ERP_URL || "postgresql://dummy:dummy@localhost/dummy";

    // Only construct the Postgres Edge Adapter if we are running in an active environment
    let adapter;
    if (connectionString !== "postgresql://dummy:dummy@localhost/dummy") {
        const pool = new Pool({ connectionString });
        adapter = new PrismaPg(pool);
    }

    return new PrismaClient({
        adapter,
        log: ['error']
    });
}

// Use a Proxy to defer instantiation until the very first database query
// This prevents Vercel buildup crashes where DATABASE_URL is strictly undefined
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
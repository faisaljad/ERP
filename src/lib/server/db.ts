import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

// Prevent multiple instances of Prisma Client in development
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const connectionString =
    process.env.DATABASE_URL ||
    process.env.STORAGE_ERP_PRISMA_URL ||
    process.env.STORAGE_ERP_POSTGRES_PRISMA_URL ||
    process.env.STORAGE_ERP_URL ||
    process.env.STORAGE_ERP_POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    env.DATABASE_URL ||
    env.STORAGE_ERP_PRISMA_URL ||
    env.STORAGE_ERP_POSTGRES_PRISMA_URL ||
    env.STORAGE_ERP_URL ||
    env.STORAGE_ERP_POSTGRES_URL ||
    env.POSTGRES_PRISMA_URL ||
    env.POSTGRES_URL;

const finalConnectionString = connectionString || "postgresql://dummy:dummy@localhost:5432/dummy";

process.env.DATABASE_URL = finalConnectionString;

let clientInstance: PrismaClient | undefined;

function getClient() {
    if (!clientInstance) {
        if (finalConnectionString === "postgresql://dummy:dummy@localhost:5432/dummy") {
            console.warn("WARNING: No Database URL Environment Variables found on Vercel. Database operations will fail until added.");
        }
        clientInstance = global.prisma || new PrismaClient();
        if (process.env.NODE_ENV === 'development') global.prisma = clientInstance;
    }
    return clientInstance;
}

const client = new Proxy({} as PrismaClient, {
    get(target, prop: string | symbol) {
        // Prevent Vite/SvelteKit from triggering Prisma evaluation during static module analysis
        if (prop === '__esModule' || prop === 'default' || prop === 'then' || typeof prop === 'symbol') {
            return Reflect.get(target, prop);
        }
        return getClient()[prop as keyof PrismaClient];
    }
});

export { client as prisma };

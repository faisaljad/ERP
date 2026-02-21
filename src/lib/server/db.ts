import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

// Prevent multiple instances of Prisma Client in development
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || env.DATABASE_URL || env.POSTGRES_PRISMA_URL || env.POSTGRES_URL;

let client: PrismaClient;

if (!building) {
    if (!connectionString) {
        console.warn("WARNING: No Database URL Environment Variables found. Vercel deployment may fail at runtime if not set.");
    }

    // Ensure Prisma explicitly uses the valid connection string
    if (connectionString) process.env.DATABASE_URL = connectionString;

    client = global.prisma || new PrismaClient();

    if (process.env.NODE_ENV === 'development') global.prisma = client;
}

export { client as prisma };

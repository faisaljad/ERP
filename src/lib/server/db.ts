import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

// Prevent multiple instances of Prisma Client in development
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Fallback natively to process.env if SvelteKit dynamic injection misses Vercel's prefixed names
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || env.DATABASE_URL || env.POSTGRES_PRISMA_URL || env.POSTGRES_URL;

if (!connectionString) {
    console.error("CRITICAL ERROR: No Database URL Environment Variables found. Please add DATABASE_URL manually in Vercel Settings.");
    throw new Error("Missing DATABASE_URL. Vercel deployment has an empty environment.");
}

// Ensure Prisma explicitly uses the valid connection string
process.env.DATABASE_URL = connectionString;

const client = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = client;

export { client as prisma };

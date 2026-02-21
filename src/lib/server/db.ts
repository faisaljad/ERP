import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { env } from '$env/dynamic/private';

// Setup WebSocket for Neon in Node environment
neonConfig.webSocketConstructor = ws;

// Prevent multiple instances of Prisma Client in development
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Fallback natively to process.env if SvelteKit dynamic injection misses Vercel's prefixed names
const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || env.POSTGRES_PRISMA_URL || env.POSTGRES_URL || env.DATABASE_URL || '';

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool as any);

const client = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = client;

export { client as prisma };

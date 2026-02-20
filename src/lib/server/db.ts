import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '$env/dynamic/private';

// Prevent multiple instances of Prisma Client in development
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const connectionString = `${env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const client = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = client;

export { client as prisma };

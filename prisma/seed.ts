import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'admin@erp.com';
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if company exists
    let company = await prisma.company.findFirst();

    if (!company) {
        company = await prisma.company.create({
            data: {
                name: 'Default Company',
                currency: 'JOD'
            }
        });
        console.log('Created default company');
    }

    // Check if admin user exists
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Admin User',
                role: Role.ADMIN,
                companyId: company.id
            }
        });
        console.log(`Created admin user: ${email} / ${password}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

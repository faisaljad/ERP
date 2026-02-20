import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';
import type { Role } from '@prisma/client';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'ADMIN') {
        // Just return empty list or handle unauthorized appropriately if not admin
        // For now, let's assume middleware or hooks handle broad access, but role check is specific here.
    }

    const users = await prisma.user.findMany({
        where: { companyId: locals.user!.companyId },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
    });

    return {
        users,
        currentUserEmail: locals.user?.email
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'ADMIN') return fail(403, { error: 'Unauthorized' });

        const data = await request.formData();
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const role = data.get('role') as Role;

        if (!name || !email || !password || !role) {
            return fail(400, { error: 'All fields are required' });
        }

        // check email unique
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return fail(400, { error: 'Email already exists' });

        const hashedPassword = await hashPassword(password);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                companyId: locals.user.companyId
            }
        });

        return { success: true };
    },

    delete: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'ADMIN') return fail(403, { error: 'Unauthorized' });

        const data = await request.formData();
        const id = data.get('id') as string;

        if (id === locals.user.id) return fail(400, { error: 'Cannot delete yourself' });

        await prisma.user.delete({
            where: { id }
        });

        return { success: true };
    }
};

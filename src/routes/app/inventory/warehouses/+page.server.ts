import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
    const warehouses = await prisma.warehouse.findMany({
        orderBy: { name: 'asc' },
        include: { branch: true }
    });

    const branches = await prisma.branch.findMany({
        orderBy: { name: 'asc' }
    });

    return {
        warehouses,
        branches
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const location = data.get('location') as string;
        const branchId = data.get('branchId') as string;

        if (!name || !branchId) {
            return fail(400, { error: 'Name and Branch are required' });
        }

        await prisma.warehouse.create({
            data: {
                name,
                location,
                branchId
            }
        });

        return { success: true };
    },

    update: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const name = data.get('name') as string;
        const location = data.get('location') as string;
        const branchId = data.get('branchId') as string;

        if (!id || !name || !branchId) {
            return fail(400, { error: 'Invalid data' });
        }

        await prisma.warehouse.update({
            where: { id },
            data: {
                name,
                location,
                branchId
            }
        });

        return { success: true };
    }
};

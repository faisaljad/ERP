import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return {
        categories
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name') as string;

        if (!name) {
            return fail(400, { error: 'Name is required' });
        }

        await prisma.category.create({
            data: { name }
        });

        return { success: true };
    },

    update: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const name = data.get('name') as string;

        if (!id || !name) {
            return fail(400, { error: 'Name is required' });
        }

        await prisma.category.update({
            where: { id },
            data: { name }
        });

        return { success: true };
    }
};

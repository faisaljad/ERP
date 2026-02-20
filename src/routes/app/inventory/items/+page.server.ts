import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
    const items = await prisma.item.findMany({
        orderBy: { name: 'asc' },
        include: { category: true }
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return {
        items,
        categories
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const sku = data.get('sku') as string;
        const name = data.get('name') as string;
        const unit = data.get('unit') as string;
        const reorderLevel = Number(data.get('reorderLevel'));
        const categoryId = data.get('categoryId') as string || null;
        const description = data.get('description') as string;

        if (!sku || !name) {
            return fail(400, { error: 'SKU and Name are required' });
        }

        try {
            await prisma.item.create({
                data: {
                    sku,
                    name,
                    unit,
                    reorderLevel,
                    categoryId,
                    description
                }
            });
        } catch (e) {
            return fail(400, { error: 'SKU must be unique' });
        }

        return { success: true };
    },

    update: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const sku = data.get('sku') as string;
        const name = data.get('name') as string;
        const unit = data.get('unit') as string;
        const reorderLevel = Number(data.get('reorderLevel'));
        const categoryId = data.get('categoryId') as string || null;
        const description = data.get('description') as string;

        if (!id || !sku || !name) return fail(400, { error: 'Invalid data' });

        try {
            await prisma.item.update({
                where: { id },
                data: {
                    sku,
                    name,
                    unit,
                    reorderLevel,
                    categoryId,
                    description
                }
            });
        } catch (e) {
            return fail(400, { error: 'Update failed' });
        }

        return { success: true };
    }
};

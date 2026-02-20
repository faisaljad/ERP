import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { Prisma } from '@prisma/client';

export const load: PageServerLoad = async () => {
    const rules = await prisma.deductionRule.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return {
        rules: rules.map(r => ({
            ...r,
            value: r.value.toNumber()
        }))
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const type = data.get('type') as 'PERCENTAGE' | 'FIXED';
        const valueStr = data.get('value') as string;

        if (!name || !type || !valueStr) {
            return fail(400, { error: 'Missing required fields' });
        }

        await prisma.deductionRule.create({
            data: {
                name,
                type,
                value: new Prisma.Decimal(valueStr),
                isActive: true
            }
        });

        return { success: true };
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        if (!id) return fail(400, { error: 'ID is required' });

        await prisma.deductionRule.delete({
            where: { id }
        });

        return { success: true };
    }
};

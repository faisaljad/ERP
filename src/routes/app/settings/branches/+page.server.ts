import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
    // Assuming locals.user is populated via hooks
    const companyId = locals.user?.companyId;

    const branches = await prisma.branch.findMany({
        where: companyId ? { companyId } : {}, // Filter by company if known
        orderBy: { name: 'asc' },
        include: { company: true }
    });

    return {
        branches
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const companyId = locals.user?.companyId;

        if (!name) {
            return fail(400, { error: 'Name is required' });
        }

        if (!companyId) {
            // Fallback: Find the first company if no user session (dev mode safety)
            // In production this should be strict.
            const firstCompany = await prisma.company.findFirst();
            if (!firstCompany) return fail(500, { error: 'No company found' });

            await prisma.branch.create({
                data: { name, companyId: firstCompany.id }
            });
        } else {
            await prisma.branch.create({
                data: { name, companyId }
            });
        }

        return { success: true };
    },

    update: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const name = data.get('name') as string;

        if (!id || !name) {
            return fail(400, { error: 'Name is required' });
        }

        await prisma.branch.update({
            where: { id },
            data: { name }
        });

        return { success: true };
    }
};

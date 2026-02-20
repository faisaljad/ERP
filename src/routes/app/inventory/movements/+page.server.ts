import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
    const movements = await prisma.stockMovement.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
            item: true,
            warehouse: true
        }
    });

    return {
        movements
    };
};

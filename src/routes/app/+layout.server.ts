import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    // Check if company is fully setup
    // We check if name is still default or address is missing
    const company = await prisma.company.findUnique({
        where: { id: locals.user.companyId }
    });

    if (company && (company.name === 'Default Company' || !company.address) && url.pathname !== '/app/setup') {
        console.log('Redirecting to setup due to incomplete company profile');
        throw redirect(302, '/app/setup');
    }

    return {
        company
    };
};

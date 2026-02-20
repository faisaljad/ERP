import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
    const employees = await prisma.employee.findMany({
        orderBy: { firstName: 'asc' },
        include: { branch: true, department: true }
    });

    const branches = await prisma.branch.findMany({
        orderBy: { name: 'asc' }
    });

    return {
        employees: employees.map(e => ({
            ...e,
            baseSalary: e.baseSalary.toNumber()
        })),
        branches
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const firstName = data.get('firstName') as string;
        const lastName = data.get('lastName') as string;
        const email = data.get('email') as string || null;
        const position = data.get('position') as string;
        const hireDate = data.get('hireDate') as string;
        const baseSalary = Number(data.get('baseSalary'));
        const branchId = data.get('branchId') as string || null;

        if (!firstName || !lastName || !position || !hireDate || !baseSalary) {
            return fail(400, { error: 'Required fields missing' });
        }

        try {
            await prisma.employee.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    position,
                    hireDate: new Date(hireDate),
                    baseSalary,
                    branchId
                }
            });
        } catch (e) {
            return fail(400, { error: 'Creation failed, email might be duplicate' });
        }

        return { success: true };
    }
};

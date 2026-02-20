import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import type { LeaveType } from '@prisma/client'; // Import enum type

export const load: PageServerLoad = async () => {
    const leaveRequests = await prisma.leaveRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { employee: true }
    });

    const employees = await prisma.employee.findMany({
        orderBy: { firstName: 'asc' },
        select: { id: true, firstName: true, lastName: true }
    });

    return {
        leaveRequests,
        employees
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const employeeId = data.get('employeeId') as string;
        const type = data.get('type') as LeaveType; // Cast to enum
        const startDateStr = data.get('startDate') as string;
        const endDateStr = data.get('endDate') as string;
        const reason = data.get('reason') as string;

        if (!employeeId || !type || !startDateStr || !endDateStr) {
            return fail(400, { error: 'Required fields missing' });
        }

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        if (endDate < startDate) {
            return fail(400, { error: 'End date cannot be before start date' });
        }

        await prisma.leaveRequest.create({
            data: {
                employeeId,
                type,
                startDate,
                endDate,
                reason,
                status: 'PENDING'
            }
        });

        return { success: true };
    },

    approve: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        if (!id) return fail(400, { error: 'ID is required' });

        await prisma.leaveRequest.update({
            where: { id },
            data: { status: 'APPROVED' }
        });

        return { success: true };
    },

    reject: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        if (!id) return fail(400, { error: 'ID is required' });

        await prisma.leaveRequest.update({
            where: { id },
            data: { status: 'REJECTED' }
        });

        return { success: true };
    }
};

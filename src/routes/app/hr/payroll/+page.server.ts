import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { Prisma } from '@prisma/client';
import { calculatePayroll } from '$lib/server/payroll';

export const load: PageServerLoad = async () => {
    const payrolls = await prisma.payroll.findMany({
        orderBy: { periodStart: 'desc' },
        include: { employee: true },
        take: 50 // Last 50 runs
    });

    return {
        payrolls: payrolls.map(p => ({
            ...p,
            baseSalary: p.baseSalary.toNumber(),
            originalSalary: p.originalSalary.toNumber(),
            payableDays: p.payableDays,
            allowances: p.allowances.toNumber(),
            deductions: p.deductions.toNumber(),
            netSalary: p.netSalary.toNumber(),
            employee: {
                ...p.employee,
                baseSalary: p.employee.baseSalary.toNumber()
            }
        }))
    };
};

export const actions: Actions = {
    run: async ({ request }) => {
        const data = await request.formData();
        const monthStr = data.get('month') as string;

        if (!monthStr) {
            return fail(400, { error: 'Month is selected' });
        }

        const [year, month] = monthStr.split('-').map(Number);
        const periodStart = new Date(year, month - 1, 1);
        const periodEnd = new Date(year, month, 0); // Last day of month

        const now = new Date();
        if (periodStart > now) {
            return fail(400, { error: 'Cannot generate payroll for future months' });
        }

        // Fetch active employees hired on or before the end of the period
        const employees = await prisma.employee.findMany({
            where: {
                hireDate: {
                    lte: periodEnd
                }
            }
        });

        if (employees.length === 0) {
            return fail(400, { error: 'No eligible employees found for this period' });
        }

        // Generate payroll record for each employee
        // In a real app, check if payroll already exists for this period

        for (const employee of employees) {
            const orgSal = employee.baseSalary.toNumber();
            const calc = calculatePayroll({
                hireDate: employee.hireDate,
                baseSalary: orgSal,
                periodStart,
                periodEnd
            });

            await prisma.payroll.create({
                data: {
                    employeeId: employee.id,
                    periodStart,
                    periodEnd,
                    baseSalary: calc.baseSalary,
                    originalSalary: calc.originalSalary,
                    payableDays: calc.payableDays,
                    allowances: calc.allowances,
                    deductions: calc.deductions,
                    netSalary: calc.netSalary,
                    isPaid: false
                }
            });
        }

        return { success: true };
    }
};

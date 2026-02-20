import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { AccountType } from '@prisma/client';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    // Check if company is already setup (this logic should ideally check for completion)
    // For now, allow re-visiting or just load current data
    const company = await prisma.company.findUnique({
        where: { id: locals.user.companyId }
    });

    return { company };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) throw fail(401);

        const data = await request.formData();
        const name = data.get('name') as string;
        const address = data.get('address') as string;
        const taxId = data.get('taxId') as string;
        const currency = data.get('currency') as string;
        const useTemplate = data.get('template') === 'standard';

        if (!name) return fail(400, { error: 'Company Name is required' });

        await prisma.company.update({
            where: { id: locals.user.companyId },
            data: {
                name,
                address,
                taxId,
                currency
            }
        });

        if (useTemplate) {
            // Create standard Chart of Accounts
            // This is a simplified version. A real one would be recursive/nested.

            // 1. Assets
            await createAccount('1000', 'Assets', AccountType.ASSET);
            await createAccount('1100', 'Current Assets', AccountType.ASSET, '1000');
            await createAccount('1110', 'Cash', AccountType.ASSET, '1100');
            await createAccount('1120', 'Bank', AccountType.ASSET, '1100');
            await createAccount('1130', 'Accounts Receivable', AccountType.ASSET, '1100');
            await createAccount('1140', 'Inventory', AccountType.ASSET, '1100');

            // 2. Liabilities
            await createAccount('2000', 'Liabilities', AccountType.LIABILITY);
            await createAccount('2100', 'Current Liabilities', AccountType.LIABILITY, '2000');
            await createAccount('2110', 'Accounts Payable', AccountType.LIABILITY, '2100');
            await createAccount('2120', 'Sales Tax Payable', AccountType.LIABILITY, '2100');

            // 3. Equity
            await createAccount('3000', 'Equity', AccountType.EQUITY);
            await createAccount('3100', 'Capital', AccountType.EQUITY, '3000');
            await createAccount('3200', 'Retained Earnings', AccountType.EQUITY, '3000');

            // 4. Revenue
            await createAccount('4000', 'Revenue', AccountType.REVENUE);
            await createAccount('4100', 'Sales Revenue', AccountType.REVENUE, '4000');

            // 5. Expenses
            await createAccount('5000', 'Expenses', AccountType.EXPENSE);
            await createAccount('5100', 'Cost of Goods Sold', AccountType.EXPENSE, '5000');
            await createAccount('5200', 'Operating Expenses', AccountType.EXPENSE, '5000');
            await createAccount('5210', 'Salaries Expense', AccountType.EXPENSE, '5000');
            await createAccount('5220', 'Rent Expense', AccountType.EXPENSE, '5000');
        }

        throw redirect(302, '/app');
    }
};

async function createAccount(code: string, name: string, type: AccountType, parentCode?: string) {
    // Check if exists
    const exists = await prisma.account.findUnique({ where: { code } });
    if (exists) return;

    let parentId = null;
    if (parentCode) {
        const parent = await prisma.account.findUnique({ where: { code: parentCode } });
        if (parent) parentId = parent.id;
    }

    await prisma.account.create({
        data: {
            code,
            name,
            type,
            parentId
        }
    });
}

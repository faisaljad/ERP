import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { isJournalBalanced } from '$lib/server/accounting';

export const load: PageServerLoad = async () => {
    const accounts = await prisma.account.findMany({
        orderBy: { code: 'asc' },
        select: { id: true, code: true, name: true }
    });
    return { accounts };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const date = data.get('date') as string;
        const reference = data.get('reference') as string;
        const description = data.get('description') as string;

        const accountIds = data.getAll('accountId') as string[];
        const debits = data.getAll('debit') as string[];
        const credits = data.getAll('credit') as string[];
        const lineDescriptions = data.getAll('lineDescription') as string[];

        if (!date || accountIds.length < 2) {
            return fail(400, { error: 'Date and at least 2 lines are required' });
        }

        let totalDebit = 0;
        let totalCredit = 0;
        const lines = [];

        for (let i = 0; i < accountIds.length; i++) {
            const debit = Number(debits[i]) || 0;
            const credit = Number(credits[i]) || 0;

            if (debit < 0 || credit < 0) return fail(400, { error: 'Amounts cannot be negative' });
            if (debit > 0 && credit > 0) return fail(400, { error: 'Line cannot have both debit and credit' });
            if (debit === 0 && credit === 0) continue; // Skip empty lines

            totalDebit += debit;
            totalCredit += credit;

            lines.push({
                accountId: accountIds[i],
                debit,
                credit,
                description: lineDescriptions[i]
            });
        }

        if (lines.length === 0) return fail(400, { error: 'Entry must have at least one valid line' });

        if (!isJournalBalanced(lines)) {
            return fail(400, { error: `Unbalanced entry: Total debits must equal total credits.` });
        }

        await prisma.journalEntry.create({
            data: {
                date: new Date(date),
                reference,
                description,
                lines: {
                    create: lines
                }
            }
        });

        throw redirect(302, '/app/accounting/journals');
    }
};

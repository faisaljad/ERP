import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
    const journals = await prisma.journalEntry.findMany({
        orderBy: { date: 'desc' },
        include: {
            lines: {
                where: { debit: { gt: 0 } } // Only fetch debit lines to calculate total? Or just fetch everything.
            }
        }
    });

    // Calculate total amount for display (sum of debits)
    const processedJournals = journals.map(j => {
        const total = j.lines.reduce((sum, line) => sum + Number(line.debit), 0);
        return {
            ...j,
            lines: j.lines.map(l => ({
                ...l,
                debit: l.debit.toNumber(),
                credit: l.credit.toNumber()
            })),
            totalAmount: total
        };
    });

    return {
        journals: processedJournals
    };
};

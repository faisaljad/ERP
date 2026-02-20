// A utility to verify if an array of Journal Entry Lines is balanced (Debits = Credits)

export interface JournalLineInput {
    debit: number;
    credit: number;
}

export function isJournalBalanced(lines: JournalLineInput[]): boolean {
    if (!lines || lines.length === 0) return false;

    let totalDebit = 0;
    let totalCredit = 0;

    for (const line of lines) {
        // Ensure values are numbers, avoiding NaN issues
        const debit = Number(line.debit) || 0;
        const credit = Number(line.credit) || 0;

        // A single line shouldn't logically have both debit and credit greater than 0
        // but we'll sum them regardless for mathematical integrity
        totalDebit += debit;
        totalCredit += credit;
    }

    // A journal entry must have at least one debit and one credit, and their sums must be exactly equal
    // To handle floating point issues common in JS (e.g., 0.1 + 0.2), we round to 4 decimal places
    const factor = 10000;
    const roundedDebit = Math.round(totalDebit * factor) / factor;
    const roundedCredit = Math.round(totalCredit * factor) / factor;

    return roundedDebit > 0 && roundedDebit === roundedCredit;
}

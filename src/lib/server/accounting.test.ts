import { describe, it, expect } from 'vitest';
import { isJournalBalanced, type JournalLineInput } from './accounting';

describe('isJournalBalanced', () => {
    it('returns true for a perfectly balanced simple entry', () => {
        const lines: JournalLineInput[] = [
            { debit: 100, credit: 0 },
            { debit: 0, credit: 100 }
        ];
        expect(isJournalBalanced(lines)).toBe(true);
    });

    it('returns false for an imbalanced entry', () => {
        const lines: JournalLineInput[] = [
            { debit: 100, credit: 0 },
            { debit: 0, credit: 90 }
        ];
        expect(isJournalBalanced(lines)).toBe(false);
    });

    it('handles multi-line complex balancing', () => {
        const lines: JournalLineInput[] = [
            { debit: 100, credit: 0 },
            { debit: 50, credit: 0 },
            { debit: 0, credit: 75 },
            { debit: 0, credit: 75 }
        ];
        expect(isJournalBalanced(lines)).toBe(true);
    });

    it('returns false for empty arrays', () => {
        expect(isJournalBalanced([])).toBe(false);
    });

    it('gracefully handles standard floating point arithmetic issues', () => {
        const lines: JournalLineInput[] = [
            { debit: 0.1, credit: 0 },
            { debit: 0.2, credit: 0 },
            { debit: 0, credit: 0.3 }
        ];
        // 0.1 + 0.2 in JS is 0.30000000000000004
        // The accounting implementation should round this securely.
        expect(isJournalBalanced(lines)).toBe(true);
    });

    it('returns false when sums equals 0 (prevent empty transactions)', () => {
        const lines: JournalLineInput[] = [
            { debit: 0, credit: 0 },
            { debit: 0, credit: 0 }
        ];
        expect(isJournalBalanced(lines)).toBe(false);
    });
});

import { describe, it, expect } from 'vitest';
import { calculateCurrentStock, type Movement } from './inventory';

describe('calculateCurrentStock', () => {
    it('properly adds incoming stock', () => {
        const movements: Movement[] = [
            { type: 'IN', quantity: 50 },
            { type: 'IN', quantity: 20 }
        ];
        expect(calculateCurrentStock(10, movements)).toBe(80);
    });

    it('properly subtracts outgoing stock', () => {
        const movements: Movement[] = [
            { type: 'OUT', quantity: 15 }
        ];
        expect(calculateCurrentStock(100, movements)).toBe(85);
    });

    it('sets absolute value on adjustments', () => {
        const movements: Movement[] = [
            { type: 'IN', quantity: 50 },
            { type: 'ADJUSTMENT', quantity: 300 } // Overrides previous INs
        ];
        expect(calculateCurrentStock(10, movements)).toBe(300);
    });

    it('prevents stock from dropping below absolute zero', () => {
        const movements: Movement[] = [
            { type: 'OUT', quantity: 500 }
        ];
        expect(calculateCurrentStock(50, movements)).toBe(0);
    });
});

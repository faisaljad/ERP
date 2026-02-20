import { describe, it, expect } from 'vitest';
import { calculatePayroll } from './payroll';

describe('calculatePayroll', () => {
    it('calculates full salary for an employee present the whole month', () => {
        const result = calculatePayroll({
            hireDate: new Date('2023-01-01'),
            baseSalary: 3000,
            periodStart: new Date('2023-10-01'),
            periodEnd: new Date('2023-10-31')
        });

        expect(result.payableDays).toBe(31);
        expect(result.originalSalary).toBe(3000);
        expect(result.baseSalary).toBe(3000);
        expect(result.netSalary).toBe(3000);
    });

    it('prorates salary for an employee hired mid-month', () => {
        const result = calculatePayroll({
            hireDate: new Date('2023-10-16'),
            baseSalary: 3100, // Easily divisible by 31 days (100 per day)
            periodStart: new Date('2023-10-01'),
            periodEnd: new Date('2023-10-31')
        });

        // Hired on 16th, month has 31 days. Payable days = 16 to 31 inclusive = 16 days.
        expect(result.payableDays).toBe(16);
        expect(result.originalSalary).toBe(3100);
        expect(result.baseSalary).toBe(1600);
        expect(result.netSalary).toBe(1600);
    });

    it('handles February gracefully', () => {
        const result = calculatePayroll({
            hireDate: new Date('2023-01-01'),
            baseSalary: 2800,
            periodStart: new Date('2023-02-01'),
            periodEnd: new Date('2023-02-28')
        });

        expect(result.payableDays).toBe(28);
        expect(result.originalSalary).toBe(2800);
        expect(result.baseSalary).toBe(2800);
        expect(result.netSalary).toBe(2800);
    });

    it('handles leap years correctly', () => {
        const result = calculatePayroll({
            hireDate: new Date('2023-01-01'),
            baseSalary: 2900,
            periodStart: new Date('2024-02-01'),
            periodEnd: new Date('2024-02-29')
        });

        expect(result.payableDays).toBe(29);
        expect(result.baseSalary).toBe(2900);
    });
});

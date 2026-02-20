export interface PayrollCalculationInput {
    hireDate: Date;
    baseSalary: number;
    periodStart: Date;
    periodEnd: Date;
}

export interface PayrollCalculationResult {
    originalSalary: number;
    baseSalary: number;
    payableDays: number;
    allowances: number;
    deductions: number;
    netSalary: number;
}

export function calculatePayroll(input: PayrollCalculationInput): PayrollCalculationResult {
    const { hireDate, baseSalary, periodStart, periodEnd } = input;

    const daysInMonth = periodEnd.getDate();
    let effectiveStartDate = new Date(periodStart);

    if (hireDate > periodStart) {
        effectiveStartDate = new Date(hireDate);
    }

    // Calculate payable days (inclusive)
    const diffTime = Math.abs(periodEnd.getTime() - effectiveStartDate.getTime());
    const payableDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let proratedSalary = baseSalary;

    if (payableDays < daysInMonth) {
        // Prorate: (Base / DaysInMonth) * PayableDays
        const validPayableDays = Math.max(0, Math.min(payableDays, daysInMonth));
        proratedSalary = (baseSalary / daysInMonth) * validPayableDays;
    }

    const allowances = 0;
    const deductions = 0;
    const netSalary = proratedSalary + allowances - deductions;

    return {
        originalSalary: baseSalary,
        baseSalary: proratedSalary,
        payableDays,
        allowances,
        deductions,
        netSalary
    };
}

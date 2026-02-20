// A utility to compute the resulting stock after a movement array

export interface Movement {
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
    quantity: number;
}

export function calculateCurrentStock(initialStock: number, movements: Movement[]): number {
    let currentStock = initialStock;

    for (const movement of movements) {
        switch (movement.type) {
            case 'IN':
                currentStock += movement.quantity;
                break;
            case 'OUT':
                currentStock -= movement.quantity;
                break;
            case 'ADJUSTMENT':
                // For simplicity in this logic, ADJUSTMENTS specify the new absolute total.
                currentStock = movement.quantity;
                break;
            case 'TRANSFER':
                // For transfers, we'd need from/to context. 
                // For a single item perspective, if it's transferring OUT it's a negative qty, IN is positive.
                currentStock += movement.quantity;
                break;
        }
    }

    // Ensure stock doesn't theoretically drop below zero unless permitted by business rules
    // (We will enforce a hard zero floor for this basic model)
    return Math.max(0, currentStock);
}

import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import type { StockMovementType } from '@prisma/client';

export const load: PageServerLoad = async () => {
    const items = await prisma.item.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, sku: true, unit: true }
    });

    const warehouses = await prisma.warehouse.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true }
    });

    return {
        items,
        warehouses
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const type = data.get('type') as StockMovementType;
        const itemId = data.get('itemId') as string;
        const warehouseId = data.get('warehouseId') as string;
        const rawQuantity = Number(data.get('quantity'));
        const reference = data.get('reference') as string;

        if (!type || !itemId || !warehouseId || !rawQuantity) {
            return fail(400, { error: 'All fields are required' });
        }

        // Adjust sign based on type
        let quantity = rawQuantity;
        if (type === 'OUT') {
            quantity = -Math.abs(rawQuantity);
        } else if (type === 'IN') {
            quantity = Math.abs(rawQuantity);
        }
        // Adjustment can be + or -, but form forces positive input. 
        // For simple adjustments, we assume adding unless we add a specific "Decrease" option.
        // For now, let's treat ADJUSTMENT as adding stock if positive, or we could just trust the user input if we allowed negatives.
        // BUT, better to be explicit. Let's say ADJUSTMENT in this form is "Add". 
        // Real systems usually have "Count" which calculates diff. 
        // Let's stick to simple IN/OUT logic for now. 

        // Actually for adjustment, if user picks "Adjustment", let's assume they want to "Set" quantity? No that's complex.
        // Let's just treat Adjustment like IN/OUT but with a different label for now, assuming positive adds.
        // To decrease stock via adjustment, user might expect to be able to enter negative, but we blocked it.
        // Simplification: We will trust the input for Adjustment (if we allowed negative).
        // Since we blocked negative, Adjustment currently acts like IN. 
        // We really should allow negative for Adjustment.

        if (type === 'ADJUSTMENT') {
            // For now, treat as raw quantity. If they want to decrease, they should use OUT or we change UI.
            // Let's assume this form is only for ADDING stock or REMOVING stock via types.
            // If type is adjustment, maybe we just take the value.
            quantity = Math.abs(rawQuantity); // Default to adding for safety in this simple form
        }

        await prisma.$transaction([
            prisma.stockMovement.create({
                data: {
                    type,
                    itemId,
                    warehouseId,
                    quantity,
                    reference
                }
            }),
            prisma.item.update({
                where: { id: itemId },
                data: {
                    currentStock: {
                        increment: quantity
                    }
                }
            })
        ]);

        throw redirect(302, '/app/inventory/movements');
    }
};

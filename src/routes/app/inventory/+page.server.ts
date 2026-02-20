import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
    // 1. Total Items
    const totalItems = await prisma.item.count();

    // 2. Out of Stock Items (Stock <= 0)
    const outOfStockItems = await prisma.item.findMany({
        where: {
            currentStock: {
                lte: 0
            }
        },
        take: 10
    });

    // 3. Low Stock Items (Stock <= Reorder Level AND Stock > 0)
    // We filter out 0 stock because they are already in "Out of Stock"
    // Using simple raw query or JS filter might be easier for comparison between columns
    // Prisma doesn't easily support "where field1 <= field2" without raw query or extensions.
    // For now, let's fetch items where Stock is likely low (e.g. constant threshold) OR filtered in JS.

    // fetching all items is bad if many.
    // But since we can't do `where: { currentStock: { lte: prisma.item.fields.reorderLevel } }` directly in Prisma standard filtering...
    // We can use `findMany` and filter in memory if dataset is small, OR use `queryRaw`.
    // Let's use filter in memory for now as dataset is likely small for this MVP.
    // BETTER: Use a fixed threshold for finding *candidates* if we had one, but we don't.
    // Let's just fetch all items and filter? No, that's dangerous.
    // Let's try to trust that reorderLevel is usually > 0.

    // Workaround: We will fetch all items (limit 1000?) and filter.
    // optimization: filtering in DB is better.
    // Since we are using Postgres, we could use raw query.
    // But to keep it simple and safe, let's just fetch items with low stock based on a reasonable upper bound if possible? No.

    // Let's stick to in-memory filtering for now, assuming small catalog.
    const allItems = await prisma.item.findMany({
        select: {
            id: true,
            name: true,
            sku: true,
            currentStock: true,
            reorderLevel: true,
            unit: true
        }
    });

    const lowStockItems = allItems.filter(item =>
        item.currentStock > 0 && item.currentStock <= item.reorderLevel
    );

    return {
        stats: {
            totalItems,
            outOfStockCount: outOfStockItems.length,
            lowStockCount: lowStockItems.length
        },
        outOfStockItems,
        lowStockItems: lowStockItems.slice(0, 10) // Limit to 10
    };
};

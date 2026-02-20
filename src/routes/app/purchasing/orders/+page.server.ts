import { prisma } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
        include: {
            vendor: true,
            branch: true,
            lines: {
                include: { item: true }
            }
        },
        orderBy: { createdAt: "desc" },
    });

    const serializedPOs = purchaseOrders.map(po => ({
        ...po,
        subtotal: po.subtotal ? po.subtotal.toNumber() : 0,
        tax: po.tax ? po.tax.toNumber() : 0,
        discount: po.discount ? po.discount.toNumber() : 0,
        total: po.total ? po.total.toNumber() : 0,
        lines: po.lines.map(line => ({
            ...line,
            unitPrice: line.unitPrice ? line.unitPrice.toNumber() : 0,
            discount: line.discount ? line.discount.toNumber() : 0,
            subtotal: line.subtotal ? line.subtotal.toNumber() : 0,
            tax: line.tax ? line.tax.toNumber() : 0,
            total: line.total ? line.total.toNumber() : 0,
        }))
    }));

    return {
        purchaseOrders: serializedPOs,
    };
};

import { prisma } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const orders = await prisma.order.findMany({
        where: { type: "INVOICE" },
        include: {
            customer: true,
            branch: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const serializedOrders = orders.map(order => ({
        ...order,
        subtotal: order.subtotal ? order.subtotal.toNumber() : 0,
        tax: order.tax ? order.tax.toNumber() : 0,
        discount: order.discount ? order.discount.toNumber() : 0,
        total: order.total ? order.total.toNumber() : 0,
    }));

    return {
        orders: serializedOrders,
    };
};

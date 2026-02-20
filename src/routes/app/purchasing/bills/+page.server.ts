import { prisma } from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async () => {
    // A Vendor Bill is implicitly a Purchase Order that has been RECEIVED or BILLED
    const bills = await prisma.purchaseOrder.findMany({
        where: {
            status: {
                in: ["RECEIVED", "BILLED"]
            }
        },
        include: {
            vendor: true,
            branch: true,
            lines: {
                include: {
                    item: true
                }
            }
        },
        orderBy: { updatedAt: "desc" },
    });

    const serializedBills = bills.map(bill => ({
        ...bill,
        subtotal: bill.subtotal ? bill.subtotal.toNumber() : 0,
        tax: bill.tax ? bill.tax.toNumber() : 0,
        discount: bill.discount ? bill.discount.toNumber() : 0,
        total: bill.total ? bill.total.toNumber() : 0,
        lines: bill.lines.map(line => ({
            ...line,
            unitPrice: line.unitPrice ? line.unitPrice.toNumber() : 0,
            discount: line.discount ? line.discount.toNumber() : 0,
            subtotal: line.subtotal ? line.subtotal.toNumber() : 0,
            tax: line.tax ? line.tax.toNumber() : 0,
            total: line.total ? line.total.toNumber() : 0,
        }))
    }));

    return {
        bills: serializedBills,
    };
};

export const actions: Actions = {
    markAsBilled: async ({ request }) => {
        const formData = await request.formData();
        const orderId = formData.get("orderId") as string;

        if (!orderId) {
            return fail(400, { error: "Order ID is required" });
        }

        try {
            await prisma.purchaseOrder.update({
                where: { id: orderId },
                data: { status: "BILLED" }
            });

            return { success: true };
        } catch (error) {
            console.error("Failed to mark bill as BILLED:", error);
            return fail(500, { error: "Failed to update bill status." });
        }
    }
};

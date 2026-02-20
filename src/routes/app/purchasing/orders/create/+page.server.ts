import { prisma } from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async () => {
    const [vendors, branches, items] = await Promise.all([
        prisma.vendor.findMany({ orderBy: { name: "asc" } }),
        prisma.branch.findMany({ orderBy: { name: "asc" } }),
        prisma.item.findMany({ orderBy: { name: "asc" } })
    ]);

    return {
        vendors,
        branches,
        items
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const vendorId = formData.get("vendorId") as string;
        const branchId = formData.get("branchId") as string;

        // Parse lines array
        const linesJson = formData.get("lines") as string;

        if (!vendorId || !branchId || !linesJson) {
            return fail(400, { error: "Missing required fields" });
        }

        let lines: { itemId: string; quantity: number; unitPrice: number }[];

        try {
            lines = JSON.parse(linesJson);
            if (!Array.isArray(lines) || lines.length === 0) {
                return fail(400, { error: "At least one item line is required." });
            }
        } catch (e) {
            return fail(400, { error: "Invalid lines data." });
        }

        try {
            // Generate a random unique order number
            const orderNumber = `PO-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;

            // Calculate totals
            let subtotal = 0;
            const mappedLines = lines.map(line => {
                const lineSubtotal = line.quantity * line.unitPrice;
                subtotal += lineSubtotal;
                return {
                    itemId: line.itemId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    subtotal: lineSubtotal,
                    tax: 0,
                    discount: 0,
                    total: lineSubtotal
                };
            });

            // Assuming 0 tax/discount at global level for simplicity in this MVP
            const total = subtotal;

            await prisma.purchaseOrder.create({
                data: {
                    orderNumber,
                    vendorId,
                    branchId,
                    status: "ORDERED",
                    subtotal,
                    tax: 0,
                    discount: 0,
                    total,
                    lines: {
                        create: mappedLines
                    }
                }
            });

        } catch (error) {
            console.error("Failed to create Purchase Order:", error);
            return fail(500, { error: "Failed to create Purchase Order. Please try again." });
        }

        throw redirect(303, "/app/purchasing/orders");
    }
};

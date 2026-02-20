import { prisma } from "$lib/server/db";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
        throw redirect(302, "/app/pos/sessions");
    }

    const session = await prisma.posSession.findUnique({
        where: { id: sessionId },
        include: {
            register: {
                include: {
                    branch: true
                }
            },
            user: true,
        },
    });

    if (!session || session.status !== "OPEN") {
        throw error(400, "Invalid or closed session");
    }

    // Load necessary data for POS
    const items = await prisma.item.findMany({
        include: {
            category: true,
        },
        orderBy: { name: "asc" },
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    const customers = await prisma.customer.findMany({
        orderBy: { name: "asc" },
    });

    const serializedSession = {
        ...session,
        openingCash: session.openingCash ? session.openingCash.toNumber() : 0,
        closingCash: session.closingCash ? session.closingCash.toNumber() : 0,
    };

    return {
        session: serializedSession,
        items,
        categories,
        customers,
    };
};

export const actions: Actions = {
    checkout: async ({ request }) => {
        // We will receive a JSON payload with the cart details
        const formData = await request.formData();
        const payloadStr = formData.get("payload") as string;

        if (!payloadStr) {
            return { success: false, error: "Missing payload" };
        }

        try {
            const payload = JSON.parse(payloadStr);
            console.log("Checkout payload received:", payload);

            // Expected payload structure:
            // {
            //   sessionId: string,
            //   customerId: string | null,
            //   items: [{ itemId: string, quantity: number, price: number, tax: number, discount: number, subtotal: number, total: number }],
            //   paymentMethod: "CASH" | "CARD" | "TRANSFER",
            //   subtotal: number,
            //   tax: number,
            //   discount: number,
            //   total: number,
            //   amountPaid: number
            // }

            // TODO: Implement the actual Order creation logic inside a transaction
            // 1. Create Order
            // 2. Create OrderLines
            // 3. Create Payment
            // 4. Update Stock logic (optional based on future requirements)

            // Simple validation simulation
            if (!payload.items || payload.items.length === 0) {
                return { success: false, error: "Cart is empty" };
            }

            // Mock success response for now
            return { success: true, orderId: "ORD-" + Math.floor(Math.random() * 10000) };

        } catch (e: any) {
            console.error("Checkout parse/process error:", e);
            return { success: false, error: "Failed to process checkout: " + e.message };
        }
    }
};

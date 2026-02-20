import { prisma } from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async () => {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
    });

    return {
        customers,
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const address = formData.get("address") as string;
        const taxId = formData.get("taxId") as string;

        if (!name) {
            return fail(400, { error: "Customer name is required" });
        }

        try {
            await prisma.customer.create({
                data: {
                    name,
                    phone: phone || null,
                    email: email || null,
                    address: address || null,
                    taxId: taxId || null,
                },
            });
            return { success: true };
        } catch (error) {
            console.error("Failed to create customer:", error);
            return fail(500, { error: "Failed to create customer" });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const address = formData.get("address") as string;
        const taxId = formData.get("taxId") as string;

        if (!id || !name) {
            return fail(400, { error: "Customer ID and name are required" });
        }

        try {
            await prisma.customer.update({
                where: { id },
                data: {
                    name,
                    phone: phone || null,
                    email: email || null,
                    address: address || null,
                    taxId: taxId || null,
                },
            });
            return { success: true };
        } catch (error) {
            console.error("Failed to update customer:", error);
            return fail(500, { error: "Failed to update customer" });
        }
    }
};

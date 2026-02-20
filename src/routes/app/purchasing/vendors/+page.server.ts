import { prisma } from "$lib/server/db";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async () => {
    const vendors = await prisma.vendor.findMany({
        orderBy: { name: "asc" },
    });

    return {
        vendors,
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const contact = formData.get("contact") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const taxId = formData.get("taxId") as string;

        await prisma.vendor.create({
            data: {
                name,
                contact: contact || null,
                email: email || null,
                phone: phone || null,
                address: address || null,
                taxId: taxId || null,
            },
        });

        return { success: true };
    },
    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const contact = formData.get("contact") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const taxId = formData.get("taxId") as string;

        await prisma.vendor.update({
            where: { id },
            data: {
                name,
                contact: contact || null,
                email: email || null,
                phone: phone || null,
                address: address || null,
                taxId: taxId || null,
            },
        });

        return { success: true };
    },
};

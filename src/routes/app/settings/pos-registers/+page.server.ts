import { prisma } from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async () => {
    const registers = await prisma.posRegister.findMany({
        include: {
            branch: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const branches = await prisma.branch.findMany({
        orderBy: { name: "asc" },
    });

    return {
        registers,
        branches,
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const branchId = formData.get("branchId") as string;
        const isActiveStr = formData.get("isActive") as string;
        const isActive = isActiveStr === "on" || isActiveStr === "true";

        if (!name || !branchId) {
            return fail(400, { error: "Name and Branch are required" });
        }

        try {
            await prisma.posRegister.create({
                data: {
                    name,
                    branchId,
                    isActive,
                },
            });
            return { success: true };
        } catch (error) {
            console.error("Failed to create POS register:", error);
            return fail(500, { error: "Failed to create POS register" });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const branchId = formData.get("branchId") as string;
        const isActiveStr = formData.get("isActive") as string;
        const isActive = isActiveStr === "on" || isActiveStr === "true";

        if (!id || !name || !branchId) {
            return fail(400, { error: "ID, Name, and Branch are required" });
        }

        try {
            await prisma.posRegister.update({
                where: { id },
                data: {
                    name,
                    branchId,
                    isActive,
                },
            });
            return { success: true };
        } catch (error) {
            console.error("Failed to update POS register:", error);
            return fail(500, { error: "Failed to update POS register" });
        }
    }
};

import { prisma } from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const userRole = locals.user?.role;
    const userId = locals.user?.id;
    const branchId = locals.user?.companyId; // Simplified: Assuming user belongs to a main branch or company

    // Ideally, filter by branch. For now, get registers
    const registers = await prisma.posRegister.findMany({
        include: {
            branch: true,
        },
    });

    const activeSessions = await prisma.posSession.findMany({
        where: {
            status: "OPEN",
        },
        include: {
            register: true,
            user: true,
        },
    });

    const serializedSessions = activeSessions.map(session => ({
        ...session,
        openingCash: session.openingCash ? session.openingCash.toNumber() : 0,
        closingCash: session.closingCash ? session.closingCash.toNumber() : 0,
    }));

    return {
        registers,
        activeSessions: serializedSessions,
    };
};

export const actions: Actions = {
    openSession: async ({ request, locals }) => {
        const formData = await request.formData();
        const registerId = formData.get("registerId") as string;
        const openingCashStr = formData.get("openingCash") as string;
        const openingCash = parseFloat(openingCashStr) || 0;

        const userId = locals.user?.id;

        if (!registerId || !userId) {
            return fail(400, { error: "Register ID and User ID are required" });
        }

        // Check if register already has an open session
        const existingSession = await prisma.posSession.findFirst({
            where: {
                registerId,
                status: "OPEN",
            }
        });

        if (existingSession) {
            return fail(400, { error: "This register already has an open session!" });
        }

        try {
            const session = await prisma.posSession.create({
                data: {
                    registerId,
                    userId,
                    openingCash,
                    status: "OPEN",
                },
            });
            return { success: true, sessionId: session.id };
        } catch (error) {
            console.error("Failed to open POS session:", error);
            return fail(500, { error: "Failed to open POS session" });
        }
    },

    closeSession: async ({ request }) => {
        const formData = await request.formData();
        const sessionId = formData.get("sessionId") as string;
        const closingCashStr = formData.get("closingCash") as string;
        const closingCash = parseFloat(closingCashStr) || 0;

        if (!sessionId) {
            return fail(400, { error: "Session ID is required" });
        }

        try {
            await prisma.posSession.update({
                where: { id: sessionId },
                data: {
                    status: "CLOSED",
                    endTime: new Date(),
                    closingCash,
                },
            });
            return { success: true };
        } catch (error) {
            console.error("Failed to close POS session:", error);
            return fail(500, { error: "Failed to close POS session" });
        }
    }
};

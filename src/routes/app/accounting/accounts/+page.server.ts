import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import type { AccountType } from '@prisma/client';

export const load: PageServerLoad = async ({ locals }) => {
    // Fetch all accounts
    const accounts = await prisma.account.findMany({
        orderBy: { code: 'asc' }
    });

    // Build tree and flatten
    // First, map ID to children
    const accountMap = new Map();
    const roots: any[] = [];

    accounts.forEach(acc => {
        accountMap.set(acc.id, { ...acc, children: [] });
    });

    accounts.forEach(acc => {
        if (acc.parentId) {
            const parent = accountMap.get(acc.parentId);
            if (parent) {
                parent.children.push(accountMap.get(acc.id));
            }
        } else {
            roots.push(accountMap.get(acc.id));
        }
    });

    // Flatten logic
    const flatList: any[] = [];

    function traverse(nodes: any[], depth = 0) {
        // sort by code logic if needed, but we ordered by code from DB.
        nodes.forEach(node => {
            flatList.push({
                ...node,
                depth,
                childrenCount: node.children.length
            });
            if (node.children.length > 0) {
                traverse(node.children, depth + 1);
            }
        });
    }

    traverse(roots);

    return {
        linearAccounts: flatList
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const code = data.get('code') as string;
        const name = data.get('name') as string;
        const type = data.get('type') as AccountType;
        const parentId = data.get('parentId') as string || null;
        const description = data.get('description') as string;

        if (!code || !name || !type) {
            return fail(400, { error: 'Code, Name and Type are required' });
        }

        try {
            await prisma.account.create({
                data: {
                    code,
                    name,
                    type,
                    parentId,
                    description
                }
            });
        } catch (e) {
            return fail(400, { error: 'Account code must be unique' });
        }

        return { success: true };
    },

    update: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const code = data.get('code') as string;
        const name = data.get('name') as string;
        const type = data.get('type') as AccountType;
        const parentId = data.get('parentId') as string || null;
        const description = data.get('description') as string;

        if (!id || !code || !name) {
            return fail(400, { error: 'Invalid data' });
        }

        // Prevent circular dependency if parentId is set
        if (parentId === id) {
            return fail(400, { error: 'Account cannot be its own parent' });
        }

        try {
            await prisma.account.update({
                where: { id },
                data: {
                    code,
                    name,
                    type,
                    parentId,
                    description
                }
            });
        } catch (e) {
            return fail(400, { error: 'Update failed' });
        }

        return { success: true };
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        const account = await prisma.account.findUnique({
            where: { id },
            include: { children: true }
        });

        if (!account) return fail(404, { error: 'Account not found' });
        if (account.children.length > 0) return fail(400, { error: 'Cannot delete account with children' });
        // TODO: Check for journal entries before deletion

        await prisma.account.delete({
            where: { id }
        });

        return { success: true };
    }
};

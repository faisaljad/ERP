import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { comparePassword, signToken } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, '/app');
    }
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return fail(400, { error: 'Invalid credentials' });
        }

        const valid = await comparePassword(password, user.password);

        if (!valid) {
            return fail(400, { error: 'Invalid credentials' });
        }

        // Create session
        const token = signToken({ userId: user.id, email: user.email, role: user.role });

        cookies.set('session_token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 8 // 8 hours
        });

        throw redirect(302, '/app');
    }
};

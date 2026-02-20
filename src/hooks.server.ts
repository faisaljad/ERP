import type { Handle } from '@sveltejs/kit';
import { verifyToken } from '$lib/server/auth';
import { prisma } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session_token');

    if (token) {
        const payload = verifyToken(token);
        if (payload && payload.userId) {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                select: { id: true, email: true, name: true, role: true, companyId: true }
            });
            if (user) {
                event.locals.user = {
                    ...user,
                    role: user.role as string // Cast enum to string if needed, or update types
                };
            }
        }
    }

    if (!event.locals.user) {
        event.locals.user = null;
    }

    // Protect routes
    if (event.url.pathname.startsWith('/app') && !event.locals.user) {
        return new Response('Redirect', { status: 303, headers: { Location: '/login' } });
    }

    // Redirect root to app or login
    if (event.url.pathname === '/') {
        if (event.locals.user) {
            return new Response('Redirect', { status: 303, headers: { Location: '/app' } });
        } else {
            return new Response('Redirect', { status: 303, headers: { Location: '/login' } });
        }
    }

    return await resolve(event);
};

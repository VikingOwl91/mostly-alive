import type { Handle } from '@sveltejs/kit';
import { verifySession, isUserAuthorized, getSecret } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;

	// Enforce authentication & authorization on all editor routes
	if (pathname.startsWith('/editor')) {
		const isAuthRoute =
			pathname === '/editor/auth/login' ||
			pathname === '/editor/auth/callback' ||
			pathname === '/editor/auth/logout' ||
			pathname === '/editor/login';

		if (isAuthRoute) {
			return resolve(event);
		}

		const sessionSecret =
			getSecret('SESSION_SECRET', event.platform) ||
			'fallback-editor-session-secret-change-in-production-min-32-chars';
		const allowedUserId = getSecret('ALLOWED_GITHUB_USER_ID', event.platform);

		const sessionCookie = event.cookies.get('editor_session');
		let authorizedSession = null;

		if (sessionCookie) {
			const session = await verifySession(sessionCookie, sessionSecret);
			if (session && isUserAuthorized(session.userId, allowedUserId)) {
				authorizedSession = session;
			}
		}

		if (!authorizedSession) {
			// Reject API calls with JSON 401
			if (pathname.startsWith('/editor/api/')) {
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Unauthorized: Valid administrative editor session required'
					}),
					{
						status: 401,
						headers: { 'Content-Type': 'application/json' }
					}
				);
			}

			// Redirect web UI requests to the login screen
			const redirectUrl = `/editor/login?redirect=${encodeURIComponent(pathname + event.url.search)}`;
			return new Response(null, {
				status: 302,
				headers: {
					Location: redirectUrl
				}
			});
		}

		// Attach authenticated session to event.locals
		event.locals.user = authorizedSession;
	}

	return resolve(event);
};

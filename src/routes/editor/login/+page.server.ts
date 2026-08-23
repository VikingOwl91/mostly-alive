import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { verifySession, isUserAuthorized, getSecret } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies, platform, url }) => {
	const sessionSecret =
		getSecret('SESSION_SECRET', platform) ||
		'fallback-editor-session-secret-change-in-production-min-32-chars';
	const allowedUserId = getSecret('ALLOWED_GITHUB_USER_ID', platform);

	const sessionCookie = cookies.get('editor_session');
	if (sessionCookie) {
		const session = await verifySession(sessionCookie, sessionSecret);
		if (session && isUserAuthorized(session.userId, allowedUserId)) {
			const destination = url.searchParams.get('redirect') || '/editor';
			throw redirect(302, destination);
		}
	}

	const error = url.searchParams.get('error');
	return {
		error
	};
};

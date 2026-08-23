import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateOAuthState, getSecret } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies, platform, url }) => {
	const clientId = getSecret('GITHUB_CLIENT_ID', platform);

	if (!clientId) {
		throw redirect(
			302,
			'/editor/login?error=GITHUB_CLIENT_ID%20is%20not%20configured%20on%20the%20server.'
		);
	}

	const state = generateOAuthState();

	// Store state in a secure, short-lived cookie for CSRF verification
	cookies.set('oauth_state', state, {
		path: '/editor',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 minutes
	});

	const redirectUri = `${url.origin}/editor/auth/callback`;
	const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
	githubAuthUrl.searchParams.set('client_id', clientId);
	githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
	githubAuthUrl.searchParams.set('scope', 'repo');
	githubAuthUrl.searchParams.set('state', state);

	throw redirect(302, githubAuthUrl.toString());
};

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { signSession, isUserAuthorized, getSecret, type EditorSession } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');

	// Clear temporary state cookie
	cookies.delete('oauth_state', { path: '/editor' });

	// Validate CSRF state token
	if (!state || !storedState || state !== storedState) {
		throw redirect(302, '/editor/login?error=Invalid%20or%20expired%20OAuth%20state%20parameter.');
	}

	if (!code) {
		throw redirect(
			302,
			'/editor/login?error=Authorization%20code%20missing%20from%20GitHub%20redirect.'
		);
	}

	const clientId = getSecret('GITHUB_CLIENT_ID', platform);
	const clientSecret = getSecret('GITHUB_CLIENT_SECRET', platform);
	const allowedUserId = getSecret('ALLOWED_GITHUB_USER_ID', platform);
	const sessionSecret =
		getSecret('SESSION_SECRET', platform) ||
		'fallback-editor-session-secret-change-in-production-min-32-chars';

	if (!clientId || !clientSecret) {
		throw redirect(
			302,
			'/editor/login?error=GitHub%20OAuth%20credentials%20are%20not%20configured.'
		);
	}

	try {
		// 1. Exchange authorization code for GitHub access token
		const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'User-Agent': 'MostlyAlive-Editor'
			},
			body: JSON.stringify({
				client_id: clientId,
				client_secret: clientSecret,
				code
			})
		});

		const tokenData = (await tokenResponse.json()) as {
			access_token?: string;
			error_description?: string;
		};

		if (!tokenData.access_token) {
			throw redirect(
				302,
				`/editor/login?error=${encodeURIComponent(tokenData.error_description || 'Failed to obtain access token from GitHub.')}`
			);
		}

		// 2. Fetch authenticated GitHub user details
		const userResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`,
				Accept: 'application/json',
				'User-Agent': 'MostlyAlive-Editor'
			}
		});

		if (!userResponse.ok) {
			throw redirect(
				302,
				'/editor/login?error=Failed%20to%20retrieve%20user%20profile%20from%20GitHub.'
			);
		}

		const user = (await userResponse.json()) as { id?: number; login?: string };

		if (!user.id || !user.login) {
			throw redirect(302, '/editor/login?error=Invalid%20user%20profile%20returned%20by%20GitHub.');
		}

		// 3. Strictly authorize the immutable numeric GitHub user ID
		if (!isUserAuthorized(user.id, allowedUserId)) {
			console.warn(
				`[AUTH] Unauthorized GitHub user access attempt: User ID ${user.id} (${user.login})`
			);
			throw redirect(
				302,
				`/editor/login?error=${encodeURIComponent(`Unauthorized user: GitHub User ID ${user.id} (@${user.login}) is not permitted to access this editor.`)}`
			);
		}

		// 4. Create cryptographically signed session cookie
		const sessionPayload: EditorSession = {
			userId: user.id,
			username: user.login,
			token: tokenData.access_token,
			exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
		};

		const signedCookie = await signSession(sessionPayload, sessionSecret);

		cookies.set('editor_session', signedCookie, {
			path: '/editor',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60
		});

		throw redirect(302, '/editor');
	} catch (err: any) {
		if (err?.status === 302 || err?.status === 303) {
			throw err;
		}
		console.error('[AUTH ERROR]', err);
		throw redirect(
			302,
			`/editor/login?error=${encodeURIComponent(err?.message || 'Authentication error')}`
		);
	}
};

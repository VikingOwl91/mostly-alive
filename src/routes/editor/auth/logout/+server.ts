import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('editor_session', { path: '/editor' });
	cookies.delete('oauth_state', { path: '/editor' });
	throw redirect(302, '/');
};

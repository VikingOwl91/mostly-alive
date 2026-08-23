import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/editor/login');
	}

	return {
		user: {
			userId: locals.user.userId,
			username: locals.user.username
		}
	};
};

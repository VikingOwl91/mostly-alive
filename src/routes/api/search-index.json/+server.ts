import { json } from '@sveltejs/kit';
import { getSearchIndex } from '$lib/server/content';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const lang = (url.searchParams.get('lang') || 'en') as 'en' | 'de';
	const index = getSearchIndex(lang);

	return json(index, {
		headers: {
			'cache-control': 'public, max-age=60, s-maxage=60'
		}
	});
};

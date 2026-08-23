import { loadAllArticles } from '$lib/server/content';
import { CATEGORIES } from '$lib/types/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'de';
	const allArticles = loadAllArticles(lang);

	// Pick priority 0 / featured articles
	const featured = allArticles.slice(0, 6);

	return {
		lang,
		featured,
		totalArticles: allArticles.length,
		categories: Object.values(CATEGORIES)
	};
};

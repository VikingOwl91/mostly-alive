import { loadAllArticles } from '$lib/server/content';
import { CATEGORIES } from '$lib/types/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'de';
	const articles = loadAllArticles(lang);

	return {
		lang,
		articles,
		categories: Object.values(CATEGORIES)
	};
};

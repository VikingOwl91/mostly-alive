import { CATEGORIES } from '$lib/types/content';
import { loadAllArticles } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'de';
	const articles = loadAllArticles(lang);

	const counts: Record<string, number> = {};
	for (const cat of Object.keys(CATEGORIES)) {
		counts[cat] = articles.filter((a) => a.category === cat).length;
	}

	return {
		lang,
		categories: Object.values(CATEGORIES),
		counts
	};
};

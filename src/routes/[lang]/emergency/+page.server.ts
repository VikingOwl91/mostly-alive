import { loadAllArticles } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'de';
	const articles = loadAllArticles(lang);

	// Filter high urgency & critical articles
	const criticalArticles = articles.filter((a) => a.threat_level >= 4 || a.urgency === 'immediate');

	return {
		lang,
		criticalArticles
	};
};

import { error } from '@sveltejs/kit';
import { getArticle, getRelatedArticles } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'de';
	const slug = params.slug;

	const article = getArticle(slug, lang);
	if (!article) {
		throw error(404, `Article "${slug}" not found in language "${lang}"`);
	}

	const relatedArticles = getRelatedArticles(article, lang, 3);

	return {
		lang,
		article,
		relatedArticles
	};
};

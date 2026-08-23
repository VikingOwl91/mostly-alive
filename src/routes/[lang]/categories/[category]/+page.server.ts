import { error } from '@sveltejs/kit';
import { CATEGORIES, CategoryEnum } from '$lib/types/content';
import { getArticlesByCategory } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'de';
	const catParam = params.category;

	const validated = CategoryEnum.safeParse(catParam);
	if (!validated.success) {
		throw error(404, `Category "${catParam}" not found`);
	}

	const category = validated.data;
	const categoryInfo = CATEGORIES[category];
	const articles = getArticlesByCategory(category, lang);

	return {
		lang,
		category,
		categoryInfo,
		articles
	};
};

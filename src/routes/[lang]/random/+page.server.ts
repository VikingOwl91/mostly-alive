import { getRandomArticle } from '$lib/server/content';
import { CATEGORIES, CategoryEnum, type Category } from '$lib/types/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const lang = params.lang as 'en' | 'de';
	const catParam = url.searchParams.get('category');

	let category: Category | undefined;
	if (catParam) {
		const parsed = CategoryEnum.safeParse(catParam);
		if (parsed.success) {
			category = parsed.data;
		}
	}

	const randomArticle = getRandomArticle(lang, category);

	return {
		lang,
		article: randomArticle,
		selectedCategory: category || 'all',
		categories: Object.values(CATEGORIES)
	};
};

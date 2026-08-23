import { error } from '@sveltejs/kit';
import { getStaticPage } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'de';
	const pageSlug = params.page;

	let staticPage = getStaticPage(pageSlug, lang);
	if (!staticPage) {
		if (pageSlug === 'lesen-rettet-leben') {
			staticPage = getStaticPage('reading-saves-lives', lang);
		} else if (pageSlug === 'reading-saves-lives') {
			staticPage = getStaticPage('lesen-rettet-leben', lang);
		}
	}
	if (!staticPage) {
		throw error(404, `Page "${pageSlug}" not found in language "${lang}"`);
	}

	return {
		lang,
		page: staticPage
	};
};

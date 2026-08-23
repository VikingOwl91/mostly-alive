import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const lang = params.lang;
	if (lang !== 'en' && lang !== 'de') {
		throw error(404, 'Language not supported');
	}

	return {
		lang: lang as 'en' | 'de'
	};
};

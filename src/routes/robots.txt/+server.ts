import type { RequestHandler } from './$types';
import { SITE_URL } from '$lib/seo';

export const GET: RequestHandler = async () => {
	const content = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /editor/',
		'Disallow: /api/',
		'Disallow: /*/random$',
		'',
		`Sitemap: ${SITE_URL}/sitemap.xml`
	].join('\n');

	return new Response(content, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};

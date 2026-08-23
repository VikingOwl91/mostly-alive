import type { RequestHandler } from './$types';
import { loadAllArticles, loadAllStaticPages } from '$lib/server/content';
import { CATEGORIES } from '$lib/types/content';
import { SITE_URL } from '$lib/seo';

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	alternates?: Array<{ lang: string; href: string }>;
}

export const GET: RequestHandler = async () => {
	const entries: SitemapEntry[] = [];

	// 1. Homepages
	for (const lang of ['en', 'de'] as const) {
		entries.push({
			loc: `${SITE_URL}/${lang}`,
			alternates: [
				{ lang: 'en', href: `${SITE_URL}/en` },
				{ lang: 'de', href: `${SITE_URL}/de` },
				{ lang: 'x-default', href: `${SITE_URL}/en` }
			]
		});
	}

	// 2. Handbooks
	for (const lang of ['en', 'de'] as const) {
		entries.push({
			loc: `${SITE_URL}/${lang}/guide`,
			alternates: [
				{ lang: 'en', href: `${SITE_URL}/en/guide` },
				{ lang: 'de', href: `${SITE_URL}/de/guide` },
				{ lang: 'x-default', href: `${SITE_URL}/en/guide` }
			]
		});
	}

	// 3. Category Indexes
	for (const lang of ['en', 'de'] as const) {
		entries.push({
			loc: `${SITE_URL}/${lang}/categories`,
			alternates: [
				{ lang: 'en', href: `${SITE_URL}/en/categories` },
				{ lang: 'de', href: `${SITE_URL}/de/categories` },
				{ lang: 'x-default', href: `${SITE_URL}/en/categories` }
			]
		});
	}

	// 4. Populated Category Pages
	for (const cat of Object.values(CATEGORIES)) {
		for (const lang of ['en', 'de'] as const) {
			entries.push({
				loc: `${SITE_URL}/${lang}/categories/${cat.id}`,
				alternates: [
					{ lang: 'en', href: `${SITE_URL}/en/categories/${cat.id}` },
					{ lang: 'de', href: `${SITE_URL}/de/categories/${cat.id}` },
					{ lang: 'x-default', href: `${SITE_URL}/en/categories/${cat.id}` }
				]
			});
		}
	}

	// 5. Emergency Mode Pages
	for (const lang of ['en', 'de'] as const) {
		entries.push({
			loc: `${SITE_URL}/${lang}/emergency`,
			alternates: [
				{ lang: 'en', href: `${SITE_URL}/en/emergency` },
				{ lang: 'de', href: `${SITE_URL}/de/emergency` },
				{ lang: 'x-default', href: `${SITE_URL}/en/emergency` }
			]
		});
	}

	// 6. Published Guide Articles (50 EN + 50 DE)
	const enArticles = loadAllArticles('en');
	const deArticles = loadAllArticles('de');
	const deArticleMap = new Map(deArticles.map((a) => [a.slug, a]));

	for (const enArticle of enArticles) {
		// Only index public published/reviewed articles (skip unreviewed drafts if status is draft without sources)
		const deArticle = deArticleMap.get(enArticle.slug);

		// EN URL
		entries.push({
			loc: `${SITE_URL}/en/guide/${enArticle.slug}`,
			lastmod: enArticle.reviewed_at,
			alternates: [
				{ lang: 'en', href: `${SITE_URL}/en/guide/${enArticle.slug}` },
				{ lang: 'de', href: `${SITE_URL}/de/guide/${enArticle.slug}` },
				{ lang: 'x-default', href: `${SITE_URL}/en/guide/${enArticle.slug}` }
			]
		});

		// DE URL
		if (deArticle) {
			entries.push({
				loc: `${SITE_URL}/de/guide/${enArticle.slug}`,
				lastmod: deArticle.reviewed_at || enArticle.reviewed_at,
				alternates: [
					{ lang: 'en', href: `${SITE_URL}/en/guide/${enArticle.slug}` },
					{ lang: 'de', href: `${SITE_URL}/de/guide/${enArticle.slug}` },
					{ lang: 'x-default', href: `${SITE_URL}/en/guide/${enArticle.slug}` }
				]
			});
		}
	}

	// 7. Public Static / Trust Center Pages
	const enPages = loadAllStaticPages('en');
	const dePages = loadAllStaticPages('de');
	const dePageMap = new Map(dePages.map((p) => [p.slug, p]));

	for (const enPage of enPages) {
		const deSlug =
			enPage.slug === 'reading-saves-lives' && dePageMap.has('lesen-rettet-leben')
				? 'reading-saves-lives'
				: enPage.slug;

		// EN Page
		entries.push({
			loc: `${SITE_URL}/en/${enPage.slug}`,
			alternates: [
				{ lang: 'en', href: `${SITE_URL}/en/${enPage.slug}` },
				{ lang: 'de', href: `${SITE_URL}/de/${deSlug}` },
				{ lang: 'x-default', href: `${SITE_URL}/en/${enPage.slug}` }
			]
		});

		// DE Page
		if (dePageMap.has(enPage.slug)) {
			entries.push({
				loc: `${SITE_URL}/de/${enPage.slug}`,
				alternates: [
					{ lang: 'en', href: `${SITE_URL}/en/${enPage.slug}` },
					{ lang: 'de', href: `${SITE_URL}/de/${enPage.slug}` },
					{ lang: 'x-default', href: `${SITE_URL}/en/${enPage.slug}` }
				]
			});
		}
	}

	// Also add lesen-rettet-leben if it exists as an alternate slug in DE
	if (dePageMap.has('lesen-rettet-leben') && !entries.some((e) => e.loc.endsWith('/de/lesen-rettet-leben'))) {
		entries.push({
			loc: `${SITE_URL}/de/lesen-rettet-leben`,
			alternates: [
				{ lang: 'en', href: `${SITE_URL}/en/reading-saves-lives` },
				{ lang: 'de', href: `${SITE_URL}/de/lesen-rettet-leben` },
				{ lang: 'x-default', href: `${SITE_URL}/en/reading-saves-lives` }
			]
		});
	}

	// Generate XML
	const xmlLines = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
	];

	for (const entry of entries) {
		xmlLines.push('  <url>');
		xmlLines.push(`    <loc>${entry.loc}</loc>`);
		if (entry.lastmod) {
			xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
		}
		if (entry.alternates) {
			for (const alt of entry.alternates) {
				xmlLines.push(
					`    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}"/>`
				);
			}
		}
		xmlLines.push('  </url>');
	}

	xmlLines.push('</urlset>');

	return new Response(xmlLines.join('\n'), {
		status: 200,
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=600, s-maxage=600'
		}
	});
};

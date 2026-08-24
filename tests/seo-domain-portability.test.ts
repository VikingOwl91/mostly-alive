import { describe, it, expect } from 'vitest';
import {
	SITE_URL,
	buildCanonicalUrl,
	buildHreflangLinks,
	buildHomepageSeo,
	buildHandbookSeo,
	buildGuideSeo,
	buildCategorySeo,
	buildEmergencySeo,
	buildStaticPageSeo,
	buildRandomSeo
} from '../src/lib/seo';
import { loadAllArticles, loadAllStaticPages } from '../src/lib/server/content';
import { CATEGORIES } from '../src/lib/types/content';
import { handle } from '../src/hooks.server';

describe('SEO Pass 2C — Domain Portability & Single Source of Truth', () => {
	const testCustomOrigin = 'https://staging.mostly-alive.dev';
	const [sampleEnArticle] = loadAllArticles('en');
	const [sampleDeArticle] = loadAllArticles('de');
	const [samplePage] = loadAllStaticPages('en');

	describe('Authoritative SITE_URL Source of Truth', () => {
		it('should have mostly-alive.nachtigall.dev as the authoritative SITE_URL', () => {
			expect(SITE_URL).toBe('https://mostly-alive.nachtigall.dev');
		});

		it('should ensure all metadata systems derive absolute URLs from SITE_URL', () => {
			const guideSeo = buildGuideSeo(sampleEnArticle, 'en');
			expect(guideSeo.canonicalUrl.startsWith('https://mostly-alive.nachtigall.dev')).toBe(true);
			expect(guideSeo.ogImage?.startsWith('https://mostly-alive.nachtigall.dev')).toBe(true);

			for (const h of guideSeo.hreflangs) {
				expect(h.href.startsWith('https://mostly-alive.nachtigall.dev')).toBe(true);
			}

			const [articleSchema, breadcrumbSchema] = guideSeo.jsonLd as [any, any];
			expect(articleSchema.url.startsWith('https://mostly-alive.nachtigall.dev')).toBe(true);
			expect(articleSchema.mainEntityOfPage.startsWith('https://mostly-alive.nachtigall.dev')).toBe(true);
			expect(articleSchema.image.startsWith('https://mostly-alive.nachtigall.dev')).toBe(true);

			for (const item of breadcrumbSchema.itemListElement) {
				expect(item.item.startsWith('https://mostly-alive.nachtigall.dev')).toBe(true);
			}
		});
	});

	describe('Domain Portability Architecture', () => {
		it('should flawlessly re-target all generated metadata to any custom origin when supplied', () => {
			// 1. Guide Article SEO
			const guideSeo = buildGuideSeo(sampleEnArticle, 'en', testCustomOrigin);
			expect(guideSeo.canonicalUrl).toBe(`${testCustomOrigin}/en/guide/${sampleEnArticle.slug}`);
			expect(guideSeo.ogImage).toBe(`${testCustomOrigin}/social-card.png`);
			expect(guideSeo.hreflangs).toEqual([
				{ lang: 'en', href: `${testCustomOrigin}/en/guide/${sampleEnArticle.slug}` },
				{ lang: 'de', href: `${testCustomOrigin}/de/guide/${sampleEnArticle.slug}` },
				{ lang: 'x-default', href: `${testCustomOrigin}/en/guide/${sampleEnArticle.slug}` }
			]);

			// 2. Homepage SEO
			const homeSeo = buildHomepageSeo('en', testCustomOrigin);
			expect(homeSeo.canonicalUrl).toBe(`${testCustomOrigin}/en`);
			expect(homeSeo.ogImage).toBe(`${testCustomOrigin}/social-card.png`);

			// 3. Handbook Directory SEO
			const handbookSeo = buildHandbookSeo('en', testCustomOrigin);
			expect(handbookSeo.canonicalUrl).toBe(`${testCustomOrigin}/en/guide`);

			// 4. Category SEO
			const catSeo = buildCategorySeo('weather', 'en', testCustomOrigin);
			expect(catSeo.canonicalUrl).toBe(`${testCustomOrigin}/en/categories/weather`);

			// 5. Emergency SEO
			const emergencySeo = buildEmergencySeo('en', testCustomOrigin);
			expect(emergencySeo.canonicalUrl).toBe(`${testCustomOrigin}/en/emergency`);

			// 6. Static Page SEO
			const staticSeo = buildStaticPageSeo(samplePage, 'en', testCustomOrigin);
			expect(staticSeo.canonicalUrl).toBe(`${testCustomOrigin}/en/${samplePage.slug}`);

			// Verify JSON-LD on custom domain
			const [articleSchema, breadcrumbs] = guideSeo.jsonLd as [any, any];
			expect(articleSchema.url).toBe(`${testCustomOrigin}/en/guide/${sampleEnArticle.slug}`);
			expect(articleSchema.image).toBe(`${testCustomOrigin}/social-card.png`);
			expect(breadcrumbs.itemListElement[0].item).toBe(`${testCustomOrigin}/en`);
		});
	});

	describe('Legacy Workers Hostname 301 Permanent Redirect', () => {
		it('should permanently redirect requests on mostly-alive.christian-d81.workers.dev to mostly-alive.nachtigall.dev preserving path and query', async () => {
			const mockEvent = {
				url: new URL('https://mostly-alive.christian-d81.workers.dev/en/guide/hair-suddenly-vertical?ref=twitter'),
				request: new Request('https://mostly-alive.christian-d81.workers.dev/en/guide/hair-suddenly-vertical?ref=twitter', {
					headers: { host: 'mostly-alive.christian-d81.workers.dev' }
				}),
				cookies: { get: () => undefined, set: () => {}, delete: () => {} },
				locals: {}
			};

			const response = await handle({
				event: mockEvent as any,
				resolve: (async () => new Response('ok')) as any
			});

			expect(response.status).toBe(301);
			expect(response.headers.get('Location')).toBe(
				'https://mostly-alive.nachtigall.dev/en/guide/hair-suddenly-vertical?ref=twitter'
			);
		});

		it('should not redirect requests destined for the production domain', async () => {
			const mockEvent = {
				url: new URL('https://mostly-alive.nachtigall.dev/en/guide/hair-suddenly-vertical'),
				request: new Request('https://mostly-alive.nachtigall.dev/en/guide/hair-suddenly-vertical', {
					headers: { host: 'mostly-alive.nachtigall.dev' }
				}),
				cookies: { get: () => undefined, set: () => {}, delete: () => {} },
				locals: {}
			};

			const response = await handle({
				event: mockEvent as any,
				resolve: (async () => new Response('ok', { status: 200 })) as any
			});

			expect(response.status).toBe(200);
		});
	});

	describe('Social Image Asset Specification', () => {
		it('should specify 1200x630 dimensions and summary_large_image card type', () => {
			const guideSeo = buildGuideSeo(sampleEnArticle, 'en');
			expect(guideSeo.ogImage).toBe('https://mostly-alive.nachtigall.dev/social-card.png');
			expect(guideSeo.ogImageWidth).toBe(1200);
			expect(guideSeo.ogImageHeight).toBe(630);
			expect(guideSeo.ogImageType).toBe('image/png');
		});
	});
});

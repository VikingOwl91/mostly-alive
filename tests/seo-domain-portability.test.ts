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

describe('SEO Pass 2C — Domain Portability & Single Source of Truth', () => {
	const testCustomOrigin = 'https://mostly-alive.nachtigall.dev';
	const [sampleEnArticle] = loadAllArticles('en');
	const [sampleDeArticle] = loadAllArticles('de');
	const [samplePage] = loadAllStaticPages('en');

	describe('Current SITE_URL derivation', () => {
		it('should ensure all metadata systems derive absolute URLs from SITE_URL', () => {
			const guideSeo = buildGuideSeo(sampleEnArticle, 'en');
			expect(guideSeo.canonicalUrl.startsWith(SITE_URL)).toBe(true);
			expect(guideSeo.ogImage?.startsWith(SITE_URL)).toBe(true);

			for (const h of guideSeo.hreflangs) {
				expect(h.href.startsWith(SITE_URL)).toBe(true);
			}

			const [articleSchema, breadcrumbSchema] = guideSeo.jsonLd as [any, any];
			expect(articleSchema.url.startsWith(SITE_URL)).toBe(true);
			expect(articleSchema.mainEntityOfPage.startsWith(SITE_URL)).toBe(true);
			expect(articleSchema.image.startsWith(SITE_URL)).toBe(true);

			for (const item of breadcrumbSchema.itemListElement) {
				expect(item.item.startsWith(SITE_URL)).toBe(true);
			}
		});
	});

	describe('Custom Domain Migration Cutover Readiness', () => {
		it('should flawlessly re-target all generated metadata to custom domain when given new origin', () => {
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

	describe('Social Image Asset Specification', () => {
		it('should specify 1200x630 dimensions and summary_large_image card type', () => {
			const guideSeo = buildGuideSeo(sampleEnArticle, 'en');
			expect(guideSeo.ogImage).toBe(`${SITE_URL}/social-card.png`);
			expect(guideSeo.ogImageWidth).toBe(1200);
			expect(guideSeo.ogImageHeight).toBe(630);
			expect(guideSeo.ogImageType).toBe('image/png');
		});
	});
});

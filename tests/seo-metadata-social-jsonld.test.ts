import { describe, it, expect } from 'vitest';
import {
	SITE_URL,
	SITE_NAME,
	DEFAULT_OG_IMAGE,
	buildHomepageSeo,
	buildHandbookSeo,
	buildGuideSeo,
	buildCategoriesIndexSeo,
	buildCategorySeo,
	buildEmergencySeo,
	buildStaticPageSeo,
	buildRandomSeo,
	buildWebSiteSchema,
	buildArticleSchema,
	buildBreadcrumbSchema,
	serializeJsonLd
} from '../src/lib/seo';
import { loadAllArticles, getArticle, loadAllStaticPages } from '../src/lib/server/content';
import { CATEGORIES, type Category } from '../src/lib/types/content';

describe('SEO Pass 2B — Metadata, Social Discovery & Structured Trust Data', () => {
	const enArticles = loadAllArticles('en');
	const deArticles = loadAllArticles('de');

	describe('Homepage Metadata & WebSite Schema', () => {
		it('should generate localized homepage metadata and WebSite structured data', () => {
			const enSeo = buildHomepageSeo('en');
			expect(enSeo.title).toBe('Mostly Alive — A practical guide to remaining so');
			expect(enSeo.description).toContain('safety knowledge base');
			expect(enSeo.canonicalUrl).toBe(`${SITE_URL}/en`);
			expect(enSeo.type).toBe('website');
			expect(enSeo.ogImage).toBe(DEFAULT_OG_IMAGE);

			const deSeo = buildHomepageSeo('de');
			expect(deSeo.title).toBe('Mostly Alive — Praktischer Überlebensleitfaden');
			expect(deSeo.description).toContain('Sicherheitskompendium');
			expect(deSeo.canonicalUrl).toBe(`${SITE_URL}/de`);

			const schema = buildWebSiteSchema('en');
			expect(schema['@type']).toBe('WebSite');
			expect(schema.name).toBe(SITE_NAME);
			expect(schema.url).toBe(`${SITE_URL}/en`);
			expect(schema.inLanguage).toEqual(['en', 'de']);

			// Ensure valid JSON serialization
			const json = serializeJsonLd(schema);
			expect(() => JSON.parse(json)).not.toThrow();
		});
	});

	describe('Guide Articles Metadata & Article JSON-LD', () => {
		it('should generate Article JSON-LD with truthful dateModified and citations for all 102 articles', () => {
			expect(enArticles.length).toBe(51);
			expect(deArticles.length).toBe(51);

			for (const article of [...enArticles, ...deArticles]) {
				const seo = buildGuideSeo(article, article.lang);

				// Title preserves memorable human title
				expect(seo.title).toBe(`${article.title} — Mostly Alive`);
				expect(seo.type).toBe('article');
				expect(seo.canonicalUrl).toBe(`${SITE_URL}/${article.lang}/guide/${article.slug}`);
				expect(seo.ogImage).toBe(DEFAULT_OG_IMAGE);

				// Structured data validation
				expect(Array.isArray(seo.jsonLd)).toBe(true);
				const [articleSchema, breadcrumbSchema] = seo.jsonLd as [any, any];

				// Article Schema
				expect(articleSchema['@type']).toBe('Article');
				expect(articleSchema.headline).toBe(article.title);
				expect(articleSchema.inLanguage).toBe(article.lang);
				expect(articleSchema.mainEntityOfPage).toBe(`${SITE_URL}/${article.lang}/guide/${article.slug}`);
				expect(articleSchema.articleSection).toBe(article.category);

				// Truthful Provenance: dateModified = reviewed_at
				if (article.reviewed_at) {
					expect(articleSchema.dateModified).toBe(article.reviewed_at);
				}

				// Citations from sources
				if (article.sources && article.sources.length > 0) {
					expect(articleSchema.citation).toEqual(article.sources.map((s) => s.url));
				}

				// Critical Integrity Check: No fabricated author, medical reviewer, or publisher
				expect(articleSchema.author).toBeUndefined();
				expect(articleSchema.publisher).toBeUndefined();
				expect(articleSchema.datePublished).toBeUndefined();

				// BreadcrumbList Schema
				expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
				expect(breadcrumbSchema.itemListElement.length).toBe(4);
				expect(breadcrumbSchema.itemListElement[0].item).toBe(`${SITE_URL}/${article.lang}`);
				expect(breadcrumbSchema.itemListElement[1].item).toBe(`${SITE_URL}/${article.lang}/guide`);
				expect(breadcrumbSchema.itemListElement[2].item).toBe(
					`${SITE_URL}/${article.lang}/categories/${article.category}`
				);
				expect(breadcrumbSchema.itemListElement[3].item).toBe(
					`${SITE_URL}/${article.lang}/guide/${article.slug}`
				);

				// JSON serialization safety check
				const serialized = serializeJsonLd(seo.jsonLd!);
				expect(() => JSON.parse(serialized)).not.toThrow();
			}
		});

		it('should expose distinct localized context on hair-suddenly-vertical and blood-sugar', () => {
			const enLightning = getArticle('hair-suddenly-vertical', 'en')!;
			const deLightning = getArticle('hair-suddenly-vertical', 'de')!;
			const enSugar = getArticle('blood-sugar-has-left-the-chat', 'en')!;
			const deSugar = getArticle('blood-sugar-has-left-the-chat', 'de')!;

			const enLightningSeo = buildGuideSeo(enLightning, 'en');
			const deLightningSeo = buildGuideSeo(deLightning, 'de');
			expect(enLightningSeo.title).toBe('Hair, Suddenly Vertical — Mostly Alive');
			expect(deLightningSeo.title).toBe('Haare stehen plötzlich senkrecht zu Berge — Mostly Alive');
			expect(enLightningSeo.description).toContain('electrostatic');
			expect(deLightningSeo.description).toContain('Elektrostatische');

			const enSugarSeo = buildGuideSeo(enSugar, 'en');
			const deSugarSeo = buildGuideSeo(deSugar, 'de');
			expect(enSugarSeo.title).toBe('Blood Sugar Has Left the Chat — Mostly Alive');
			expect(deSugarSeo.title).toBe('Blutzucker hat den Chat verlassen — Mostly Alive');
			expect(enSugarSeo.description.toLowerCase()).toContain('hypoglycemia');
			expect(deSugarSeo.description.toLowerCase()).toContain('hypoglykämie');
		});
	});

	describe('Handbook & Category Metadata and Breadcrumbs', () => {
		it('should generate descriptive category metadata and 3-tier breadcrumbs', () => {
			for (const cat of Object.keys(CATEGORIES) as Category[]) {
				const enCatSeo = buildCategorySeo(cat, 'en');
				const deCatSeo = buildCategorySeo(cat, 'de');

				expect(enCatSeo.canonicalUrl).toBe(`${SITE_URL}/en/categories/${cat}`);
				expect(deCatSeo.canonicalUrl).toBe(`${SITE_URL}/de/categories/${cat}`);
				expect(enCatSeo.type).toBe('website');
				expect(enCatSeo.description.length).toBeGreaterThan(15);
				expect(deCatSeo.description.length).toBeGreaterThan(15);

				const enBreadcrumb = enCatSeo.jsonLd as any;
				expect(enBreadcrumb['@type']).toBe('BreadcrumbList');
				expect(enBreadcrumb.itemListElement.length).toBe(3);
				expect(enBreadcrumb.itemListElement[0].name).toBe('Home');
				expect(enBreadcrumb.itemListElement[1].name).toBe('Categories');

				const deBreadcrumb = deCatSeo.jsonLd as any;
				expect(deBreadcrumb.itemListElement[0].name).toBe('Startseite');
				expect(deBreadcrumb.itemListElement[1].name).toBe('Kategorien');
			}
		});

		it('should generate handbook directory metadata with 2-tier breadcrumbs', () => {
			const enHandbookSeo = buildHandbookSeo('en');
			expect(enHandbookSeo.title).toContain('Guide Directory');
			expect(enHandbookSeo.canonicalUrl).toBe(`${SITE_URL}/en/guide`);
			expect(enHandbookSeo.jsonLd).toBeDefined();

			const deHandbookSeo = buildHandbookSeo('de');
			expect(deHandbookSeo.title).toContain('Vollständiges Handbuch');
			expect(deHandbookSeo.canonicalUrl).toBe(`${SITE_URL}/de/guide`);
		});
	});

	describe('Emergency & Static Pages Metadata', () => {
		it('should generate emergency mode metadata with fast-scan description', () => {
			const enEmergencySeo = buildEmergencySeo('en');
			expect(enEmergencySeo.title).toContain('Emergency Fast Scan');
			expect(enEmergencySeo.canonicalUrl).toBe(`${SITE_URL}/en/emergency`);

			const deEmergencySeo = buildEmergencySeo('de');
			expect(deEmergencySeo.title).toContain('Notfall-Schnellhilfe');
			expect(deEmergencySeo.canonicalUrl).toBe(`${SITE_URL}/de/emergency`);
		});

		it('should generate metadata for all static Trust Center pages', () => {
			const staticPagesEn = loadAllStaticPages('en');
			for (const page of staticPagesEn) {
				const seo = buildStaticPageSeo(page, 'en');
				expect(seo.title).toBe(`${page.title} — Mostly Alive`);
				expect(seo.canonicalUrl).toBe(`${SITE_URL}/en/${page.slug}`);
				expect(seo.type).toBe('website');
				expect(seo.jsonLd).toBeDefined();
			}
		});
	});

	describe('Utility / Internal Route Exclusions', () => {
		it('should configure random route as noindex, follow without Article schema', () => {
			const enRandom = buildRandomSeo('en');
			expect(enRandom.robots).toBe('noindex, follow');
			expect(enRandom.canonicalUrl).toBe(`${SITE_URL}/en/random`);
			expect(enRandom.jsonLd).toBeUndefined();

			const deRandom = buildRandomSeo('de');
			expect(deRandom.robots).toBe('noindex, follow');
			expect(deRandom.canonicalUrl).toBe(`${SITE_URL}/de/random`);
			expect(deRandom.jsonLd).toBeUndefined();
		});
	});
});

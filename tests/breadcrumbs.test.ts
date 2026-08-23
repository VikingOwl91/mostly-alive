import { describe, it, expect } from 'vitest';
import {
	buildGuideBreadcrumbs,
	buildCategoryBreadcrumbs,
	buildHandbookBreadcrumbs,
	buildStaticPageBreadcrumbs,
	buildBreadcrumbSchema,
	SITE_URL
} from '../src/lib/seo';
import { loadAllArticles, loadAllStaticPages } from '../src/lib/server/content';

describe('SEO Pass 2C — Breadcrumb Consistency (Visible UI + JSON-LD)', () => {
	const [enArticle] = loadAllArticles('en');
	const [deArticle] = loadAllArticles('de');
	const [enPage] = loadAllStaticPages('en');

	it('should maintain 1:1 parity between visible breadcrumb model and JSON-LD BreadcrumbList', () => {
		const items = buildGuideBreadcrumbs(enArticle, 'en');
		const schema = buildBreadcrumbSchema(items);

		expect(schema['@type']).toBe('BreadcrumbList');
		expect(schema.itemListElement.length).toBe(items.length);

		for (let i = 0; i < items.length; i++) {
			expect(schema.itemListElement[i].position).toBe(i + 1);
			expect(schema.itemListElement[i].name).toBe(items[i].name);
			expect(schema.itemListElement[i].item).toBe(items[i].url);
		}
	});

	it('should correctly localize breadcrumb names for German routes', () => {
		const deItems = buildGuideBreadcrumbs(deArticle, 'de');
		expect(deItems[0].name).toBe('Startseite');
		expect(deItems[1].name).toBe('Handbuch');
		expect(deItems[0].url).toBe(`${SITE_URL}/de`);
		expect(deItems[1].url).toBe(`${SITE_URL}/de/guide`);
	});

	it('should generate valid hierarchy for category and static pages', () => {
		const catItems = buildCategoryBreadcrumbs('medical', 'en');
		expect(catItems.length).toBe(3);
		expect(catItems[0].name).toBe('Home');
		expect(catItems[1].name).toBe('Categories');
		expect(catItems[2].name).toBe('Medical Basics & First Aid');

		const pageItems = buildStaticPageBreadcrumbs(enPage, 'en');
		expect(pageItems.length).toBe(2);
		expect(pageItems[0].name).toBe('Home');
		expect(pageItems[1].name).toBe(enPage.title);
	});
});

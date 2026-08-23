import { describe, it, expect } from 'vitest';
import {
	loadAllArticles,
	loadAllStaticPages,
	getArticle,
	getStaticPage,
	getArticlesByCategory,
	getRandomArticle
} from '../src/lib/server/content';

describe('Cloudflare Production Content Loader (Build-Time Embedded)', () => {
	it('should contain all 15 EN articles without filesystem access', () => {
		const articles = loadAllArticles('en');
		expect(articles.length).toBe(15);
		const slugs = articles.map((a) => a.slug);
		expect(slugs).toContain('person-currently-choking');
		expect(slugs).toContain('hair-suddenly-vertical');
		expect(slugs).toContain('oil-currently-on-fire');
		expect(slugs).toContain('carbon-monoxide-quietly-ruining-everyones-afternoon');
		expect(slugs).toContain('power-line-inconveniently-on-the-ground');
	});

	it('should contain all 15 DE articles without filesystem access', () => {
		const articles = loadAllArticles('de');
		expect(articles.length).toBe(15);
		const slugs = articles.map((a) => a.slug);
		expect(slugs).toContain('person-currently-choking');
		expect(slugs).toContain('hair-suddenly-vertical');
		expect(slugs).toContain('oil-currently-on-fire');
		expect(slugs).toContain('carbon-monoxide-quietly-ruining-everyones-afternoon');
		expect(slugs).toContain('power-line-inconveniently-on-the-ground');
	});

	it('should contain all 10 EN static trust and legal pages', () => {
		const pages = loadAllStaticPages('en');
		expect(pages.length).toBe(10);
		const slugs = pages.map((p) => p.slug);
		expect(slugs).toContain('about');
		expect(slugs).toContain('methodology');
		expect(slugs).toContain('sources');
		expect(slugs).toContain('editorial-policy');
		expect(slugs).toContain('contributing');
		expect(slugs).toContain('imprint');
		expect(slugs).toContain('privacy');
		expect(slugs).toContain('terms');
		expect(slugs).toContain('security');
		expect(slugs).toContain('accessibility');
	});

	it('should contain all 10 DE static trust and legal pages', () => {
		const pages = loadAllStaticPages('de');
		expect(pages.length).toBe(10);
		const slugs = pages.map((p) => p.slug);
		expect(slugs).toContain('about');
		expect(slugs).toContain('methodology');
		expect(slugs).toContain('sources');
		expect(slugs).toContain('editorial-policy');
		expect(slugs).toContain('contributing');
		expect(slugs).toContain('imprint');
		expect(slugs).toContain('privacy');
		expect(slugs).toContain('terms');
		expect(slugs).toContain('security');
		expect(slugs).toContain('accessibility');
	});

	it('should resolve representative article routes with complete HTML and metadata', () => {
		const chokingEn = getArticle('person-currently-choking', 'en');
		expect(chokingEn).not.toBeNull();
		expect(chokingEn?.title).toBe('Person, Currently Choking');
		expect(chokingEn?.category).toBe('medical');
		expect(chokingEn?.html).toContain('Back Blows');
		expect(chokingEn?.immediate_action.length).toBeGreaterThan(0);

		const chokingDe = getArticle('person-currently-choking', 'de');
		expect(chokingDe).not.toBeNull();
		expect(chokingDe?.title).toBe('Person, derzeit erstickend');
		expect(chokingDe?.html).toContain('Rückenschläge');

		const hairEn = getArticle('hair-suddenly-vertical', 'en');
		expect(hairEn).not.toBeNull();
		expect(hairEn?.threat_level).toBe(5);
	});

	it('should resolve representative static legal/trust pages with complete HTML', () => {
		const methodologyEn = getStaticPage('methodology', 'en');
		expect(methodologyEn).not.toBeNull();
		expect(methodologyEn?.title).toContain('Methodology');
		expect(methodologyEn?.html).toContain('Source Supremacy');

		const privacyDe = getStaticPage('privacy', 'de');
		expect(privacyDe).not.toBeNull();
		expect(privacyDe?.title).toBe('Datenschutzerklärung');
		expect(privacyDe?.html).toContain('Cloudflare');

		const imprintEn = getStaticPage('imprint', 'en');
		expect(imprintEn).not.toBeNull();
		expect(imprintEn?.html).toContain('Christian Nachtigall');
	});

	it('should support category filtering and random article sampling', () => {
		const weatherArticles = getArticlesByCategory('weather', 'en');
		expect(weatherArticles.length).toBeGreaterThan(0);
		for (const a of weatherArticles) {
			expect(a.category).toBe('weather');
		}

		const randomArticle = getRandomArticle('en');
		expect(randomArticle).not.toBeNull();
		expect(randomArticle?.slug).toBeDefined();
	});
});

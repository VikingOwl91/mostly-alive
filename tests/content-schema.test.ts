import { describe, it, expect } from 'vitest';
import { loadAllArticles, getArticle, getStaticPage } from '../src/lib/server/content';
import { ArticleFrontmatterSchema } from '../src/lib/types/content';

describe('Content Schema & Integrity', () => {
	it('should load all 15 Priority 0 articles in English', () => {
		const articles = loadAllArticles('en');
		expect(articles.length).toBeGreaterThanOrEqual(15);
		for (const article of articles) {
			const parsed = ArticleFrontmatterSchema.safeParse(article);
			expect(parsed.success).toBe(true);
			expect(article.immediate_action.length).toBeGreaterThan(0);
			expect(article.sources.length).toBeGreaterThan(0);
		}
	});

	it('should load all 15 Priority 0 articles in German', () => {
		const articles = loadAllArticles('de');
		expect(articles.length).toBeGreaterThanOrEqual(15);
		for (const article of articles) {
			const parsed = ArticleFrontmatterSchema.safeParse(article);
			expect(parsed.success).toBe(true);
			expect(article.immediate_action.length).toBeGreaterThan(0);
			expect(article.sources.length).toBeGreaterThan(0);
		}
	});

	it('should have complete slug parity between EN and DE', () => {
		const enArticles = loadAllArticles('en');
		const deArticles = loadAllArticles('de');

		const enSlugs = new Set(enArticles.map((a) => a.slug));
		const deSlugs = new Set(deArticles.map((a) => a.slug));

		expect(enSlugs.size).toBe(deSlugs.size);
		for (const slug of enSlugs) {
			expect(deSlugs.has(slug)).toBe(true);
		}
	});

	it('should enforce authoritative sources on reviewed articles', () => {
		const all = loadAllArticles();
		for (const article of all) {
			if (article.status === 'reviewed') {
				const authoritative = article.sources.filter((s) => s.authoritative);
				expect(authoritative.length).toBeGreaterThan(0);
				expect(article.reviewed_at).toBeDefined();
				expect(article.reviewer).toBeDefined();
			}
		}
	});

	it('should retrieve individual articles by slug', () => {
		const article = getArticle('hair-suddenly-vertical', 'en');
		expect(article).not.toBeNull();
		expect(article?.slug).toBe('hair-suddenly-vertical');
		expect(article?.category).toBe('weather');
		expect(article?.threat_level).toBe(5);
	});

	it('should load static legal and trust pages', () => {
		const about = getStaticPage('about', 'en');
		expect(about).not.toBeNull();
		expect(about?.title).toContain('About Mostly Alive');

		const methodology = getStaticPage('methodology', 'de');
		expect(methodology).not.toBeNull();
		expect(methodology?.title).toContain('Methodik');
	});
});

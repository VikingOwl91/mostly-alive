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

	it('should validate structured immediate action steps with substeps and variants', () => {
		const anaphylaxisEn = getArticle('allergy-escalating-rather-quickly', 'en');
		expect(anaphylaxisEn).not.toBeNull();
		expect(anaphylaxisEn?.immediate_action.length).toBe(4);

		// First step has substeps
		const step1 = anaphylaxisEn?.immediate_action[0] as any;
		expect(typeof step1).toBe('object');
		expect(step1.title).toBe('INJECT EPINEPHRINE (ADRENALINE) IMMEDIATELY');
		expect(step1.substeps).toBeDefined();
		expect(step1.substeps.length).toBeGreaterThan(0);

		// Third step has variants
		const step3 = anaphylaxisEn?.immediate_action[2] as any;
		expect(typeof step3).toBe('object');
		expect(step3.variants).toBeDefined();
		expect(step3.variants.length).toBe(4);
		expect(step3.variants[0].condition).toBe('Faint / Pale / Shock');
	});
});


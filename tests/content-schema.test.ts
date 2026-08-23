import { describe, it, expect } from 'vitest';
import { loadAllArticles, getArticle } from '../src/lib/server/content';
import { ArticleFrontmatterSchema, type ImmediateActionStep } from '../src/lib/types/content';

describe('Content Schema & Action Hierarchy Integrity', () => {
	it('should load all 50 survival guides in English', () => {
		const articles = loadAllArticles('en');
		expect(articles.length).toBe(50);
		for (const article of articles) {
			const parsed = ArticleFrontmatterSchema.safeParse(article);
			expect(parsed.success).toBe(true);
			expect(article.immediate_action.length).toBeGreaterThanOrEqual(2);
			expect(article.immediate_action.length).toBeLessThanOrEqual(5);
			expect(article.sources.length).toBeGreaterThan(0);
		}
	});

	it('should load all 50 survival guides in German', () => {
		const articles = loadAllArticles('de');
		expect(articles.length).toBe(50);
		for (const article of articles) {
			const parsed = ArticleFrontmatterSchema.safeParse(article);
			expect(parsed.success).toBe(true);
			expect(article.immediate_action.length).toBeGreaterThanOrEqual(2);
			expect(article.immediate_action.length).toBeLessThanOrEqual(5);
			expect(article.sources.length).toBeGreaterThan(0);
		}
	});

	it('should have 100% slug and structural action parity between EN and DE', () => {
		const enArticles = loadAllArticles('en');
		const deArticles = loadAllArticles('de');

		const enMap = new Map(enArticles.map((a) => [a.slug, a]));
		const deMap = new Map(deArticles.map((a) => [a.slug, a]));

		expect(enMap.size).toBe(50);
		expect(deMap.size).toBe(50);

		for (const [slug, enArticle] of enMap) {
			const deArticle = deMap.get(slug);
			expect(deArticle).toBeDefined();

			// Exact primary action count parity
			expect(enArticle.immediate_action.length).toBe(deArticle!.immediate_action.length);

			// All items must be structured objects
			for (let i = 0; i < enArticle.immediate_action.length; i++) {
				const enStep = enArticle.immediate_action[i] as ImmediateActionStep;
				const deStep = deArticle!.immediate_action[i] as ImmediateActionStep;

				expect(typeof enStep).toBe('object');
				expect(typeof deStep).toBe('object');
				expect(enStep.title.length).toBeGreaterThan(0);
				expect(deStep.title.length).toBeGreaterThan(0);
				expect(enStep.instruction.length).toBeGreaterThan(0);
				expect(deStep.instruction.length).toBeGreaterThan(0);

				if (enStep.substeps) {
					expect(deStep.substeps).toBeDefined();
					expect(enStep.substeps.length).toBe(deStep.substeps!.length);
				}

				if (enStep.variants) {
					expect(deStep.variants).toBeDefined();
					expect(enStep.variants.length).toBe(deStep.variants!.length);
				}
			}
		}
	});

	it('should enforce authoritative sources on all reviewed articles', () => {
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

	it('should retrieve structured individual articles by slug', () => {
		const article = getArticle('hair-suddenly-vertical', 'en');
		expect(article).not.toBeNull();
		expect(article?.slug).toBe('hair-suddenly-vertical');
		expect(article?.category).toBe('weather');
		expect(article?.threat_level).toBe(5);
		expect(article?.immediate_action.length).toBe(3);

		const step1 = article?.immediate_action[0] as ImmediateActionStep;
		expect(step1.title).toBe('LEAVE EXPOSED TERRAIN IMMEDIATELY');
		expect(step1.substeps?.length).toBe(2);
	});
});

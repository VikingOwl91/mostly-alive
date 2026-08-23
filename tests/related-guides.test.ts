import { describe, it, expect } from 'vitest';
import { loadAllArticles, getArticle, getRelatedArticles } from '../src/lib/server/content';

describe('SEO Pass 2C — Related Guides & Internal Linkage', () => {
	const enArticles = loadAllArticles('en');
	const deArticles = loadAllArticles('de');

	describe('Related Guides Ranking & Link Invariants', () => {
		it('should generate exactly 3 deterministic related guides for all 100 articles without self-links', () => {
			expect(enArticles.length).toBe(51);
			expect(deArticles.length).toBe(51);

			for (const article of enArticles) {
				const related = getRelatedArticles(article, 'en', 3);
				expect(related.length).toBe(3);

				// No self-links
				expect(related.some((r) => r.slug === article.slug)).toBe(false);

				// Language isolation
				for (const r of related) {
					expect(r.lang).toBe('en');
				}
			}

			for (const article of deArticles) {
				const related = getRelatedArticles(article, 'de', 3);
				expect(related.length).toBe(3);

				// No self-links
				expect(related.some((r) => r.slug === article.slug)).toBe(false);

				// Language isolation
				for (const r of related) {
					expect(r.lang).toBe('de');
				}
			}
		});

		it('should establish semantic topic connections for key high-value emergency hazards', () => {
			// Hair Suddenly Vertical -> Tree Suspiciously Alone During a Thunderstorm
			const hairVertical = getArticle('hair-suddenly-vertical', 'en')!;
			const relatedLightning = getRelatedArticles(hairVertical, 'en', 3);
			const slugs = relatedLightning.map((r) => r.slug);
			expect(slugs).toContain('tree-suspiciously-alone-during-a-thunderstorm');

			// Floodwater Looking Surprisingly Drivable -> Car Unexpectedly Becoming a Boat
			const floodwater = getArticle('floodwater-looking-surprisingly-drivable', 'en')!;
			const relatedFlood = getRelatedArticles(floodwater, 'en', 3);
			const floodSlugs = relatedFlood.map((r) => r.slug);
			expect(floodSlugs).toContain('car-unexpectedly-becoming-a-boat');
		});

		it('should preserve EN/DE related guide parity', () => {
			for (const enArticle of enArticles) {
				const deArticle = getArticle(enArticle.slug, 'de')!;
				const enRelated = getRelatedArticles(enArticle, 'en', 3).map((r) => r.slug);
				const deRelated = getRelatedArticles(deArticle, 'de', 3).map((r) => r.slug);

				expect(enRelated).toEqual(deRelated);
			}
		});
	});
});

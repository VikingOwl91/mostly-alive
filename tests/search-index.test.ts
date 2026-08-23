import { describe, it, expect } from 'vitest';
import MiniSearch from 'minisearch';
import { getSearchIndex } from '../src/lib/server/content';

describe('Search Index Engine', () => {
	it('should generate valid search index documents for EN', () => {
		const raw = getSearchIndex('en');
		expect(raw.length).toBeGreaterThanOrEqual(15);

		const mini = new MiniSearch({
			fields: [
				'title',
				'subtitle',
				'aliases',
				'tags',
				'memory_hook',
				'immediate_action',
				'bodySnippet'
			],
			storeFields: ['slug', 'title', 'category'],
			searchOptions: {
				prefix: true,
				fuzzy: 0.2
			}
		});
		mini.addAll(raw);

		// Test exact title search
		const results1 = mini.search('lightning');
		expect(results1.length).toBeGreaterThan(0);
		expect(results1.some((r) => r.slug === 'hair-suddenly-vertical')).toBe(true);

		// Test colloquial alias search
		const results2 = mini.search('oil fire');
		expect(results2.length).toBeGreaterThan(0);
		expect(results2.some((r) => r.slug === 'oil-currently-on-fire')).toBe(true);

		// Test symptom search
		const results3 = mini.search('choking');
		expect(results3.length).toBeGreaterThan(0);
		expect(results3.some((r) => r.slug === 'person-currently-choking')).toBe(true);
	});

	it('should generate valid search index documents for DE', () => {
		const raw = getSearchIndex('de');
		expect(raw.length).toBeGreaterThanOrEqual(15);

		const mini = new MiniSearch({
			fields: [
				'title',
				'subtitle',
				'aliases',
				'tags',
				'memory_hook',
				'immediate_action',
				'bodySnippet'
			],
			storeFields: ['slug', 'title', 'category'],
			searchOptions: {
				prefix: true,
				fuzzy: 0.2
			}
		});
		mini.addAll(raw);

		const results1 = mini.search('Fettbrand');
		expect(results1.length).toBeGreaterThan(0);
		expect(results1.some((r) => r.slug === 'oil-currently-on-fire')).toBe(true);

		const results2 = mini.search('Gewitter');
		expect(results2.length).toBeGreaterThan(0);
	});
});

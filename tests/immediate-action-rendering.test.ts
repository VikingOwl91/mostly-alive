import { describe, it, expect } from 'vitest';
import { loadAllArticles, getArticle, getSearchIndex } from '../src/lib/server/content';
import {
	normalizeImmediateAction,
	getImmediateActionPreview,
	flattenImmediateActionForSearch,
	type ImmediateActionStep,
	type ImmediateActionItem
} from '../src/lib/types/content';

describe('Structured Immediate Action Rendering & Consumer Safety', () => {
	const enArticles = loadAllArticles('en');
	const deArticles = loadAllArticles('de');

	describe('Normalization & Preview Helpers', () => {
		it('should normalize structured steps correctly', () => {
			const structured: ImmediateActionStep = {
				title: 'SEEK SHELTER',
				instruction: 'Enter an enclosed building.',
				substeps: ['Avoid trees.', 'Stay off ridges.'],
				variants: [{ condition: 'No shelter', action: 'Adopt lightning crouch.' }],
				note: 'Critical safety note.'
			};

			const normalized = normalizeImmediateAction(structured);
			expect(normalized.title).toBe('SEEK SHELTER');
			expect(normalized.instruction).toBe('Enter an enclosed building.');
			expect(normalized.substeps).toHaveLength(2);
			expect(normalized.variants).toHaveLength(1);
			expect(normalized.note).toBe('Critical safety note.');
		});

		it('should normalize legacy formatted strings correctly', () => {
			const legacyNumbered = '1. CALL DISPATCH: Immediately dial 911.';
			const normalized1 = normalizeImmediateAction(legacyNumbered);
			expect(normalized1.title).toBe('CALL DISPATCH');
			expect(normalized1.instruction).toBe('Immediately dial 911.');

			const legacySimple = 'Apply Tourniquet: Place high and tight on extremity.';
			const normalized2 = normalizeImmediateAction(legacySimple);
			expect(normalized2.title).toBe('Apply Tourniquet');
			expect(normalized2.instruction).toBe('Place high and tight on extremity.');

			const flatText = 'Run in a straight line away from danger.';
			const normalized3 = normalizeImmediateAction(flatText);
			expect(normalized3.title).toBe('');
			expect(normalized3.instruction).toBe('Run in a straight line away from danger.');
		});

		it('should safely handle empty or null values', () => {
			expect(normalizeImmediateAction(undefined as any)).toEqual({ title: '', instruction: '' });
			expect(normalizeImmediateAction(null as any)).toEqual({ title: '', instruction: '' });
			expect(getImmediateActionPreview(undefined)).toEqual({ title: '', instruction: '', formatted: '' });
		});

		it('should produce clean human-readable preview for real article fixtures', () => {
			// Real fixture: Blood Sugar Has Left the Chat (EN)
			const enBloodSugar = getArticle('blood-sugar-has-left-the-chat', 'en');
			expect(enBloodSugar).toBeDefined();
			const enPreview = getImmediateActionPreview(enBloodSugar!.immediate_action[0]);
			expect(enPreview.title).toBe('ASSESS CONSCIOUSNESS & SWALLOWING REFLEX');
			expect(enPreview.instruction).toContain('Determine if the person can safely swallow');
			expect(enPreview.formatted).not.toContain('[object Object]');
			expect(enPreview.formatted).toBe(
				'ASSESS CONSCIOUSNESS & SWALLOWING REFLEX: Determine if the person can safely swallow without risk of fatal aspiration:'
			);

			// Real fixture: Blood Sugar Has Left the Chat (DE)
			const deBloodSugar = getArticle('blood-sugar-has-left-the-chat', 'de');
			expect(deBloodSugar).toBeDefined();
			const dePreview = getImmediateActionPreview(deBloodSugar!.immediate_action[0]);
			expect(dePreview.title).toBe('BEWUSSTSEIN & SCHLUCKREFLEX PRÜFEN');
			expect(dePreview.instruction).toContain('Überprüfen, ob die Person gefahrlos schlucken kann');
			expect(dePreview.formatted).not.toContain('[object Object]');

			// Real fixture: Large Reptile (EN & DE)
			const enReptile = getArticle('large-reptile-has-decided-you-are-relevant', 'en');
			expect(enReptile).toBeDefined();
			const enReptilePreview = getImmediateActionPreview(enReptile!.immediate_action[0]);
			expect(enReptilePreview.title).toBe('BREAK THE WATER BOUNDARY IMMEDIATELY');
			expect(enReptilePreview.formatted).not.toContain('[object Object]');

			const deReptile = getArticle('large-reptile-has-decided-you-are-relevant', 'de');
			expect(deReptile).toBeDefined();
			const deReptilePreview = getImmediateActionPreview(deReptile!.immediate_action[0]);
			expect(deReptilePreview.title).toBe('DIE WASSERKANTE SOFORT VERLASSEN');
			expect(deReptilePreview.formatted).not.toContain('[object Object]');
		});
	});

	describe('Repository-Wide Immediate Action Stringification Invariant Gate', () => {
		it('should verify that all 102 articles produce non-empty, clean previews without [object Object]', () => {
			expect(enArticles.length).toBe(51);
			expect(deArticles.length).toBe(51);

			const allArticles = [...enArticles, ...deArticles];

			for (const article of allArticles) {
				expect(article.immediate_action.length).toBeGreaterThanOrEqual(1);

				for (let i = 0; i < article.immediate_action.length; i++) {
					const action = article.immediate_action[i];
					const preview = getImmediateActionPreview(action);

					// Must have a meaningful instruction or title
					expect(
						preview.instruction.length + preview.title.length,
						`Article "${article.slug}" (${article.lang}) action step ${i} must have text`
					).toBeGreaterThan(0);

					// Must NEVER contain [object Object]
					expect(preview.title).not.toContain('[object Object]');
					expect(preview.instruction).not.toContain('[object Object]');
					expect(preview.formatted).not.toContain('[object Object]');

					// Search flattening must also NEVER contain [object Object]
					const searchStr = flattenImmediateActionForSearch(action);
					expect(searchStr).not.toContain('[object Object]');
					expect(searchStr.length).toBeGreaterThan(0);
				}
			}
		});
	});

	describe('Search Index Engine Safety', () => {
		it('should ensure all indexed articles contain plain string actions without [object Object]', () => {
			for (const lang of ['en', 'de'] as const) {
				const index = getSearchIndex(lang);
				expect(index.length).toBeGreaterThanOrEqual(51);

				for (const item of index) {
					expect(typeof item.immediate_action).toBe('string');
					expect(item.immediate_action).not.toContain('[object Object]');
				}
			}
		});
	});

	describe('Random Entry Simulation', () => {
		it('should simulate random page preview rendering for all articles and guarantee clean presentation', () => {
			for (const article of [...enArticles, ...deArticles]) {
				const primary = getImmediateActionPreview(article.immediate_action[0]);

				// Check what would be rendered in Random Entry card
				const renderedPreview = `
					${primary.title ? `TITLE: ${primary.title}` : ''}
					${primary.instruction ? `INSTRUCTION: ${primary.instruction}` : ''}
				`.trim();

				expect(renderedPreview).not.toContain('[object Object]');
				expect(renderedPreview.length).toBeGreaterThan(10);
				expect(primary.instruction).not.toContain('substeps');
				expect(primary.instruction).not.toContain('variants');
			}
		});
	});
});

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { EMERGENCY_REGISTRY } from '../src/lib/types/emergency';

describe('Mobile UI/UX & Emergency Usability Audit Suite', () => {
	it('includes proper mobile viewport and safe area configuration in app.html', () => {
		const appHtmlPath = path.resolve('src/app.html');
		const appHtml = fs.readFileSync(appHtmlPath, 'utf-8');

		expect(appHtml).toContain('name="viewport"');
		expect(appHtml).toContain('width=device-width');
		expect(appHtml).toContain('initial-scale=1');
		expect(appHtml).toContain('viewport-fit=cover');
	});

	it('configures global css with safe-area insets, dvh height, and word-break rules in app.css', () => {
		const appCssPath = path.resolve('src/app.css');
		const appCss = fs.readFileSync(appCssPath, 'utf-8');

		// Safe areas
		expect(appCss).toContain('safe-area-inset-top');
		expect(appCss).toContain('safe-area-inset-bottom');
		expect(appCss).toContain('safe-area-inset-left');
		expect(appCss).toContain('safe-area-inset-right');

		// Text size adjust & overflow containment
		expect(appCss).toContain('-webkit-text-size-adjust: 100%');
		expect(appCss).toContain('overflow-x: hidden');
		expect(appCss).toContain('100dvh');

		// Word break & hyphens for long German words
		expect(appCss).toContain('hyphens: auto');
		expect(appCss).toContain('overflow-wrap: break-word');
		expect(appCss).toContain('word-wrap: break-word');
	});

	it('provides valid emergency dispatch numbers across all registered countries', () => {
		expect(Object.keys(EMERGENCY_REGISTRY).length).toBeGreaterThanOrEqual(5);

		for (const [code, profile] of Object.entries(EMERGENCY_REGISTRY)) {
			expect(profile.generalEmergency).toMatch(/^[0-9+ ]+$/);
			expect(profile.countryName.en).toBeTruthy();
			expect(profile.countryName.de).toBeTruthy();
			expect(profile.officialSource.url).toMatch(/^https?:\/\//);
		}
	});

	it('ensures Emergency Mode page includes 8 core protocols and quick jump navigation', () => {
		const emergencyPagePath = path.resolve('src/routes/[lang]/emergency/+page.svelte');
		const emergencyPage = fs.readFileSync(emergencyPagePath, 'utf-8');

		// Quick jump anchors
		expect(emergencyPage).toContain('href="#cpr"');
		expect(emergencyPage).toContain('href="#choking"');
		expect(emergencyPage).toContain('href="#bleeding"');
		expect(emergencyPage).toContain('href="#anaphylaxis"');
		expect(emergencyPage).toContain('href="#stroke"');
		expect(emergencyPage).toContain('href="#heart-attack"');
		expect(emergencyPage).toContain('href="#asthma"');
		expect(emergencyPage).toContain('href="#oil-fire"');

		// Protocol IDs
		expect(emergencyPage).toContain('id="cpr"');
		expect(emergencyPage).toContain('id="choking"');
		expect(emergencyPage).toContain('id="bleeding"');
		expect(emergencyPage).toContain('id="anaphylaxis"');
		expect(emergencyPage).toContain('id="stroke"');
		expect(emergencyPage).toContain('id="heart-attack"');
		expect(emergencyPage).toContain('id="asthma"');
		expect(emergencyPage).toContain('id="oil-fire"');
	});

	it('verifies SearchModal has mobile keyboard friendliness and dynamic viewport bounds', () => {
		const searchModalPath = path.resolve('src/lib/components/SearchModal.svelte');
		const searchModal = fs.readFileSync(searchModalPath, 'utf-8');

		expect(searchModal).toContain('autocapitalize="none"');
		expect(searchModal).toContain('autocorrect="off"');
		expect(searchModal).toContain('spellcheck="false"');
		expect(searchModal).toContain('100dvh');
	});

	it('verifies Header provides touch-friendly targets and mobile emergency button', () => {
		const headerPath = path.resolve('src/lib/components/GuideHeader.svelte');
		const header = fs.readFileSync(headerPath, 'utf-8');

		expect(header).toContain('min-w-[44px]');
		expect(header).toContain('min-h-[44px]');
		expect(header).toContain('min-h-[48px]');
		expect(header).toContain('/emergency');
	});

	it('verifies Web Studio editor uses dvh viewport and touch tabs', () => {
		const editorPath = path.resolve('src/routes/editor/+page.svelte');
		const editor = fs.readFileSync(editorPath, 'utf-8');

		expect(editor).toContain('100dvh');
		expect(editor).toContain('activeTab');
	});
});

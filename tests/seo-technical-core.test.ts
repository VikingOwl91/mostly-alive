import { describe, it, expect } from 'vitest';
import {
	SITE_URL,
	buildCanonicalUrl,
	buildHreflangLinks,
	isIndexableRoute
} from '../src/lib/seo';
import { loadAllArticles, loadAllStaticPages } from '../src/lib/server/content';
import { CATEGORIES } from '../src/lib/types/content';
import { GET as getSitemap } from '../src/routes/sitemap.xml/+server';
import fs from 'node:fs';
import path from 'node:path';

describe('SEO Technical Core — Pass 2A', () => {
	describe('Canonical URL Infrastructure', () => {
		it('should build absolute HTTPS canonical URLs without query params or trailing slashes', () => {
			expect(buildCanonicalUrl('/en/guide/hair-suddenly-vertical?ref=twitter')).toBe(
				`${SITE_URL}/en/guide/hair-suddenly-vertical`
			);
			expect(buildCanonicalUrl('/de/guide/hair-suddenly-vertical/')).toBe(
				`${SITE_URL}/de/guide/hair-suddenly-vertical`
			);
			expect(buildCanonicalUrl('/en/categories/medical#symptoms')).toBe(
				`${SITE_URL}/en/categories/medical`
			);
			expect(buildCanonicalUrl('/en')).toBe(`${SITE_URL}/en`);
			expect(buildCanonicalUrl('/de')).toBe(`${SITE_URL}/de`);
		});

		it('should self-canonicalize random route without pointing to /guide', () => {
			const enRandom = buildCanonicalUrl('/en/random');
			const deRandom = buildCanonicalUrl('/de/random');
			expect(enRandom).toBe(`${SITE_URL}/en/random`);
			expect(deRandom).toBe(`${SITE_URL}/de/random`);
			expect(enRandom).not.toContain('/guide');
		});
	});

	describe('Hreflang Bilingual Alternates', () => {
		it('should generate reciprocal en, de, and x-default links for guide articles', () => {
			const links = buildHreflangLinks('/en/guide/hair-suddenly-vertical');
			expect(links.length).toBe(3);

			const enLink = links.find((l) => l.lang === 'en');
			const deLink = links.find((l) => l.lang === 'de');
			const xDefaultLink = links.find((l) => l.lang === 'x-default');

			expect(enLink?.href).toBe(`${SITE_URL}/en/guide/hair-suddenly-vertical`);
			expect(deLink?.href).toBe(`${SITE_URL}/de/guide/hair-suddenly-vertical`);
			expect(xDefaultLink?.href).toBe(`${SITE_URL}/en/guide/hair-suddenly-vertical`);
		});

		it('should generate identical reciprocal hreflang links when requested from German path', () => {
			const linksFromDe = buildHreflangLinks('/de/guide/hair-suddenly-vertical');
			const linksFromEn = buildHreflangLinks('/en/guide/hair-suddenly-vertical');

			expect(linksFromDe).toEqual(linksFromEn);
		});

		it('should not emit hreflang on non-localized paths', () => {
			expect(buildHreflangLinks('/editor/login')).toEqual([]);
			expect(buildHreflangLinks('/api/search-index.json')).toEqual([]);
		});
	});

	describe('Indexing Policy & Route Classification', () => {
		it('should identify public knowledge routes as indexable', () => {
			expect(isIndexableRoute('/en')).toBe(true);
			expect(isIndexableRoute('/de')).toBe(true);
			expect(isIndexableRoute('/en/guide')).toBe(true);
			expect(isIndexableRoute('/en/guide/hair-suddenly-vertical')).toBe(true);
			expect(isIndexableRoute('/de/categories/weather')).toBe(true);
			expect(isIndexableRoute('/en/emergency')).toBe(true);
			expect(isIndexableRoute('/en/methodology')).toBe(true);
		});

		it('should identify utility, internal, and api routes as non-indexable', () => {
			expect(isIndexableRoute('/en/random')).toBe(false);
			expect(isIndexableRoute('/de/random')).toBe(false);
			expect(isIndexableRoute('/editor')).toBe(false);
			expect(isIndexableRoute('/editor/login')).toBe(false);
			expect(isIndexableRoute('/api/search-index.json')).toBe(false);
			expect(isIndexableRoute('/')).toBe(false);
		});
	});

	describe('Robots.txt Configuration', () => {
		it('should have a static robots.txt file with valid crawler directives and sitemap reference', () => {
			const robotsPath = path.resolve('static/robots.txt');
			expect(fs.existsSync(robotsPath)).toBe(true);

			const content = fs.readFileSync(robotsPath, 'utf-8');
			expect(content).toContain('User-agent: *');
			expect(content).toContain('Allow: /');
			expect(content).toContain('Disallow: /editor/');
			expect(content).toContain('Disallow: /api/');
			expect(content).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
		});
	});

	describe('XML Sitemap Endpoint & Data Consistency', () => {
		it('should cover all published guide articles in both EN and DE', () => {
			const enArticles = loadAllArticles('en');
			const deArticles = loadAllArticles('de');
			expect(enArticles.length).toBe(50);
			expect(deArticles.length).toBe(50);
		});

		it('should include all populated categories and static Trust Center pages', () => {
			const categories = Object.values(CATEGORIES);
			expect(categories.length).toBeGreaterThanOrEqual(11);

			const staticPagesEn = loadAllStaticPages('en');
			expect(staticPagesEn.length).toBeGreaterThanOrEqual(10);
		});

		it('should generate valid XML sitemap response with HTTP 200 and application/xml header', async () => {
			const response = await getSitemap({} as any);
			expect(response.status).toBe(200);
			expect(response.headers.get('Content-Type')).toContain('application/xml');

			const xml = await response.text();
			expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
			expect(xml).toContain('<urlset');
			expect(xml).toContain(`${SITE_URL}/en/guide/hair-suddenly-vertical`);
			expect(xml).toContain(`${SITE_URL}/de/guide/hair-suddenly-vertical`);
			expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en"');
			expect(xml).toContain('<xhtml:link rel="alternate" hreflang="de"');
			expect(xml).toContain('<xhtml:link rel="alternate" hreflang="x-default"');

			// Must not contain excluded routes
			expect(xml).not.toContain('/random');
			expect(xml).not.toContain('/editor/');
			expect(xml).not.toContain('/editor<');
			expect(xml).not.toContain('/api/');
		});
	});
});

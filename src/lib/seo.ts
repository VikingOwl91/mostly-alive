/**
 * Mostly Alive — Centralized SEO & Metadata Infrastructure
 * Source of truth for canonical URLs, hreflang alternates, and indexing policies.
 */

export const SITE_URL = 'https://mostly-alive.christian-d81.workers.dev';

/**
 * Normalizes a URL pathname to a clean canonical absolute URL.
 * - Strips query parameters and hash fragments
 * - Normalizes trailing slashes (preserves '/' for root, strips trailing slash elsewhere)
 * - Returns absolute HTTPS URL
 */
export function buildCanonicalUrl(pathname: string): string {
	if (!pathname) return `${SITE_URL}/`;
	const clean = pathname.split('?')[0].split('#')[0].trim();
	const normalized = clean === '/' ? '/' : clean.replace(/\/+$/, '') || '/';
	return `${SITE_URL}${normalized}`;
}

export interface HreflangLink {
	lang: string;
	href: string;
}

/**
 * Builds reciprocal bilingual hreflang links (en, de, and x-default).
 * Assumes 1:1 structural content parity across bilingual routes.
 */
export function buildHreflangLinks(pathname: string): HreflangLink[] {
	if (!pathname) return [];
	const clean = pathname.split('?')[0].split('#')[0].trim();
	const normalized = clean === '/' ? '/' : clean.replace(/\/+$/, '') || '/';

	const match = normalized.match(/^\/(en|de)(\/.*)?$/);
	if (!match) {
		return [];
	}

	const subpath = match[2] || '';

	return [
		{ lang: 'en', href: `${SITE_URL}/en${subpath}` },
		{ lang: 'de', href: `${SITE_URL}/de${subpath}` },
		{ lang: 'x-default', href: `${SITE_URL}/en${subpath}` }
	];
}

/**
 * Checks whether a given path is an indexable public page.
 */
export function isIndexableRoute(pathname: string): boolean {
	if (!pathname) return false;
	const clean = pathname.split('?')[0].split('#')[0].trim();

	// Exclude utility, internal, auth, api, and debug namespaces
	if (
		clean.startsWith('/api') ||
		clean.startsWith('/editor') ||
		clean.includes('/random') ||
		clean === '/'
	) {
		return false;
	}

	// Must be a valid language namespace (/en/* or /de/*)
	return clean.startsWith('/en') || clean.startsWith('/de');
}

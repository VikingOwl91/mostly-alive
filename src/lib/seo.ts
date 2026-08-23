/**
 * Mostly Alive — Centralized SEO, Social Discovery & Structured Trust Data Infrastructure
 * Source of truth for canonical URLs, hreflang alternates, OpenGraph, Twitter Cards,
 * and schema.org JSON-LD structured data.
 */

import { CATEGORIES, type Article, type Category, type StaticPage } from '$lib/types/content';

export const SITE_URL = 'https://mostly-alive.christian-d81.workers.dev';
export const SITE_NAME = 'Mostly Alive';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export interface HreflangLink {
	lang: string;
	href: string;
}

export interface SeoMetadata {
	title: string;
	description: string;
	canonicalUrl: string;
	lang: 'en' | 'de';
	type: 'website' | 'article';
	robots?: string; // e.g. 'noindex, follow' or 'noindex, nofollow'
	hreflangs: HreflangLink[];
	ogImage?: string;
	ogImageWidth?: number;
	ogImageHeight?: number;
	ogImageType?: string;
	jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Normalizes a URL pathname to a clean canonical absolute URL.
 */
export function buildCanonicalUrl(pathname: string): string {
	if (!pathname) return `${SITE_URL}/`;
	const clean = pathname.split('?')[0].split('#')[0].trim();
	const normalized = clean === '/' ? '/' : clean.replace(/\/+$/, '') || '/';
	return `${SITE_URL}${normalized}`;
}

/**
 * Builds reciprocal bilingual hreflang links (en, de, and x-default).
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

	if (
		clean.startsWith('/api') ||
		clean.startsWith('/editor') ||
		clean.includes('/random') ||
		clean === '/'
	) {
		return false;
	}

	return clean.startsWith('/en') || clean.startsWith('/de');
}

/**
 * Safely serializes JSON-LD structured data for HTML head insertion.
 */
export function serializeJsonLd(data: Record<string, any> | Array<Record<string, any>>): string {
	return JSON.stringify(data).replace(/<\/script/g, '<\\/script');
}

/* =========================================================================
 * JSON-LD Schema Builders (Truthful & Provenance-Backed)
 * ========================================================================= */

/**
 * Builds WebSite structured data for the homepage.
 */
export function buildWebSiteSchema(lang: 'en' | 'de') {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: `${SITE_URL}/${lang}`,
		description:
			lang === 'de'
				? 'Ein quellenbasiertes, trocken humorvolles Sicherheitskompendium für seltene, aber lebenswichtige Alltagssituationen.'
				: 'An open-source, source-backed safety knowledge base teaching rare-but-important survival knowledge through dry, memorable humor.',
		inLanguage: ['en', 'de']
	};
}

/**
 * Builds Article structured data for guide articles using real frontmatter provenance.
 * Note: Only verified review dates and source URLs are included. No fake authors or publishers.
 */
export function buildArticleSchema(article: Article, lang: 'en' | 'de') {
	const url = `${SITE_URL}/${lang}/guide/${article.slug}`;
	const description = article.subtitle || article.memory_hook;

	const schema: Record<string, any> = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		description,
		url,
		mainEntityOfPage: url,
		inLanguage: lang,
		articleSection: article.category,
		image: DEFAULT_OG_IMAGE
	};

	if (article.reviewed_at) {
		schema.dateModified = article.reviewed_at;
	}

	if (article.sources && article.sources.length > 0) {
		schema.citation = article.sources.map((s) => s.url);
	}

	return schema;
}

/**
 * Builds BreadcrumbList structured data reflecting real information architecture.
 */
export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	};
}

/* =========================================================================
 * High-Level Page SEO Builders
 * ========================================================================= */

export function buildHomepageSeo(lang: 'en' | 'de'): SeoMetadata {
	const canonicalUrl = `${SITE_URL}/${lang}`;
	const title =
		lang === 'de'
			? 'Mostly Alive — Praktischer Überlebensleitfaden'
			: 'Mostly Alive — A practical guide to remaining so';
	const description =
		lang === 'de'
			? 'Ein quellenbasiertes, trocken humorvolles Sicherheitskompendium für seltene, aber lebenswichtige Alltagssituationen.'
			: 'An open-source, source-backed safety knowledge base teaching rare-but-important survival knowledge through dry, memorable humor.';

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}`),
		ogImage: DEFAULT_OG_IMAGE,
		ogImageWidth: 512,
		ogImageHeight: 512,
		ogImageType: 'image/png',
		jsonLd: buildWebSiteSchema(lang)
	};
}

export function buildHandbookSeo(lang: 'en' | 'de'): SeoMetadata {
	const canonicalUrl = `${SITE_URL}/${lang}/guide`;
	const title =
		lang === 'de'
			? 'Vollständiges Handbuch — Überlebenswissen — Mostly Alive'
			: 'Guide Directory — Survival Knowledge Base — Mostly Alive';
	const description =
		lang === 'de'
			? 'Durchsuche alle dokumentierten Notfallsituationen und Überlebensanleitungen. Quellenbasierte Sofortmaßnahmen für den Ernstfall.'
			: 'Browse all documented emergency situations and survival instructions. Actionable safety steps backed by authoritative primary sources.';

	const breadcrumb = buildBreadcrumbSchema([
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${SITE_URL}/${lang}` },
		{ name: lang === 'de' ? 'Handbuch' : 'Handbook', url: canonicalUrl }
	]);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/guide`),
		ogImage: DEFAULT_OG_IMAGE,
		ogImageWidth: 512,
		ogImageHeight: 512,
		ogImageType: 'image/png',
		jsonLd: breadcrumb
	};
}

export function buildGuideSeo(article: Article, lang: 'en' | 'de'): SeoMetadata {
	const canonicalUrl = `${SITE_URL}/${lang}/guide/${article.slug}`;
	const title = `${article.title} — Mostly Alive`;
	const description = article.subtitle || article.memory_hook;

	const catInfo = CATEGORIES[article.category as Category];
	const catTitle = catInfo ? catInfo.title[lang] : article.category;
	const catUrl = `${SITE_URL}/${lang}/categories/${article.category}`;

	const articleSchema = buildArticleSchema(article, lang);
	const breadcrumbSchema = buildBreadcrumbSchema([
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${SITE_URL}/${lang}` },
		{ name: lang === 'de' ? 'Handbuch' : 'Handbook', url: `${SITE_URL}/${lang}/guide` },
		{ name: catTitle, url: catUrl },
		{ name: article.title, url: canonicalUrl }
	]);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'article',
		hreflangs: buildHreflangLinks(`/${lang}/guide/${article.slug}`),
		ogImage: DEFAULT_OG_IMAGE,
		ogImageWidth: 512,
		ogImageHeight: 512,
		ogImageType: 'image/png',
		jsonLd: [articleSchema, breadcrumbSchema]
	};
}

export function buildCategoriesIndexSeo(lang: 'en' | 'de'): SeoMetadata {
	const canonicalUrl = `${SITE_URL}/${lang}/categories`;
	const title = lang === 'de' ? 'Gefahrenkategorien — Mostly Alive' : 'Hazard Categories — Mostly Alive';
	const description =
		lang === 'de'
			? 'Systematische Klassifikation alltäglicher und unvorhergesehener Notlagen nach Gefahrenbereichen.'
			: 'Systematic classification of emergency and survival situations across medical, weather, fire, electrical, and other hazard domains.';

	const breadcrumb = buildBreadcrumbSchema([
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${SITE_URL}/${lang}` },
		{ name: lang === 'de' ? 'Kategorien' : 'Categories', url: canonicalUrl }
	]);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/categories`),
		ogImage: DEFAULT_OG_IMAGE,
		ogImageWidth: 512,
		ogImageHeight: 512,
		ogImageType: 'image/png',
		jsonLd: breadcrumb
	};
}

export function buildCategorySeo(category: Category, lang: 'en' | 'de'): SeoMetadata {
	const catInfo = CATEGORIES[category];
	const canonicalUrl = `${SITE_URL}/${lang}/categories/${category}`;
	const catTitle = catInfo ? catInfo.title[lang] : category;
	const title =
		lang === 'de'
			? `${catTitle} — Gefahrenkategorie — Mostly Alive`
			: `${catTitle} — Hazard Category — Mostly Alive`;
	const description =
		catInfo?.description[lang] ||
		(lang === 'de'
			? `Alle Sicherheitsanleitungen in der Kategorie ${catTitle}.`
			: `All survival and emergency guides in the ${catTitle} category.`);

	const breadcrumb = buildBreadcrumbSchema([
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${SITE_URL}/${lang}` },
		{ name: lang === 'de' ? 'Kategorien' : 'Categories', url: `${SITE_URL}/${lang}/categories` },
		{ name: catTitle, url: canonicalUrl }
	]);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/categories/${category}`),
		ogImage: DEFAULT_OG_IMAGE,
		ogImageWidth: 512,
		ogImageHeight: 512,
		ogImageType: 'image/png',
		jsonLd: breadcrumb
	};
}

export function buildEmergencySeo(lang: 'en' | 'de'): SeoMetadata {
	const canonicalUrl = `${SITE_URL}/${lang}/emergency`;
	const title =
		lang === 'de'
			? 'Notfall-Schnellhilfe — Sofortmaßnahmen — Mostly Alive'
			: 'Emergency Fast Scan — Rapid Action Guide — Mostly Alive';
	const description =
		lang === 'de'
			? 'Kompakte, schnörkellose Sofortmaßnahmen für akute Lebensgefahr. Schnelle Handlungsschritte für kritische Notfälle.'
			: 'Ultra-fast, zero-fluff immediate actions for life-threatening emergencies. Fast-scan reference for critical situations.';

	const breadcrumb = buildBreadcrumbSchema([
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${SITE_URL}/${lang}` },
		{ name: lang === 'de' ? 'Notfall-Schnellhilfe' : 'Emergency Fast Scan', url: canonicalUrl }
	]);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/emergency`),
		ogImage: DEFAULT_OG_IMAGE,
		ogImageWidth: 512,
		ogImageHeight: 512,
		ogImageType: 'image/png',
		jsonLd: breadcrumb
	};
}

export function buildStaticPageSeo(page: StaticPage, lang: 'en' | 'de'): SeoMetadata {
	const canonicalUrl = `${SITE_URL}/${lang}/${page.slug}`;
	const title = `${page.title} — Mostly Alive`;
	const description =
		page.description ||
		(lang === 'de'
			? 'Offizielle Dokumentation und Transparenzangaben für Mostly Alive.'
			: 'Official documentation and transparency disclosures for Mostly Alive.');

	const breadcrumb = buildBreadcrumbSchema([
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${SITE_URL}/${lang}` },
		{ name: page.title, url: canonicalUrl }
	]);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/${page.slug}`),
		ogImage: DEFAULT_OG_IMAGE,
		ogImageWidth: 512,
		ogImageHeight: 512,
		ogImageType: 'image/png',
		jsonLd: breadcrumb
	};
}

export function buildRandomSeo(lang: 'en' | 'de'): SeoMetadata {
	const canonicalUrl = `${SITE_URL}/${lang}/random`;
	const title =
		lang === 'de'
			? 'Zufallseintrag — Einprägsames Überlebenswissen — Mostly Alive'
			: 'Random Entry — Potentially Life-Saving Knowledge — Mostly Alive';
	const description =
		lang === 'de'
			? 'Präge dir ein überlebenswichtiges Detail ein, bevor die Realität beschließt, dein Wissen unangekündigt zu prüfen.'
			: 'Burn one obscure yet crucial emergency rule into your memory before nature tests your reflexes without warning.';

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		robots: 'noindex, follow',
		hreflangs: [],
		ogImage: DEFAULT_OG_IMAGE,
		ogImageWidth: 512,
		ogImageHeight: 512,
		ogImageType: 'image/png'
	};
}

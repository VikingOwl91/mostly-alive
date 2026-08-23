/**
 * Mostly Alive — Centralized SEO, Social Discovery & Structured Trust Data Infrastructure
 * Source of truth for canonical URLs, hreflang alternates, OpenGraph, Twitter Cards,
 * schema.org JSON-LD structured data, and navigation breadcrumbs.
 */

import { CATEGORIES, type Article, type Category, type StaticPage } from '$lib/types/content';

/**
 * SINGLE AUTHORITATIVE SITE ORIGIN
 * All canonical URLs, hreflang links, OpenGraph URLs, JSON-LD identifiers,
 * sitemap entries, and social image assets MUST derive from this value.
 */
export const SITE_URL = 'https://mostly-alive.christian-d81.workers.dev';
export const SITE_NAME = 'Mostly Alive';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/social-card.png`;
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE_TYPE = 'image/png';

export interface HreflangLink {
	lang: string;
	href: string;
}

export interface BreadcrumbItem {
	name: string;
	url: string;
	current?: boolean;
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
	breadcrumbs?: BreadcrumbItem[];
	jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Normalizes a URL pathname to a clean canonical absolute URL based on SITE_URL.
 */
export function buildCanonicalUrl(pathname: string, origin: string = SITE_URL): string {
	if (!pathname) return `${origin}/`;
	const clean = pathname.split('?')[0].split('#')[0].trim();
	const normalized = clean === '/' ? '/' : clean.replace(/\/+$/, '') || '/';
	return `${origin}${normalized}`;
}

/**
 * Builds reciprocal bilingual hreflang links (en, de, and x-default).
 */
export function buildHreflangLinks(pathname: string, origin: string = SITE_URL): HreflangLink[] {
	if (!pathname) return [];
	const clean = pathname.split('?')[0].split('#')[0].trim();
	const normalized = clean === '/' ? '/' : clean.replace(/\/+$/, '') || '/';

	const match = normalized.match(/^\/(en|de)(\/.*)?$/);
	if (!match) {
		return [];
	}

	const subpath = match[2] || '';

	return [
		{ lang: 'en', href: `${origin}/en${subpath}` },
		{ lang: 'de', href: `${origin}/de${subpath}` },
		{ lang: 'x-default', href: `${origin}/en${subpath}` }
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
 * Breadcrumb Model Builders (Single Source for Visible UI + JSON-LD)
 * ========================================================================= */

export function buildHandbookBreadcrumbs(lang: 'en' | 'de', origin: string = SITE_URL): BreadcrumbItem[] {
	return [
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${origin}/${lang}` },
		{ name: lang === 'de' ? 'Handbuch' : 'Handbook', url: `${origin}/${lang}/guide`, current: true }
	];
}

export function buildCategoriesIndexBreadcrumbs(lang: 'en' | 'de', origin: string = SITE_URL): BreadcrumbItem[] {
	return [
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${origin}/${lang}` },
		{ name: lang === 'de' ? 'Kategorien' : 'Categories', url: `${origin}/${lang}/categories`, current: true }
	];
}

export function buildCategoryBreadcrumbs(category: Category, lang: 'en' | 'de', origin: string = SITE_URL): BreadcrumbItem[] {
	const catInfo = CATEGORIES[category];
	const catTitle = catInfo ? catInfo.title[lang] : category;

	return [
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${origin}/${lang}` },
		{ name: lang === 'de' ? 'Kategorien' : 'Categories', url: `${origin}/${lang}/categories` },
		{ name: catTitle, url: `${origin}/${lang}/categories/${category}`, current: true }
	];
}

export function buildGuideBreadcrumbs(article: Article, lang: 'en' | 'de', origin: string = SITE_URL): BreadcrumbItem[] {
	const catInfo = CATEGORIES[article.category as Category];
	const catTitle = catInfo ? catInfo.title[lang] : article.category;
	const catUrl = `${origin}/${lang}/categories/${article.category}`;

	return [
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${origin}/${lang}` },
		{ name: lang === 'de' ? 'Handbuch' : 'Handbook', url: `${origin}/${lang}/guide` },
		{ name: catTitle, url: catUrl },
		{ name: article.title, url: `${origin}/${lang}/guide/${article.slug}`, current: true }
	];
}

export function buildEmergencyBreadcrumbs(lang: 'en' | 'de', origin: string = SITE_URL): BreadcrumbItem[] {
	return [
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${origin}/${lang}` },
		{ name: lang === 'de' ? 'Notfall-Schnellhilfe' : 'Emergency Fast Scan', url: `${origin}/${lang}/emergency`, current: true }
	];
}

export function buildStaticPageBreadcrumbs(page: StaticPage, lang: 'en' | 'de', origin: string = SITE_URL): BreadcrumbItem[] {
	return [
		{ name: lang === 'de' ? 'Startseite' : 'Home', url: `${origin}/${lang}` },
		{ name: page.title, url: `${origin}/${lang}/${page.slug}`, current: true }
	];
}

/* =========================================================================
 * JSON-LD Schema Builders (Truthful & Provenance-Backed)
 * ========================================================================= */

export function buildWebSiteSchema(lang: 'en' | 'de', origin: string = SITE_URL) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: `${origin}/${lang}`,
		description:
			lang === 'de'
				? 'Ein quellenbasiertes, trocken humorvolles Sicherheitskompendium für seltene, aber lebenswichtige Alltagssituationen.'
				: 'An open-source, source-backed safety knowledge base teaching rare-but-important survival knowledge through dry, memorable humor.',
		inLanguage: ['en', 'de']
	};
}

export function buildArticleSchema(article: Article, lang: 'en' | 'de', origin: string = SITE_URL) {
	const url = `${origin}/${lang}/guide/${article.slug}`;
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
		image: `${origin}/social-card.png`
	};

	if (article.reviewed_at) {
		schema.dateModified = article.reviewed_at;
	}

	if (article.sources && article.sources.length > 0) {
		schema.citation = article.sources.map((s) => s.url);
	}

	return schema;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
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

export function buildHomepageSeo(lang: 'en' | 'de', origin: string = SITE_URL): SeoMetadata {
	const canonicalUrl = `${origin}/${lang}`;
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
		hreflangs: buildHreflangLinks(`/${lang}`, origin),
		ogImage: `${origin}/social-card.png`,
		ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
		ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
		ogImageType: DEFAULT_OG_IMAGE_TYPE,
		jsonLd: buildWebSiteSchema(lang, origin)
	};
}

export function buildHandbookSeo(lang: 'en' | 'de', origin: string = SITE_URL): SeoMetadata {
	const canonicalUrl = `${origin}/${lang}/guide`;
	const title =
		lang === 'de'
			? 'Vollständiges Handbuch — Überlebenswissen — Mostly Alive'
			: 'Guide Directory — Survival Knowledge Base — Mostly Alive';
	const description =
		lang === 'de'
			? 'Durchsuche alle dokumentierten Notfallsituationen und Überlebensanleitungen. Quellenbasierte Sofortmaßnahmen für den Ernstfall.'
			: 'Browse all documented emergency situations and survival instructions. Actionable safety steps backed by authoritative primary sources.';

	const breadcrumbs = buildHandbookBreadcrumbs(lang, origin);
	const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/guide`, origin),
		ogImage: `${origin}/social-card.png`,
		ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
		ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
		ogImageType: DEFAULT_OG_IMAGE_TYPE,
		breadcrumbs,
		jsonLd: breadcrumbSchema
	};
}

export function buildGuideSeo(article: Article, lang: 'en' | 'de', origin: string = SITE_URL): SeoMetadata {
	const canonicalUrl = `${origin}/${lang}/guide/${article.slug}`;
	const title = `${article.title} — Mostly Alive`;
	const description = article.subtitle || article.memory_hook;

	const breadcrumbs = buildGuideBreadcrumbs(article, lang, origin);
	const articleSchema = buildArticleSchema(article, lang, origin);
	const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'article',
		hreflangs: buildHreflangLinks(`/${lang}/guide/${article.slug}`, origin),
		ogImage: `${origin}/social-card.png`,
		ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
		ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
		ogImageType: DEFAULT_OG_IMAGE_TYPE,
		breadcrumbs,
		jsonLd: [articleSchema, breadcrumbSchema]
	};
}

export function buildCategoriesIndexSeo(lang: 'en' | 'de', origin: string = SITE_URL): SeoMetadata {
	const canonicalUrl = `${origin}/${lang}/categories`;
	const title = lang === 'de' ? 'Gefahrenkategorien — Mostly Alive' : 'Hazard Categories — Mostly Alive';
	const description =
		lang === 'de'
			? 'Systematische Klassifikation alltäglicher und unvorhergesehener Notlagen nach Gefahrenbereichen.'
			: 'Systematic classification of emergency and survival situations across medical, weather, fire, electrical, and other hazard domains.';

	const breadcrumbs = buildCategoriesIndexBreadcrumbs(lang, origin);
	const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/categories`, origin),
		ogImage: `${origin}/social-card.png`,
		ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
		ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
		ogImageType: DEFAULT_OG_IMAGE_TYPE,
		breadcrumbs,
		jsonLd: breadcrumbSchema
	};
}

export function buildCategorySeo(category: Category, lang: 'en' | 'de', origin: string = SITE_URL): SeoMetadata {
	const catInfo = CATEGORIES[category];
	const canonicalUrl = `${origin}/${lang}/categories/${category}`;
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

	const breadcrumbs = buildCategoryBreadcrumbs(category, lang, origin);
	const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/categories/${category}`, origin),
		ogImage: `${origin}/social-card.png`,
		ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
		ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
		ogImageType: DEFAULT_OG_IMAGE_TYPE,
		breadcrumbs,
		jsonLd: breadcrumbSchema
	};
}

export function buildEmergencySeo(lang: 'en' | 'de', origin: string = SITE_URL): SeoMetadata {
	const canonicalUrl = `${origin}/${lang}/emergency`;
	const title =
		lang === 'de'
			? 'Notfall-Schnellhilfe — Sofortmaßnahmen — Mostly Alive'
			: 'Emergency Fast Scan — Rapid Action Guide — Mostly Alive';
	const description =
		lang === 'de'
			? 'Kompakte, schnörkellose Sofortmaßnahmen für akute Lebensgefahr. Schnelle Handlungsschritte für kritische Notfälle.'
			: 'Ultra-fast, zero-fluff immediate actions for life-threatening emergencies. Fast-scan reference for critical situations.';

	const breadcrumbs = buildEmergencyBreadcrumbs(lang, origin);
	const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/emergency`, origin),
		ogImage: `${origin}/social-card.png`,
		ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
		ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
		ogImageType: DEFAULT_OG_IMAGE_TYPE,
		breadcrumbs,
		jsonLd: breadcrumbSchema
	};
}

export function buildStaticPageSeo(page: StaticPage, lang: 'en' | 'de', origin: string = SITE_URL): SeoMetadata {
	const canonicalUrl = `${origin}/${lang}/${page.slug}`;
	const title = `${page.title} — Mostly Alive`;
	const description =
		page.description ||
		(lang === 'de'
			? 'Offizielle Dokumentation und Transparenzangaben für Mostly Alive.'
			: 'Official documentation and transparency disclosures for Mostly Alive.');

	const breadcrumbs = buildStaticPageBreadcrumbs(page, lang, origin);
	const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

	return {
		title,
		description,
		canonicalUrl,
		lang,
		type: 'website',
		hreflangs: buildHreflangLinks(`/${lang}/${page.slug}`, origin),
		ogImage: `${origin}/social-card.png`,
		ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
		ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
		ogImageType: DEFAULT_OG_IMAGE_TYPE,
		breadcrumbs,
		jsonLd: breadcrumbSchema
	};
}

export function buildRandomSeo(lang: 'en' | 'de', origin: string = SITE_URL): SeoMetadata {
	const canonicalUrl = `${origin}/${lang}/random`;
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
		ogImage: `${origin}/social-card.png`,
		ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
		ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
		ogImageType: DEFAULT_OG_IMAGE_TYPE
	};
}

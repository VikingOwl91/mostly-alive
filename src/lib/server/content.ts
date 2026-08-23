import matter from 'gray-matter';
import { marked } from 'marked';
import {
	ArticleFrontmatterSchema,
	PageFrontmatterSchema,
	type Article,
	type Category,
	type StaticPage
} from '$lib/types/content';

// Set up marked configuration
marked.setOptions({
	gfm: true,
	breaks: true
});

// Vite glob imports: build-time discoverable without runtime filesystem access
const rawArticleFiles = import.meta.glob('/content/articles/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const rawPageFiles = import.meta.glob('/content/pages/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

// In-memory indexed structures for lightning-fast lookups in Cloudflare Workers
const articleMap = new Map<string, Article>();
const articlesByLang: Record<'en' | 'de', Article[]> = {
	en: [],
	de: []
};

const pageMap = new Map<string, StaticPage>();
const pagesByLang: Record<'en' | 'de', StaticPage[]> = {
	en: [],
	de: []
};

// Initialize article catalog
for (const [filePath, rawContent] of Object.entries(rawArticleFiles)) {
	const match = filePath.match(/(?:content\/articles\/)?(en|de)\/([^/]+)\.md$/);
	if (!match) continue;

	const lang = match[1] as 'en' | 'de';
	const parsed = matter(rawContent);
	const validated = ArticleFrontmatterSchema.safeParse(parsed.data);

	if (!validated.success) {
		console.error(`Invalid article frontmatter in ${filePath}:`, validated.error.format());
		continue;
	}

	const html = marked.parse(parsed.content) as string;
	const article: Article = {
		...validated.data,
		lang,
		body: parsed.content,
		html
	};

	articleMap.set(`${lang}:${article.slug}`, article);
	articlesByLang[lang].push(article);
}

// Initialize static page catalog
for (const [filePath, rawContent] of Object.entries(rawPageFiles)) {
	const match = filePath.match(/(?:content\/pages\/)?(en|de)\/([^/]+)\.md$/);
	if (!match) continue;

	const lang = match[1] as 'en' | 'de';
	const parsed = matter(rawContent);
	const validated = PageFrontmatterSchema.safeParse(parsed.data);

	if (!validated.success) {
		console.error(`Invalid page frontmatter in ${filePath}:`, validated.error.format());
		continue;
	}

	const html = marked.parse(parsed.content) as string;
	const page: StaticPage = {
		...validated.data,
		lang,
		body: parsed.content,
		html
	};

	pageMap.set(`${lang}:${page.slug}`, page);
	pagesByLang[lang].push(page);
}

export function loadAllArticles(lang?: 'en' | 'de'): Article[] {
	if (lang) {
		return articlesByLang[lang] ? [...articlesByLang[lang]] : [];
	}
	return [...articlesByLang.en, ...articlesByLang.de];
}

export function getArticle(slug: string, lang: 'en' | 'de'): Article | null {
	return articleMap.get(`${lang}:${slug}`) || null;
}

export function getArticlesByCategory(category: Category, lang: 'en' | 'de'): Article[] {
	const all = loadAllArticles(lang);
	return all.filter((a) => a.category === category);
}

export function getRandomArticle(lang: 'en' | 'de', category?: Category): Article | null {
	let list = loadAllArticles(lang);
	if (category) {
		list = list.filter((a) => a.category === category);
	}
	if (list.length === 0) return null;
	const index = Math.floor(Math.random() * list.length);
	return list[index];
}

export function getStaticPage(slug: string, lang: 'en' | 'de'): StaticPage | null {
	return pageMap.get(`${lang}:${slug}`) || null;
}

export function loadAllStaticPages(lang?: 'en' | 'de'): StaticPage[] {
	if (lang) {
		return pagesByLang[lang] ? [...pagesByLang[lang]] : [];
	}
	return [...pagesByLang.en, ...pagesByLang.de];
}

export function getSearchIndex(lang: 'en' | 'de') {
	const articles = loadAllArticles(lang);
	return articles.map((a) => ({
		id: a.slug,
		slug: a.slug,
		title: a.title,
		subtitle: a.subtitle || '',
		category: a.category,
		tags: a.tags.join(' '),
		aliases: a.aliases.join(' '),
		memory_hook: a.memory_hook,
		immediate_action: a.immediate_action.join(' '),
		bodySnippet: a.body.slice(0, 300),
		severity: a.severity,
		urgency: a.urgency,
		threat_level: a.threat_level,
		status: a.status
	}));
}

import fs from 'node:fs';
import path from 'node:path';
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

const CONTENT_DIR = path.resolve('content');

export function loadAllArticles(lang?: 'en' | 'de'): Article[] {
	const articles: Article[] = [];
	const langs: ('en' | 'de')[] = lang ? [lang] : ['en', 'de'];

	for (const l of langs) {
		const langDir = path.join(CONTENT_DIR, 'articles', l);
		if (!fs.existsSync(langDir)) continue;

		const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.md'));
		for (const file of files) {
			const filePath = path.join(langDir, file);
			const fileContent = fs.readFileSync(filePath, 'utf-8');
			const parsed = matter(fileContent);

			const validated = ArticleFrontmatterSchema.safeParse(parsed.data);
			if (!validated.success) {
				console.error(`Invalid article frontmatter in ${filePath}:`, validated.error.format());
				continue;
			}

			const html = marked.parse(parsed.content) as string;

			articles.push({
				...validated.data,
				lang: l,
				body: parsed.content,
				html
			});
		}
	}

	return articles;
}

export function getArticle(slug: string, lang: 'en' | 'de'): Article | null {
	const filePath = path.join(CONTENT_DIR, 'articles', lang, `${slug}.md`);
	if (!fs.existsSync(filePath)) return null;

	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const parsed = matter(fileContent);

	const validated = ArticleFrontmatterSchema.safeParse(parsed.data);
	if (!validated.success) {
		console.error(`Invalid frontmatter in ${filePath}:`, validated.error.format());
		return null;
	}

	const html = marked.parse(parsed.content) as string;

	return {
		...validated.data,
		lang,
		body: parsed.content,
		html
	};
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
	const filePath = path.join(CONTENT_DIR, 'pages', lang, `${slug}.md`);
	if (!fs.existsSync(filePath)) return null;

	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const parsed = matter(fileContent);

	const validated = PageFrontmatterSchema.safeParse(parsed.data);
	if (!validated.success) {
		console.error(`Invalid page frontmatter in ${filePath}:`, validated.error.format());
		return null;
	}

	const html = marked.parse(parsed.content) as string;

	return {
		...validated.data,
		lang,
		body: parsed.content,
		html
	};
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

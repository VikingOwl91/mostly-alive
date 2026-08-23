import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	ArticleFrontmatterSchema,
	PageFrontmatterSchema,
	CATEGORIES,
	type ArticleFrontmatter
} from '../src/lib/types/content.js';
import { SITE_URL } from '../src/lib/seo.js';

const CONTENT_DIR = path.resolve('content');

interface ValidationReport {
	articleCount: number;
	pageCount: number;
	reviewedCount: number;
	draftCount: number;
	sitemapUrlsCount: number;
	errors: string[];
	warnings: string[];
}

function runValidation(): ValidationReport {
	const report: ValidationReport = {
		articleCount: 0,
		pageCount: 0,
		reviewedCount: 0,
		draftCount: 0,
		sitemapUrlsCount: 0,
		errors: [],
		warnings: []
	};

	const langs = ['en', 'de'] as const;
	const articlesByLang: Record<'en' | 'de', Map<string, ArticleFrontmatter>> = {
		en: new Map(),
		de: new Map()
	};

	console.log('🔍 Starting Mostly Alive Content, Provenance & Technical SEO Validation...\n');

	// 1. Validate Articles
	for (const lang of langs) {
		const langDir = path.join(CONTENT_DIR, 'articles', lang);
		if (!fs.existsSync(langDir)) {
			report.warnings.push(`Directory missing: ${langDir}`);
			continue;
		}

		const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.md'));
		for (const file of files) {
			report.articleCount++;
			const filePath = path.join(langDir, file);
			const content = fs.readFileSync(filePath, 'utf-8');
			const parsed = matter(content);

			const fileSlug = file.replace(/\.md$/, '');

			// Zod schema parse
			const result = ArticleFrontmatterSchema.safeParse(parsed.data);
			if (!result.success) {
				report.errors.push(
					`[${lang.toUpperCase()}] Schema error in ${file}:\n` +
						JSON.stringify(result.error.format(), null, 2)
				);
				continue;
			}

			const meta = result.data;
			articlesByLang[lang].set(fileSlug, meta);

			// Check slug matches filename
			if (meta.slug !== fileSlug) {
				report.errors.push(
					`[${lang.toUpperCase()}] Slug mismatch in ${file}: metadata slug "${meta.slug}" != filename "${fileSlug}"`
				);
			}

			// Validate Immediate Action Semantic Structure
			if (meta.immediate_action.length > 6) {
				report.warnings.push(
					`[${lang.toUpperCase()}] High primary action count in ${file}: ${meta.immediate_action.length} primary actions (ideal: 2–5). Consider nesting procedural steps into substeps.`
				);
			}

			for (let i = 0; i < meta.immediate_action.length; i++) {
				const item = meta.immediate_action[i];
				if (typeof item === 'object') {
					if (!item.title || !item.title.trim()) {
						report.errors.push(
							`[${lang.toUpperCase()}] Empty action title in ${file} at action step ${i + 1}.`
						);
					}
					if (!item.instruction || !item.instruction.trim()) {
						report.errors.push(
							`[${lang.toUpperCase()}] Empty action instruction in ${file} at action step ${i + 1}.`
						);
					}
					if (item.substeps) {
						for (let s = 0; s < item.substeps.length; s++) {
							if (!item.substeps[s] || !item.substeps[s].trim()) {
								report.errors.push(
									`[${lang.toUpperCase()}] Empty substep in ${file} (Action ${i + 1}, substep ${s + 1}).`
								);
							}
						}
					}
					if (item.variants) {
						for (let v = 0; v < item.variants.length; v++) {
							const variant = item.variants[v];
							if (!variant.condition?.trim() || !variant.action?.trim()) {
								report.errors.push(
									`[${lang.toUpperCase()}] Incomplete condition variant in ${file} (Action ${i + 1}, variant ${v + 1}).`
								);
							}
						}
					}
				}
			}

			// Provenance gate: Reviewed status requires authoritative source & review metadata
			if (meta.status === 'reviewed') {
				report.reviewedCount++;
				const authoritativeSources = meta.sources.filter((s) => s.authoritative);
				if (authoritativeSources.length === 0) {
					report.errors.push(
						`[${lang.toUpperCase()}] Provenance failure in ${file}: Article is marked "reviewed" but lacks authoritative sources.`
					);
				}
				if (!meta.reviewed_at) {
					report.errors.push(
						`[${lang.toUpperCase()}] Review metadata missing in ${file}: "reviewed_at" is required for reviewed articles.`
					);
				}
				if (!meta.reviewer) {
					report.errors.push(
						`[${lang.toUpperCase()}] Review metadata missing in ${file}: "reviewer" is required for reviewed articles.`
					);
				}
			} else {
				report.draftCount++;
			}

			// Validate URLs in sources
			for (const source of meta.sources) {
				try {
					new URL(source.url);
				} catch {
					report.errors.push(
						`[${lang.toUpperCase()}] Invalid source URL in ${file}: "${source.url}" (Source: ${source.name})`
					);
				}
			}
		}
	}

	// Check translation & structural parity between EN and DE
	for (const [slug, enMeta] of articlesByLang.en) {
		const deMeta = articlesByLang.de.get(slug);
		if (!deMeta) {
			report.warnings.push(`Translation missing: Article "${slug}" exists in EN but missing in DE.`);
			continue;
		}

		// Structural parity check: number of primary actions
		if (enMeta.immediate_action.length !== deMeta.immediate_action.length) {
			report.warnings.push(
				`Structural action parity mismatch in "${slug}": EN has ${enMeta.immediate_action.length} primary actions, DE has ${deMeta.immediate_action.length}.`
			);
		}
	}

	for (const [slug] of articlesByLang.de) {
		if (!articlesByLang.en.has(slug)) {
			report.warnings.push(`Translation missing: Article "${slug}" exists in DE but missing in EN.`);
		}
	}

	// 2. Validate Static Pages
	const staticPagesByLang: Record<'en' | 'de', Set<string>> = {
		en: new Set(),
		de: new Set()
	};

	for (const lang of langs) {
		const pagesDir = path.join(CONTENT_DIR, 'pages', lang);
		if (!fs.existsSync(pagesDir)) continue;

		const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.md'));
		for (const file of files) {
			report.pageCount++;
			const filePath = path.join(pagesDir, file);
			const content = fs.readFileSync(filePath, 'utf-8');
			const parsed = matter(content);

			const fileSlug = file.replace(/\.md$/, '');
			staticPagesByLang[lang].add(fileSlug);

			const result = PageFrontmatterSchema.safeParse(parsed.data);
			if (!result.success) {
				report.errors.push(
					`[${lang.toUpperCase()}] Page schema error in ${file}:\n` +
						JSON.stringify(result.error.format(), null, 2)
				);
			}
		}
	}

	// 3. Validate Robots.txt & Technical SEO Invariants
	const robotsPath = path.resolve('static/robots.txt');
	if (!fs.existsSync(robotsPath)) {
		report.errors.push('Missing static/robots.txt file.');
	} else {
		const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
		if (!robotsContent.includes('User-agent: *')) {
			report.errors.push('robots.txt missing "User-agent: *" directive.');
		}
		if (!robotsContent.includes('Disallow: /editor/')) {
			report.errors.push('robots.txt missing "Disallow: /editor/" directive.');
		}
		if (!robotsContent.includes('Disallow: /api/')) {
			report.errors.push('robots.txt missing "Disallow: /api/" directive.');
		}
		if (!robotsContent.includes('Sitemap:')) {
			report.errors.push('robots.txt missing "Sitemap:" reference.');
		}
	}

	// 4. Validate Sitemap Coverage & Consistency
	const sitemapUrls = new Set<string>();

	// Add homepages, guides, categories, emergency
	for (const lang of langs) {
		sitemapUrls.add(`${SITE_URL}/${lang}`);
		sitemapUrls.add(`${SITE_URL}/${lang}/guide`);
		sitemapUrls.add(`${SITE_URL}/${lang}/categories`);
		sitemapUrls.add(`${SITE_URL}/${lang}/emergency`);

		for (const cat of Object.values(CATEGORIES)) {
			sitemapUrls.add(`${SITE_URL}/${lang}/categories/${cat.id}`);
		}

		for (const slug of articlesByLang[lang].keys()) {
			sitemapUrls.add(`${SITE_URL}/${lang}/guide/${slug}`);
		}

		for (const pageSlug of staticPagesByLang[lang]) {
			sitemapUrls.add(`${SITE_URL}/${lang}/${pageSlug}`);
		}
	}

	report.sitemapUrlsCount = sitemapUrls.size;

	// Ensure no illegal routes are in sitemap
	for (const url of sitemapUrls) {
		const pathname = new URL(url).pathname;
		if (
			pathname.startsWith('/editor') ||
			pathname.startsWith('/api') ||
			pathname.includes('/random')
		) {
			report.errors.push(`Illegal route detected in sitemap index calculation: ${url}`);
		}
	}

	return report;
}

// Execute CLI
const result = runValidation();

console.log('--------------------------------------------------');
console.log('📊 Validation Summary:');
console.log(`- Total Articles Scanned: ${result.articleCount}`);
console.log(`  • Reviewed & Sourced:   ${result.reviewedCount}`);
console.log(`  • Draft / In Review:    ${result.draftCount}`);
console.log(`- Total Static Pages:     ${result.pageCount}`);
console.log(`- Total Indexable URLs:   ${result.sitemapUrlsCount}`);
console.log(`- Warnings:               ${result.warnings.length}`);
console.log(`- Errors:                 ${result.errors.length}`);
console.log('--------------------------------------------------\n');

if (result.warnings.length > 0) {
	console.log('⚠️  Validation Warnings:');
	result.warnings.forEach((w) => console.log(`  - ${w}`));
	console.log('');
}

if (result.errors.length > 0) {
	console.error('❌ Validation Failed with Errors:');
	result.errors.forEach((e) => console.error(`  - ${e}`));
	console.log('');
	process.exit(1);
} else {
	console.log('✅ Content, Provenance & SEO validation passed successfully!\n');
}

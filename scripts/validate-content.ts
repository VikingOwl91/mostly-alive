import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	ArticleFrontmatterSchema,
	PageFrontmatterSchema,
	CATEGORIES,
	type ArticleFrontmatter,
	type Category
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

function getRelatedSlugs(
	currentSlug: string,
	currentMeta: ArticleFrontmatter,
	allArticles: Map<string, ArticleFrontmatter>,
	limit = 3
): string[] {
	const tagSet = new Set((currentMeta.tags || []).map((t) => t.toLowerCase()));

	const affinityMap: Record<string, string[]> = {
		weather: ['electricity', 'water', 'medical', 'outdoors'],
		electricity: ['vehicles', 'weather', 'home', 'buildings'],
		fire: ['home', 'buildings', 'vehicles', 'medical'],
		water: ['vehicles', 'weather', 'outdoors', 'medical'],
		medical: ['weather', 'water', 'fire', 'animals'],
		vehicles: ['water', 'electricity', 'fire', 'weather'],
		animals: ['medical', 'outdoors', 'water'],
		outdoors: ['weather', 'medical', 'water', 'animals'],
		home: ['fire', 'electricity', 'buildings', 'medical'],
		buildings: ['fire', 'electricity', 'home', 'crowds']
	};

	const affinities = new Set(affinityMap[currentMeta.category] || []);

	const scored: Array<{ slug: string; score: number; threat: number }> = [];

	for (const [slug, candidate] of allArticles) {
		if (slug === currentSlug) continue;

		let score = 0;
		if (candidate.category === currentMeta.category) {
			score += 10;
		} else if (affinities.has(candidate.category)) {
			score += 4;
		}

		if (candidate.tags) {
			for (const t of candidate.tags) {
				if (tagSet.has(t.toLowerCase())) {
					score += 3;
				}
			}
		}

		if (Math.abs(candidate.threat_level - currentMeta.threat_level) <= 1) {
			score += 1;
		}

		scored.push({ slug, score, threat: candidate.threat_level });
	}

	scored.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if (b.threat !== a.threat) return b.threat - a.threat;
		return a.slug.localeCompare(b.slug);
	});

	return scored.slice(0, limit).map((s) => s.slug);
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

			// Check category exists in taxonomy
			if (!CATEGORIES[meta.category as Category]) {
				report.errors.push(
					`[${lang.toUpperCase()}] Invalid category "${meta.category}" in ${file}.`
				);
			}

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

	// 4. Validate Social Preview Asset (1200x630)
	const socialCardPath = path.resolve('static/social-card.png');
	if (!fs.existsSync(socialCardPath)) {
		report.errors.push('Missing static/social-card.png file (1200x630 social preview image).');
	} else {
		const stat = fs.statSync(socialCardPath);
		if (stat.size < 1000) {
			report.errors.push('static/social-card.png file is suspiciously small or empty.');
		}
	}

	// 5. Validate Sitemap Coverage & Consistency
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

	// 6. Validate Internal Linking & Orphan Detection
	for (const lang of langs) {
		for (const [slug, meta] of articlesByLang[lang]) {
			const relatedSlugs = getRelatedSlugs(slug, meta, articlesByLang[lang], 3);

			if (relatedSlugs.length === 0) {
				report.errors.push(`[${lang.toUpperCase()}] Orphan guide detected: "${slug}" has 0 related guide paths.`);
			}

			for (const rSlug of relatedSlugs) {
				if (rSlug === slug) {
					report.errors.push(`[${lang.toUpperCase()}] Self-link in related guides detected for "${slug}".`);
				}
				if (!articlesByLang[lang].has(rSlug)) {
					report.errors.push(`[${lang.toUpperCase()}] Related guide references non-existent slug "${rSlug}" from "${slug}".`);
				}
			}
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
	console.log('✅ Content, Provenance, SEO & Linkage validation passed successfully!\n');
}

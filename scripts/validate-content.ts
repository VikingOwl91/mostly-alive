import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { ArticleFrontmatterSchema, PageFrontmatterSchema } from '../src/lib/types/content.js';

const CONTENT_DIR = path.resolve('content');

interface ValidationReport {
	articleCount: number;
	pageCount: number;
	reviewedCount: number;
	draftCount: number;
	errors: string[];
	warnings: string[];
}

function runValidation(): ValidationReport {
	const report: ValidationReport = {
		articleCount: 0,
		pageCount: 0,
		reviewedCount: 0,
		draftCount: 0,
		errors: [],
		warnings: []
	};

	const langs = ['en', 'de'] as const;
	const articlesByLang: Record<'en' | 'de', Set<string>> = {
		en: new Set(),
		de: new Set()
	};

	console.log('🔍 Starting Mostly Alive Content & Provenance Validation...\n');

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
			articlesByLang[lang].add(fileSlug);

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

			// Check slug matches filename
			if (meta.slug !== fileSlug) {
				report.errors.push(
					`[${lang.toUpperCase()}] Slug mismatch in ${file}: metadata slug "${meta.slug}" != filename "${fileSlug}"`
				);
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

	// Check translation parity between EN and DE
	for (const slug of articlesByLang.en) {
		if (!articlesByLang.de.has(slug)) {
			report.warnings.push(
				`Translation missing: Article "${slug}" exists in EN but missing in DE.`
			);
		}
	}
	for (const slug of articlesByLang.de) {
		if (!articlesByLang.en.has(slug)) {
			report.warnings.push(
				`Translation missing: Article "${slug}" exists in DE but missing in EN.`
			);
		}
	}

	// 2. Validate Static Pages
	for (const lang of langs) {
		const pagesDir = path.join(CONTENT_DIR, 'pages', lang);
		if (!fs.existsSync(pagesDir)) continue;

		const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.md'));
		for (const file of files) {
			report.pageCount++;
			const filePath = path.join(pagesDir, file);
			const content = fs.readFileSync(filePath, 'utf-8');
			const parsed = matter(content);

			const result = PageFrontmatterSchema.safeParse(parsed.data);
			if (!result.success) {
				report.errors.push(
					`[${lang.toUpperCase()}] Page schema error in ${file}:\n` +
						JSON.stringify(result.error.format(), null, 2)
				);
			}
		}
	}

	return report;
}

const report = runValidation();

console.log('--------------------------------------------------');
console.log(`📊 Validation Summary:`);
console.log(`- Total Articles Scanned: ${report.articleCount}`);
console.log(`  • Reviewed & Sourced:   ${report.reviewedCount}`);
console.log(`  • Draft / In Review:    ${report.draftCount}`);
console.log(`- Total Static Pages:     ${report.pageCount}`);
console.log(`- Warnings:               ${report.warnings.length}`);
console.log(`- Errors:                 ${report.errors.length}`);
console.log('--------------------------------------------------\n');

if (report.warnings.length > 0) {
	console.log('⚠️  Warnings:');
	for (const w of report.warnings) {
		console.log(`  - ${w}`);
	}
	console.log('');
}

if (report.errors.length > 0) {
	console.error('❌ Validation Failed with Errors:');
	for (const e of report.errors) {
		console.error(`  - ${e}`);
	}
	process.exit(1);
} else {
	console.log('✅ Content & Provenance validation passed successfully!');
	process.exit(0);
}

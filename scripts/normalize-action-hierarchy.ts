import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { ImmediateActionStep } from '../src/lib/types/content.js';

const CONTENT_DIR = path.resolve('content/articles');

function parseStringArrayToStructured(items: any[]): ImmediateActionStep[] {
	const structured: ImmediateActionStep[] = [];
	let currentStep: ImmediateActionStep | null = null;

	for (const raw of items) {
		if (typeof raw === 'object' && raw.title && raw.instruction) {
			structured.push(raw as ImmediateActionStep);
			continue;
		}

		const str = String(raw).trim();

		// Check if this line is a sub-bullet point (starts with bullet or indented)
		const isBullet = /^[•\-\*]\s+/.test(str) || /^└─\s+/.test(str) || /^├─\s+/.test(str);
		const isCondition =
			/^[•\-\*]?\s*(?:If|Falls|Bei|Wenn|In case of)\s+([^:]+):\s*(.+)$/i.test(str);

		if (isCondition && currentStep) {
			const match = str.match(/^[•\-\*]?\s*(?:If|Falls|Bei|Wenn|In case of)\s+([^:]+):\s*(.+)$/i);
			if (match) {
				currentStep.variants = currentStep.variants || [];
				currentStep.variants.push({
					condition: match[1].trim(),
					action: match[2].trim()
				});
				continue;
			}
		}

		if (isBullet && currentStep) {
			const cleanSub = str.replace(/^[•\-\*└─├─]\s*/, '').trim();
			currentStep.substeps = currentStep.substeps || [];
			currentStep.substeps.push(cleanSub);
			continue;
		}

		// Match numbered or uppercase primary headings: "1. TITLE: Instruction" or "TITLE: Instruction"
		const numberedHeadingMatch = str.match(
			/^(?:\d+[\.\)]\s*)?([A-ZÄÖÜ0-9\s\-\/\(\)]{3,50}?):?\s*(.*)$/
		);

		if (numberedHeadingMatch && numberedHeadingMatch[1].trim().length > 2) {
			let title = numberedHeadingMatch[1].trim().replace(/^[\d\.\s]+/, '');
			let instruction = numberedHeadingMatch[2].trim();

			if (!instruction && currentStep) {
				instruction = title;
			}

			if (currentStep) {
				structured.push(currentStep);
			}

			currentStep = {
				title: title.toUpperCase(),
				instruction: instruction || title,
				substeps: [],
				variants: []
			};
		} else {
			if (currentStep) {
				currentStep.substeps = currentStep.substeps || [];
				currentStep.substeps.push(str);
			} else {
				currentStep = {
					title: 'IMMEDIATE ACTION',
					instruction: str,
					substeps: [],
					variants: []
				};
			}
		}
	}

	if (currentStep) {
		structured.push(currentStep);
	}

	// Clean up empty arrays
	for (const step of structured) {
		if (step.substeps && step.substeps.length === 0) delete step.substeps;
		if (step.variants && step.variants.length === 0) delete step.variants;
	}

	return structured;
}

export function normalizeAllArticles() {
	const enDir = path.join(CONTENT_DIR, 'en');
	const deDir = path.join(CONTENT_DIR, 'de');

	const files = fs.readdirSync(enDir).filter((f) => f.endsWith('.md'));

	console.log(`Normalizing ${files.length} article pairs into semantic hierarchy...`);

	for (const file of files) {
		const enPath = path.join(enDir, file);
		const dePath = path.join(deDir, file);

		const enRaw = fs.readFileSync(enPath, 'utf-8');
		const deRaw = fs.readFileSync(dePath, 'utf-8');

		const enParsed = matter(enRaw);
		const deParsed = matter(deRaw);

		const enStructured = parseStringArrayToStructured(enParsed.data.immediate_action || []);
		const deStructured = parseStringArrayToStructured(deParsed.data.immediate_action || []);

		enParsed.data.immediate_action = enStructured;
		deParsed.data.immediate_action = deStructured;

		fs.writeFileSync(enPath, matter.stringify(enParsed.content.trim() + '\n', enParsed.data));
		fs.writeFileSync(dePath, matter.stringify(deParsed.content.trim() + '\n', deParsed.data));
	}

	console.log('✅ Automated conversion complete.');
}

if (process.argv[1].endsWith('normalize-action-hierarchy.ts')) {
	normalizeAllArticles();
}

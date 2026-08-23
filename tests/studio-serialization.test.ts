import { describe, it, expect } from 'vitest';
import matter from 'gray-matter';
import {
	ArticleFrontmatterSchema,
	type ImmediateActionStep
} from '../src/lib/types/content';

function serializeStudioArticle(data: {
	slug: string;
	title: string;
	category: string;
	severity: string;
	urgency: string;
	threat_level: number;
	status: string;
	memory_hook: string;
	immediate_action: ImmediateActionStep[];
	do_not: string[];
	sources: Array<{ name: string; url: string; authoritative: boolean; guideline_version?: string; jurisdiction?: string }>;
	bodyMarkdown: string;
}): string {
	const yamlLines = [
		'---',
		`slug: ${JSON.stringify(data.slug)}`,
		`title: ${JSON.stringify(data.title)}`,
		`category: ${JSON.stringify(data.category)}`,
		`severity: ${JSON.stringify(data.severity)}`,
		`urgency: ${JSON.stringify(data.urgency)}`,
		`threat_level: ${data.threat_level}`,
		`status: ${JSON.stringify(data.status)}`,
		`memory_hook: ${JSON.stringify(data.memory_hook)}`,
		'immediate_action:'
	];

	for (const act of data.immediate_action) {
		yamlLines.push(`  - title: ${JSON.stringify(act.title.trim())}`);
		yamlLines.push(`    instruction: ${JSON.stringify(act.instruction.trim())}`);
		if (act.substeps && act.substeps.length > 0) {
			yamlLines.push('    substeps:');
			for (const s of act.substeps) {
				yamlLines.push(`      - ${JSON.stringify(s.trim())}`);
			}
		}
		if (act.variants && act.variants.length > 0) {
			yamlLines.push('    variants:');
			for (const v of act.variants) {
				yamlLines.push(`      - condition: ${JSON.stringify(v.condition.trim())}`);
				yamlLines.push(`        action: ${JSON.stringify(v.action.trim())}`);
			}
		}
		if (act.note) {
			yamlLines.push(`    note: ${JSON.stringify(act.note.trim())}`);
		}
	}

	yamlLines.push('do_not:');
	for (const d of data.do_not) {
		yamlLines.push(`  - ${JSON.stringify(d)}`);
	}

	yamlLines.push('sources:');
	for (const s of data.sources) {
		yamlLines.push(`  - name: ${JSON.stringify(s.name)}`);
		yamlLines.push(`    url: ${JSON.stringify(s.url)}`);
		yamlLines.push(`    authoritative: ${s.authoritative}`);
	}

	yamlLines.push('---');
	yamlLines.push('');
	yamlLines.push(data.bodyMarkdown);

	return yamlLines.join('\n');
}

describe('Web Studio Serialization & Round-Trip', () => {
	it('should serialize structured actions into valid YAML frontmatter and parse back cleanly', () => {
		const inputSteps: ImmediateActionStep[] = [
			{
				title: 'SEEK IMMEDIATE SHELTER',
				instruction: 'Enter a substantial enclosed building or hard-topped vehicle.',
				substeps: ['Move off ridges and open ground.', 'Avoid tall isolated trees and metal fences.'],
				variants: [
					{
						condition: 'No Shelter Available',
						action: 'Adopt lightning crouch on balls of feet with heels touching.'
					}
				],
				note: 'Last resort mitigation only.'
			},
			{
				title: 'CALL EMERGENCY DISPATCH',
				instruction: 'Call 911 / 112 if anyone is injured or structure is damaged.'
			}
		];

		const markdown = serializeStudioArticle({
			slug: 'test-lightning-hazard',
			title: 'Lightning Strike Hazard',
			category: 'weather',
			severity: 'critical',
			urgency: 'immediate',
			threat_level: 5,
			status: 'draft',
			memory_hook: 'If hair stands up, shelter immediately.',
			immediate_action: inputSteps,
			do_not: ['Do not shelter under isolated trees.'],
			sources: [
				{
					name: 'NOAA Weather Safety',
					url: 'https://www.weather.gov/safety/lightning',
					authoritative: true
				}
			],
			bodyMarkdown: '### Context\nLightning is an acute hazard.'
		});

		const parsed = matter(markdown);
		const validated = ArticleFrontmatterSchema.safeParse(parsed.data);

		expect(validated.success).toBe(true);
		if (validated.success) {
			expect(validated.data.immediate_action.length).toBe(2);
			const step1 = validated.data.immediate_action[0] as ImmediateActionStep;
			expect(step1.title).toBe('SEEK IMMEDIATE SHELTER');
			expect(step1.instruction).toBe('Enter a substantial enclosed building or hard-topped vehicle.');
			expect(step1.substeps?.length).toBe(2);
			expect(step1.variants?.length).toBe(1);
			expect(step1.variants?.[0].condition).toBe('No Shelter Available');
			expect(step1.note).toBe('Last resort mitigation only.');
		}
	});

	it('should fail schema validation when action step title is missing or empty', () => {
		const invalidSteps = [
			{
				title: '',
				instruction: 'Some instruction'
			}
		];

		const result = ArticleFrontmatterSchema.safeParse({
			slug: 'invalid-article',
			title: 'Invalid Article',
			category: 'weather',
			severity: 'critical',
			urgency: 'immediate',
			threat_level: 4,
			status: 'draft',
			memory_hook: 'Test hook',
			immediate_action: invalidSteps,
			do_not: ['Mistake'],
			sources: [{ name: 'Src', url: 'https://example.com', authoritative: true }]
		});

		expect(result.success).toBe(false);
	});
});

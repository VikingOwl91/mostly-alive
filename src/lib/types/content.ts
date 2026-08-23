import { z } from 'zod';

export const CategoryEnum = z.enum([
	'weather',
	'water',
	'fire',
	'electricity',
	'home',
	'medical',
	'vehicles',
	'animals',
	'outdoors',
	'buildings',
	'crowds',
	'digital'
]);
export type Category = z.infer<typeof CategoryEnum>;

export const SeverityEnum = z.enum([
	'informational',
	'caution',
	'serious',
	'critical',
	'immediate'
]);
export type Severity = z.infer<typeof SeverityEnum>;

export const UrgencyEnum = z.enum(['immediate', 'high', 'medium', 'low']);
export type Urgency = z.infer<typeof UrgencyEnum>;

export const ArticleStatusEnum = z.enum([
	'draft',
	'needs-review',
	'reviewed',
	'outdated',
	'archived'
]);
export type ArticleStatus = z.infer<typeof ArticleStatusEnum>;

export const RegionScopeEnum = z.enum(['global', 'de', 'us', 'uk', 'au', 'ca', 'eu']);
export type RegionScope = z.infer<typeof RegionScopeEnum>;

export const EmergencyServicesActionEnum = z.enum([
	'call_immediately',
	'context_dependent',
	'not_required'
]);
export type EmergencyServicesAction = z.infer<typeof EmergencyServicesActionEnum>;

export const SourceReferenceSchema = z.object({
	name: z.string().min(1, 'Source name is required'),
	url: z.string().url('Source URL must be a valid URL'),
	authoritative: z.boolean().default(true),
	guideline_version: z.string().optional(),
	jurisdiction: z.string().optional(),
	retrieved_at: z.string().optional(),
	notes: z.string().optional()
});
export type SourceReference = z.infer<typeof SourceReferenceSchema>;

export const RegionalVariationSchema = z.object({
	region: z.string(),
	note: z.string(),
	source_name: z.string().optional(),
	source_url: z.string().optional()
});
export type RegionalVariation = z.infer<typeof RegionalVariationSchema>;

export const ImmediateActionVariantSchema = z.object({
	condition: z.string().min(1, 'Variant condition is required'),
	action: z.string().min(1, 'Variant action is required')
});
export type ImmediateActionVariant = z.infer<typeof ImmediateActionVariantSchema>;

export const ImmediateActionStepSchema = z.object({
	title: z.string().min(1, 'Step title is required'),
	instruction: z.string().min(1, 'Step instruction is required'),
	substeps: z.array(z.string()).optional(),
	variants: z.array(ImmediateActionVariantSchema).optional(),
	note: z.string().optional()
});
export type ImmediateActionStep = z.infer<typeof ImmediateActionStepSchema>;

export const ImmediateActionItemSchema = z.union([z.string(), ImmediateActionStepSchema]);
export type ImmediateActionItem = z.infer<typeof ImmediateActionItemSchema>;

export interface NormalizedImmediateActionStep {
	title: string;
	instruction: string;
	substeps?: string[];
	variants?: Array<{ condition: string; action: string }>;
	note?: string;
}

/**
 * Normalizes an immediate action item (legacy string or structured step)
 * into a canonical structured step.
 */
export function normalizeImmediateAction(item: ImmediateActionItem | undefined | null): NormalizedImmediateActionStep {
	if (!item) {
		return { title: '', instruction: '' };
	}
	if (typeof item !== 'string') {
		return {
			title: (item.title || '').trim(),
			instruction: (item.instruction || '').trim(),
			substeps: item.substeps,
			variants: item.variants,
			note: item.note
		};
	}

	const str = item.trim();

	// Parse legacy string format with colon: "1. TITLE: Instruction text."
	const colonIndex = str.indexOf(':');
	if (colonIndex > 0 && colonIndex < 80) {
		const rawTitle = str.slice(0, colonIndex).replace(/^\d+[\.\)]\s*/, '').trim();
		const rawInstruction = str.slice(colonIndex + 1).trim();
		if (rawTitle && rawInstruction) {
			return {
				title: rawTitle,
				instruction: rawInstruction
			};
		}
	}

	// Parse legacy uppercase title format without colon: "1. TITLE Instruction text."
	const numberedMatch = str.match(/^(?:\d+[\.\)]\s*)?([A-ZÄÖÜ\s\-\/\(\)]{3,})\s+(.*)$/s);
	if (numberedMatch) {
		return {
			title: numberedMatch[1].trim().replace(/^[\d\.\s]+/, ''),
			instruction: numberedMatch[2].trim()
		};
	}

	return {
		title: '',
		instruction: str.replace(/^\d+[\.\)]\s*/, '').trim()
	};
}

/**
 * Extracts a concise, human-readable preview from the primary immediate action.
 * Returns title, instruction, and a combined formatted string.
 */
export function getImmediateActionPreview(item: ImmediateActionItem | undefined | null): {
	title: string;
	instruction: string;
	formatted: string;
} {
	if (!item) {
		return { title: '', instruction: '', formatted: '' };
	}
	const normalized = normalizeImmediateAction(item);
	const title = normalized.title;
	const instruction = normalized.instruction;

	let formatted = '';
	if (title && instruction) {
		formatted = `${title}: ${instruction}`;
	} else if (instruction) {
		formatted = instruction;
	} else if (title) {
		formatted = title;
	}

	return { title, instruction, formatted };
}

/**
 * Extracts all searchable text from an immediate action item (deep flattening for search).
 */
export function flattenImmediateActionForSearch(item: ImmediateActionItem | undefined | null): string {
	if (!item) return '';
	if (typeof item === 'string') {
		return item.trim();
	}
	const parts: string[] = [];
	if (item.title) parts.push(item.title.trim());
	if (item.instruction) parts.push(item.instruction.trim());
	if (item.substeps && item.substeps.length > 0) {
		for (const s of item.substeps) {
			if (s && s.trim()) parts.push(s.trim());
		}
	}
	if (item.variants && item.variants.length > 0) {
		for (const v of item.variants) {
			if (v.condition && v.action) parts.push(`${v.condition.trim()}: ${v.action.trim()}`);
		}
	}
	if (item.note && item.note.trim()) parts.push(item.note.trim());
	return parts.join(' ');
}

export const ArticleFrontmatterSchema = z.object({
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/, 'Slug must be kebab-case'),
	title: z.string().min(1),
	subtitle: z.string().optional(),
	category: CategoryEnum,
	tags: z.array(z.string()).default([]),
	aliases: z.array(z.string()).default([]),
	severity: SeverityEnum,
	urgency: UrgencyEnum,
	threat_level: z.number().int().min(0).max(5),
	difficulty: z.enum(['easy', 'moderate', 'hard']).default('easy'),
	region_scope: RegionScopeEnum.default('global'),
	regional_variations: z.array(RegionalVariationSchema).optional(),
	medical: z.boolean().default(false),
	emergency_services: EmergencyServicesActionEnum.default('context_dependent'),
	status: ArticleStatusEnum.default('draft'),
	reviewed_at: z.string().optional(),
	review_due: z.string().optional(),
	reviewer: z.string().optional(),
	sources: z.array(SourceReferenceSchema).default([]),
	memory_hook: z.string().min(1, 'Memory hook must be defined'),
	memorable_facts: z.array(z.string()).optional(),
	immediate_action: z
		.array(ImmediateActionItemSchema)
		.min(1, 'At least one immediate action required'),
	do_not: z.array(z.string()).default([]),
	why_this_happens: z.string().optional(),
	what_happens_next: z.string().optional(),
	when_to_call_services: z.string().optional()
});
export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;

export interface Article extends ArticleFrontmatter {
	lang: 'en' | 'de';
	body: string;
	html: string;
}

export const PageFrontmatterSchema = z.object({
	slug: z.string().min(1),
	title: z.string().min(1),
	description: z.string().optional(),
	last_updated: z.string().optional()
});
export type PageFrontmatter = z.infer<typeof PageFrontmatterSchema>;

export interface StaticPage extends PageFrontmatter {
	lang: 'en' | 'de';
	body: string;
	html: string;
}

export interface CategoryInfo {
	id: Category;
	title: Record<'en' | 'de', string>;
	description: Record<'en' | 'de', string>;
	humorousTitle: Record<'en' | 'de', string>;
	icon: string;
	threatDefault: number;
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
	weather: {
		id: 'weather',
		title: { en: 'Weather & Atmospheric', de: 'Wetter & Atmosphäre' },
		humorousTitle: { en: 'Atmospheric Inconveniences', de: 'Atmosphärische Unannehmlichkeiten' },
		description: {
			en: 'Lightning, tornadoes, storms, and other occasions where the sky develops an attitude.',
			de: 'Blitzschlag, Stürme, Unwetter und Momente, in denen der Himmel Launen entwickelt.'
		},
		icon: 'CloudLightning',
		threatDefault: 4
	},
	water: {
		id: 'water',
		title: { en: 'Water & Maritime', de: 'Wasser & Schifffahrt' },
		humorousTitle: { en: 'Hydraulic Complications', de: 'Hydraulische Komplikationen' },
		description: {
			en: 'Rip currents, cold water shock, ice, floods, and vehicles acting as questionable submarines.',
			de: 'Strömungen, Eisbruch, Überschwemmungen und Fahrzeuge in fragwürdiger U-Boot-Rolle.'
		},
		icon: 'Waves',
		threatDefault: 4
	},
	fire: {
		id: 'fire',
		title: { en: 'Fire & Combustion', de: 'Feuer & Verbrennung' },
		humorousTitle: { en: 'Thermal Misunderstandings', de: 'Thermische Missverständnisse' },
		description: {
			en: 'Grease fires, electrical fires, smoke inhalation, and sudden exothermic events.',
			de: 'Fettbrände, Elektrobrände, Rauchentwicklung und plötzliche exotherme Ereignisse.'
		},
		icon: 'Flame',
		threatDefault: 4
	},
	electricity: {
		id: 'electricity',
		title: { en: 'Electricity & High Voltage', de: 'Elektrizität & Hochspannung' },
		humorousTitle: { en: 'High-Voltage Enthusiasm', de: 'Hochspannungs-Begeisterung' },
		description: {
			en: 'Fallen power lines, step potential, wet circuits, and why direct current is unsentimental.',
			de: 'Abgerissene Stromleitungen, Schrittspannung und unbedachte Kontakte.'
		},
		icon: 'Zap',
		threatDefault: 5
	},
	home: {
		id: 'home',
		title: { en: 'Home & Domestic Hazards', de: 'Haushalt & Gebäudegefahren' },
		humorousTitle: { en: 'Domestic Treachery', de: 'Häusliche Hinterhalte' },
		description: {
			en: 'Gas leaks, carbon monoxide, chemical cleaning mixtures, and quiet indoor hazards.',
			de: 'Gaslecks, Kohlenmonoxid, Reinigungsmittel-Mischungen und lautlose Risiken.'
		},
		icon: 'Home',
		threatDefault: 3
	},
	medical: {
		id: 'medical',
		title: { en: 'Medical Basics & First Aid', de: 'Erste Hilfe & Medizinische Notfälle' },
		humorousTitle: { en: 'Fragile Biology', de: 'Fragile Biologie' },
		description: {
			en: 'Choking, severe bleeding, stroke, heart attack, hypothermia, and immediate life support.',
			de: 'Ersticken, schwere Blutungen, Schlaganfall, Herzinfarkt und lebensrettende Sofortmaßnahmen.'
		},
		icon: 'HeartPulse',
		threatDefault: 4
	},
	vehicles: {
		id: 'vehicles',
		title: { en: 'Roads & Vehicles', de: 'Straßenverkehr & Fahrzeuge' },
		humorousTitle: { en: 'Kinetic Transport Failures', de: 'Kinetische Transportpannen' },
		description: {
			en: 'Submerged cars, motorway breakdowns, brake failures, and rapid velocity changes.',
			de: 'Versinkende Autos, Autobahnpannen, Bremsversagen und unplanmäßige Stillstände.'
		},
		icon: 'Car',
		threatDefault: 4
	},
	animals: {
		id: 'animals',
		title: { en: 'Animals & Wildlife', de: 'Tiere & Wildtiere' },
		humorousTitle: { en: 'Zoological Disagreements', de: 'Zoologische Meinungsverschiedenheiten' },
		description: {
			en: 'Aggressive dogs, surprisingly fast cattle, wild boars, venomous bites, and insect swarms.',
			de: 'Aggressive Hunde, unerwartet schnelle Rinder, Wildschweine, Bisse und Stiche.'
		},
		icon: 'Footprints',
		threatDefault: 3
	},
	outdoors: {
		id: 'outdoors',
		title: { en: 'Outdoors & Wilderness', de: 'Natur & Wildnis' },
		humorousTitle: { en: 'Terrestrial Wilderness', de: 'Terrestrische Wildnis' },
		description: {
			en: 'Getting lost, hypothermia, rockfalls, avalanches, and sudden isolation.',
			de: 'Verirren, Unterkühlung, Steinschlag, Lawinen und Orientierungsverlust.'
		},
		icon: 'Compass',
		threatDefault: 3
	},
	buildings: {
		id: 'buildings',
		title: { en: 'Buildings & Architecture', de: 'Gebäude & Bauwerke' },
		humorousTitle: { en: 'Structural Opinions', de: 'Strukturelle Meinungen' },
		description: {
			en: 'Elevator stops, emergency exits, structural collapse signs, and room evacuation.',
			de: 'Aufzugsstörungen, Fluchtwege, Einsturzsignale und Notausgänge.'
		},
		icon: 'Building2',
		threatDefault: 3
	},
	crowds: {
		id: 'crowds',
		title: { en: 'Crowds & Public Spaces', de: 'Menschenmengen & Öffentlichkeit' },
		humorousTitle: { en: 'Human Clustering Dynamics', de: 'Menschliche Verdichtungsdynamik' },
		description: {
			en: 'Crowd surges, bottleneck escapes, stampede prevention, and spatial awareness.',
			de: 'Dichte Gedränge, Engpässe, Schockwellen in Menschenmassen und Fluchtwege.'
		},
		icon: 'Users',
		threatDefault: 4
	},
	digital: {
		id: 'digital',
		title: { en: 'Digital & Battery Hazards', de: 'Digitale & Batteriegefahren' },
		humorousTitle: { en: 'Silicon & Chemical Anomalies', de: 'Silizium & Zellchemie' },
		description: {
			en: 'Swollen lithium-ion pouches, thermal runaways, and critical tech cutoffs.',
			de: 'Aufgeblähte Lithium-Akkus, thermisches Durchgehen und Ladebrände.'
		},
		icon: 'BatteryWarning',
		threatDefault: 3
	}
};

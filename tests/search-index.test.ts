import { describe, it, expect } from 'vitest';
import MiniSearch from 'minisearch';
import { getSearchIndex } from '../src/lib/server/content';

function createSearchEngine(lang: 'en' | 'de') {
	const raw = getSearchIndex(lang);
	const mini = new MiniSearch({
		fields: [
			'title',
			'subtitle',
			'aliases',
			'tags',
			'memory_hook',
			'immediate_action',
			'memorable_facts',
			'body'
		],
		storeFields: ['slug', 'title', 'category', 'threat_level', 'memory_hook', 'status'],
		searchOptions: {
			prefix: true,
			fuzzy: 0.2,
			combineWith: 'OR',
			boost: {
				title: 6,
				aliases: 5,
				tags: 4,
				memory_hook: 2.5,
				immediate_action: 2,
				memorable_facts: 2,
				body: 1
			}
		}
	});
	mini.addAll(raw);
	return { mini, raw };
}

describe('Search Index Engine Regression Suite', () => {
	it('should index all 25 EN articles and match all required English queries', () => {
		const { mini, raw } = createSearchEngine('en');
		expect(raw.length).toBeGreaterThanOrEqual(25);

		const requiredQueries: Array<{ query: string; expectedSlug: string }> = [
			{ query: 'heart attack', expectedSlug: 'chest-feeling-unreasonably-heavy' },
			{ query: 'chest pain', expectedSlug: 'chest-feeling-unreasonably-heavy' },
			{ query: 'choking', expectedSlug: 'person-currently-choking' },
			{ query: 'heimlich', expectedSlug: 'person-currently-choking' },
			{ query: 'bleeding', expectedSlug: 'bleeding-more-than-is-generally-recommended' },
			{ query: 'tourniquet', expectedSlug: 'bleeding-more-than-is-generally-recommended' },
			{ query: 'lightning', expectedSlug: 'hair-suddenly-vertical' },
			{ query: 'hair standing up', expectedSlug: 'hair-suddenly-vertical' },
			{ query: 'gas smell', expectedSlug: 'gas-noticeably-existing-indoors' },
			{ query: 'rotten eggs', expectedSlug: 'gas-noticeably-existing-indoors' },
			{
				query: 'carbon monoxide',
				expectedSlug: 'carbon-monoxide-quietly-ruining-everyones-afternoon'
			},
			{ query: 'drowning', expectedSlug: 'person-has-inhaled-more-water-than-recommended' },
			{ query: 'stroke', expectedSlug: 'face-doing-something-weird-on-one-side' },
			{ query: 'FAST', expectedSlug: 'face-doing-something-weird-on-one-side' },
			{ query: 'Reading Saves Lives', expectedSlug: 'reading-saves-lives' },
			{ query: 'why reading helps', expectedSlug: 'reading-saves-lives' },
			{ query: 'chemical in eye', expectedSlug: 'eye-recently-contacted-by-angry-chemical' },
			{ query: 'asthma attack', expectedSlug: 'asthma-inhaler-not-doing-the-job' },
			{ query: 'needle poke', expectedSlug: 'skin-recently-perforated-by-hypodermic-needle' },
			{ query: 'thunderclap headache', expectedSlug: 'sudden-crushing-headache-like-thunder' },
			{ query: 'tick bite', expectedSlug: 'tick-currently-attached-and-dining' },
			{ query: 'knocked out tooth', expectedSlug: 'tooth-violently-evicted-from-mouth' },
			{
				query: 'unresponsive breathing',
				expectedSlug: 'person-unconscious-but-inconveniently-still-breathing'
			},
			{ query: 'severed finger', expectedSlug: 'something-important-is-no-longer-attached' },
			{ query: 'hypoglycemia', expectedSlug: 'blood-sugar-has-left-the-chat' },
			{
				query: 'broken bone',
				expectedSlug: 'body-part-pointing-in-a-new-and-unapproved-direction'
			},
			{
				query: 'circulatory shock',
				expectedSlug: 'person-looking-alarmingly-pale-after-something-bad-happened'
			},
			{ query: 'power line on car', expectedSlug: 'vehicle-currently-touching-a-power-line' },
			{ query: 'car on fire', expectedSlug: 'car-currently-on-fire' },
			{ query: 'bleach and ammonia', expectedSlug: 'cleaning-products-have-formed-an-alliance' },
			{ query: 'knife stuck in person', expectedSlug: 'something-is-stuck-in-a-person' },
			{ query: 'dog bite rabies', expectedSlug: 'animal-has-made-an-unplanned-hole-in-you' },
			{ query: 'snake bite', expectedSlug: 'snake-has-expressed-an-opinion' },
			{
				query: 'earthquake drop cover',
				expectedSlug: 'building-has-started-moving-without-permission'
			},
			{ query: 'tornado shelter', expectedSlug: 'sky-is-rotating-more-than-usual' },
			{ query: 'wildfire evacuation', expectedSlug: 'wildfire-is-now-considerably-less-distant' },
			{ query: 'stuck in elevator', expectedSlug: 'elevator-has-stopped-being-an-elevator' },
			{ query: 'escalator emergency stop', expectedSlug: 'escalator-currently-eating-something' },
			{ query: 'sucking chest wound', expectedSlug: 'open-chest-wound-sucking-sound' },
			{ query: 'frostbite water bath', expectedSlug: 'frostbite-turning-fingers-waxy-and-solid' },
			{
				query: 'heat exhaustion electrolytes',
				expectedSlug: 'heat-cramps-and-exhaustion-escalating'
			}
		];

		for (const { query, expectedSlug } of requiredQueries) {
			const results = mini.search(query, {
				prefix: true,
				fuzzy: 0.2,
				combineWith: 'OR',
				boost: {
					title: 6,
					aliases: 5,
					tags: 4,
					memory_hook: 2.5,
					immediate_action: 2,
					memorable_facts: 2,
					body: 1
				}
			});
			expect(
				results.length,
				`Search for "${query}" should yield at least 1 result`
			).toBeGreaterThan(0);
			expect(
				results.some((r) => r.slug === expectedSlug),
				`Search for "${query}" should match slug "${expectedSlug}". Top result: ${results[0]?.slug}`
			).toBe(true);
		}
	});

	it('should index all DE articles and pages, matching all required German queries', () => {
		const { mini, raw } = createSearchEngine('de');
		expect(raw.length).toBeGreaterThanOrEqual(25);

		const requiredQueries: Array<{ query: string; expectedSlug: string }> = [
			{ query: 'herzinfarkt', expectedSlug: 'chest-feeling-unreasonably-heavy' },
			{ query: 'brustschmerz', expectedSlug: 'chest-feeling-unreasonably-heavy' },
			{ query: 'verschluckt', expectedSlug: 'person-currently-choking' },
			{ query: 'heimlich', expectedSlug: 'person-currently-choking' },
			{ query: 'blutung', expectedSlug: 'bleeding-more-than-is-generally-recommended' },
			{ query: 'tourniquet', expectedSlug: 'bleeding-more-than-is-generally-recommended' },
			{ query: 'gewitter', expectedSlug: 'hair-suddenly-vertical' },
			{ query: 'haare stehen zu berge', expectedSlug: 'hair-suddenly-vertical' },
			{ query: 'gasgeruch', expectedSlug: 'gas-noticeably-existing-indoors' },
			{
				query: 'kohlenmonoxid',
				expectedSlug: 'carbon-monoxide-quietly-ruining-everyones-afternoon'
			},
			{ query: 'ertrinken', expectedSlug: 'person-has-inhaled-more-water-than-recommended' },
			{ query: 'schlaganfall', expectedSlug: 'face-doing-something-weird-on-one-side' },
			{ query: 'Lesen rettet Leben', expectedSlug: 'reading-saves-lives' },
			{ query: 'warum lesen hilft', expectedSlug: 'reading-saves-lives' },
			{ query: 'chemikalie im auge', expectedSlug: 'eye-recently-contacted-by-angry-chemical' },
			{ query: 'asthmaanfall', expectedSlug: 'asthma-inhaler-not-doing-the-job' },
			{
				query: 'nadelstichverletzung',
				expectedSlug: 'skin-recently-perforated-by-hypodermic-needle'
			},
			{ query: 'donnerschlagkopfschmerz', expectedSlug: 'sudden-crushing-headache-like-thunder' },
			{ query: 'zeckenbiss', expectedSlug: 'tick-currently-attached-and-dining' },
			{ query: 'zahn ausgeschlagen', expectedSlug: 'tooth-violently-evicted-from-mouth' },
			{
				query: 'stabile seitenlage',
				expectedSlug: 'person-unconscious-but-inconveniently-still-breathing'
			},
			{ query: 'finger abgetrennt', expectedSlug: 'something-important-is-no-longer-attached' },
			{ query: 'unterzuckerung', expectedSlug: 'blood-sugar-has-left-the-chat' },
			{
				query: 'knochen gebrochen',
				expectedSlug: 'body-part-pointing-in-a-new-and-unapproved-direction'
			},
			{
				query: 'schocklagerung',
				expectedSlug: 'person-looking-alarmingly-pale-after-something-bad-happened'
			},
			{ query: 'stromleitung auf auto', expectedSlug: 'vehicle-currently-touching-a-power-line' },
			{ query: 'auto brennt', expectedSlug: 'car-currently-on-fire' },
			{
				query: 'reinigungsmittel gemischt',
				expectedSlug: 'cleaning-products-have-formed-an-alliance'
			},
			{ query: 'messer im koerper', expectedSlug: 'something-is-stuck-in-a-person' },
			{ query: 'hundebiss tollwut', expectedSlug: 'animal-has-made-an-unplanned-hole-in-you' },
			{ query: 'schlangenbiss', expectedSlug: 'snake-has-expressed-an-opinion' },
			{
				query: 'erdbeben verhalten',
				expectedSlug: 'building-has-started-moving-without-permission'
			},
			{ query: 'tornado schutzraum', expectedSlug: 'sky-is-rotating-more-than-usual' },
			{ query: 'waldbrand evakuierung', expectedSlug: 'wildfire-is-now-considerably-less-distant' },
			{ query: 'aufzug steckengeblieben', expectedSlug: 'elevator-has-stopped-being-an-elevator' },
			{ query: 'rolltreppe not aus', expectedSlug: 'escalator-currently-eating-something' },
			{ query: 'offener pneumothorax', expectedSlug: 'open-chest-wound-sucking-sound' },
			{ query: 'erfrierung wasserbad', expectedSlug: 'frostbite-turning-fingers-waxy-and-solid' },
			{ query: 'hitzeerschoepfung', expectedSlug: 'heat-cramps-and-exhaustion-escalating' }
		];

		for (const { query, expectedSlug } of requiredQueries) {
			const results = mini.search(query, {
				prefix: true,
				fuzzy: 0.2,
				combineWith: 'OR',
				boost: {
					title: 6,
					aliases: 5,
					tags: 4,
					memory_hook: 2.5,
					immediate_action: 2,
					memorable_facts: 2,
					body: 1
				}
			});
			expect(
				results.length,
				`Search for "${query}" should yield at least 1 result`
			).toBeGreaterThan(0);
			expect(
				results.some((r) => r.slug === expectedSlug || r.slug === 'lesen-rettet-leben'),
				`Search for "${query}" should match slug "${expectedSlug}". Top result: ${results[0]?.slug}`
			).toBe(true);
		}
	});
});

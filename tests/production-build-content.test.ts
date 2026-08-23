import { describe, it, expect } from 'vitest';
import {
	loadAllArticles,
	loadAllStaticPages,
	getArticle,
	getStaticPage,
	getArticlesByCategory,
	getRandomArticle
} from '../src/lib/server/content';

describe('Cloudflare Production Content Loader (Build-Time Embedded)', () => {
	it('should contain all 51 EN articles without filesystem access', () => {
		const articles = loadAllArticles('en');
		expect(articles.length).toBe(51);
		const slugs = articles.map((a) => a.slug);
		expect(slugs).toContain('large-reptile-has-decided-you-are-relevant');
		expect(slugs).toContain('person-currently-choking');
		expect(slugs).toContain('hair-suddenly-vertical');
		expect(slugs).toContain('oil-currently-on-fire');
		expect(slugs).toContain('carbon-monoxide-quietly-ruining-everyones-afternoon');
		expect(slugs).toContain('power-line-inconveniently-on-the-ground');
		expect(slugs).toContain('face-doing-something-weird-on-one-side');
		expect(slugs).toContain('chest-feeling-unreasonably-heavy');
		expect(slugs).toContain('allergy-escalating-rather-quickly');
		expect(slugs).toContain('person-currently-having-a-seizure');
		expect(slugs).toContain('skin-recently-introduced-to-too-much-heat');
		expect(slugs).toContain('person-no-longer-breathing-for-some-reason');
		expect(slugs).toContain('person-has-inhaled-more-water-than-recommended');
		expect(slugs).toContain('electricity-currently-using-a-person-as-a-wire');
		expect(slugs).toContain('someone-ate-something-they-really-should-not-have');
		expect(slugs).toContain('head-recently-met-something-solid');
		expect(slugs).toContain('eye-recently-contacted-by-angry-chemical');
		expect(slugs).toContain('asthma-inhaler-not-doing-the-job');
		expect(slugs).toContain('skin-recently-perforated-by-hypodermic-needle');
		expect(slugs).toContain('sudden-crushing-headache-like-thunder');
		expect(slugs).toContain('tick-currently-attached-and-dining');
		expect(slugs).toContain('tooth-violently-evicted-from-mouth');
		expect(slugs).toContain('person-unconscious-but-inconveniently-still-breathing');
		expect(slugs).toContain('something-important-is-no-longer-attached');
		expect(slugs).toContain('blood-sugar-has-left-the-chat');
		expect(slugs).toContain('body-part-pointing-in-a-new-and-unapproved-direction');
		expect(slugs).toContain('person-looking-alarmingly-pale-after-something-bad-happened');
		expect(slugs).toContain('vehicle-currently-touching-a-power-line');
		expect(slugs).toContain('car-currently-on-fire');
		expect(slugs).toContain('cleaning-products-have-formed-an-alliance');
		expect(slugs).toContain('something-is-stuck-in-a-person');
		expect(slugs).toContain('animal-has-made-an-unplanned-hole-in-you');
		expect(slugs).toContain('snake-has-expressed-an-opinion');
		expect(slugs).toContain('building-has-started-moving-without-permission');
		expect(slugs).toContain('sky-is-rotating-more-than-usual');
		expect(slugs).toContain('wildfire-is-now-considerably-less-distant');
		expect(slugs).toContain('elevator-has-stopped-being-an-elevator');
		expect(slugs).toContain('escalator-currently-eating-something');
		expect(slugs).toContain('open-chest-wound-sucking-sound');
		expect(slugs).toContain('frostbite-turning-fingers-waxy-and-solid');
		expect(slugs).toContain('heat-cramps-and-exhaustion-escalating');
	});

	it('should contain all 51 DE articles without filesystem access', () => {
		const articles = loadAllArticles('de');
		expect(articles.length).toBe(51);
		const slugs = articles.map((a) => a.slug);
		expect(slugs).toContain('large-reptile-has-decided-you-are-relevant');
		expect(slugs).toContain('person-currently-choking');
		expect(slugs).toContain('hair-suddenly-vertical');
		expect(slugs).toContain('oil-currently-on-fire');
		expect(slugs).toContain('carbon-monoxide-quietly-ruining-everyones-afternoon');
		expect(slugs).toContain('power-line-inconveniently-on-the-ground');
		expect(slugs).toContain('face-doing-something-weird-on-one-side');
		expect(slugs).toContain('chest-feeling-unreasonably-heavy');
		expect(slugs).toContain('allergy-escalating-rather-quickly');
		expect(slugs).toContain('person-currently-having-a-seizure');
		expect(slugs).toContain('skin-recently-introduced-to-too-much-heat');
		expect(slugs).toContain('person-no-longer-breathing-for-some-reason');
		expect(slugs).toContain('person-has-inhaled-more-water-than-recommended');
		expect(slugs).toContain('electricity-currently-using-a-person-as-a-wire');
		expect(slugs).toContain('someone-ate-something-they-really-should-not-have');
		expect(slugs).toContain('head-recently-met-something-solid');
		expect(slugs).toContain('eye-recently-contacted-by-angry-chemical');
		expect(slugs).toContain('asthma-inhaler-not-doing-the-job');
		expect(slugs).toContain('skin-recently-perforated-by-hypodermic-needle');
		expect(slugs).toContain('sudden-crushing-headache-like-thunder');
		expect(slugs).toContain('tick-currently-attached-and-dining');
		expect(slugs).toContain('tooth-violently-evicted-from-mouth');
		expect(slugs).toContain('person-unconscious-but-inconveniently-still-breathing');
		expect(slugs).toContain('something-important-is-no-longer-attached');
		expect(slugs).toContain('blood-sugar-has-left-the-chat');
		expect(slugs).toContain('body-part-pointing-in-a-new-and-unapproved-direction');
		expect(slugs).toContain('person-looking-alarmingly-pale-after-something-bad-happened');
		expect(slugs).toContain('vehicle-currently-touching-a-power-line');
		expect(slugs).toContain('car-currently-on-fire');
		expect(slugs).toContain('cleaning-products-have-formed-an-alliance');
		expect(slugs).toContain('something-is-stuck-in-a-person');
		expect(slugs).toContain('animal-has-made-an-unplanned-hole-in-you');
		expect(slugs).toContain('snake-has-expressed-an-opinion');
		expect(slugs).toContain('building-has-started-moving-without-permission');
		expect(slugs).toContain('sky-is-rotating-more-than-usual');
		expect(slugs).toContain('wildfire-is-now-considerably-less-distant');
		expect(slugs).toContain('elevator-has-stopped-being-an-elevator');
		expect(slugs).toContain('escalator-currently-eating-something');
		expect(slugs).toContain('open-chest-wound-sucking-sound');
		expect(slugs).toContain('frostbite-turning-fingers-waxy-and-solid');
		expect(slugs).toContain('heat-cramps-and-exhaustion-escalating');
	});

	it('should contain all EN static pages including Reading Saves Lives', () => {
		const pages = loadAllStaticPages('en');
		expect(pages.length).toBeGreaterThanOrEqual(11);
		const slugs = pages.map((p) => p.slug);
		expect(slugs).toContain('about');
		expect(slugs).toContain('methodology');
		expect(slugs).toContain('sources');
		expect(slugs).toContain('editorial-policy');
		expect(slugs).toContain('contributing');
		expect(slugs).toContain('imprint');
		expect(slugs).toContain('privacy');
		expect(slugs).toContain('terms');
		expect(slugs).toContain('security');
		expect(slugs).toContain('accessibility');
		expect(slugs).toContain('reading-saves-lives');
	});

	it('should contain all DE static pages including Lesen rettet Leben', () => {
		const pages = loadAllStaticPages('de');
		expect(pages.length).toBeGreaterThanOrEqual(11);
		const slugs = pages.map((p) => p.slug);
		expect(slugs).toContain('about');
		expect(slugs).toContain('methodology');
		expect(slugs).toContain('sources');
		expect(slugs).toContain('editorial-policy');
		expect(slugs).toContain('contributing');
		expect(slugs).toContain('imprint');
		expect(slugs).toContain('privacy');
		expect(slugs).toContain('terms');
		expect(slugs).toContain('security');
		expect(slugs).toContain('accessibility');
		expect(slugs).toContain('reading-saves-lives');
	});

	it('should resolve representative article routes with complete HTML and metadata', () => {
		const chokingEn = getArticle('person-currently-choking', 'en');
		expect(chokingEn).not.toBeNull();
		expect(chokingEn?.title).toBe('Person, Currently Choking');
		expect(chokingEn?.category).toBe('medical');
		expect(chokingEn?.html).toContain('Back Blows');
		expect(chokingEn?.immediate_action.length).toBeGreaterThan(0);

		const chokingDe = getArticle('person-currently-choking', 'de');
		expect(chokingDe).not.toBeNull();
		expect(chokingDe?.title).toBe('Person verschluckt sich gerade lebensgefährlich');
		expect(chokingDe?.html).toContain('Rückenschläge');

		const hairEn = getArticle('hair-suddenly-vertical', 'en');
		expect(hairEn).not.toBeNull();
		expect(hairEn?.threat_level).toBe(5);
	});

	it('should resolve representative static legal/trust and editorial pages with complete HTML', () => {
		const methodologyEn = getStaticPage('methodology', 'en');
		expect(methodologyEn).not.toBeNull();
		expect(methodologyEn?.title).toContain('Methodology');
		expect(methodologyEn?.html).toContain('Source Supremacy');

		const privacyDe = getStaticPage('privacy', 'de');
		expect(privacyDe).not.toBeNull();

		const readingEn = getStaticPage('reading-saves-lives', 'en');
		expect(readingEn).not.toBeNull();
		expect(readingEn?.title).toBe('Reading Saves Lives');
		expect(readingEn?.html).toContain('Recognition Clues');
		expect(readingEn?.html).toContain('/en/guide/hair-suddenly-vertical');

		const readingDe = getStaticPage('reading-saves-lives', 'de');
		expect(readingDe).not.toBeNull();
		expect(readingDe?.title).toBe('Lesen rettet Leben');
		expect(readingDe?.html).toContain('Wiedererkennen');
		expect(readingDe?.html).toContain('/de/guide/hair-suddenly-vertical');
	});

	it('should support category filtering and random article sampling without returning static pages', () => {
		const weatherEn = getArticlesByCategory('weather', 'en');
		expect(weatherEn.length).toBeGreaterThanOrEqual(1);
		expect(weatherEn.every((a) => a.category === 'weather')).toBe(true);

		const randomEn = getRandomArticle('en');
		expect(randomEn).not.toBeNull();
		expect(randomEn?.category).toBeDefined();
		expect(randomEn?.immediate_action).toBeDefined();
		expect(['reading-saves-lives', 'about', 'privacy']).not.toContain(randomEn?.slug);
	});
});

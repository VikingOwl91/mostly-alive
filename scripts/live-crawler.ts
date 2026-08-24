/**
 * Mostly Alive — Comprehensive Live Production Crawler & Full Site Audit
 */

const BASE_URL = 'https://mostly-alive.nachtigall.dev';

interface CheckResult {
	url: string;
	status: number;
	ok: boolean;
	details: string[];
	errors: string[];
}

async function probe(url: string, validator?: (text: string, res: Response) => { ok: boolean; details: string[]; errors: string[] }): Promise<CheckResult> {
	try {
		const res = await fetch(url, { headers: { 'User-Agent': 'MostlyAliveCrawler/3.0' } });
		const text = await res.text();
		if (!validator) {
			return {
				url,
				status: res.status,
				ok: res.status === 200,
				details: [`HTTP ${res.status}`],
				errors: res.status === 200 ? [] : [`Non-200 status code: ${res.status}`]
			};
		}
		const val = validator(text, res);
		return {
			url,
			status: res.status,
			ok: res.ok && val.ok,
			details: val.details,
			errors: val.errors
		};
	} catch (e: any) {
		return {
			url,
			status: 0,
			ok: false,
			details: [],
			errors: [`Network exception: ${e.message}`]
		};
	}
}

async function main() {
	console.log(`🌐 Initiating Comprehensive Live Production Crawl on: ${BASE_URL}\n`);

	const checks: CheckResult[] = [];

	// 1. Robots.txt
	checks.push(
		await probe(`${BASE_URL}/robots.txt`, (text) => {
			const details: string[] = [];
			const errors: string[] = [];
			if (text.includes(`Sitemap: ${BASE_URL}/sitemap.xml`)) {
				details.push('Dynamic Sitemap reference verified');
			} else {
				errors.push('Missing/incorrect Sitemap line');
			}
			if (text.includes('Disallow: /editor/')) details.push('Disallow /editor/ present');
			return { ok: errors.length === 0, details, errors };
		})
	);

	// 2. Social Card Image Asset
	checks.push(
		await probe(`${BASE_URL}/social-card.png`, (_, res) => {
			const details: string[] = [];
			const errors: string[] = [];
			const ct = res.headers.get('content-type') || '';
			const cl = parseInt(res.headers.get('content-length') || '0', 10);
			if (ct.includes('image/png')) {
				details.push(`Content-Type image/png (Size: ${cl || 'valid'} bytes)`);
			} else {
				errors.push(`Invalid Content-Type: ${ct}`);
			}
			return { ok: errors.length === 0, details, errors };
		})
	);

	// 3. Dynamic Sitemap.xml (Fetch and extract all URLs)
	let sitemapUrls: string[] = [];
	checks.push(
		await probe(`${BASE_URL}/sitemap.xml?v=${Date.now()}`, (text) => {
			const details: string[] = [];
			const errors: string[] = [];
			const locMatches = text.match(/<loc>([^<]+)<\/loc>/g) || [];
			sitemapUrls = locMatches.map((m) => m.replace(/<\/?loc>/g, ''));
			details.push(`Total indexed URLs: ${sitemapUrls.length}`);
			if (sitemapUrls.length !== 157) {
				errors.push(`Expected 157 URLs (51 EN guides + 51 DE guides + categories + pages + homepages), found ${sitemapUrls.length}`);
			}
			return { ok: errors.length === 0, details, errors };
		})
	);

	// 4. Special Deep Verification of Guide #51 (EN and DE)
	const guide51Cases = [
		{
			slug: 'large-reptile-has-decided-you-are-relevant',
			lang: 'en',
			title: 'Large Reptile Has Decided You Are Relevant',
			factTag: 'DINOSAUR ADJACENT / UNHELPFULLY SO',
			hook: "The water's edge is their front door. Do not wait for them to answer it."
		},
		{
			slug: 'large-reptile-has-decided-you-are-relevant',
			lang: 'de',
			title: 'Großes Reptil hat beschlossen, dass du relevant bist',
			factTag: 'DINOSAURUS-VERWANDT / BEDAUERLICH WENIG HILFREICH',
			hook: 'Die Uferkante ist ihre Haustür. Warte nicht darauf, dass sie dir aufmachen.'
		}
	];

	for (const tc of guide51Cases) {
		const target = `${BASE_URL}/${tc.lang}/guide/${tc.slug}`;
		checks.push(
			await probe(target, (text) => {
				const details: string[] = [];
				const errors: string[] = [];

				if (text.includes(tc.title)) details.push(`Title "${tc.title}" present`);
				else errors.push(`Missing title "${tc.title}"`);

				if (text.includes(tc.factTag)) details.push(`Fact "${tc.factTag}" present`);
				else errors.push(`Missing fact "${tc.factTag}"`);

				if (text.includes(tc.hook)) details.push('Memory hook present');
				else errors.push('Missing memory hook');

				if (text.includes('aria-label="Breadcrumb"')) details.push('Visible Breadcrumb nav present');
				else errors.push('Missing visible breadcrumbs');

				if (text.includes('"@type":"BreadcrumbList"')) details.push('JSON-LD BreadcrumbList present');
				else errors.push('Missing JSON-LD BreadcrumbList');

				if (text.includes('content="summary_large_image"')) details.push('Twitter summary_large_image verified');
				else errors.push('Missing summary_large_image');

				const navAria = tc.lang === 'de' ? 'Verwandte Sicherheitsanleitungen' : 'Related Survival Guides';
				const navMatch = text.match(new RegExp(`<nav aria-label="${navAria}">([\\s\\S]*?)<\\/nav>`));
				if (navMatch) {
					const navContent = navMatch[1];
					if (navContent.includes(`href="/${tc.lang}/guide/${tc.slug}"`)) {
						errors.push(`Self-link found in related guides section for "${tc.slug}"`);
					} else {
						details.push('Zero self-links in related guides verified');
					}
					const cardLinks = navContent.match(/href="\/(en|de)\/guide\/[^"]+"/g) || [];
					details.push(`Found ${cardLinks.length} related guide recommendations`);
					if (cardLinks.length !== 3) errors.push(`Expected 3 related recommendations, found ${cardLinks.length}`);
				} else {
					errors.push(`Could not find <nav aria-label="${navAria}"> block`);
				}

				return { ok: errors.length === 0, details, errors };
			})
		);
	}

	// 5. Full Crawl of All Remaining Sitemap URLs
	console.log(`🕷️ Crawling all ${sitemapUrls.length} sitemap URLs concurrently...`);
	const batchSize = 10;
	for (let i = 0; i < sitemapUrls.length; i += batchSize) {
		const batch = sitemapUrls.slice(i, i + batchSize);
		const results = await Promise.all(
			batch.map((url) =>
				probe(url, (text, res) => {
					const details: string[] = [`HTTP ${res.status}`];
					const errors: string[] = [];
					if (res.status !== 200) errors.push(`HTTP ${res.status}`);
					if (!text.includes('Mostly Alive')) errors.push('Missing site branding');
					return { ok: errors.length === 0, details, errors };
				})
			)
		);
		checks.push(...results);
	}

	console.log('==================================================');
	console.log('📊 Comprehensive Live Production Crawl Summary:');
	console.log('==================================================\n');

	let failed = 0;
	let totalPassed = 0;
	for (const c of checks) {
		if (!c.ok) {
			failed++;
			console.log(`❌ [HTTP ${c.status}] ${c.url}`);
			for (const e of c.errors) {
				console.log(`   ❌ ERROR: ${e}`);
			}
		} else {
			totalPassed++;
		}
	}

	console.log(`\n--------------------------------------------------`);
	console.log(`Total URLs Verified: ${checks.length}`);
	console.log(`Passed: ${totalPassed}`);
	console.log(`Failed: ${failed}`);
	console.log('--------------------------------------------------\n');

	if (failed > 0) {
		console.error(`❌ Live verification failed on ${failed} routes.`);
		process.exit(1);
	} else {
		console.log(`🎉 Complete production crawl succeeded! All ${checks.length} routes are 100% healthy!`);
	}
}

main().catch(console.error);

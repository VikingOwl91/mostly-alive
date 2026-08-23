/**
 * Mostly Alive — Comprehensive Live Production Crawler & SEO Pass 2C Verification
 */

const BASE_URL = 'https://mostly-alive.christian-d81.workers.dev';

interface CheckResult {
	url: string;
	status: number;
	ok: boolean;
	details: string[];
	errors: string[];
}

async function probe(url: string, validator: (text: string, res: Response) => { ok: boolean; details: string[]; errors: string[] }): Promise<CheckResult> {
	try {
		const res = await fetch(url, { headers: { 'User-Agent': 'MostlyAliveVerifier/2.0' } });
		const text = await res.text();
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
	console.log(`🌐 Initiating Live Production Probe on: ${BASE_URL}\n`);

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

	// 3. Dynamic Sitemap.xml
	checks.push(
		await probe(`${BASE_URL}/sitemap.xml`, (text) => {
			const details: string[] = [];
			const errors: string[] = [];
			const locMatches = text.match(/<loc>/g) || [];
			details.push(`Indexed URLs: ${locMatches.length}`);
			if (locMatches.length !== 155) {
				errors.push(`Expected 155 URLs, found ${locMatches.length}`);
			}
			return { ok: errors.length === 0, details, errors };
		})
	);

	// 4. Sample Articles across English and German
	const guideTestCases = [
		{ slug: 'hair-suddenly-vertical', lang: 'en', title: 'Hair, Suddenly Vertical' },
		{ slug: 'hair-suddenly-vertical', lang: 'de', title: 'Haare stehen plötzlich senkrecht' },
		{ slug: 'floodwater-looking-surprisingly-drivable', lang: 'en', title: 'Floodwater Looking Surprisingly Drivable' },
		{ slug: 'floodwater-looking-surprisingly-drivable', lang: 'de', title: 'Das Hochwasser sieht überraschend befahrbar aus' },
		{ slug: 'bleeding-more-than-is-generally-recommended', lang: 'en', title: 'Bleeding More Than Is Generally Recommended' },
		{ slug: 'bleeding-more-than-is-generally-recommended', lang: 'de', title: 'Es blutet mehr als allgemein empfohlen' }
	];

	for (const tc of guideTestCases) {
		const target = `${BASE_URL}/${tc.lang}/guide/${tc.slug}`;
		checks.push(
			await probe(target, (text) => {
				const details: string[] = [];
				const errors: string[] = [];

				// Check breadcrumbs
				if (text.includes('aria-label="Breadcrumb"')) {
					details.push('Visible Breadcrumb nav verified');
				} else {
					errors.push('Missing visible breadcrumb nav');
				}

				// Check Twitter large card
				if (text.includes('content="summary_large_image"')) {
					details.push('summary_large_image verified');
				} else {
					errors.push('Missing twitter:card summary_large_image');
				}

				// Check 1200x630 OG image
				if (text.includes(`${BASE_URL}/social-card.png`)) {
					details.push('og:image /social-card.png verified');
				} else {
					errors.push('Missing og:image social-card.png');
				}

				// Check related guides section
				const expectedHeader = tc.lang === 'de' ? '// VERWANDTE SICHERHEITSHINWEISE' : '// RELATED FIELD NOTES';
				const navAria = tc.lang === 'de' ? 'Verwandte Sicherheitsanleitungen' : 'Related Survival Guides';
				
				if (text.includes(expectedHeader)) {
					details.push(`Related guides header "${expectedHeader}" verified`);
				} else {
					errors.push(`Missing related guides header "${expectedHeader}"`);
				}

				// Extract related guides nav block and verify zero self-links
				const navMatch = text.match(new RegExp(`<nav aria-label="${navAria}">([\\s\\S]*?)<\\/nav>`));
				if (navMatch) {
					const navContent = navMatch[1];
					if (navContent.includes(`href="/${tc.lang}/guide/${tc.slug}"`)) {
						errors.push(`Self-link found in related guides section for "${tc.slug}"`);
					} else {
						details.push('Zero self-links in related guides block verified');
					}

					// Verify 3 recommendation links exist
					const cardLinks = navContent.match(/href="\/(en|de)\/guide\/[^"]+"/g) || [];
					details.push(`Found ${cardLinks.length} related guide recommendations`);
					if (cardLinks.length !== 3) {
						errors.push(`Expected 3 related recommendations, found ${cardLinks.length}`);
					}
				} else {
					errors.push(`Could not find <nav aria-label="${navAria}"> block`);
				}

				// Check BreadcrumbList JSON-LD
				if (text.includes('"@type":"BreadcrumbList"')) {
					details.push('JSON-LD BreadcrumbList verified');
				} else {
					errors.push('Missing JSON-LD BreadcrumbList');
				}

				return { ok: errors.length === 0, details, errors };
			})
		);
	}

	// 5. Category and Static pages breadcrumbs
	const otherRoutes = [
		{ path: '/en/categories/weather', lang: 'en' },
		{ path: '/de/categories/weather', lang: 'de' },
		{ path: '/en/reading-saves-lives', lang: 'en' },
		{ path: '/de/reading-saves-lives', lang: 'de' },
		{ path: '/en/guide', lang: 'en' },
		{ path: '/de/guide', lang: 'de' }
	];

	for (const route of otherRoutes) {
		const target = `${BASE_URL}${route.path}`;
		checks.push(
			await probe(target, (text) => {
				const details: string[] = [];
				const errors: string[] = [];

				if (text.includes('aria-label="Breadcrumb"')) {
					details.push('Visible Breadcrumb nav present');
				} else {
					errors.push('Missing visible breadcrumbs');
				}

				if (text.includes('"@type":"BreadcrumbList"')) {
					details.push('JSON-LD BreadcrumbList present');
				} else {
					errors.push('Missing JSON-LD BreadcrumbList');
				}

				return { ok: errors.length === 0, details, errors };
			})
		);
	}

	console.log('==================================================');
	console.log('📊 Live Production Verification Results:');
	console.log('==================================================\n');

	let failed = 0;
	for (const c of checks) {
		const statusIcon = c.ok ? '✅' : '❌';
		console.log(`${statusIcon} [HTTP ${c.status}] ${c.url}`);
		for (const d of c.details) {
			console.log(`   • ${d}`);
		}
		if (c.errors.length > 0) {
			failed++;
			for (const e of c.errors) {
				console.log(`   ❌ ERROR: ${e}`);
			}
		}
		console.log('');
	}

	console.log('--------------------------------------------------');
	if (failed > 0) {
		console.error(`❌ Live verification failed on ${failed} routes.`);
		process.exit(1);
	} else {
		console.log(`🎉 All ${checks.length} live production routes verified successfully!`);
	}
}

main().catch(console.error);

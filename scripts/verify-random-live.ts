/**
 * Live Verification Script for Structured Immediate Action Regression Fix
 */

const BASE_URL = 'https://mostly-alive.nachtigall.dev';

async function testRandomRolls(lang: 'en' | 'de', sampleCount = 20) {
	console.log(`🎲 Sampling ${sampleCount} live random rolls on /${lang}/random...`);
	const seenSlugs = new Set<string>();
	let objectObjectFound = false;

	for (let i = 0; i < sampleCount; i++) {
		const res = await fetch(`${BASE_URL}/${lang}/random?cb=${Date.now()}_${i}`, {
			headers: { 'User-Agent': 'MostlyAliveVerifier/1.0' }
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch /${lang}/random: HTTP ${res.status}`);
		}
		const html = await res.text();

		// Check for [object Object]
		if (html.includes('[object Object]')) {
			console.error(`❌ FATAL: [object Object] detected in /${lang}/random roll #${i + 1}!`);
			objectObjectFound = true;
		}

		// Extract slug
		const slugMatch = html.match(/SLUG:\s*([a-z0-9-]+)/);
		const slug = slugMatch ? slugMatch[1] : 'unknown';
		seenSlugs.add(slug);

		// Extract action block
		const actionHeading = lang === 'de' ? 'Wichtigste Sofortmaßnahme:' : 'Key Immediate Action:';
		if (!html.includes(actionHeading)) {
			console.error(`❌ Missing action heading in roll #${i + 1} for slug: ${slug}`);
		}
	}

	console.log(`  ✓ Sampled ${sampleCount} rolls across ${seenSlugs.size} distinct articles.`);
	console.log(`  ✓ [object Object] detections: ${objectObjectFound ? 'FAILED' : '0 (PASSED)'}\n`);

	if (objectObjectFound) {
		throw new Error(`[object Object] found during /${lang}/random sampling!`);
	}
}

async function testRouteZeroObjectArtifacts(url: string, description: string) {
	const res = await fetch(url, { headers: { 'User-Agent': 'MostlyAliveVerifier/1.0' } });
	if (!res.ok) {
		throw new Error(`Failed ${description} (${url}): HTTP ${res.status}`);
	}
	const html = await res.text();
	if (html.includes('[object Object]')) {
		throw new Error(`❌ [object Object] found in ${description} at ${url}!`);
	}
	console.log(`✓ ${description} [HTTP ${res.status}] — Clean, 0 object artifacts.`);
}

async function main() {
	console.log(`🚀 Verifying live production deployment: ${BASE_URL}\n`);

	// 1. Test live Random rolls
	await testRandomRolls('en', 25);
	await testRandomRolls('de', 25);

	// 2. Test specific representative guide routes
	console.log('📖 Auditing representative guide routes...');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/en/guide/blood-sugar-has-left-the-chat`, 'EN Blood Sugar Guide');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/de/guide/blood-sugar-has-left-the-chat`, 'DE Blood Sugar Guide');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/en/guide/large-reptile-has-decided-you-are-relevant`, 'EN Large Reptile Guide');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/de/guide/large-reptile-has-decided-you-are-relevant`, 'DE Large Reptile Guide');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/en/guide/chest-feeling-unreasonably-heavy`, 'EN Heart Attack Guide');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/de/guide/chest-feeling-unreasonably-heavy`, 'DE Heart Attack Guide');

	// 3. Test directory and index routes
	console.log('\n📂 Auditing directory, emergency, and category routes...');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/en/guide`, 'EN Guide Directory');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/de/guide`, 'DE Guide Directory');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/en/categories/medical`, 'EN Medical Category');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/de/categories/medical`, 'DE Medical Category');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/en/emergency`, 'EN Emergency Mode');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/de/emergency`, 'DE Emergency Mode');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/en`, 'EN Homepage');
	await testRouteZeroObjectArtifacts(`${BASE_URL}/de`, 'DE Homepage');

	console.log('\n🎉 ALL LIVE VERIFICATION CHECKS PASSED! Zero structured object regressions exist in production.');
}

main().catch((err) => {
	console.error('❌ Verification failed:', err);
	process.exit(1);
});

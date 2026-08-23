<script lang="ts">
	import {
		ArrowLeft,
		Printer,
		Share2,
		ShieldAlert,
		Edit3,
		MessageSquareWarning,
		BookOpen
	} from '@lucide/svelte';
	import ThreatGauge from '$lib/components/ThreatGauge.svelte';
	import ImmediateActionBanner from '$lib/components/ImmediateActionBanner.svelte';
	import DraftWarningBanner from '$lib/components/DraftWarningBanner.svelte';
	import DoNotCard from '$lib/components/DoNotCard.svelte';
	import MemoryHook from '$lib/components/MemoryHook.svelte';
	import MemorableFacts from '$lib/components/MemorableFacts.svelte';
	import SourceInspector from '$lib/components/SourceInspector.svelte';
	import EmergencyNumbersWidget from '$lib/components/EmergencyNumbersWidget.svelte';
	import RegionalVariationNote from '$lib/components/RegionalVariationNote.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import RelatedGuides from '$lib/components/RelatedGuides.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { buildGuideSeo } from '$lib/seo';

	let { data } = $props();
	let article = $derived(data.article);
	const seo = $derived(buildGuideSeo(article, data.lang));

	let copied = $state(false);

	function copyShareLink() {
		if (typeof window !== 'undefined') {
			navigator.clipboard.writeText(window.location.href);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	function handlePrint() {
		if (typeof window !== 'undefined') {
			window.print();
		}
	}
</script>

<SeoHead {seo} />

<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
	<!-- Visible Semantic Breadcrumb Navigation -->
	<Breadcrumbs items={seo.breadcrumbs || []} />

	<!-- Navigation & Tools Bar -->
	<div class="flex items-center justify-between gap-4 no-print text-xs font-mono text-slate-400">
		<a
			href="/{data.lang}/guide"
			class="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
		>
			<ArrowLeft class="w-4 h-4" />
			<span>{data.lang === 'de' ? 'Zurück zum Handbuch' : 'Back to Guide'}</span>
		</a>

		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={handlePrint}
				class="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
				title={data.lang === 'de' ? 'Taschenkarte drucken' : 'Print Pocket Card'}
			>
				<Printer class="w-4 h-4" />
			</button>

			<button
				type="button"
				onclick={copyShareLink}
				class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
			>
				<Share2 class="w-3.5 h-3.5" />
				<span
					>{copied
						? data.lang === 'de'
							? 'Kopiert!'
							: 'Copied!'
						: data.lang === 'de'
							? 'Teilen'
							: 'Share'}</span
				>
			</button>
		</div>
	</div>

	<!-- Article Header & Metadata -->
	<header class="space-y-4 border-b border-slate-800 pb-6">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="flex items-center gap-2">
				<a
					href="/{data.lang}/categories/{article.category}"
					class="font-mono text-xs uppercase font-bold text-amber-400 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60 transition-colors"
				>
					{article.category}
				</a>
				<span class="text-xs font-mono text-slate-500">
					SLUG: {article.slug}
				</span>
			</div>

			<ThreatGauge level={article.threat_level} lang={data.lang} />
		</div>

		<h1
			class="text-3xl sm:text-5xl font-mono font-black text-white uppercase tracking-tight leading-tight"
		>
			{article.title}
		</h1>

		{#if article.subtitle}
			<p class="text-lg text-slate-300 font-medium">
				{article.subtitle}
			</p>
		{/if}
	</header>

	<!-- Draft Notice (if unreviewed) -->
	<DraftWarningBanner status={article.status} lang={data.lang} />

	<!-- SAFETY LAYER (PRIORITIZED FIRST FOR HIGH-SEVERITY ARTICLES) -->
	<section class="space-y-6">
		<ImmediateActionBanner
			actions={article.immediate_action}
			lang={data.lang}
			urgency={article.urgency}
		/>

		<DoNotCard items={article.do_not} lang={data.lang} />

		{#if article.memory_hook}
			<MemoryHook hook={article.memory_hook} lang={data.lang} />
		{/if}
	</section>

	<!-- OBVIOUS FACT, USEFULLY QUANTIFIED / MEMORABLE FACTS -->
	{#if article.memorable_facts && article.memorable_facts.length > 0}
		<MemorableFacts facts={article.memorable_facts} lang={data.lang} />
	{/if}

	<!-- GUIDE & EXPLANATION LAYER (BODY) -->
	<section
		class="prose prose-invert prose-slate max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:text-amber-400 prose-a:text-cyan-400 prose-code:font-mono pt-4 border-t border-slate-800/80"
	>
		{@html article.html}
	</section>

	<!-- Regional Nuances Note -->
	{#if article.regional_variations && article.regional_variations.length > 0}
		<RegionalVariationNote variations={article.regional_variations} lang={data.lang} />
	{/if}

	<!-- Emergency Dispatch Widget (if services needed) -->
	{#if article.emergency_services !== 'not_required'}
		<div class="my-8">
			<EmergencyNumbersWidget lang={data.lang} />
		</div>
	{/if}

	<!-- PROVENANCE & SOURCES TRANSPARENCY -->
	<SourceInspector
		sources={article.sources}
		reviewedAt={article.reviewed_at}
		reviewDue={article.review_due}
		reviewer={article.reviewer}
		status={article.status}
		lang={data.lang}
	/>

	<!-- Editorial Feedback & Correction Actions -->
	<div
		class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 no-print"
	>
		<div class="flex items-center gap-2">
			<MessageSquareWarning class="w-4 h-4 text-amber-400" />
			<span>
				{data.lang === 'de'
					? 'Fehler oder veraltete Information entdeckt?'
					: 'Spotted an error or outdated standard?'}
			</span>
		</div>

		<div class="flex items-center gap-3">
			<a
				href="https://github.com/VikingOwl91/mostly-alive/issues/new?title=Correction+for+{article.slug}&body=Article:+{article.slug}"
				target="_blank"
				rel="noopener noreferrer"
				class="text-amber-400 hover:text-amber-300 font-semibold"
			>
				{data.lang === 'de' ? 'Korrektur melden' : 'Report Correction'}
			</a>
			<span>•</span>
			<a
				href="/editor?slug={article.slug}&lang={data.lang}"
				class="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
			>
				<Edit3 class="w-3.5 h-3.5" />
				<span>{data.lang === 'de' ? 'Im Web Studio bearbeiten' : 'Edit in Web Studio'}</span>
			</a>
		</div>
	</div>

	<!-- Related Survival Guides Discovery -->
	<RelatedGuides articles={data.relatedArticles || []} lang={data.lang} />
</article>

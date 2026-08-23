<script lang="ts">
	import { BookOpen, Filter, ArrowRight, ShieldCheck, AlertTriangle } from '@lucide/svelte';
	import ThreatGauge from '$lib/components/ThreatGauge.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { buildHandbookSeo } from '$lib/seo';
	import type { Category } from '$lib/types/content';

	let { data } = $props();

	const seo = $derived(buildHandbookSeo(data.lang));

	let selectedCategory: string = $state('all');
	let selectedThreat: string = $state('all');

	let filteredArticles = $derived(
		data.articles.filter((a) => {
			if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
			if (selectedThreat !== 'all') {
				const minThreat = parseInt(selectedThreat, 10);
				if (a.threat_level < minThreat) return false;
			}
			return true;
		})
	);
</script>

<SeoHead {seo} />

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
	<!-- Page Header -->
	<div class="border-b border-slate-800 pb-6">
		<div
			class="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold tracking-wider uppercase mb-1"
		>
			<BookOpen class="w-4 h-4" />
			<span>{data.lang === 'de' ? 'VOLLSTÄNDIGES HANDBUCH' : 'FULL GUIDE DIRECTORY'}</span>
		</div>
		<h1 class="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
			{data.lang === 'de' ? 'Überlebenswissen nach Situationen' : 'Survival Knowledge Base'}
		</h1>
		<p class="text-sm text-slate-400 mt-2 max-w-2xl">
			{data.lang === 'de'
				? 'Durchsuche alle dokumentierten Situationen. Jede Anleitung trennt präzise Sicherheitsanweisungen von absurden Fußnoten.'
				: 'Browse all documented situations. Every instruction clearly separates life-saving actions from dry commentary.'}
		</p>
	</div>

	<!-- Filter Controls -->
	<div
		class="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono"
	>
		<div class="flex items-center gap-2 text-slate-400">
			<Filter class="w-4 h-4 text-amber-400" />
			<span>{data.lang === 'de' ? 'Filter:' : 'Filters:'}</span>
		</div>

		<!-- Category Filter -->
		<select
			bind:value={selectedCategory}
			class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
		>
			<option value="all">{data.lang === 'de' ? 'Alle Kategorien' : 'All Categories'}</option>
			{#each data.categories as cat}
				<option value={cat.id}>{cat.title[data.lang]}</option>
			{/each}
		</select>

		<!-- Threat Level Filter -->
		<select
			bind:value={selectedThreat}
			class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
		>
			<option value="all">{data.lang === 'de' ? 'Jede Bedrohungsstufe' : 'Any Threat Level'}</option
			>
			<option value="3"
				>{data.lang === 'de' ? 'Ab Stufe 3 (Ernst)' : 'Threat Level 3+ (Severe)'}</option
			>
			<option value="4"
				>{data.lang === 'de' ? 'Ab Stufe 4 (Verlassen)' : 'Threat Level 4+ (Leave)'}</option
			>
			<option value="5"
				>{data.lang === 'de' ? 'Stufe 5 (Unmittelbar)' : 'Threat Level 5 (Immediate)'}</option
			>
		</select>

		<div class="ml-auto text-slate-400">
			{filteredArticles.length}
			{data.lang === 'de' ? 'Einträge' : 'entries'}
		</div>
	</div>

	<!-- Articles Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each filteredArticles as article}
			<a
				href="/{data.lang}/guide/{article.slug}"
				class="group rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/90 p-6 flex flex-col justify-between h-full transition-all hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]"
			>
				<div class="space-y-4 flex-1">
					<div class="flex items-center justify-between gap-2">
						<span
							class="font-mono text-[11px] uppercase font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30"
						>
							{article.category}
						</span>
						<ThreatGauge level={article.threat_level} lang={data.lang} />
					</div>

					<h2
						class="text-xl font-mono font-bold text-white group-hover:text-amber-300 transition-colors leading-snug"
					>
						{article.title}
					</h2>

					{#if article.memory_hook}
						<p
							class="text-xs text-cyan-200/90 italic bg-cyan-950/30 p-3 rounded-lg border border-cyan-900/40 leading-relaxed"
						>
							"{article.memory_hook}"
						</p>
					{/if}

					<p class="text-xs text-slate-300 leading-relaxed font-sans">
						{article.immediate_action[0]}
					</p>
				</div>

				<div
					class="pt-4 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-amber-400 border-t border-slate-800/60 mt-5 shrink-0"
				>
					<span class="flex items-center gap-1.5">
						{#if article.status === 'reviewed'}
							<ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
							<span class="text-emerald-400 font-medium"
								>{data.lang === 'de' ? 'Geprüft' : 'Reviewed'}</span
							>
						{:else}
							<AlertTriangle class="w-3.5 h-3.5 text-amber-400" />
							<span class="text-amber-400 font-medium"
								>{data.lang === 'de' ? 'Entwurf' : 'Draft'}</span
							>
						{/if}
					</span>
					<span class="flex items-center gap-1">
						<span>{data.lang === 'de' ? 'Öffnen' : 'Read'}</span>
						<ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
					</span>
				</div>
			</a>
		{/each}
	</div>
</div>

<script lang="ts">
	import { ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle } from '@lucide/svelte';
	import ThreatGauge from '$lib/components/ThreatGauge.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.categoryInfo.title[data.lang]} — Mostly Alive</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
	<!-- Navigation -->
	<a
		href="/{data.lang}/categories"
		class="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-cyan-400 transition-colors"
	>
		<ArrowLeft class="w-4 h-4" />
		<span>{data.lang === 'de' ? 'Alle Kategorien' : 'All Categories'}</span>
	</a>

	<!-- Header -->
	<div class="border-b border-slate-800 pb-6">
		<div class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
			{data.categoryInfo.humorousTitle[data.lang]}
		</div>
		<h1 class="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
			{data.categoryInfo.title[data.lang]}
		</h1>
		<p class="text-sm text-slate-400 mt-2 max-w-2xl">
			{data.categoryInfo.description[data.lang]}
		</p>
	</div>

	<!-- Articles in this category -->
	{#if data.articles.length === 0}
		<div
			class="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 font-mono text-sm text-slate-400"
		>
			{data.lang === 'de'
				? 'In dieser Kategorie liegen derzeit noch keine überprüften Artikel vor.'
				: 'No articles currently published in this category.'}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.articles as article}
				<a
					href="/{data.lang}/guide/{article.slug}"
					class="group rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/90 p-6 flex flex-col justify-between transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
				>
					<div class="space-y-4">
						<div class="flex items-center justify-between gap-2">
							<ThreatGauge level={article.threat_level} lang={data.lang} />
						</div>

						<h2
							class="text-xl font-mono font-bold text-white group-hover:text-cyan-300 transition-colors"
						>
							{article.title}
						</h2>

						{#if article.memory_hook}
							<p
								class="text-xs text-cyan-200/90 italic bg-cyan-950/20 p-2 rounded-lg border border-cyan-900/30 line-clamp-2"
							>
								"{article.memory_hook}"
							</p>
						{/if}

						<p class="text-xs text-slate-400 line-clamp-3 leading-relaxed">
							{article.immediate_action[0]}
						</p>
					</div>

					<div
						class="pt-6 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-cyan-400 border-t border-slate-800/60 mt-4"
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
	{/if}
</div>

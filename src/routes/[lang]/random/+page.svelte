<script lang="ts">
	import { Dices, ArrowRight, RefreshCw, Sparkles, BookOpen } from '@lucide/svelte';
	import ThreatGauge from '$lib/components/ThreatGauge.svelte';
	import MemoryHook from '$lib/components/MemoryHook.svelte';

	let { data } = $props();

	function rollAnother() {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title
		>{data.lang === 'de' ? 'Zufallseintrag — Mostly Alive' : 'Random Entry — Mostly Alive'}</title
	>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
	<!-- Hero / Randomizer controls -->
	<div class="text-center space-y-4">
		<div
			class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs uppercase tracking-wider"
		>
			<Dices class="w-4 h-4 text-cyan-400" />
			<span>{data.lang === 'de' ? 'SPONTANE LEBENSRETTUNG' : 'SPONTANEOUS PRESERVATION'}</span>
		</div>
		<h1 class="text-3xl sm:text-5xl font-mono font-black text-white uppercase tracking-tight">
			{data.lang === 'de'
				? 'Erhöhe deine Überlebenschancen'
				: 'Tell Me Something Potentially Life-Saving'}
		</h1>
		<p class="text-slate-400 text-sm max-w-xl mx-auto">
			{data.lang === 'de'
				? 'Lerne ein nützliches Detail, bevor die Natur beschließt, dein Wissen unangekündigt abzufragen.'
				: 'Learn something useful before nature decides to test your knowledge without prior notice.'}
		</p>
	</div>

	<!-- Random Article Card -->
	{#if data.article}
		<div
			class="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 sm:p-10 terminal-border-cyan space-y-6 shadow-2xl"
		>
			<div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
				<div class="flex items-center gap-2">
					<span
						class="font-mono text-xs uppercase font-bold text-cyan-400 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40"
					>
						{data.article.category}
					</span>
				</div>
				<ThreatGauge level={data.article.threat_level} lang={data.lang} />
			</div>

			<div class="space-y-2">
				<h2 class="text-2xl sm:text-4xl font-mono font-bold text-white">
					{data.article.title}
				</h2>
				{#if data.article.subtitle}
					<p class="text-sm text-slate-300 font-medium">
						{data.article.subtitle}
					</p>
				{/if}
			</div>

			{#if data.article.memory_hook}
				<MemoryHook hook={data.article.memory_hook} lang={data.lang} />
			{/if}

			<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
				<div class="font-mono text-xs font-bold uppercase text-amber-400">
					{data.lang === 'de' ? 'Sofortmaßnahme:' : 'Immediate Action:'}
				</div>
				<p class="text-sm text-slate-200 leading-relaxed font-medium">
					{data.article.immediate_action[0]}
				</p>
			</div>

			<!-- Actions -->
			<div class="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
				<button
					type="button"
					onclick={rollAnother}
					class="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center gap-2"
				>
					<RefreshCw class="w-4 h-4" />
					<span>{data.lang === 'de' ? 'Anderen Ratschlag würfeln' : 'Roll Another Fact'}</span>
				</button>

				<a
					href="/{data.lang}/guide/{data.article.slug}"
					class="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
				>
					<span>{data.lang === 'de' ? 'Vollständigen Eintrag lesen' : 'Read Full Entry'}</span>
					<ArrowRight class="w-4 h-4" />
				</a>
			</div>
		</div>
	{:else}
		<div
			class="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 font-mono text-sm text-slate-400"
		>
			{data.lang === 'de' ? 'Keine Artikel verfügbar.' : 'No articles available.'}
		</div>
	{/if}
</div>

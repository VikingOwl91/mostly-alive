<script lang="ts">
	import { Dices, ArrowRight, RefreshCw, Sparkles, ShieldAlert, Brain } from '@lucide/svelte';
	import ThreatGauge from '$lib/components/ThreatGauge.svelte';
	import MemoryHook from '$lib/components/MemoryHook.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { buildRandomSeo } from '$lib/seo';
	import { getImmediateActionPreview } from '$lib/types/content';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	const seo = $derived(buildRandomSeo(data.lang));

	let isRolling = $state(false);

	async function rollAnother() {
		isRolling = true;
		await invalidateAll();
		setTimeout(() => {
			isRolling = false;
		}, 250);
	}
</script>

<SeoHead {seo} />

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
	<!-- Hero / Randomizer controls -->
	<div class="text-center space-y-3">
		<div
			class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.15)]"
		>
			<Dices class="w-4 h-4 text-cyan-400 {isRolling ? 'animate-spin' : ''}" />
			<span>{data.lang === 'de' ? 'SPONTANE LEBENSRETTUNG' : 'SPONTANEOUS PRESERVATION'}</span>
		</div>
		<h1 class="text-3xl sm:text-5xl font-mono font-black text-white uppercase tracking-tight">
			{data.lang === 'de'
				? 'Ein merkwürdiger Fakt, der dir das Leben retten könnte'
				: 'Teach Me One Weird Thing That Might Save My Life'}
		</h1>
		<p class="text-slate-400 text-sm max-w-xl mx-auto font-sans leading-relaxed">
			{data.lang === 'de'
				? 'Präge dir ein überlebenswichtiges Detail ein, bevor die Realität beschließt, dein Wissen unangekündigt zu prüfen.'
				: 'Burn one obscure yet crucial emergency rule into your memory before nature tests your reflexes without warning.'}
		</p>
	</div>

	<!-- Random Article Card -->
	{#if data.article}
		<div
			class="rounded-3xl border border-slate-700 bg-slate-900/90 p-6 sm:p-10 terminal-border-cyan space-y-6 shadow-2xl transition-all"
		>
			<div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
				<div class="flex items-center gap-2">
					<span
						class="font-mono text-xs uppercase font-bold text-cyan-400 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/40"
					>
						{data.article.category}
					</span>
					<span class="text-xs font-mono text-slate-500">
						SLUG: {data.article.slug}
					</span>
				</div>
				<ThreatGauge level={data.article.threat_level} lang={data.lang} />
			</div>

			<div class="space-y-2">
				<h2 class="text-2xl sm:text-4xl font-mono font-bold text-white leading-tight">
					{data.article.title}
				</h2>
				{#if data.article.subtitle}
					<p class="text-sm text-slate-300 font-medium font-sans">
						{data.article.subtitle}
					</p>
				{/if}
			</div>

			{#if data.article.memory_hook}
				<MemoryHook hook={data.article.memory_hook} lang={data.lang} />
			{/if}

			{#if data.article.memorable_facts && data.article.memorable_facts.length > 0}
				<div class="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2">
					<div
						class="flex items-center gap-2 font-mono text-[11px] font-bold uppercase text-cyan-400"
					>
						<Brain class="w-3.5 h-3.5 text-cyan-400" />
						<span>
							{data.lang === 'de'
								? '// OFFENSICHTLICH, ABER LEBENSWICHTIG QUANTIFIZIERT'
								: '// OBVIOUS FACT, USEFULLY QUANTIFIED'}
						</span>
					</div>
					<p class="text-sm text-slate-300 leading-relaxed font-sans font-medium">
						{data.article.memorable_facts[0]}
					</p>
				</div>
			{/if}

			{#if data.article.immediate_action && data.article.immediate_action.length > 0}
				{@const primaryAction = getImmediateActionPreview(data.article.immediate_action[0])}
				{#if primaryAction.instruction || primaryAction.title}
					<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
						<div
							class="font-mono text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5"
						>
							<ShieldAlert class="w-3.5 h-3.5 text-amber-400" />
							<span>{data.lang === 'de' ? 'Wichtigste Sofortmaßnahme:' : 'Key Immediate Action:'}</span>
						</div>
						{#if primaryAction.title}
							<div class="font-mono text-xs font-black uppercase text-amber-300 tracking-wider">
								{primaryAction.title}
							</div>
						{/if}
						{#if primaryAction.instruction}
							<p class="text-sm text-slate-200 leading-relaxed font-medium font-sans">
								{primaryAction.instruction}
							</p>
						{/if}
					</div>
				{/if}
			{/if}

			<!-- Actions -->
			<div class="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
				<button
					type="button"
					onclick={rollAnother}
					disabled={isRolling}
					class="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
				>
					<RefreshCw class="w-4 h-4 {isRolling ? 'animate-spin' : ''}" />
					<span
						>{data.lang === 'de' ? 'Nächsten Zufallseintrag würfeln' : 'Roll Another Entry'}</span
					>
				</button>

				<a
					href="/{data.lang}/guide/{data.article.slug}"
					class="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
				>
					<span>{data.lang === 'de' ? 'Vollständigen Eintrag öffnen' : 'Read Full Entry'}</span>
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

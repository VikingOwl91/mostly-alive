<script lang="ts">
	import { Sparkles, Brain, Lightbulb } from '@lucide/svelte';

	interface Props {
		facts?: string[];
		lang?: 'en' | 'de';
	}

	let { facts = [], lang = 'en' }: Props = $props();
</script>

{#if facts && facts.length > 0}
	<aside
		class="my-8 rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 sm:p-6 shadow-[0_0_25px_rgba(6,182,212,0.06)] space-y-4"
		aria-label={lang === 'de'
			? 'Wissenswerte Fakten und Eselsbrücken'
			: 'Memorable facts and mnemonics'}
	>
		<div class="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
			<div
				class="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-400"
			>
				<Brain class="w-4 h-4 text-cyan-400" />
				<span>
					{lang === 'de'
						? '// OFFENSICHTLICH, ABER LEBENSWICHTIG QUANTIFIZIERT'
						: '// OBVIOUS FACT, USEFULLY QUANTIFIED'}
				</span>
			</div>
			<span
				class="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/50 text-cyan-300"
			>
				{lang === 'de' ? 'Gedächtnisstütze' : 'Memory Retention'}
			</span>
		</div>

		<div class="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
			{#each facts as fact}
				<div class="flex items-start gap-3">
					<div class="shrink-0 mt-1">
						<Sparkles class="w-4 h-4 text-amber-400" />
					</div>
					<p class="text-slate-300 font-medium">
						{fact}
					</p>
				</div>
			{/each}
		</div>
	</aside>
{/if}

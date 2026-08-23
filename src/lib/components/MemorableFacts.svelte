<script lang="ts">
	import { Brain, Sparkles } from '@lucide/svelte';

	interface Props {
		facts?: string[];
		lang?: 'en' | 'de';
	}

	let { facts = [], lang = 'en' }: Props = $props();

	interface ParsedFact {
		badge: string;
		explanation: string;
	}

	function parseFact(fact: string): ParsedFact {
		const match = fact.match(/^([^:]+):\s+(.+)$/s);
		if (match && match[1].length < 80) {
			return {
				badge: match[1].trim(),
				explanation: match[2].trim()
			};
		}
		return {
			badge: '',
			explanation: fact.trim()
		};
	}

	let parsedFacts = $derived(facts.map(parseFact));
</script>

{#if facts && facts.length > 0}
	<aside
		class="my-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6 space-y-4"
		aria-label={lang === 'de'
			? 'Wissenswerte Fakten und Eselsbrücken'
			: 'Memorable facts and mnemonics'}
	>
		<!-- Neutral Secondary Learning Header -->
		<div class="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
			<div
				class="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-400 min-w-0"
			>
				<Brain class="w-4 h-4 text-slate-400 shrink-0" />
				<span class="truncate">
					{lang === 'de'
						? '// WISSENSWERTE FAKTEN & HINTERGRÜNDE'
						: '// MEMORABLE RETENTION FACTS'}
				</span>
			</div>
			<span
				class="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 shrink-0"
			>
				{lang === 'de' ? 'Hintergrundwissen' : 'Context'}
			</span>
		</div>

		<!-- Facts list with prominent key badges -->
		<div class="space-y-4 text-xs sm:text-sm font-sans">
			{#each parsedFacts as item}
				<div class="space-y-1.5">
					{#if item.badge}
						<div class="flex items-center gap-2">
							<Sparkles class="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
							<span
								class="font-mono text-[10px] sm:text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 tracking-wide break-words"
							>
								{item.badge}
							</span>
						</div>
					{/if}
					<p class="text-slate-300 leading-relaxed font-medium pl-4 sm:pl-5.5 break-words">
						{item.explanation}
					</p>
				</div>
			{/each}
		</div>
	</aside>
{/if}

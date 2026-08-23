<script lang="ts">
	import { XCircle, AlertOctagon } from '@lucide/svelte';

	interface Props {
		items: string[];
		lang?: 'en' | 'de';
	}

	let { items = [], lang = 'en' }: Props = $props();

	interface ParsedMistake {
		prohibition: string;
		why?: string;
	}

	function parseMistake(item: string): ParsedMistake {
		// Matches: "Do not do X (Because Y)." or "Niemals X tun (Weil Y)."
		const parenMatch = item.match(/^(.*?)\s*\((.*?)\)\.?$/s);
		if (parenMatch) {
			return {
				prohibition: parenMatch[1].trim(),
				why: parenMatch[2].trim()
			};
		}

		// Matches: "Prohibition: Reason"
		const colonMatch = item.match(/^([^:]+):\s+(.+)$/s);
		if (colonMatch && colonMatch[1].length < 60) {
			return {
				prohibition: colonMatch[1].trim(),
				why: colonMatch[2].trim()
			};
		}

		return {
			prohibition: item.trim()
		};
	}

	let parsedItems = $derived(items.map(parseMistake));
</script>

{#if items.length > 0}
	<section
		class="my-6 rounded-2xl border border-red-500/30 bg-red-950/15 p-4 sm:p-6"
		aria-labelledby="donot-heading"
	>
		<!-- Header -->
		<div class="flex items-center gap-2.5 pb-3 border-b border-red-500/20 text-red-400">
			<AlertOctagon class="w-5 h-5 shrink-0" />
			<h2 id="donot-heading" class="font-mono text-xs sm:text-sm font-black uppercase tracking-wider truncate">
				{lang === 'de'
					? '// KRITISCHE FEHLER (UNBEDINGT VERMEIDEN)'
					: '// CRITICAL MISTAKES (DO NOT)'}
			</h2>
		</div>

		<!-- List of prohibited actions with short explanations -->
		<ul class="mt-4 space-y-3.5">
			{#each parsedItems as mistake}
				<li class="space-y-1">
					<!-- Primary Prohibition (High-Contrast Red Anchor) -->
					<div class="flex items-start gap-2.5 text-sm sm:text-base font-semibold text-red-200">
						<span class="text-red-400 font-bold shrink-0 mt-0.5 select-none">✕</span>
						<span class="leading-snug break-words">{mistake.prohibition}</span>
					</div>

					<!-- Secondary Explanation (Visually quieter, indented) -->
					{#if mistake.why}
						<div class="pl-4 sm:pl-5 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed break-words">
							<span class="font-mono text-[10px] uppercase font-bold text-red-400/80 mr-1"
								>{lang === 'de' ? 'WARUM:' : 'WHY:'}</span
							>
							{mistake.why}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</section>
{/if}

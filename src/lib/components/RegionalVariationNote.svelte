<script lang="ts">
	import { MapPin } from '@lucide/svelte';
	import type { RegionalVariation } from '$lib/types/content';

	interface Props {
		variations: RegionalVariation[];
		lang?: 'en' | 'de';
	}

	let { variations = [], lang = 'en' }: Props = $props();
</script>

{#if variations.length > 0}
	<div class="my-6 rounded-xl border border-slate-700 bg-slate-900/40 p-4">
		<div class="flex items-center gap-2 text-slate-300 pb-2 border-b border-slate-800">
			<MapPin class="w-4 h-4 text-cyan-400" />
			<span class="font-mono text-xs font-bold uppercase tracking-wider">
				{lang === 'de' ? 'REGIONALE UNTERSCHIEDE & NORMEN' : 'REGIONAL VARIATIONS & STANDARDS'}
			</span>
		</div>
		<div class="mt-3 space-y-2">
			{#each variations as item}
				<div class="text-xs text-slate-300">
					<span
						class="font-mono uppercase font-bold text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50 mr-2"
					>
						{item.region}
					</span>
					<span>{item.note}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

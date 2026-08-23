<script lang="ts">
	import { XCircle } from '@lucide/svelte';

	interface Props {
		items: string[];
		lang?: 'en' | 'de';
	}

	let { items = [], lang = 'en' }: Props = $props();
</script>

{#if items.length > 0}
	<div class="my-6 rounded-xl border border-red-500/30 bg-red-950/15 p-5">
		<div class="flex items-center gap-2.5 pb-3 border-b border-red-500/20 text-red-400">
			<XCircle class="w-5 h-5" />
			<h3 class="font-mono text-xs font-bold uppercase tracking-wider">
				{lang === 'de' ? 'UNBEDINGT VERMEIDEN (GEFÄHRLICHE FEHLER)' : 'DO NOT (CRITICAL MISTAKES)'}
			</h3>
		</div>
		<ul class="mt-3.5 space-y-2.5">
			{#each items as item}
				<li class="flex items-start gap-2.5 text-sm text-slate-200">
					<span class="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
					<span class="leading-relaxed">{item}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}

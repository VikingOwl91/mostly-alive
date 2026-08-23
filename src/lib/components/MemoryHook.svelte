<script lang="ts">
	import { Lightbulb } from '@lucide/svelte';

	interface Props {
		hook: string;
		lang?: 'en' | 'de';
	}

	let { hook, lang = 'en' }: Props = $props();
</script>

<div class="my-6 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 terminal-border-cyan">
	<div class="flex items-center gap-2 text-cyan-400 pb-2.5">
		<Lightbulb class="w-4 h-4" />
		<span class="font-mono text-xs font-bold uppercase tracking-wider">
			{lang === 'de'
				? 'GEDÄCHTNISANKER (DAS EINE DING, DAS DU BEHÄLTST)'
				: 'MEMORY HOOK (THE ONE THING TO REMEMBER)'}
		</span>
	</div>
	<blockquote class="text-lg md:text-xl font-semibold italic text-cyan-100 leading-snug pl-1">
		“{hook}”
	</blockquote>
</div>

<script lang="ts">
	import { AlertTriangle, ShieldAlert } from '@lucide/svelte';

	interface Props {
		actions: string[];
		lang?: 'en' | 'de';
		urgency?: 'immediate' | 'high' | 'medium' | 'low';
	}

	let { actions = [], lang = 'en', urgency = 'high' }: Props = $props();

	const isImmediate = $derived(urgency === 'immediate');
</script>

<div
	class="relative my-6 overflow-hidden rounded-xl p-5 sm:p-6 transition-all {isImmediate
		? 'terminal-border-red bg-red-950/20 text-red-100'
		: 'terminal-border-amber bg-amber-950/20 text-amber-100'}"
>
	<!-- Header Bar -->
	<div
		class="flex items-center gap-3 pb-3 border-b {isImmediate
			? 'border-red-500/30'
			: 'border-amber-500/30'}"
	>
		<div
			class="p-2 rounded-lg {isImmediate
				? 'bg-red-500/20 text-red-400'
				: 'bg-amber-500/20 text-amber-400'}"
		>
			{#if isImmediate}
				<ShieldAlert class="w-6 h-6 animate-pulse" />
			{:else}
				<AlertTriangle class="w-6 h-6" />
			{/if}
		</div>
		<div>
			<div
				class="text-[11px] font-mono font-bold uppercase tracking-widest {isImmediate
					? 'text-red-400'
					: 'text-amber-400'}"
			>
				{lang === 'de' ? 'SOFORTIGE MASSNAHME' : 'IMMEDIATE ACTION REQUIRED'}
			</div>
			<div class="text-sm font-semibold text-slate-200">
				{lang === 'de'
					? 'Führe diese Schritte jetzt unverzüglich aus:'
					: 'Execute these steps right now:'}
			</div>
		</div>
	</div>

	<!-- Step List -->
	<ol class="mt-4 space-y-3">
		{#each actions as action, idx}
			<li class="flex items-start gap-3">
				<span
					class="flex items-center justify-center shrink-0 w-6 h-6 rounded-full font-mono text-xs font-bold {isImmediate
						? 'bg-red-500/30 text-red-200 border border-red-500/40'
						: 'bg-amber-500/30 text-amber-200 border border-amber-500/40'}"
				>
					{idx + 1}
				</span>
				<span class="text-base leading-relaxed text-slate-100 font-medium pt-0.5">
					{action}
				</span>
			</li>
		{/each}
	</ol>
</div>

<script lang="ts">
	import { AlertTriangle, ShieldAlert, CornerDownRight, ArrowRight, Info } from '@lucide/svelte';
	import {
		type ImmediateActionItem,
		type NormalizedImmediateActionStep,
		normalizeImmediateAction
	} from '$lib/types/content';

	interface Props {
		actions: ImmediateActionItem[];
		lang?: 'en' | 'de';
		urgency?: 'immediate' | 'high' | 'medium' | 'low';
	}

	let { actions = [], lang = 'en', urgency = 'high' }: Props = $props();

	const isImmediate = $derived(urgency === 'immediate');
	let normalizedActions = $derived(actions.map(normalizeImmediateAction));
</script>

<section
	class="relative my-6 overflow-hidden rounded-2xl p-4 sm:p-6 md:p-7 transition-all {isImmediate
		? 'terminal-border-red bg-red-950/20 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
		: 'terminal-border-amber bg-amber-950/20 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.08)]'}"
	aria-labelledby="immediate-actions-heading"
>
	<!-- Header Bar -->
	<div class="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b {isImmediate ? 'border-red-500/30' : 'border-amber-500/30'}">
		<div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
			<div
				class="p-2 sm:p-2.5 rounded-xl shrink-0 {isImmediate
					? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
					: 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'}"
			>
				<ShieldAlert class="w-5 h-5 sm:w-6 sm:h-6 {isImmediate ? 'animate-pulse' : ''}" />
			</div>
			<div class="min-w-0">
				<h2
					id="immediate-actions-heading"
					class="font-mono text-xs sm:text-sm font-black uppercase tracking-wider truncate {isImmediate
						? 'text-red-400'
						: 'text-amber-400'}"
				>
					{lang === 'de' ? '// SOFORTIGE MASSNAHMEN' : '// IMMEDIATE ACTIONS'}
				</h2>
				<p class="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
					{lang === 'de'
						? 'Führe diese Schritte in der angegebenen Reihenfolge aus:'
						: 'Execute these steps in order:'}
				</p>
			</div>
		</div>

		<span
			class="hidden sm:inline-flex items-center font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shrink-0 {isImmediate
				? 'bg-red-950 text-red-300 border border-red-500/40'
				: 'bg-amber-950 text-amber-300 border border-amber-500/40'}"
		>
			{isImmediate ? (lang === 'de' ? 'HÖCHSTE PRIORITÄT' : 'MAX PRIORITY') : 'PRIORITY 1'}
		</span>
	</div>

	<!-- Primary Steps Hierarchical List -->
	<ol class="mt-5 sm:mt-6 space-y-5 sm:space-y-6">
		{#each normalizedActions as step, idx}
			<li class="relative flex items-start gap-3 sm:gap-4 group">
				<!-- Large Number Marker (01, 02, 03...) for Primary Actions only -->
				<span
					class="flex items-center justify-center shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl font-mono text-xs sm:text-base font-black {isImmediate
						? 'bg-red-500/25 text-red-200 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
						: 'bg-amber-500/25 text-amber-200 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'}"
					aria-label={`Step ${idx + 1}`}
				>
					{String(idx + 1).padStart(2, '0')}
				</span>

				<div class="flex-1 space-y-2 pt-0.5 min-w-0">
					<!-- Step Title (if present) -->
					{#if step.title}
						<div
							class="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider break-words {isImmediate
								? 'text-red-300'
								: 'text-amber-300'}"
						>
							{step.title}
						</div>
					{/if}

					<!-- Main Instruction -->
					<p class="text-sm sm:text-base leading-relaxed text-slate-100 font-medium break-words">
						{step.instruction}
					</p>

					<!-- Substeps (Tree-structure, no heavy numbers) -->
					{#if step.substeps && step.substeps.length > 0}
						<ul class="mt-2.5 sm:mt-3 space-y-1.5 pl-1.5 sm:pl-2.5 border-l-2 border-slate-700/60 font-sans">
							{#each step.substeps as substep, subIdx}
								<li class="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
									<span class="text-slate-500 font-mono select-none text-xs shrink-0 mt-0.5">
										{subIdx === step.substeps.length - 1 ? '└─' : '├─'}
									</span>
									<span class="leading-relaxed break-words">{substep}</span>
								</li>
							{/each}
						</ul>
					{/if}

					<!-- Condition / Action Variants -->
					{#if step.variants && step.variants.length > 0}
						<div class="mt-2.5 sm:mt-3 space-y-2">
							{#each step.variants as variant}
								<div
									class="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs sm:text-sm"
								>
									<span
										class="font-mono text-[10px] sm:text-[11px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 shrink-0 self-start break-words"
									>
										{variant.condition}
									</span>
									<span class="text-slate-200 font-medium leading-relaxed break-words">
										{variant.action}
									</span>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Context Note (if any) -->
					{#if step.note}
						<div
							class="mt-2.5 flex items-start gap-2 text-xs text-slate-400 bg-slate-950/40 px-2.5 sm:px-3 py-1.5 rounded border border-slate-800/80"
						>
							<Info class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
							<span class="leading-relaxed break-words">{step.note}</span>
						</div>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</section>

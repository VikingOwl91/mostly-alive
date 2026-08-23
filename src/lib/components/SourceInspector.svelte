<script lang="ts">
	import {
		ExternalLink,
		ShieldCheck,
		ChevronDown,
		ChevronUp,
		Calendar,
		UserCheck
	} from '@lucide/svelte';
	import type { SourceReference } from '$lib/types/content';

	interface Props {
		sources: SourceReference[];
		reviewedAt?: string;
		reviewDue?: string;
		reviewer?: string;
		lang?: 'en' | 'de';
		status?: string;
	}

	let {
		sources = [],
		reviewedAt,
		reviewDue,
		reviewer,
		lang = 'en',
		status = 'draft'
	}: Props = $props();

	let isOpen = $state(false);
</script>

<div
	class="my-8 rounded-xl border border-slate-700/60 bg-slate-900/60 overflow-hidden terminal-border"
>
	<!-- Summary bar / Clickable trigger -->
	<button
		type="button"
		class="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
		onclick={() => (isOpen = !isOpen)}
		aria-expanded={isOpen}
		aria-controls="provenance-details"
	>
		<div class="flex items-center gap-3">
			<div class="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
				<ShieldCheck class="w-5 h-5" />
			</div>
			<div>
				<div class="text-sm font-semibold text-slate-100 flex items-center gap-2">
					<span>{lang === 'de' ? 'Quellen & Prüfungstransparenz' : 'Sources & Provenance'}</span>
					<span
						class="text-[10px] font-mono uppercase px-2 py-0.5 rounded {status === 'reviewed'
							? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
							: 'bg-amber-950 text-amber-300 border border-amber-500/30'}"
					>
						{status}
					</span>
				</div>
				<p class="text-xs text-slate-400 mt-0.5">
					{sources.length}
					{lang === 'de'
						? sources.length === 1
							? 'autoritative Quelle'
							: 'autoritative Quellen'
						: sources.length === 1
							? 'authoritative source'
							: 'authoritative sources'}
					{#if reviewedAt}
						• {lang === 'de' ? 'Geprüft:' : 'Reviewed:'} <time datetime={reviewedAt}>{reviewedAt}</time>
					{/if}
				</p>
			</div>
		</div>

		<div class="text-slate-400">
			{#if isOpen}
				<ChevronUp class="w-5 h-5" />
			{:else}
				<ChevronDown class="w-5 h-5" />
			{/if}
		</div>
	</button>

	<!-- Expandable detail body -->
	{#if isOpen}
		<div id="provenance-details" class="px-5 pb-5 pt-2 border-t border-slate-800 space-y-4 text-xs">
			<!-- Review metadata -->
			<div
				class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-950/60 font-mono text-slate-300"
			>
				<div class="flex items-center gap-2">
					<Calendar class="w-3.5 h-3.5 text-slate-400" />
					<span
						>{lang === 'de' ? 'Stand:' : 'Reviewed:'}
						{#if reviewedAt}
							<time datetime={reviewedAt}>{reviewedAt}</time>
						{:else}
							N/A
						{/if}</span
					>
				</div>
				<div class="flex items-center gap-2">
					<Calendar class="w-3.5 h-3.5 text-slate-400" />
					<span
						>{lang === 'de' ? 'Fällig:' : 'Due:'}
						{#if reviewDue}
							<time datetime={reviewDue}>{reviewDue}</time>
						{:else}
							N/A
						{/if}</span
					>
				</div>
				<div class="flex items-center gap-2">
					<UserCheck class="w-3.5 h-3.5 text-slate-400" />
					<span>{lang === 'de' ? 'Prüfer:' : 'Reviewer:'} {reviewer || 'Editorial Core'}</span>
				</div>
			</div>

			<!-- Source citations list -->
			<div class="space-y-3 pt-1">
				<div class="font-mono uppercase font-bold text-[11px] text-slate-400">
					{lang === 'de' ? 'Primäre Referenzen & Richtlinien' : 'Primary References & Guidelines'}
				</div>
				<div class="divide-y divide-slate-800">
					{#each sources as src}
						<div class="py-2.5 flex items-start justify-between gap-4">
							<div class="space-y-1">
								<div class="font-medium text-slate-200 text-sm">
									{src.name}
								</div>
								{#if src.guideline_version}
									<div class="text-slate-400 font-mono text-[11px]">
										{lang === 'de' ? 'Richtlinie:' : 'Guideline:'}
										{src.guideline_version}
										{#if src.jurisdiction}
											• {src.jurisdiction}
										{/if}
									</div>
								{/if}
								{#if src.notes}
									<div class="text-slate-400 italic">
										{src.notes}
									</div>
								{/if}
							</div>

							{#if src.url}
								<a
									href={src.url}
									target="_blank"
									rel="noopener noreferrer"
									class="shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors"
									title={lang === 'de' ? 'Offizielle Quelle öffnen' : 'Open official source'}
								>
									<ExternalLink class="w-4 h-4" />
								</a>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

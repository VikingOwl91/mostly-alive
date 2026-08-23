<script lang="ts">
	import { ArrowRight, BookOpen } from '@lucide/svelte';
	import ThreatGauge from '$lib/components/ThreatGauge.svelte';
	import type { Article } from '$lib/types/content';

	interface Props {
		articles: Article[];
		lang: 'en' | 'de';
	}

	let { articles = [], lang = 'en' }: Props = $props();
</script>

{#if articles.length > 0}
	<section
		class="mt-12 pt-8 border-t border-slate-800 space-y-6 no-print"
		aria-labelledby="related-guides-heading"
	>
		<div class="flex items-center justify-between gap-4">
			<div class="space-y-1">
				<div class="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
					<BookOpen class="w-4 h-4" />
					<span id="related-guides-heading">
						{lang === 'de' ? '// VERWANDTE SICHERHEITSHINWEISE' : '// RELATED FIELD NOTES'}
					</span>
				</div>
				<p class="text-xs text-slate-400">
					{lang === 'de'
						? 'Weitere potenziell relevante Notfallsituationen und angrenzende Gefahrenbereiche.'
						: 'Additional safety instructions and adjacent hazard knowledge.'}
				</p>
			</div>
		</div>

		<nav aria-label={lang === 'de' ? 'Verwandte Sicherheitsanleitungen' : 'Related Survival Guides'}>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{#each articles as a}
					<a
						href="/{lang}/guide/{a.slug}"
						class="group p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 hover:bg-slate-900/90 shadow-sm"
					>
						<div class="space-y-2">
							<div class="flex items-center justify-between gap-2">
								<span
									class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50"
								>
									{a.category}
								</span>
								<ThreatGauge level={a.threat_level} {lang} />
							</div>
							<h3 class="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
								{a.title}
							</h3>
							{#if a.subtitle || a.memory_hook}
								<p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
									{a.subtitle || a.memory_hook}
								</p>
							{/if}
						</div>

						<div class="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-cyan-400 transition-colors border-t border-slate-800/60">
							<span>{lang === 'de' ? 'Anleitung öffnen' : 'Open guide'}</span>
							<ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
						</div>
					</a>
				{/each}
			</div>
		</nav>
	</section>
{/if}

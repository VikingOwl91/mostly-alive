<script lang="ts">
	import {
		BookOpen,
		Flame,
		Waves,
		CloudLightning,
		Zap,
		Home,
		HeartPulse,
		Car,
		Footprints,
		Compass,
		Building2,
		Users,
		BatteryWarning,
		ArrowRight,
		Clock
	} from '@lucide/svelte';

	import SeoHead from '$lib/components/SeoHead.svelte';
	import { buildCategoriesIndexSeo } from '$lib/seo';

	let { data } = $props();

	const seo = $derived(buildCategoriesIndexSeo(data.lang));

	const iconMap: Record<string, any> = {
		CloudLightning,
		Waves,
		Flame,
		Zap,
		Home,
		HeartPulse,
		Car,
		Footprints,
		Compass,
		Building2,
		Users,
		BatteryWarning
	};

	let activeCategories = $derived(
		data.categories.filter((cat: any) => (data.counts[cat.id] || 0) > 0)
	);
	let plannedCategories = $derived(
		data.categories.filter((cat: any) => (data.counts[cat.id] || 0) === 0)
	);
</script>

<SeoHead {seo} />

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
	<!-- Page Header -->
	<div class="border-b border-slate-800 pb-6">
		<div class="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
			{data.lang === 'de' ? '// THEMATISCHE GLIEDERUNG' : '// TAXONOMY'}
		</div>
		<h1 class="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
			{data.lang === 'de' ? 'Gefahrenkategorien' : 'Hazard Categories'}
		</h1>
		<p class="text-sm text-slate-400 mt-2">
			{data.lang === 'de'
				? 'Systematische Klassifikation alltäglicher und unvorhergesehener Notlagen.'
				: 'Systematic classification of everyday and unforeseen complications.'}
		</p>
	</div>

	<!-- Active Categories Grid -->
	<section class="space-y-6">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each activeCategories as cat}
				{@const IconComponent = iconMap[cat.icon] || BookOpen}
				<a
					href="/{data.lang}/categories/{cat.id}"
					class="group p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/90 hover:border-amber-500/40 transition-all flex flex-col justify-between"
				>
					<div>
						<div class="flex items-center justify-between gap-3 mb-4">
							<div
								class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 group-hover:border-amber-500/40 transition-colors"
							>
								<IconComponent class="w-6 h-6" />
							</div>
							<span
								class="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/50 text-slate-300"
							>
								{data.counts[cat.id]}
								{data.lang === 'de' ? 'Anleitungen' : 'guides'}
							</span>
						</div>

						<h2 class="text-xl font-mono font-bold text-white group-hover:text-amber-300">
							{cat.title[data.lang]}
						</h2>
						<div class="font-mono text-xs text-slate-400 mb-3">
							{cat.humorousTitle[data.lang]}
						</div>

						<p class="text-xs text-slate-400 leading-relaxed">
							{cat.description[data.lang]}
						</p>
					</div>

					<div
						class="pt-6 flex items-center justify-between text-xs font-mono text-amber-400 group-hover:text-amber-300 border-t border-slate-800/60 mt-4"
					>
						<span>{data.lang === 'de' ? 'Kategorie öffnen' : 'Explore Category'}</span>
						<ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Planned Categories (Coming Soon) -->
	{#if plannedCategories.length > 0}
		<section class="pt-6 border-t border-slate-800/80 space-y-6">
			<div class="flex items-center gap-2 font-mono text-xs uppercase font-bold text-slate-500 tracking-wider">
				<Clock class="w-3.5 h-3.5" />
				<span>{data.lang === 'de' ? '// IN PLANUNG (KOMMENDE THEMEN)' : '// ROADMAP (PLANNED CATEGORIES)'}</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each plannedCategories as cat}
					{@const IconComponent = iconMap[cat.icon] || BookOpen}
					<div
						class="p-5 rounded-xl border border-slate-800/60 bg-slate-950/40 opacity-75 flex items-start gap-4"
					>
						<div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500">
							<IconComponent class="w-5 h-5" />
						</div>
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<h3 class="font-mono text-sm font-bold text-slate-300">
									{cat.title[data.lang]}
								</h3>
								<span
									class="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800"
								>
									{data.lang === 'de' ? 'In Planung' : 'Planned'}
								</span>
							</div>
							<p class="text-xs text-slate-500 leading-relaxed">
								{cat.description[data.lang]}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

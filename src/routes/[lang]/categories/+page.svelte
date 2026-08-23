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
		ArrowRight
	} from '@lucide/svelte';

	let { data } = $props();

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
</script>

<svelte:head>
	<title>{data.lang === 'de' ? 'Kategorien — Mostly Alive' : 'Categories — Mostly Alive'}</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
	<div class="border-b border-slate-800 pb-6">
		<div class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
			{data.lang === 'de' ? '// THEMATISCHE GLIEDERUNG' : '// TAXONOMY'}
		</div>
		<h1 class="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
			{data.lang === 'de' ? 'Alle Gefahrenkategorien' : 'All Hazard Categories'}
		</h1>
		<p class="text-sm text-slate-400 mt-2">
			{data.lang === 'de'
				? 'Systematische Klassifikation alltäglicher und unvorhergesehener Herausforderungen.'
				: 'Systematic classification of everyday and unforeseen complications.'}
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each data.categories as cat}
			{@const IconComponent = iconMap[cat.icon] || BookOpen}
			<a
				href="/{data.lang}/categories/{cat.id}"
				class="group p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
			>
				<div>
					<div class="flex items-center justify-between gap-3 mb-4">
						<div
							class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 group-hover:border-cyan-500/40 transition-colors"
						>
							<IconComponent class="w-6 h-6" />
						</div>
						<span
							class="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300"
						>
							{data.counts[cat.id] || 0}
							{data.lang === 'de' ? 'Einträge' : 'articles'}
						</span>
					</div>

					<h2 class="text-xl font-mono font-bold text-white group-hover:text-cyan-300">
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
					class="pt-6 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-cyan-300 border-t border-slate-800/60 mt-4"
				>
					<span>{data.lang === 'de' ? 'Kategorie öffnen' : 'Explore Category'}</span>
					<ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
				</div>
			</a>
		{/each}
	</div>
</div>

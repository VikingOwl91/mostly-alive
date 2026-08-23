<script lang="ts">
	import {
		BookOpen,
		Dices,
		ShieldAlert,
		ArrowRight,
		Search,
		Sparkles,
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
		BatteryWarning
	} from '@lucide/svelte';
	import ThreatGauge from '$lib/components/ThreatGauge.svelte';

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
	<title
		>{data.lang === 'de'
			? 'Mostly Alive — Praktischer Überlebensleitfaden'
			: 'Mostly Alive — A practical guide to remaining so'}</title
	>
	<meta
		name="description"
		content={data.lang === 'de'
			? 'Ein quellenbasiertes, trocken humorvolles Sicherheitskompendium für seltene, aber lebenswichtige Alltagssituationen.'
			: 'An open-source, source-backed safety knowledge base teaching rare-but-important survival knowledge through dry, memorable humor.'}
	/>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
	<!-- Hero Section -->
	<section
		class="relative rounded-3xl border border-slate-800 bg-slate-950/80 p-8 sm:p-12 md:p-16 overflow-hidden terminal-border-amber shadow-[0_0_50px_rgba(245,158,11,0.05)]"
	>
		<!-- Background Accents -->
		<div
			class="absolute -right-24 -top-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute -left-24 -bottom-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="relative z-10 max-w-3xl space-y-6">
			<!-- Terminal System Badge -->
			<div
				class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs tracking-wider uppercase"
			>
				<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
				<span>{data.lang === 'de' ? 'SYS-MANUAL // V1.0 BEREIT' : 'SYS-MANUAL // V1.0 READY'}</span>
			</div>

			<!-- Main Title -->
			<h1
				class="text-4xl sm:text-6xl md:text-7xl font-mono font-black tracking-tight text-white uppercase leading-none"
			>
				Mostly<br /><span class="text-amber-400 glow-amber">Alive</span>
			</h1>

			<!-- Subtitle -->
			<p class="text-xl sm:text-2xl font-sans font-medium text-slate-200">
				{data.lang === 'de'
					? 'Ein praktischer Leitfaden, um es zu bleiben.'
					: 'A practical guide to remaining so.'}
			</p>

			<!-- Dry Absurdist Quote -->
			<blockquote
				class="border-l-2 border-slate-700 pl-4 py-1 text-slate-400 italic text-sm sm:text-base leading-relaxed"
			>
				“{data.lang === 'de'
					? 'Die Menschheit hat trotz allgemein mangelhafter Dokumentation erstaunlich lange überlebt.'
					: 'Humanity has survived for quite some time despite generally poor documentation.'}”
			</blockquote>

			<!-- CTA Buttons -->
			<div class="pt-4 flex flex-wrap items-center gap-4 font-mono text-sm">
				<a
					href="/{data.lang}/guide"
					class="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
				>
					<BookOpen class="w-4 h-4" />
					<span>{data.lang === 'de' ? 'HANDBUCH ÖFFNEN' : 'OPEN THE GUIDE'}</span>
				</a>

				<a
					href="/{data.lang}/random"
					class="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 transition-all flex items-center gap-2"
				>
					<Dices class="w-4 h-4 text-cyan-400" />
					<span>{data.lang === 'de' ? 'ZUFALLS-RATSCHLAG' : 'RANDOM USEFUL FACT'}</span>
				</a>

				<a
					href="/{data.lang}/emergency"
					class="px-6 py-3.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
				>
					<ShieldAlert class="w-4 h-4 text-red-400 animate-pulse" />
					<span>{data.lang === 'de' ? 'NOTFALL-SCHNELLHILFE' : 'EMERGENCY BASICS'}</span>
				</a>
			</div>
		</div>
	</section>

	<!-- Reading Saves Lives / Manifesto Featured Section -->
	<section
		class="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900/90 to-cyan-950/30 p-6 sm:p-10 terminal-border-cyan space-y-6 shadow-2xl overflow-hidden"
	>
		<!-- Background glow accent -->
		<div
			class="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="relative z-10 space-y-4 max-w-4xl">
			<div
				class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs tracking-wider uppercase"
			>
				<Sparkles class="w-3.5 h-3.5 text-cyan-400" />
				<span
					>{data.lang === 'de'
						? '// LIES DAS, BEVOR DU ES BRAUCHST'
						: '// READ THIS BEFORE YOU NEED IT'}</span
				>
			</div>

			<h2 class="text-2xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight">
				{data.lang === 'de' ? 'LESEN RETTET LEBEN' : 'READING SAVES LIVES'}
			</h2>

			<p class="text-slate-300 text-sm sm:text-base font-sans leading-relaxed">
				{data.lang === 'de'
					? 'Der schlechteste Zeitpunkt herauszufinden, was plötzlich hochstehende Haare, ein zurückweichendes Meer oder dieselben Kopfschmerzen bei mehreren Menschen bedeuten, ist dann, wenn es gerade passiert.'
					: "The worst possible moment to learn what standing hair, a suddenly retreating sea, or identical headaches across a room mean is when they're already happening."}
			</p>

			<div
				class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-xs sm:text-sm text-amber-300/90"
			>
				<p class="font-bold text-white uppercase tracking-wide">
					{data.lang === 'de'
						? 'MOSTLY ALIVE ist für den langweiligen Moment vor dem aufregenden da.'
						: 'MOSTLY ALIVE exists for the boring moment before the exciting one.'}
				</p>
				<p class="text-slate-400 font-sans text-xs sm:text-sm">
					{data.lang === 'de'
						? 'Lern jetzt ein seltsames Warnsignal. Erinner dich daran, wenn es darauf ankommt.'
						: 'Learn one strange warning sign now. Remember it when it matters.'}
				</p>
			</div>

			<div class="pt-2 flex flex-wrap items-center gap-3.5 font-mono text-xs">
				<a
					href="/{data.lang}/random"
					class="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-[1.02]"
				>
					<Dices class="w-4 h-4 text-slate-950" />
					<span
						>{data.lang === 'de'
							? 'BRING MIR WAS ZUFÄLLIGES BEI →'
							: 'TEACH ME SOMETHING RANDOM →'}</span
					>
				</a>

				<a
					href="/{data.lang}/reading-saves-lives"
					class="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2"
				>
					<BookOpen class="w-4 h-4 text-cyan-400" />
					<span>{data.lang === 'de' ? 'WARUM LESEN HILFT →' : 'WHY READING HELPS →'}</span>
				</a>
			</div>
		</div>
	</section>

	<!-- Featured Priority 0 Articles -->
	<section class="space-y-6">
		<div
			class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-800"
		>
			<div>
				<div class="font-mono text-xs uppercase font-bold text-amber-400 tracking-wider">
					{data.lang === 'de' ? '// PRIORITÄT 0 EREIGNISSE' : '// PRIORITY 0 INCIDENTS'}
				</div>
				<h2 class="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
					{data.lang === 'de' ? 'Häufig unterschätzte Lagen' : 'Commonly Underestimated Situations'}
				</h2>
			</div>
			<a
				href="/{data.lang}/guide"
				class="font-mono text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 group shrink-0"
			>
				<span
					>{data.lang === 'de' ? 'Alle Einträge ansehen' : 'View all articles'} ({data.totalArticles})</span
				>
				<ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
			</a>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.featured as article}
				<a
					href="/{data.lang}/guide/{article.slug}"
					class="group relative rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/90 p-6 flex flex-col justify-between h-full transition-all hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
				>
					<div class="space-y-4 flex-1">
						<div class="flex items-center justify-between gap-2">
							<span
								class="font-mono text-[11px] uppercase font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30"
							>
								{article.category}
							</span>
							<ThreatGauge level={article.threat_level} lang={data.lang} />
						</div>

						<h3
							class="text-xl font-mono font-bold text-white group-hover:text-amber-300 transition-colors leading-snug"
						>
							{article.title}
						</h3>

						{#if article.memory_hook}
							<p
								class="text-xs text-cyan-200/90 italic bg-cyan-950/30 p-3 rounded-lg border border-cyan-900/40 leading-relaxed"
							>
								"{article.memory_hook}"
							</p>
						{/if}

						<p class="text-xs text-slate-300 leading-relaxed font-sans">
							{article.immediate_action[0]}
						</p>
					</div>

					<div
						class="pt-4 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-amber-400 border-t border-slate-800/60 mt-5 shrink-0"
					>
						<span>{data.lang === 'de' ? 'Handbuch öffnen' : 'Read entry'}</span>
						<ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Categories Directory Grid -->
	<section class="space-y-6">
		<div class="pb-2 border-b border-slate-800">
			<div class="font-mono text-xs uppercase font-bold text-cyan-400 tracking-wider">
				{data.lang === 'de' ? '// THEMATISCHE GLIEDERUNG' : '// TOPICAL TAXONOMY'}
			</div>
			<h2 class="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
				{data.lang === 'de' ? 'Kategorien' : 'Hazard Categories'}
			</h2>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each data.categories as cat}
				{@const IconComponent = iconMap[cat.icon] || BookOpen}
				<a
					href="/{data.lang}/categories/{cat.id}"
					class="p-5 rounded-2xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-900/70 hover:border-cyan-500/40 transition-all group"
				>
					<div class="flex items-center gap-3 mb-3">
						<div
							class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 group-hover:border-cyan-500/40 transition-colors"
						>
							<IconComponent class="w-5 h-5" />
						</div>
						<div>
							<h3 class="font-mono text-sm font-bold text-slate-100 group-hover:text-cyan-300">
								{cat.title[data.lang]}
							</h3>
							<div class="text-[11px] font-mono text-slate-400">
								{cat.humorousTitle[data.lang]}
							</div>
						</div>
					</div>
					<p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
						{cat.description[data.lang]}
					</p>
				</a>
			{/each}
		</div>
	</section>
</div>

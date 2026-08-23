<script lang="ts">
	import { ArrowLeft, BookOpen, Calendar, ShieldCheck } from '@lucide/svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { buildStaticPageSeo } from '$lib/seo';

	let { data } = $props();
	let page = $derived(data.page);
	const seo = $derived(buildStaticPageSeo(page, data.lang));

	const trustCenterLinks = [
		{ slug: 'methodology', label: { en: 'Methodology', de: 'Methodik' } },
		{ slug: 'sources', label: { en: 'Sources', de: 'Quellen' } },
		{ slug: 'editorial-policy', label: { en: 'Editorial Policy', de: 'Redaktionsrichtlinie' } },
		{ slug: 'contributing', label: { en: 'Contribute', de: 'Mitwirken' } },
		{ slug: 'reading-saves-lives', label: { en: 'Reading Saves Lives', de: 'Lesen rettet Leben' } }
	];
</script>

<SeoHead {seo} />

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
	<!-- Visible Breadcrumbs Navigation -->
	<Breadcrumbs items={seo.breadcrumbs || []} />

	<!-- Navigation -->
	<a
		href="/{data.lang}"
		class="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-amber-400 transition-colors"
	>
		<ArrowLeft class="w-4 h-4" />
		<span>{data.lang === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}</span>
	</a>

	<!-- Page Header -->
	<header class="border-b border-slate-800 pb-6 space-y-4">
		<div class="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
			<ShieldCheck class="w-4 h-4 text-emerald-400" />
			<span>{data.lang === 'de' ? '// TRUST CENTER & DOKUMENTATION' : '// TRUST CENTER & DOCUMENTATION'}</span>
		</div>

		<!-- Trust Center Sub-Navigation -->
		<nav
			class="flex flex-wrap items-center gap-2 py-2 text-xs font-mono border-y border-slate-800/80 my-3"
			aria-label={data.lang === 'de' ? 'Trust Center Navigation' : 'Trust Center Navigation'}
		>
			<span class="text-slate-500 mr-1 hidden sm:inline">// SEKTIONEN:</span>
			{#each trustCenterLinks as item}
				<a
					href="/{data.lang}/{item.slug}"
					class="px-2.5 py-1 rounded transition-colors {page.slug === item.slug || (item.slug === 'reading-saves-lives' && page.slug === 'lesen-rettet-leben')
						? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
						: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}"
				>
					{item.label[data.lang]}
				</a>
			{/each}
		</nav>

		<h1 class="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight">
			{page.title}
		</h1>
		{#if page.description}
			<p class="text-base text-slate-300">
				{page.description}
			</p>
		{/if}
		{#if page.last_updated}
			<div class="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
				<Calendar class="w-3.5 h-3.5" />
				<span
					>{data.lang === 'de' ? 'Zuletzt aktualisiert:' : 'Last updated:'}
					{page.last_updated}</span
				>
			</div>
		{/if}
	</header>

	<!-- Markdown Content -->
	<div
		class="prose prose-invert prose-slate max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:text-amber-400 prose-a:text-cyan-400 prose-code:font-mono leading-relaxed"
	>
		{@html page.html}
	</div>
</div>

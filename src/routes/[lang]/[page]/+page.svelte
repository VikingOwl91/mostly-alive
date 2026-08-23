<script lang="ts">
	import { ArrowLeft, BookOpen, Calendar } from '@lucide/svelte';

	let { data } = $props();
	let page = $derived(data.page);
</script>

<svelte:head>
	<title>{page.title} — Mostly Alive</title>
	{#if page.description}
		<meta name="description" content={page.description} />
	{/if}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
	<!-- Navigation -->
	<a
		href="/{data.lang}"
		class="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-amber-400 transition-colors"
	>
		<ArrowLeft class="w-4 h-4" />
		<span>{data.lang === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}</span>
	</a>

	<!-- Page Header -->
	<header class="border-b border-slate-800 pb-6 space-y-3">
		<div class="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
			{data.lang === 'de' ? '// SYSTEM-DOKUMENTATION' : '// SYSTEM DOCUMENTATION'}
		</div>
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
		class="prose prose-invert prose-slate max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:text-amber-400 prose-a:text-cyan-400 prose-code:font-mono"
	>
		{@html page.html}
	</div>
</div>

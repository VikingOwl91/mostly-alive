<script lang="ts">
	import { page } from '$app/state';
	import GuideHeader from '$lib/components/GuideHeader.svelte';
	import GuideFooter from '$lib/components/GuideFooter.svelte';
	import { buildCanonicalUrl, buildHreflangLinks } from '$lib/seo';

	let { data, children } = $props();

	const currentPath = $derived(page.url.pathname);
	const canonicalUrl = $derived(buildCanonicalUrl(currentPath));
	const isRandomRoute = $derived(currentPath.includes('/random'));
	const hreflangs = $derived(!isRandomRoute ? buildHreflangLinks(currentPath) : []);
</script>

<svelte:head>
	<link rel="canonical" href={canonicalUrl} />
	{#each hreflangs as h}
		<link rel="alternate" hreflang={h.lang} href={h.href} />
	{/each}
</svelte:head>

<div class="flex-1 flex flex-col">
	<GuideHeader lang={data.lang} />
	<main class="flex-1">
		{@render children()}
	</main>
	<GuideFooter lang={data.lang} />
</div>

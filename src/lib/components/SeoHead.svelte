<script lang="ts">
	import { SITE_NAME, serializeJsonLd, type SeoMetadata } from '$lib/seo';

	interface Props {
		seo: SeoMetadata;
	}

	let { seo }: Props = $props();
</script>

<svelte:head>
	<!-- Primary Metadata -->
	<title>{seo.title}</title>
	{#if seo.description}
		<meta name="description" content={seo.description} />
	{/if}
	{#if seo.robots}
		<meta name="robots" content={seo.robots} />
	{/if}

	<!-- Canonical Link -->
	<link rel="canonical" href={seo.canonicalUrl} />

	<!-- Hreflang Alternates -->
	{#each seo.hreflangs as h}
		<link rel="alternate" hreflang={h.lang} href={h.href} />
	{/each}

	<!-- Open Graph Metadata -->
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={seo.type} />
	<meta property="og:title" content={seo.title} />
	{#if seo.description}
		<meta property="og:description" content={seo.description} />
	{/if}
	<meta property="og:url" content={seo.canonicalUrl} />
	<meta property="og:locale" content={seo.lang === 'de' ? 'de_DE' : 'en_US'} />
	<meta property="og:locale:alternate" content={seo.lang === 'de' ? 'en_US' : 'de_DE'} />
	{#if seo.ogImage}
		<meta property="og:image" content={seo.ogImage} />
		{#if seo.ogImageWidth}
			<meta property="og:image:width" content={seo.ogImageWidth.toString()} />
		{/if}
		{#if seo.ogImageHeight}
			<meta property="og:image:height" content={seo.ogImageHeight.toString()} />
		{/if}
		{#if seo.ogImageType}
			<meta property="og:image:type" content={seo.ogImageType} />
		{/if}
	{/if}

	<!-- Twitter Card Metadata -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	{#if seo.description}
		<meta name="twitter:description" content={seo.description} />
	{/if}
	{#if seo.ogImage}
		<meta name="twitter:image" content={seo.ogImage} />
	{/if}

	<!-- Structured Data (JSON-LD) -->
	{#if seo.jsonLd}
		{@html `<script type="application/ld+json">${serializeJsonLd(seo.jsonLd)}</script>`}
	{/if}
</svelte:head>

<script lang="ts">
	import GuideHeader from '$lib/components/GuideHeader.svelte';
	import GuideFooter from '$lib/components/GuideFooter.svelte';

	let { data, children } = $props();
</script>

<div class="flex-1 flex flex-col">
	<GuideHeader lang={data.lang} />
	<main class="flex-1">
		{@render children()}
	</main>
	<GuideFooter lang={data.lang} />
</div>

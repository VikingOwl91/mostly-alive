<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import type { BreadcrumbItem } from '$lib/seo';

	interface Props {
		items: BreadcrumbItem[];
		class?: string;
	}

	let { items = [], class: className = '' }: Props = $props();
</script>

{#if items.length > 0}
	<nav aria-label="Breadcrumb" class="no-print {className}">
		<ol class="flex flex-wrap items-center gap-1.5 font-mono text-[11px] sm:text-xs text-slate-400">
			{#each items as item, index}
				{#if index > 0}
					<li aria-hidden="true" class="text-slate-600 select-none">
						<ChevronRight class="w-3 h-3" />
					</li>
				{/if}
				<li class="inline-flex items-center min-w-0">
					{#if item.current || index === items.length - 1}
						<span
							class="text-slate-200 font-medium truncate max-w-[180px] sm:max-w-[260px] md:max-w-none"
							aria-current="page"
							title={item.name}
						>
							{item.name}
						</span>
					{:else}
						<a
							href={item.url.replace(/^https?:\/\/[^/]+/, '') || '/'}
							class="text-slate-400 hover:text-cyan-400 transition-colors truncate max-w-[120px] sm:max-w-[200px]"
							title={item.name}
						>
							{item.name}
						</a>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}

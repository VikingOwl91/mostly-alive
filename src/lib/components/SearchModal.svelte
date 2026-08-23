<script lang="ts">
	import { Search, X, ShieldAlert, ArrowRight } from '@lucide/svelte';
	import MiniSearch from 'minisearch';
	import { onMount } from 'svelte';

	interface Props {
		lang?: 'en' | 'de';
		isOpen?: boolean;
		onClose?: () => void;
	}

	let { lang = 'en', isOpen = $bindable(false), onClose }: Props = $props();

	let searchQuery = $state('');
	let searchIndex: MiniSearch | null = $state(null);
	let rawData: any[] = $state([]);
	let searchResults: any[] = $state([]);
	let selectedIndex = $state(0);
	let inputElement: HTMLInputElement | null = $state(null);

	async function loadIndex() {
		try {
			const res = await fetch(`/api/search-index.json?lang=${lang}`);
			if (res.ok) {
				rawData = await res.json();
				const mini = new MiniSearch({
					fields: [
						'title',
						'subtitle',
						'aliases',
						'tags',
						'memory_hook',
						'immediate_action',
						'bodySnippet'
					],
					storeFields: [
						'slug',
						'title',
						'subtitle',
						'category',
						'threat_level',
						'memory_hook',
						'status'
					],
					searchOptions: {
						prefix: true,
						fuzzy: 0.2,
						boost: { title: 4, aliases: 3, tags: 2, memory_hook: 1.5 }
					}
				});
				mini.addAll(rawData);
				searchIndex = mini;
			}
		} catch (err) {
			console.error('Failed to load search index', err);
		}
	}

	$effect(() => {
		if (isOpen) {
			if (!searchIndex) {
				loadIndex();
			}
			setTimeout(() => {
				inputElement?.focus();
			}, 50);
		} else {
			searchQuery = '';
			searchResults = [];
			selectedIndex = 0;
		}
	});

	$effect(() => {
		if (!searchQuery.trim()) {
			searchResults = rawData.slice(0, 5); // Show first 5 items as suggested
			return;
		}

		if (searchIndex) {
			const results = searchIndex.search(searchQuery);
			searchResults = results.slice(0, 8);
			selectedIndex = 0;
		}
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (!isOpen) {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				isOpen = true;
			} else if (
				e.key === '/' &&
				document.activeElement?.tagName !== 'INPUT' &&
				document.activeElement?.tagName !== 'TEXTAREA'
			) {
				e.preventDefault();
				isOpen = true;
			}
			return;
		}

		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (searchResults.length > 0) {
				selectedIndex = (selectedIndex + 1) % searchResults.length;
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (searchResults.length > 0) {
				selectedIndex = (selectedIndex - 1 + searchResults.length) % searchResults.length;
			}
		} else if (e.key === 'Enter') {
			if (searchResults.length > 0 && searchResults[selectedIndex]) {
				e.preventDefault();
				const item = searchResults[selectedIndex];
				window.location.href = `/${lang}/guide/${item.slug}`;
				close();
			}
		}
	}

	function close() {
		isOpen = false;
		if (onClose) onClose();
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop click -->
		<button
			type="button"
			class="fixed inset-0 w-full h-full cursor-default"
			onclick={close}
			tabindex="-1"
			aria-label="Close search modal"
		></button>

		<div
			class="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl terminal-border-amber z-10"
		>
			<!-- Input Header -->
			<div class="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/80">
				<Search class="w-5 h-5 text-amber-400 shrink-0 mr-3" />
				<input
					bind:this={inputElement}
					bind:value={searchQuery}
					type="text"
					placeholder={lang === 'de'
						? 'Suche nach Gefahren, Symptomen oder Alltagsworten (z.B. Haare stehen zu Berge, Gasgeruch, Auto im Wasser)...'
						: 'Search hazards, symptoms or colloquial phrases (e.g. hair standing up, gas smell, car in water)...'}
					class="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-base"
				/>
				<button
					type="button"
					onclick={close}
					class="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Results list -->
			<div class="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/60">
				{#if searchResults.length === 0 && searchQuery.trim()}
					<div class="p-8 text-center text-slate-400 space-y-2">
						<div class="font-mono text-sm">
							{lang === 'de'
								? 'Keine passenden Einträge gefunden'
								: 'No matching survival entries found'}
						</div>
						<p class="text-xs text-slate-500 max-w-sm mx-auto">
							{lang === 'de'
								? 'Versuche es mit einfacheren Begriffen oder schaue in den Notfall-Überblick.'
								: 'Try simpler terms, symptoms, or check the emergency quick-reference.'}
						</p>
					</div>
				{:else}
					{#each searchResults as item, index}
						<a
							href="/{lang}/guide/{item.slug}"
							class="flex items-center justify-between p-3.5 rounded-xl transition-all {index ===
							selectedIndex
								? 'bg-amber-500/15 border border-amber-500/40 text-amber-100'
								: 'hover:bg-slate-800/60 text-slate-200'}"
							onclick={close}
						>
							<div class="space-y-1 pr-3">
								<div class="flex items-center gap-2">
									<span class="font-mono text-xs font-bold uppercase text-amber-400">
										{item.category}
									</span>
									<span class="text-xs font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
										L{item.threat_level ?? 4}
									</span>
								</div>
								<div class="text-base font-semibold text-white">
									{item.title}
								</div>
								{#if item.memory_hook}
									<p class="text-xs text-slate-400 line-clamp-1 italic">
										"{item.memory_hook}"
									</p>
								{/if}
							</div>

							<div class="shrink-0 text-slate-500">
								<ArrowRight class="w-4 h-4" />
							</div>
						</a>
					{/each}
				{/if}
			</div>

			<!-- Footer hints -->
			<div
				class="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400"
			>
				<div class="flex items-center gap-3">
					<span
						><kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
							>↑↓</kbd
						> navigate</span
					>
					<span
						><kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
							>↵</kbd
						> select</span
					>
					<span
						><kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
							>esc</kbd
						> close</span
					>
				</div>
				<a
					href="/{lang}/emergency"
					class="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
				>
					<ShieldAlert class="w-3.5 h-3.5" />
					<span>{lang === 'de' ? 'Notfall-Schnellhilfe' : 'Emergency Quick Ref'}</span>
				</a>
			</div>
		</div>
	</div>
{/if}

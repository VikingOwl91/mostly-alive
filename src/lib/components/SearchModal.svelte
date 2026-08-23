<script lang="ts">
	import { Search, X, ShieldAlert, ArrowRight, CornerDownLeft, Sparkles } from '@lucide/svelte';
	import MiniSearch from 'minisearch';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	interface Props {
		lang?: 'en' | 'de';
		isOpen?: boolean;
		onClose?: () => void;
	}

	let { lang = 'en', isOpen = $bindable(false), onClose }: Props = $props();

	let searchQuery = $state('');
	let rawData: any[] = $state([]);
	let searchResults: any[] = $state([]);
	let selectedIndex = $state(0);
	let isLoading = $state(false);
	let inputElement: HTMLInputElement | null = $state(null);

	// Client-side index cache per language
	const indexCache: Record<string, { mini: MiniSearch; raw: any[] }> = {};

	const searchOptions = {
		prefix: true,
		fuzzy: 0.2,
		combineWith: 'OR' as const,
		boost: {
			title: 6,
			aliases: 5,
			tags: 4,
			memory_hook: 2.5,
			immediate_action: 2,
			memorable_facts: 2,
			body: 1
		}
	};

	async function ensureIndexLoaded(targetLang: 'en' | 'de') {
		if (indexCache[targetLang]) {
			rawData = indexCache[targetLang].raw;
			executeSearch(searchQuery, indexCache[targetLang].mini);
			return;
		}

		isLoading = true;
		try {
			const res = await fetch(`/api/search-index.json?lang=${targetLang}&_t=${Date.now()}`);
			if (res.ok) {
				const data = await res.json();
				const mini = new MiniSearch({
					fields: [
						'title',
						'subtitle',
						'aliases',
						'tags',
						'memory_hook',
						'memorable_facts',
						'immediate_action',
						'body'
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
					searchOptions
				});
				mini.addAll(data);
				indexCache[targetLang] = { mini, raw: data };
				rawData = data;
				executeSearch(searchQuery, mini);
			}
		} catch (err) {
			console.error('Failed to load search index for', targetLang, err);
		} finally {
			isLoading = false;
		}
	}

	function executeSearch(query: string, miniInstance?: MiniSearch) {
		const mini = miniInstance || indexCache[lang]?.mini;
		const trimmed = query.trim();

		if (!trimmed) {
			searchResults = rawData.slice(0, 6);
			selectedIndex = 0;
			return;
		}

		if (mini) {
			const results = mini.search(trimmed, searchOptions);
			searchResults = results.slice(0, 10);
			selectedIndex = 0;
		}
	}

	$effect(() => {
		if (isOpen) {
			ensureIndexLoaded(lang);
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
		// Reactive search execution when query changes
		if (isOpen) {
			executeSearch(searchQuery);
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
			e.preventDefault();
			if (searchResults.length > 0 && searchResults[selectedIndex]) {
				navigateToItem(searchResults[selectedIndex]);
			}
		}
	}

	function navigateToItem(item: any) {
		const targetUrl = `/${lang}/guide/${item.slug}`;
		close();
		goto(targetUrl);
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
		class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md transition-opacity"
		role="dialog"
		aria-modal="true"
		aria-label={lang === 'de' ? 'Suchfenster' : 'Search Dialog'}
	>
		<!-- Backdrop button -->
		<button
			type="button"
			class="fixed inset-0 w-full h-full cursor-default bg-transparent"
			onclick={close}
			tabindex="-1"
			aria-label="Close search"
		></button>

		<div
			class="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl terminal-border-amber z-10 flex flex-col max-h-[80vh]"
		>
			<!-- Input Header -->
			<div class="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/90 shrink-0">
				<Search class="w-5 h-5 text-amber-400 shrink-0 mr-3" />
				<input
					bind:this={inputElement}
					bind:value={searchQuery}
					type="text"
					placeholder={lang === 'de'
						? 'Suche nach Gefahren, Symptomen oder Alltagsworten (z.B. Herzinfarkt, Haare stehen zu Berge, Gasgeruch)...'
						: 'Search hazards, symptoms or colloquial phrases (e.g. heart attack, hair standing up, gas smell)...'}
					class="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-base font-sans"
					autocomplete="off"
					autocorrect="off"
					spellcheck="false"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={() => (searchQuery = '')}
						class="p-1 mr-1 text-slate-400 hover:text-slate-200"
						aria-label="Clear query"
					>
						<X class="w-4 h-4" />
					</button>
				{/if}
				<button
					type="button"
					onclick={close}
					class="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
					aria-label="Close dialog"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Results list -->
			<div class="overflow-y-auto p-2 divide-y divide-slate-800/60 flex-1">
				{#if isLoading}
					<div class="p-8 text-center text-slate-400 font-mono text-xs">
						{lang === 'de' ? 'Suchindex wird initialisiert...' : 'Initializing survival index...'}
					</div>
				{:else if searchResults.length === 0 && searchQuery.trim()}
					<div class="p-8 text-center text-slate-400 space-y-2">
						<div class="font-mono text-sm font-semibold text-slate-300">
							{lang === 'de'
								? 'Keine passenden Einträge gefunden'
								: 'No matching survival entries found'}
						</div>
						<p class="text-xs text-slate-500 max-w-sm mx-auto">
							{lang === 'de'
								? 'Versuche es mit Begriffen wie „Brustschmerz“, „Verschluckt“, „Stromschlag“ oder „Gewitter“.'
								: 'Try common terms such as "chest pain", "choking", "seizure", or "lightning".'}
						</p>
					</div>
				{:else}
					{#if !searchQuery.trim()}
						<div class="px-3 py-1.5 text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center gap-1.5">
							<Sparkles class="w-3.5 h-3.5 text-amber-400" />
							<span>{lang === 'de' ? 'Empfohlene Notfall-Einträge' : 'Suggested Emergency Guides'}</span>
						</div>
					{/if}

					{#each searchResults as item, index}
						<a
							href="/{lang}/guide/{item.slug}"
							class="flex items-center justify-between p-3.5 rounded-xl transition-all {index ===
							selectedIndex
								? 'bg-amber-500/15 border border-amber-500/40 text-amber-100'
								: 'hover:bg-slate-800/60 text-slate-200 border border-transparent'}"
							onclick={(e) => {
								e.preventDefault();
								navigateToItem(item);
							}}
							onmouseenter={() => (selectedIndex = index)}
						>
							<div class="space-y-1 pr-3 flex-1">
								<div class="flex items-center gap-2">
									<span class="font-mono text-[11px] font-bold uppercase text-amber-400">
										{item.category}
									</span>
									<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
										L{item.threat_level ?? 4}
									</span>
								</div>
								<div class="text-base font-semibold text-white">
									{item.title}
								</div>
								{#if item.memory_hook}
									<p class="text-xs text-cyan-300/80 italic leading-relaxed">
										"{item.memory_hook}"
									</p>
								{/if}
							</div>

							<div class="shrink-0 text-slate-500 flex items-center gap-1.5">
								{#if index === selectedIndex}
									<CornerDownLeft class="w-3.5 h-3.5 text-amber-400" />
								{:else}
									<ArrowRight class="w-4 h-4" />
								{/if}
							</div>
						</a>
					{/each}
				{/if}
			</div>

			<!-- Footer hints -->
			<div
				class="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0"
			>
				<div class="flex items-center gap-3">
					<span
						><kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
							>↑↓</kbd
						> {lang === 'de' ? 'navigieren' : 'navigate'}</span
					>
					<span
						><kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
							>↵</kbd
						> {lang === 'de' ? 'öffnen' : 'select'}</span
					>
					<span
						><kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
							>esc</kbd
						> {lang === 'de' ? 'schließen' : 'close'}</span
					>
				</div>
				<a
					href="/{lang}/emergency"
					onclick={close}
					class="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
				>
					<ShieldAlert class="w-3.5 h-3.5" />
					<span>{lang === 'de' ? 'Notfall-Schnellhilfe' : 'Emergency Basics'}</span>
				</a>
			</div>
		</div>
	</div>
{/if}

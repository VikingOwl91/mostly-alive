<script lang="ts">
	import {
		Search,
		X,
		ShieldAlert,
		ArrowRight,
		CornerDownLeft,
		Sparkles,
		HeartPulse,
		AlertTriangle,
		Crosshair,
		Activity,
		Flame
	} from '@lucide/svelte';
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

	// Curated Emergency Quick Launcher items for zero-query state
	const emergencyQuickPicks: Record<
		'en' | 'de',
		Array<{
			title: string;
			slug: string;
			subtitle: string;
			category: string;
			threat_level: number;
		}>
	> = {
		en: [
			{
				title: 'Person No Longer Breathing (CPR)',
				slug: 'person-no-longer-breathing-for-some-reason',
				subtitle: 'Cardiopulmonary resuscitation (CPR 30:2) and AED',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Person Currently Choking',
				slug: 'person-currently-choking',
				subtitle: '5 back blows and 5 abdominal thrusts (Heimlich)',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Life-Threatening Bleeding',
				slug: 'bleeding-more-than-is-generally-recommended',
				subtitle: 'Direct pressure, wound packing, and tourniquets',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Allergy Escalating Rather Quickly (Anaphylaxis)',
				slug: 'allergy-escalating-rather-quickly',
				subtitle: 'Immediate epinephrine auto-injector protocol',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Face Doing Something Weird on One Side (Stroke)',
				slug: 'face-doing-something-weird-on-one-side',
				subtitle: 'FAST stroke recognition and emergency activation',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Chest Feeling Unreasonably Heavy (Heart Attack)',
				slug: 'chest-feeling-unreasonably-heavy',
				subtitle: 'Acute coronary syndrome recognition and positioning',
				category: 'medical',
				threat_level: 5
			}
		],
		de: [
			{
				title: 'Herz-Lungen-Wiederbelebung (CPR)',
				slug: 'person-no-longer-breathing-for-some-reason',
				subtitle: 'Reanimation 30:2 und AED-Einsatz bei Atemstillstand',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Person erstickt (Verschlucken)',
				slug: 'person-currently-choking',
				subtitle: '5 Rückenschläge und 5 Oberbauchkompressionen (Heimlich)',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Kritische Blutung',
				slug: 'bleeding-more-than-is-generally-recommended',
				subtitle: 'Direkter Druck, Wundtamponade und Tourniquet',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Allergischer Schock (Anaphylaxie)',
				slug: 'allergy-escalating-rather-quickly',
				subtitle: 'Sofortige Adrenalin-Autoinjektor-Gabe',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Schlaganfall (FAST-Schema)',
				slug: 'face-doing-something-weird-on-one-side',
				subtitle: 'FAST-Test zur schnellen Schlaganfallerkennung',
				category: 'medical',
				threat_level: 5
			},
			{
				title: 'Herzinfarkt (Brustenge)',
				slug: 'chest-feeling-unreasonably-heavy',
				subtitle: 'Erkennung von akutem Koronarsyndrom und Ruhelagerung',
				category: 'medical',
				threat_level: 5
			}
		]
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
			searchResults = emergencyQuickPicks[lang];
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
		if (isOpen) {
			executeSearch(searchQuery);
		}
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (!isOpen) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			closeModal();
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
			if (searchResults[selectedIndex]) {
				selectResult(searchResults[selectedIndex]);
			}
		}
	}

	function selectResult(item: any) {
		closeModal();
		// If item is a static page / editorial page, route to /{lang}/{slug}
		const isPage = item.is_page || item.category === 'editorial' || item.category === 'system';
		const targetUrl = isPage ? `/${lang}/${item.slug}` : `/${lang}/guide/${item.slug}`;
		goto(targetUrl);
	}

	function closeModal() {
		isOpen = false;
		if (onClose) onClose();
	}

	onMount(() => {
		function onGlobalKeyDown(e: KeyboardEvent) {
			// Cmd+K or Ctrl+K or /
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				isOpen = !isOpen;
			} else if (
				e.key === '/' &&
				!isOpen &&
				document.activeElement?.tagName !== 'INPUT' &&
				document.activeElement?.tagName !== 'TEXTAREA'
			) {
				e.preventDefault();
				isOpen = true;
			}
		}

		window.addEventListener('keydown', onGlobalKeyDown);
		return () => window.removeEventListener('keydown', onGlobalKeyDown);
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeModal();
		}}
		onkeydown={(e) => {
			if (e.target === e.currentTarget && (e.key === 'Escape' || e.key === 'Enter')) closeModal();
		}}
		role="dialog"
		tabindex="-1"
		aria-modal="true"
		aria-label={lang === 'de' ? 'Notfall- und Wissenssuche' : 'Emergency & Knowledge Search'}
	>
		<!-- Modal Box -->
		<div
			class="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden terminal-border flex flex-col my-auto sm:my-0"
		>
			<!-- Input Header -->
			<div class="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
				<Search class="w-5 h-5 text-amber-400 shrink-0 ml-1" />
				<input
					bind:this={inputElement}
					bind:value={searchQuery}
					type="text"
					placeholder={lang === 'de'
						? 'Suche: Herzinfarkt, Blutung, Strom, Tsunami, Blitz...'
						: 'Search: heart attack, bleeding, power line, tsunami, lightning...'}
					class="w-full bg-transparent px-3.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-mono"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={() => (searchQuery = '')}
						class="p-1 rounded-md text-slate-400 hover:text-white"
					>
						<X class="w-4 h-4" />
					</button>
				{/if}
				<button
					type="button"
					onclick={closeModal}
					class="ml-2 px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-400 hover:text-white border border-slate-700"
				>
					ESC
				</button>
			</div>

			<!-- Search Results / Initial Emergency Launcher -->
			<div class="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/40">
				{#if isLoading}
					<div class="py-12 text-center text-slate-400 font-mono text-xs">
						{lang === 'de' ? 'Lade Suchindex...' : 'Loading search index...'}
					</div>
				{:else if searchResults.length > 0}
					<!-- Zero-query Emergency Launcher Banner -->
					{#if !searchQuery.trim()}
						<div
							class="px-3 py-2 flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-red-400"
						>
							<ShieldAlert class="w-3.5 h-3.5 animate-pulse" />
							<span>{lang === 'de' ? '// HÄUFIGE NOTFALL-SUCHEN' : '// COMMON URGENT LOOKUPS'}</span>
						</div>
					{/if}

					{#each searchResults as item, idx}
						<button
							type="button"
							class="w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 group {selectedIndex ===
							idx
								? 'bg-amber-500/15 border border-amber-500/40'
								: 'hover:bg-slate-800/50 border border-transparent'}"
							onclick={() => selectResult(item)}
							onmouseenter={() => (selectedIndex = idx)}
						>
							<div class="space-y-1 min-w-0">
								<div class="flex items-center gap-2 flex-wrap">
									<span
										class="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded {item.threat_level >=
										4
											? 'bg-red-950 text-red-300 border border-red-500/30'
											: 'bg-amber-950 text-amber-300 border border-amber-500/30'}"
									>
										{item.category}
									</span>
									{#if item.threat_level > 0}
										<span class="font-mono text-[10px] text-slate-400">
											L{item.threat_level}
										</span>
									{/if}
								</div>

								<div
									class="text-sm font-mono font-bold text-white group-hover:text-amber-300 transition-colors truncate"
								>
									{item.title}
								</div>

								{#if item.subtitle || item.memory_hook}
									<p class="text-xs text-slate-400 truncate font-sans">
										{item.subtitle || item.memory_hook}
									</p>
								{/if}
							</div>

							<div class="shrink-0 text-slate-500 group-hover:text-amber-400">
								<CornerDownLeft class="w-4 h-4" />
							</div>
						</button>
					{/each}
				{:else}
					<div class="py-12 text-center space-y-2">
						<p class="font-mono text-sm text-slate-300">
							{lang === 'de'
								? `Keine Treffer für "${searchQuery}"`
								: `No survival guide found for "${searchQuery}"`}
						</p>
						<p class="text-xs text-slate-500">
							{lang === 'de'
								? 'Versuche es mit Synonymen oder schau in die Notfall-Kategorien.'
								: 'Try broad keywords like "burns", "cpr", or check emergency categories.'}
						</p>
					</div>
				{/if}
			</div>

			<!-- Keyboard Footer Shortcuts -->
			<div
				class="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500"
			>
				<div class="flex items-center gap-3">
					<span><strong class="text-slate-400">↑↓</strong> {lang === 'de' ? 'Navigieren' : 'Navigate'}</span>
					<span><strong class="text-slate-400">↵</strong> {lang === 'de' ? 'Öffnen' : 'Select'}</span>
					<span><strong class="text-slate-400">ESC</strong> {lang === 'de' ? 'Schließen' : 'Close'}</span>
				</div>
				<span class="hidden sm:inline text-amber-500/80">Mostly Alive Search</span>
			</div>
		</div>
	</div>
{/if}

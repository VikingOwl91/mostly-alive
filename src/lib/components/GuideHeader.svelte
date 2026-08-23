<script lang="ts">
	import { ShieldAlert, Search, Dices, BookOpen, Menu, X } from '@lucide/svelte';
	import LanguagePicker from '$lib/components/LanguagePicker.svelte';
	import SearchModal from '$lib/components/SearchModal.svelte';

	interface Props {
		lang?: 'en' | 'de';
	}

	let { lang = 'en' }: Props = $props();

	let isSearchOpen = $state(false);
	let isMobileMenuOpen = $state(false);
</script>

<header class="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#07090e]/95 backdrop-blur-md">
	<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
		<!-- Brand / Logo -->
		<div class="flex items-center gap-2 sm:gap-3 shrink-0">
			<a href="/{lang}" class="flex items-center gap-2 sm:gap-2.5 group min-h-[44px] py-1">
				<div
					class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.15)] shrink-0"
				>
					<span class="font-mono font-black text-sm tracking-tighter">MA</span>
				</div>
				<div class="flex flex-col">
					<span
						class="font-mono text-sm sm:text-base font-bold tracking-wider text-slate-100 group-hover:text-amber-400 transition-colors uppercase whitespace-nowrap"
					>
						Mostly Alive
					</span>
					<span class="text-[10px] font-mono text-slate-400 tracking-tight hidden sm:block">
						{lang === 'de' ? 'Praktischer Leitfaden' : 'Practical Survival Guide'}
					</span>
				</div>
			</a>
		</div>

		<!-- Desktop Navigation -->
		<nav aria-label={lang === 'de' ? 'Hauptnavigation' : 'Main navigation'} class="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-mono">
			<a
				href="/{lang}/guide"
				class="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 min-h-[40px] px-1"
			>
				<BookOpen class="w-3.5 h-3.5 text-slate-400" />
				<span>{lang === 'de' ? 'Handbuch' : 'Guide'}</span>
			</a>
			<a href="/{lang}/categories" class="text-slate-300 hover:text-amber-400 transition-colors min-h-[40px] px-1 flex items-center">
				<span>{lang === 'de' ? 'Kategorien' : 'Categories'}</span>
			</a>
			<a
				href="/{lang}/random"
				class="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 min-h-[40px] px-1"
			>
				<Dices class="w-3.5 h-3.5 text-cyan-400" />
				<span>{lang === 'de' ? 'Zufallseintrag' : 'Random Entry'}</span>
			</a>
			<a
				href="/{lang}/emergency"
				class="px-3.5 py-2 rounded-xl bg-red-950/70 hover:bg-red-900/90 border border-red-500/50 text-red-200 hover:text-white font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.2)] min-h-[40px]"
			>
				<ShieldAlert class="w-4 h-4 text-red-400 animate-pulse" />
				<span>{lang === 'de' ? 'NOTFALL-SCHNELLHILFE' : 'EMERGENCY BASICS'}</span>
			</a>
		</nav>

		<!-- Right Tools (Search + Language + Mobile Toggle) -->
		<div class="flex items-center gap-1.5 sm:gap-3">
			<button
				type="button"
				onclick={() => (isSearchOpen = true)}
				class="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors min-h-[40px]"
			>
				<Search class="w-3.5 h-3.5 text-amber-400" />
				<span>{lang === 'de' ? 'Suchen...' : 'Search...'}</span>
				<kbd
					class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400"
					>⌘K</kbd
				>
			</button>

			<button
				type="button"
				onclick={() => (isSearchOpen = true)}
				class="sm:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 transition-colors"
				aria-label={lang === 'de' ? 'Suche öffnen' : 'Open search'}
			>
				<Search class="w-4 h-4" />
			</button>

			<LanguagePicker currentLang={lang} />

			<button
				type="button"
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
				aria-label={isMobileMenuOpen ? (lang === 'de' ? 'Menü schließen' : 'Close menu') : (lang === 'de' ? 'Menü öffnen' : 'Open menu')}
				aria-expanded={isMobileMenuOpen}
			>
				{#if isMobileMenuOpen}
					<X class="w-5 h-5" />
				{:else}
					<Menu class="w-5 h-5" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Dropdown Menu -->
	{#if isMobileMenuOpen}
		<nav
			aria-label={lang === 'de' ? 'Mobile Navigation' : 'Mobile navigation'}
			class="md:hidden border-t border-slate-800 bg-[#07090e] px-4 pt-3 pb-6 space-y-2.5 font-mono text-sm shadow-2xl"
		>
			<a
				href="/{lang}/emergency"
				onclick={() => (isMobileMenuOpen = false)}
				class="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-red-950/80 border-2 border-red-500/60 text-red-100 font-bold text-center shadow-[0_0_15px_rgba(239,68,68,0.25)] min-h-[48px]"
			>
				<ShieldAlert class="w-4 h-4 text-red-400 animate-pulse" />
				<span>{lang === 'de' ? 'NOTFALL-SCHNELLHILFE (SOFORT)' : 'EMERGENCY BASICS (ACT NOW)'}</span>
			</a>
			<a
				href="/{lang}/guide"
				onclick={() => (isMobileMenuOpen = false)}
				class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-slate-900 border border-slate-800/60 min-h-[48px]"
			>
				<BookOpen class="w-4 h-4 text-amber-400 shrink-0" />
				<span>{lang === 'de' ? 'Handbuch-Übersicht' : 'Guide Directory'}</span>
			</a>
			<a
				href="/{lang}/categories"
				onclick={() => (isMobileMenuOpen = false)}
				class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-slate-900 border border-slate-800/60 min-h-[48px]"
			>
				<span class="text-base select-none">📂</span>
				<span>{lang === 'de' ? 'Gefahrenkategorien' : 'Hazard Categories'}</span>
			</a>
			<a
				href="/{lang}/random"
				onclick={() => (isMobileMenuOpen = false)}
				class="flex items-center gap-3 px-4 py-3 rounded-xl text-cyan-300 hover:bg-slate-900 border border-cyan-900/30 min-h-[48px]"
			>
				<Dices class="w-4 h-4 text-cyan-400 shrink-0" />
				<span>{lang === 'de' ? 'Spontaner Zufallseintrag' : 'Random Survival Entry'}</span>
			</a>
		</nav>
	{/if}
</header>

<SearchModal {lang} bind:isOpen={isSearchOpen} />

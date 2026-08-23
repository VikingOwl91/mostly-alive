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

<header class="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#07090e]/90 backdrop-blur-md">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
		<!-- Brand / Logo -->
		<div class="flex items-center gap-3">
			<a href="/{lang}" class="flex items-center gap-2.5 group">
				<div
					class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.15)]"
				>
					<span class="font-mono font-black text-sm tracking-tighter">MA</span>
				</div>
				<div class="flex flex-col">
					<span
						class="font-mono text-sm font-bold tracking-wider text-slate-100 group-hover:text-amber-400 transition-colors uppercase"
					>
						Mostly Alive
					</span>
					<span class="text-[10px] font-mono text-slate-400 tracking-tight">
						{lang === 'de' ? 'Praktischer Leitfaden' : 'Practical Survival Guide'}
					</span>
				</div>
			</a>
		</div>

		<!-- Desktop Navigation -->
		<nav aria-label={lang === 'de' ? 'Hauptnavigation' : 'Main navigation'} class="hidden md:flex items-center gap-6 text-xs font-mono">
			<a
				href="/{lang}/guide"
				class="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
			>
				<BookOpen class="w-3.5 h-3.5 text-slate-400" />
				<span>{lang === 'de' ? 'Handbuch' : 'Guide'}</span>
			</a>
			<a href="/{lang}/categories" class="text-slate-300 hover:text-amber-400 transition-colors">
				<span>{lang === 'de' ? 'Kategorien' : 'Categories'}</span>
			</a>
			<a
				href="/{lang}/random"
				class="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
			>
				<Dices class="w-3.5 h-3.5 text-cyan-400" />
				<span>{lang === 'de' ? 'Zufallseintrag' : 'Random Entry'}</span>
			</a>
			<a
				href="/{lang}/emergency"
				class="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 hover:text-red-200 font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
			>
				<ShieldAlert class="w-3.5 h-3.5 animate-pulse" />
				<span>{lang === 'de' ? 'NOTFALL-SCHNELLHILFE' : 'EMERGENCY BASICS'}</span>
			</a>
		</nav>

		<!-- Right Tools (Search + Language + Mobile Toggle) -->
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={() => (isSearchOpen = true)}
				class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
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
				class="sm:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400"
				aria-label="Search"
			>
				<Search class="w-4 h-4" />
			</button>

			<LanguagePicker currentLang={lang} />

			<button
				type="button"
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
				aria-label="Open menu"
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
			class="md:hidden border-t border-slate-800 bg-[#07090e] px-4 pt-3 pb-5 space-y-3 font-mono text-sm"
		>
			<a
				href="/{lang}/guide"
				onclick={() => (isMobileMenuOpen = false)}
				class="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900"
			>
				📖 {lang === 'de' ? 'Handbuch-Übersicht' : 'Guide Directory'}
			</a>
			<a
				href="/{lang}/categories"
				onclick={() => (isMobileMenuOpen = false)}
				class="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900"
			>
				📂 {lang === 'de' ? 'Kategorien' : 'Categories'}
			</a>
			<a
				href="/{lang}/random"
				onclick={() => (isMobileMenuOpen = false)}
				class="block px-3 py-2 rounded-lg text-cyan-300 hover:bg-slate-900"
			>
				🎲 {lang === 'de' ? 'Zufallseintrag' : 'Random Entry'}
			</a>
			<a
				href="/{lang}/emergency"
				onclick={() => (isMobileMenuOpen = false)}
				class="block px-3 py-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 font-bold text-center"
			>
				🚨 {lang === 'de' ? 'NOTFALL-SCHNELLHILFE' : 'EMERGENCY BASICS'}
			</a>
		</nav>
	{/if}
</header>

<SearchModal {lang} bind:isOpen={isSearchOpen} />

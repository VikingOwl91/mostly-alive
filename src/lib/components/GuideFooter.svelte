<script lang="ts">
	import { Shield, Heart, AlertTriangle } from '@lucide/svelte';

	interface Props {
		lang?: 'en' | 'de';
	}

	let { lang = 'en' }: Props = $props();
</script>

<footer class="mt-20 border-t border-slate-800/80 bg-slate-950/60 text-slate-400 text-xs">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<nav aria-label={lang === 'de' ? 'Fußzeilen-Navigation' : 'Footer navigation'} class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
			<!-- Column 1: Guide & Content -->
			<div class="space-y-3 font-mono">
				<div class="text-[11px] uppercase font-bold text-slate-200 tracking-wider">
					{lang === 'de' ? 'Wissensbasis' : 'Knowledge Base'}
				</div>
				<ul class="space-y-2">
					<li>
						<a href="/{lang}/guide" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Alle Artikel' : 'All Articles'}</a
						>
					</li>
					<li>
						<a href="/{lang}/categories" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Kategorien' : 'Categories'}</a
						>
					</li>
					<li>
						<a href="/{lang}/emergency" class="hover:text-red-400 transition-colors"
							>{lang === 'de' ? 'Notfall-Sofortübersicht' : 'Emergency Basics'}</a
						>
					</li>
					<li>
						<a href="/{lang}/random" class="hover:text-cyan-400 transition-colors"
							>{lang === 'de' ? 'Zufälliger Ratschlag' : 'Random Entry'}</a
						>
					</li>
				</ul>
			</div>

			<!-- Column 2: Trust & Editorial -->
			<div class="space-y-3 font-mono">
				<div class="text-[11px] uppercase font-bold text-slate-200 tracking-wider">
					{lang === 'de' ? 'Prüfung & Transparenz' : 'Editorial & Trust'}
				</div>
				<ul class="space-y-2">
					<li>
						<a href="/{lang}/methodology" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Methodik & Quellenstandard' : 'Methodology & Standards'}</a
						>
					</li>
					<li>
						<a href="/{lang}/sources" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Autoritative Quellen' : 'Authoritative Sources'}</a
						>
					</li>
					<li>
						<a href="/{lang}/editorial-policy" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Redaktionsrichtlinie' : 'Editorial Policy'}</a
						>
					</li>
					<li>
						<a href="/{lang}/contributing" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Mitwirken / Korrekturen' : 'Contribute / Corrections'}</a
						>
					</li>
				</ul>
			</div>

			<!-- Column 3: Legal -->
			<div class="space-y-3 font-mono">
				<div class="text-[11px] uppercase font-bold text-slate-200 tracking-wider">
					{lang === 'de' ? 'Rechtliches' : 'Legal & Policies'}
				</div>
				<ul class="space-y-2">
					<li>
						<a href="/{lang}/imprint" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Impressum' : 'Imprint / Legal Notice'}</a
						>
					</li>
					<li>
						<a href="/{lang}/privacy" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}</a
						>
					</li>
					<li>
						<a href="/{lang}/terms" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Nutzungsbedingungen' : 'Terms of Service'}</a
						>
					</li>
					<li>
						<a href="/{lang}/security" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Sicherheitshinweise' : 'Security Policy'}</a
						>
					</li>
					<li>
						<a href="/{lang}/accessibility" class="hover:text-amber-400 transition-colors"
							>{lang === 'de' ? 'Barrierefreiheit' : 'Accessibility'}</a
						>
					</li>
				</ul>
			</div>

			<!-- Column 4: Project Info -->
			<div class="space-y-3 font-mono">
				<div class="text-[11px] uppercase font-bold text-slate-200 tracking-wider">
					{lang === 'de' ? 'Open Source' : 'Open Source Project'}
				</div>
				<p class="text-xs text-slate-400 leading-relaxed">
					{lang === 'de'
						? 'Ein gemeinnütziges, quellenbasiertes Sicherheitskompendium für ungewöhnliche Alltagslagen.'
						: 'An open-source, source-backed safety compendium for unusual everyday situations.'}
				</p>
				<div class="pt-2 flex items-center gap-3">
					<a
						href="https://github.com/VikingOwl91/mostly-alive"
						target="_blank"
						rel="noopener noreferrer"
						class="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
						aria-label="GitHub Repository"
					>
						<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
							<path
								d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
							/>
						</svg>
					</a>
					<a
						href="/editor"
						class="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
					>
						Web Studio
					</a>
				</div>
			</div>
		</nav>

		<!-- Bottom Bar with Absurdist Dry Disclaimer -->
		<div
			class="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
		>
			<div class="space-y-1">
				<div class="font-mono text-xs text-slate-400">
					{lang === 'de'
						? 'Keine Menschen wurden bei der Erstellung dieser Dokumentation verletzt.'
						: 'No humans were harmed in the preparation of this documentation.'}
				</div>
				<div class="font-mono text-[11px] text-slate-400 italic">
					{lang === 'de'
						? 'Diese Aussage wurde nicht unabhängig überprüft.'
						: 'This statement has not been independently verified.'}
				</div>
			</div>

			<div class="font-mono text-xs text-slate-400">
				Mostly Alive • CC BY-SA 4.0 (Content) & MIT (Software)
			</div>
		</div>
	</div>
</footer>

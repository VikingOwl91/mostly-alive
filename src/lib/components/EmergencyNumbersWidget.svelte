<script lang="ts">
	import { PhoneCall, ShieldAlert, Globe } from '@lucide/svelte';
	import { EMERGENCY_REGISTRY } from '$lib/types/emergency';

	interface Props {
		lang?: 'en' | 'de';
		defaultRegion?: string;
	}

	let { lang = 'en', defaultRegion = 'de' }: Props = $props();

	let selectedRegion = $state('de');

	$effect(() => {
		selectedRegion = defaultRegion;
	});

	let currentProfile = $derived(EMERGENCY_REGISTRY[selectedRegion] || EMERGENCY_REGISTRY.de);
</script>

<div class="rounded-xl border border-red-500/40 bg-red-950/20 p-5 terminal-border-red">
	<div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-red-500/20">
		<div class="flex items-center gap-2.5 text-red-400">
			<ShieldAlert class="w-5 h-5" />
			<span class="font-mono text-xs font-bold uppercase tracking-wider">
				{lang === 'de' ? 'NOTRUFNUMMERN (OFFIZIELL)' : 'EMERGENCY DISPATCH NUMBERS'}
			</span>
		</div>

		<!-- Region selector -->
		<div class="flex items-center gap-1.5 text-xs font-mono">
			<Globe class="w-3.5 h-3.5 text-slate-400" />
			<select
				bind:value={selectedRegion}
				class="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-red-500"
			>
				<option value="de">Deutschland (DE)</option>
				<option value="eu">European Union (EU - 112)</option>
				<option value="us">United States (US)</option>
				<option value="uk">United Kingdom (UK)</option>
				<option value="au">Australia (AU)</option>
			</select>
		</div>
	</div>

	<!-- Number cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
		<!-- General / Fire / Medical -->
		<a
			href="tel:{currentProfile.generalEmergency}"
			class="flex items-center justify-between p-3.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 transition-colors group"
		>
			<div>
				<div class="text-[11px] font-mono uppercase text-red-300">
					{lang === 'de' ? 'Feuerwehr / Notarzt' : 'Fire & Medical Dispatch'}
				</div>
				<div class="text-2xl font-bold font-mono text-white group-hover:text-red-200">
					{currentProfile.generalEmergency}
				</div>
			</div>
			<div class="p-2 rounded-full bg-red-500/20 text-red-300 group-hover:bg-red-500/30">
				<PhoneCall class="w-4 h-4" />
			</div>
		</a>

		<!-- Police -->
		<a
			href="tel:{currentProfile.police}"
			class="flex items-center justify-between p-3.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700 transition-colors group"
		>
			<div>
				<div class="text-[11px] font-mono uppercase text-slate-400">
					{lang === 'de' ? 'Polizei' : 'Police'}
				</div>
				<div class="text-2xl font-bold font-mono text-white group-hover:text-slate-200">
					{currentProfile.police}
				</div>
			</div>
			<div class="p-2 rounded-full bg-slate-800 text-slate-300 group-hover:bg-slate-700">
				<PhoneCall class="w-4 h-4" />
			</div>
		</a>

		{#if currentProfile.poisonControl}
			<a
				href="tel:{currentProfile.poisonControl.replace(/\s+/g, '')}"
				class="sm:col-span-2 flex items-center justify-between p-3 rounded-lg bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/30 transition-colors group"
			>
				<div>
					<div class="text-[11px] font-mono uppercase text-amber-300">
						{lang === 'de' ? 'Giftnotruf' : 'Poison Help Center'}
					</div>
					<div class="text-base font-bold font-mono text-amber-100">
						{currentProfile.poisonControl}
						{#if currentProfile.poisonControlName}
							<span class="text-xs font-sans font-normal text-slate-400 ml-2">
								({currentProfile.poisonControlName})
							</span>
						{/if}
					</div>
				</div>
				<div class="p-2 rounded-full bg-amber-500/20 text-amber-300">
					<PhoneCall class="w-4 h-4" />
				</div>
			</a>
		{/if}
	</div>

	{#if currentProfile.authorityNotes}
		<p class="text-xs text-slate-400 mt-3 italic">
			{currentProfile.authorityNotes[lang]}
		</p>
	{/if}
</div>

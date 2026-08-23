<script lang="ts">
	interface Props {
		level: number; // 0 to 5
		lang?: 'en' | 'de';
	}

	let { level = 0, lang = 'en' }: Props = $props();

	const labels = {
		en: [
			'0 — Fine',
			'1 — Mildly Concerning',
			'2 — Worth Addressing',
			'3 — Quite Bad',
			'4 — Leave',
			'5 — Leave Faster'
		],
		de: [
			'0 — Unbedenklich',
			'1 — Leicht Beunruhigend',
			'2 — Beachtenswert',
			'3 — Ziemlich Ungünstig',
			'4 — Entfernen',
			'5 — Schneller Entfernen'
		]
	};

	const levelColors = [
		'bg-slate-700 text-slate-300 border-slate-600',
		'bg-emerald-950/80 text-emerald-300 border-emerald-600/40',
		'bg-cyan-950/80 text-cyan-300 border-cyan-600/40',
		'bg-amber-950/80 text-amber-300 border-amber-500/50',
		'bg-orange-950/90 text-orange-300 border-orange-500/60',
		'bg-red-950/90 text-red-300 border-red-500/70 animate-pulse'
	];

	const barColors = [
		'bg-slate-500',
		'bg-emerald-400',
		'bg-cyan-400',
		'bg-amber-400',
		'bg-orange-500',
		'bg-red-500'
	];

	let currentLabel = $derived(labels[lang][Math.min(Math.max(0, level), 5)]);
</script>

<div class="inline-flex flex-col gap-1.5 font-mono">
	<div class="flex items-center gap-2">
		<span class="text-[10px] uppercase tracking-wider text-slate-400">
			{lang === 'de' ? 'Bedrohungsstufe' : 'Threat Level'}
		</span>
		<span class="text-xs font-semibold px-2 py-0.5 rounded border {levelColors[level]}">
			{currentLabel}
		</span>
	</div>
	<div class="flex gap-1 h-1.5 w-full max-w-[180px]">
		{#each Array(6) as _, i}
			<div
				class="flex-1 rounded-xs transition-all duration-300 {i <= level
					? barColors[level]
					: 'bg-slate-800/80'}"
			></div>
		{/each}
	</div>
</div>

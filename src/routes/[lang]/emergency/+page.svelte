<script lang="ts">
	import {
		ShieldAlert,
		PhoneCall,
		AlertTriangle,
		ArrowRight,
		HeartPulse,
		Flame,
		Zap,
		Waves,
		Wind
	} from '@lucide/svelte';
	import EmergencyNumbersWidget from '$lib/components/EmergencyNumbersWidget.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title
		>{data.lang === 'de'
			? 'NOTFALL-SCHNELLHILFE — Mostly Alive'
			: 'EMERGENCY BASICS — Mostly Alive'}</title
	>
	<meta
		name="description"
		content={data.lang === 'de'
			? 'Kompakte, schnörkellose Sofortmaßnahmen für akute Lebensgefahr.'
			: 'Ultra-fast, zero-fluff immediate actions for life-threatening emergencies.'}
	/>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
	<!-- High Alert Header -->
	<div class="p-6 sm:p-8 rounded-2xl bg-red-950/40 border border-red-500/50 terminal-border-red">
		<div
			class="flex items-center gap-3 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-2"
		>
			<ShieldAlert class="w-6 h-6 animate-pulse" />
			<span
				>{data.lang === 'de'
					? 'AKUTER NOTFALL-MODUS // NULL KOMMENTAR'
					: 'EMERGENCY FAST SCAN // ZERO COMMENTARY'}</span
			>
		</div>
		<h1 class="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight">
			{data.lang === 'de' ? 'Sofortmaßnahmen bei Lebensgefahr' : 'Immediate Survival Actions'}
		</h1>
		<p class="text-sm text-red-200 mt-2 font-medium">
			{data.lang === 'de'
				? '1. Eigenschutz sicherstellen • 2. Notruf absetzen • 3. Sofortige Maßnahmen ergreifen.'
				: '1. Ensure scene safety • 2. Call emergency dispatch • 3. Execute immediate life support.'}
		</p>
	</div>

	<!-- Emergency Numbers Selector -->
	<EmergencyNumbersWidget lang={data.lang} />

	<!-- Fast Scan Quick Cards -->
	<div class="space-y-6">
		<h2
			class="font-mono text-lg font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2"
		>
			{data.lang === 'de'
				? 'Akute Situationen — Schneller Überblick'
				: 'Critical Scenarios — Fast Action'}
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- CPR / Herz-Lungen-Wiederbelebung -->
			<div class="p-6 rounded-2xl bg-slate-900 border border-red-500/30 space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
						<HeartPulse class="w-4 h-4" />
						<span
							>{data.lang === 'de'
								? 'Bewusstlos + Keine normale Atmung'
								: 'Unconscious + No Normal Breathing'}</span
						>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40"
					>
						CPR 30:2
					</span>
				</div>
				<h3 class="text-xl font-mono font-bold text-white">
					{data.lang === 'de'
						? 'Herz-Lungen-Wiederbelebung (CPR)'
						: 'Cardiopulmonary Resuscitation (CPR)'}
				</h3>
				<ol
					class="space-y-2 text-xs text-slate-200 list-decimal list-inside font-medium leading-relaxed"
				>
					<li>
						{data.lang === 'de'
							? 'Reaktion prüfen (Laut ansprechen, Schultern rütteln)'
							: 'Check response (Shout loudly, shake shoulders)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Atemwege frei machen (Kopf nackenwärts überstrecken), 10 Sek. Atmung prüfen'
							: 'Open airway (Tilt head, lift chin), check breathing 10s'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Sofort Notruf 112 rufen / AED anfordern'
							: 'Call 911/112 immediately, send someone for AED'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Herzdruckmassage: Mitte Brustkorb, 5-6 cm tief, 100-120/min (30x drücken, 2x beatmen oder durchgehend drücken)'
							: 'Chest compressions: Center of chest, 5-6 cm deep, 100-120 bpm (30 compressions, 2 breaths or continuous)'}
					</li>
				</ol>
			</div>

			<!-- Choking / Ersticken -->
			<div class="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
						<AlertTriangle class="w-4 h-4" />
						<span
							>{data.lang === 'de'
								? 'Vollständige Atemwegsverlegung'
								: 'Severe Airway Obstruction'}</span
						>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40"
					>
						5+5
					</span>
				</div>
				<h3 class="text-xl font-mono font-bold text-white">
					{data.lang === 'de' ? 'Person erstickt (Verschlucken)' : 'Person Currently Choking'}
				</h3>
				<ol
					class="space-y-2 text-xs text-slate-200 list-decimal list-inside font-medium leading-relaxed"
				>
					<li>
						{data.lang === 'de'
							? 'Fragen: "Ersticken Sie?" — Wenn kein Sprechen/Husten möglich:'
							: 'Ask "Are you choking?" — If unable to speak/cough:'}
					</li>
					<li>
						{data.lang === 'de'
							? '5 kräftige Rückenschläge zwischen die Schulterblätter (Oberkörper nach vorne gebeugt)'
							: 'Give 5 sharp back blows between shoulder blades'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Falls erfolglos: 5 Oberbauchkompressionen (Heimlich-Handgriff nach hinten-oben)'
							: 'If unrelieved: Give 5 abdominal thrusts (Heimlich inward/upward)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Abwechselnd 5 Rückenschläge / 5 Bauchkompressionen wiederholen. Bei Bewusstlosigkeit: Sofort CPR!'
							: 'Alternate 5 back blows / 5 thrusts. If unconscious: begin CPR!'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/person-currently-choking"
					class="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung lesen' : 'Read full guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- Severe Bleeding / Schwere Blutung -->
			<div class="p-6 rounded-2xl bg-slate-900 border border-red-500/30 space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
						<ShieldAlert class="w-4 h-4" />
						<span>{data.lang === 'de' ? 'Spritzen / Strömen' : 'Pulsing / Severe Flow'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40"
					>
						Stop The Bleed
					</span>
				</div>
				<h3 class="text-xl font-mono font-bold text-white">
					{data.lang === 'de' ? 'Kritische Blutung' : 'Life-Threatening Bleeding'}
				</h3>
				<ol
					class="space-y-2 text-xs text-slate-200 list-decimal list-inside font-medium leading-relaxed"
				>
					<li>
						{data.lang === 'de'
							? 'Direkter Druck mit beiden Händen und festem Tuch/Verband direkt auf die Wunde'
							: 'Direct, unrelenting pressure with cloth/gauze directly onto bleeding point'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Wunde ausstopfen (Wound Packing) bei tiefen Wunden'
							: 'Pack the wound deeply with gauze/cloth if pressure fails'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Bei Gliedmaßen: Tourniquet 5-7 cm oberhalb der Wunde anlegen und anziehen, bis Blutung stoppt'
							: 'For limbs: Apply commercial windlass tourniquet 2-3 inches above wound, tighten until flow stops'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Druck halten bis Rettungsdienst übernimmt'
							: 'Maintain continuous pressure until emergency crew arrives'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/bleeding-more-than-is-generally-recommended"
					class="inline-flex items-center gap-1 text-xs font-mono text-red-400 hover:text-red-300"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung lesen' : 'Read full guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- Kitchen Oil Fire / Fettbrand -->
			<div class="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
						<Flame class="w-4 h-4" />
						<span>{data.lang === 'de' ? 'Fettbrand / Speiseöl' : 'Cooking Oil / Grease'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40"
					>
						NIEMALS WASSER
					</span>
				</div>
				<h3 class="text-xl font-mono font-bold text-white">
					{data.lang === 'de' ? 'Öl / Fett brennt' : 'Cooking Oil Fire'}
				</h3>
				<ol
					class="space-y-2 text-xs text-slate-200 list-decimal list-inside font-medium leading-relaxed"
				>
					<li class="font-bold text-red-300">
						{data.lang === 'de'
							? 'NIEMALS WASSER HINEINGIESSEN (Explosionsgefahr!)'
							: 'NEVER POUR WATER (Catastrophic fireball explosion)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Passenden Metalldeckel von der Seite auf den Topf schieben, um Sauerstoff abzuschnüren'
							: 'Slide matching metal lid or fire blanket smoothly over the pan'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Herdplatte sofort ausschalten. Topf NICHT bewegen!'
							: 'Turn off heat source immediately. DO NOT MOVE the burning pan!'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Topf geschlossen lassen, bis er vollständig abgekühlt ist'
							: 'Leave lid in place until completely cold'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/oil-currently-on-fire"
					class="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung lesen' : 'Read full guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>
		</div>
	</div>

	<!-- Critical Articles List -->
	<div class="space-y-4 pt-6 border-t border-slate-800">
		<h2 class="font-mono text-base font-bold text-white uppercase tracking-wider">
			{data.lang === 'de' ? 'Alle kritischen Anleitungen im Handbuch' : 'All Critical Handbooks'}
		</h2>
		<div
			class="divide-y divide-slate-800 rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden"
		>
			{#each data.criticalArticles as art}
				<a
					href="/{data.lang}/guide/{art.slug}"
					class="p-4 flex items-center justify-between hover:bg-slate-800/80 transition-colors group"
				>
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<span
								class="font-mono text-[10px] uppercase font-bold text-red-400 px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30"
							>
								{art.category}
							</span>
							<span class="font-mono text-xs text-slate-400">
								Stufe {art.threat_level}/5
							</span>
						</div>
						<div
							class="text-base font-semibold text-white group-hover:text-amber-300 transition-colors"
						>
							{art.title}
						</div>
					</div>
					<ArrowRight
						class="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-4"
					/>
				</a>
			{/each}
		</div>
	</div>
</div>

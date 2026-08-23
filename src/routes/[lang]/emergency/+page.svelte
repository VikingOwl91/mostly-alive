<script lang="ts">
	import {
		ShieldAlert,
		PhoneCall,
		AlertTriangle,
		ArrowRight,
		HeartPulse,
		Flame,
		Zap,
		Activity,
		Wind,
		Crosshair,
		BookOpen
	} from '@lucide/svelte';
	import EmergencyNumbersWidget from '$lib/components/EmergencyNumbersWidget.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { buildEmergencySeo } from '$lib/seo';

	let { data } = $props();

	const seo = $derived(buildEmergencySeo(data.lang));
</script>

<SeoHead {seo} />

<div class="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 md:py-12 space-y-8 sm:space-y-10">
	<!-- High Alert Header -->
	<section
		class="p-5 sm:p-8 rounded-2xl bg-red-950/40 border border-red-500/50 terminal-border-red space-y-3 shadow-[0_0_35px_rgba(239,68,68,0.15)]"
		aria-labelledby="emergency-mode-heading"
	>
		<div
			class="flex items-center gap-2.5 sm:gap-3 text-red-400 font-mono text-xs font-black uppercase tracking-widest min-w-0"
		>
			<ShieldAlert class="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-red-400 shrink-0" />
			<span class="truncate"
				>{data.lang === 'de'
					? 'AKUTER NOTFALL-MODUS // NULL KOMMENTAR'
					: 'EMERGENCY FAST SCAN // ZERO FLUFF'}</span
			>
		</div>
		<h1
			id="emergency-mode-heading"
			class="text-2xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight break-words"
		>
			{data.lang === 'de' ? 'Sofortmaßnahmen bei Lebensgefahr' : 'Immediate Survival Actions'}
		</h1>
		<p class="text-xs sm:text-sm text-red-200 font-medium leading-relaxed">
			{data.lang === 'de'
				? '1. Eigenschutz sicherstellen • 2. Notruf 112 absetzen • 3. Sofortige Maßnahmen ergreifen.'
				: '1. Ensure scene safety • 2. Call emergency dispatch • 3. Execute immediate life support.'}
		</p>
	</section>

	<!-- Emergency Numbers Selector -->
	<EmergencyNumbersWidget lang={data.lang} />

	<!-- Fast Scenario Jump Navigation for One-Handed Mobile Use -->
	<nav aria-label={data.lang === 'de' ? 'Notfall-Schnellnavigation' : 'Emergency quick jump navigation'} class="space-y-2">
		<div class="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider">
			{data.lang === 'de' ? '// SCHNELLWAHL (1-TAP SPRUNG)' : '// FAST JUMP (1-TAP SCROLL)'}
		</div>
		<div class="flex flex-wrap gap-2">
			<a
				href="#cpr"
				class="px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono font-bold hover:bg-red-900/60 transition-colors min-h-[38px] flex items-center"
			>
				CPR / 30:2
			</a>
			<a
				href="#choking"
				class="px-3 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold hover:bg-amber-900/60 transition-colors min-h-[38px] flex items-center"
			>
				{data.lang === 'de' ? 'Erstickung (5+5)' : 'Choking (5+5)'}
			</a>
			<a
				href="#bleeding"
				class="px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono font-bold hover:bg-red-900/60 transition-colors min-h-[38px] flex items-center"
			>
				{data.lang === 'de' ? 'Kritische Blutung' : 'Severe Bleeding'}
			</a>
			<a
				href="#anaphylaxis"
				class="px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono font-bold hover:bg-red-900/60 transition-colors min-h-[38px] flex items-center"
			>
				{data.lang === 'de' ? 'Allergieschock' : 'Anaphylaxis'}
			</a>
			<a
				href="#stroke"
				class="px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono font-bold hover:bg-red-900/60 transition-colors min-h-[38px] flex items-center"
			>
				FAST / {data.lang === 'de' ? 'Schlaganfall' : 'Stroke'}
			</a>
			<a
				href="#heart-attack"
				class="px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono font-bold hover:bg-red-900/60 transition-colors min-h-[38px] flex items-center"
			>
				{data.lang === 'de' ? 'Herzinfarkt' : 'Heart Attack'}
			</a>
			<a
				href="#asthma"
				class="px-3 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold hover:bg-amber-900/60 transition-colors min-h-[38px] flex items-center"
			>
				{data.lang === 'de' ? 'Asthma' : 'Asthma'}
			</a>
			<a
				href="#oil-fire"
				class="px-3 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold hover:bg-amber-900/60 transition-colors min-h-[38px] flex items-center"
			>
				{data.lang === 'de' ? 'Fettbrand' : 'Oil Fire'}
			</a>
		</div>
	</nav>

	<!-- Curated Fast Action Cards for Critical Emergencies -->
	<section class="space-y-6" aria-label="Curated Emergency Scenarios">
		<div class="flex items-center justify-between border-b border-slate-800 pb-3">
			<h2 class="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-wider">
				{data.lang === 'de'
					? 'Akute Notfallprotokolle (Sofortiges Handeln)'
					: 'Critical Protocols (Act Now)'}
			</h2>
			<span
				class="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 shrink-0"
			>
				{data.lang === 'de' ? '8 KERN-PROTOKOLLE' : '8 CORE PROTOCOLS'}
			</span>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
			<!-- 1. CPR / Cardiac Arrest -->
			<div
				id="cpr"
				class="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-red-500/40 space-y-3.5 sm:space-y-4 hover:border-red-500 transition-colors scroll-mt-20"
			>
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase truncate">
						<HeartPulse class="w-4 h-4 shrink-0" />
						<span class="truncate">{data.lang === 'de' ? 'Bewusstlos + Keine Atmung' : 'No Normal Breathing'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 shrink-0"
					>
						CPR 30:2
					</span>
				</div>
				<h3 class="text-lg sm:text-xl font-mono font-bold text-white break-words">
					{data.lang === 'de'
						? 'Herz-Kreislauf-Stillstand (CPR)'
						: 'Cardiac Arrest / CPR'}
				</h3>
				<ol class="space-y-2 text-xs sm:text-sm text-slate-200 list-decimal list-inside font-medium leading-relaxed">
					<li>
						<strong>{data.lang === 'de' ? 'Notruf 112 & AED holen' : 'Call 911/112 & get AED'}</strong>
					</li>
					<li>
						{data.lang === 'de'
							? 'Mitte Brustkorb, 5–6 cm tief, 100–120/min drücken'
							: 'Center of chest, 5–6 cm deep, 100–120 bpm'}
					</li>
					<li>
						{data.lang === 'de'
							? '30 Herzdruckmassagen : 2 Beatmungen (oder durchgehend drücken)'
							: '30 compressions : 2 breaths (or continuous compressions)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Sobald der AED da ist: Einschalten und Sprachansagen folgen'
							: 'Turn on AED immediately and follow voice prompts'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/person-no-longer-breathing-for-some-reason"
					class="inline-flex items-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 font-bold min-h-[44px] py-1"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung' : 'Full CPR Guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- 2. Choking / Severe Obstruction -->
			<div
				id="choking"
				class="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3.5 sm:space-y-4 hover:border-amber-500 transition-colors scroll-mt-20"
			>
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase truncate">
						<AlertTriangle class="w-4 h-4 shrink-0" />
						<span class="truncate">{data.lang === 'de' ? 'Vollständige Blockade' : 'Complete Obstruction'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 shrink-0"
					>
						5 + 5
					</span>
				</div>
				<h3 class="text-lg sm:text-xl font-mono font-bold text-white break-words">
					{data.lang === 'de' ? 'Person erstickt (Verschlucken)' : 'Person Currently Choking'}
				</h3>
				<ol class="space-y-2 text-xs sm:text-sm text-slate-200 list-decimal list-inside font-medium leading-relaxed">
					<li>
						<strong>{data.lang === 'de' ? '5 kräftige Rückenschläge' : '5 sharp back blows'}</strong>
						{data.lang === 'de' ? ' zwischen die Schulterblätter' : ' between shoulder blades'}
					</li>
					<li>
						<strong>{data.lang === 'de' ? '5 Oberbauchkompressionen' : '5 abdominal thrusts'}</strong>
						{data.lang === 'de' ? ' (Heimlich-Handgriff nach hinten-oben)' : ' (Heimlich inward/upward)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Abwechselnd 5 Schläge / 5 Kompressionen bis Fremdkörper frei'
							: 'Alternate 5 blows / 5 thrusts until relieved'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Bei Bewusstlosigkeit: Sofort flach auf den Rücken und CPR starten!'
							: 'If unconscious: Lower to floor immediately and start CPR!'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/person-currently-choking"
					class="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 font-bold min-h-[44px] py-1"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung' : 'Full Choking Guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- 3. Severe Arterial Bleeding -->
			<div
				id="bleeding"
				class="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-red-500/40 space-y-3.5 sm:space-y-4 hover:border-red-500 transition-colors scroll-mt-20"
			>
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase truncate">
						<ShieldAlert class="w-4 h-4 shrink-0" />
						<span class="truncate">{data.lang === 'de' ? 'Spritzt / Strömt massiv' : 'Pulsing Arterial Flow'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 shrink-0"
					>
						Stop Bleed
					</span>
				</div>
				<h3 class="text-lg sm:text-xl font-mono font-bold text-white break-words">
					{data.lang === 'de' ? 'Kritische Blutung' : 'Life-Threatening Bleeding'}
				</h3>
				<ol class="space-y-2 text-xs sm:text-sm text-slate-200 list-decimal list-inside font-medium leading-relaxed">
					<li>
						<strong>{data.lang === 'de' ? 'Direkter Druck mit beiden Händen' : 'Direct unrelenting pressure'}</strong>
						{data.lang === 'de' ? ' und Tuch auf die Wunde' : ' on the wound'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Tiefe Wunden mit Verbandstoff fest ausstopfen (Wound Packing)'
							: 'Pack deep cavity wounds tightly with gauze/cloth'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Bei Gliedmaßen: Tourniquet 5–7 cm oberhalb der Wunde zudrehen bis Blutung stoppt'
							: 'For limbs: Apply tourniquet 2–3 inches proximal, twist until flow halts'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Druck halten und Notruf 112 wählen'
							: 'Maintain continuous pressure and call 911/112'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/bleeding-more-than-is-generally-recommended"
					class="inline-flex items-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 font-bold min-h-[44px] py-1"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung' : 'Full Bleeding Guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- 4. Severe Anaphylaxis -->
			<div
				id="anaphylaxis"
				class="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-red-500/40 space-y-3.5 sm:space-y-4 hover:border-red-500 transition-colors scroll-mt-20"
			>
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase truncate">
						<Activity class="w-4 h-4 shrink-0" />
						<span class="truncate">{data.lang === 'de' ? 'Akute Atemnot / Kreislauf' : 'Airway Swelling / Shock'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 shrink-0"
					>
						Adrenalin
					</span>
				</div>
				<h3 class="text-lg sm:text-xl font-mono font-bold text-white break-words">
					{data.lang === 'de' ? 'Allergischer Schock (Anaphylaxie)' : 'Severe Anaphylaxis'}
				</h3>
				<ol class="space-y-2 text-xs sm:text-sm text-slate-200 list-decimal list-inside font-medium leading-relaxed">
					<li>
						<strong>{data.lang === 'de' ? 'Adrenalin-Autoinjektor sofort' : 'Epinephrine auto-injector now'}</strong>
						{data.lang === 'de' ? ' in die Außenseite des Oberschenkels' : ' into outer mid-thigh'}
					</li>
					<li>
						<strong>{data.lang === 'de' ? 'Sofort Notruf 112' : 'Call 911/112 immediately'}</strong>
						{data.lang === 'de' ? ' (Anaphylaxie & Adrenalingabe melden)' : ' (Report anaphylaxis & epi dose)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Lagerung: Flach mit erhöhten Beinen (bei Atemnot aufrecht sitzend)'
							: 'Positioning: Flat with legs up (or upright if breathing struggles)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Zweite Dosis nach 5–15 Minuten, falls keine Besserung eintritt'
							: 'Second dose after 5–15 min if symptoms do not improve'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/allergy-escalating-rather-quickly"
					class="inline-flex items-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 font-bold min-h-[44px] py-1"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung' : 'Full Anaphylaxis Guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- 5. Stroke / FAST -->
			<div
				id="stroke"
				class="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-red-500/40 space-y-3.5 sm:space-y-4 hover:border-red-500 transition-colors scroll-mt-20"
			>
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase truncate">
						<Crosshair class="w-4 h-4 shrink-0" />
						<span class="truncate">{data.lang === 'de' ? 'Lähmung / Sprachverlust' : 'Face / Arm / Speech'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 shrink-0"
					>
						FAST Test
					</span>
				</div>
				<h3 class="text-lg sm:text-xl font-mono font-bold text-white break-words">
					{data.lang === 'de' ? 'Schlaganfall (FAST-Schema)' : 'Possible Stroke (FAST)'}
				</h3>
				<ol class="space-y-2 text-xs sm:text-sm text-slate-200 list-decimal list-inside font-medium leading-relaxed">
					<li>
						<strong>Face / Gesicht:</strong> {data.lang === 'de' ? 'Lächeln lassen (hängt ein Mundwinkel?)' : 'Ask to smile (drooping mouth?)'}
					</li>
					<li>
						<strong>Arms / Arme:</strong> {data.lang === 'de' ? 'Beide Arme anheben (sinkt einer herab?)' : 'Raise both arms (one drifts down?)'}
					</li>
					<li>
						<strong>Speech / Sprache:</strong> {data.lang === 'de' ? 'Satz nachsprechen (verwaschen/unverständlich?)' : 'Repeat simple phrase (slurred speech?)'}
					</li>
					<li>
						<strong>Time / Zeit:</strong> {data.lang === 'de' ? 'Sofort 112 (Time is Brain! Nichts zu trinken geben!)' : 'Call 911/112 immediately (Time is brain! Zero food/water!)'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/face-doing-something-weird-on-one-side"
					class="inline-flex items-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 font-bold min-h-[44px] py-1"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung' : 'Full Stroke Guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- 6. Heart Attack -->
			<div
				id="heart-attack"
				class="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-red-500/40 space-y-3.5 sm:space-y-4 hover:border-red-500 transition-colors scroll-mt-20"
			>
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase truncate">
						<HeartPulse class="w-4 h-4 shrink-0" />
						<span class="truncate">{data.lang === 'de' ? 'Brustenge / Todesangst' : 'Crushing Chest Pressure'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 shrink-0"
					>
						112 Sofort
					</span>
				</div>
				<h3 class="text-lg sm:text-xl font-mono font-bold text-white break-words">
					{data.lang === 'de' ? 'Herzinfarkt (Akutes Koronarsyndrom)' : 'Possible Heart Attack'}
				</h3>
				<ol class="space-y-2 text-xs sm:text-sm text-slate-200 list-decimal list-inside font-medium leading-relaxed">
					<li>
						<strong>{data.lang === 'de' ? 'Sofort Notruf 112' : 'Call 911/112 immediately'}</strong>
						{data.lang === 'de' ? ' (Verdacht auf Herzinfarkt melden)' : ' (Report suspected heart attack)'}
					</li>
					<li>
						<strong>{data.lang === 'de' ? 'Oberkörper erhöht hinsetzen' : 'Sit upright and supported'}</strong>
						{data.lang === 'de' ? ' (entlastet das Herz mechanisch)' : ' (reduces cardiac preload)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Absolute körperliche Ruhe – jede Bewegung strikt verbieten'
							: 'Total physical rest – strictly prohibit walking or exertion'}
					</li>
					<li>
						{data.lang === 'de'
							? 'AED bereithalten; bei Bewusstlosigkeit sofort CPR starten'
							: 'Have AED ready; begin CPR immediately if consciousness is lost'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/chest-feeling-unreasonably-heavy"
					class="inline-flex items-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 font-bold min-h-[44px] py-1"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung' : 'Full Heart Attack Guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- 7. Severe Asthma / Breathing Crisis -->
			<div
				id="asthma"
				class="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3.5 sm:space-y-4 hover:border-amber-500 transition-colors scroll-mt-20"
			>
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase truncate">
						<Wind class="w-4 h-4 shrink-0" />
						<span class="truncate">{data.lang === 'de' ? 'Schwere Atemnot' : 'Silent Chest / Inhaler Failure'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 shrink-0"
					>
						Kutschersitz
					</span>
				</div>
				<h3 class="text-lg sm:text-xl font-mono font-bold text-white break-words">
					{data.lang === 'de' ? 'Schwerer Asthmaanfall' : 'Severe Asthma Attack'}
				</h3>
				<ol class="space-y-2 text-xs sm:text-sm text-slate-200 list-decimal list-inside font-medium leading-relaxed">
					<li>
						<strong>{data.lang === 'de' ? 'Kutschersitz / Torwarthaltung' : 'Upright tripod position'}</strong>
						{data.lang === 'de' ? ' (aufrecht sitzen, Hände auf die Knie stützen)' : ' (lean forward, arms on knees)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Notfall-Inhalator (Salbutamol) mit Spacer inhalieren (4–10 Hübe)'
							: 'Administer rescue inhaler (albuterol/salbutamol) with spacer (4–10 puffs)'}
					</li>
					<li>
						<strong>{data.lang === 'de' ? 'Notruf 112' : 'Call 911/112'}</strong>
						{data.lang === 'de' ? ' bei Stillem Thorax oder fehlender Besserung' : ' if silent chest or no relief after 5 min'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Lippenbremse einsetzen (langsam gegen gespitzte Lippen ausatmen)'
							: 'Use pursed-lip breathing to maintain airway pressure'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/asthma-inhaler-not-doing-the-job"
					class="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 font-bold min-h-[44px] py-1"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung' : 'Full Asthma Guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- 8. Cooking Oil / Kitchen Fire -->
			<div
				id="oil-fire"
				class="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3.5 sm:space-y-4 hover:border-amber-500 transition-colors scroll-mt-20"
			>
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase truncate">
						<Flame class="w-4 h-4 shrink-0" />
						<span class="truncate">{data.lang === 'de' ? 'Fettbrand / Pfanne' : 'Cooking Oil / Grease Fire'}</span>
					</div>
					<span
						class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 shrink-0"
					>
						KEIN WASSER
					</span>
				</div>
				<h3 class="text-lg sm:text-xl font-mono font-bold text-white break-words">
					{data.lang === 'de' ? 'Brennendes Speiseöl' : 'Cooking Oil Fire'}
				</h3>
				<ol class="space-y-2 text-xs sm:text-sm text-slate-200 list-decimal list-inside font-medium leading-relaxed">
					<li class="font-bold text-red-300">
						{data.lang === 'de'
							? 'NIEMALS WASSER HINEINGIESSEN (Explosionsgefahr!)'
							: 'NEVER POUR WATER (Instant catastrophic fireball explosion)'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Metalldeckel von der Seite auf die Pfanne schieben'
							: 'Slide metal lid or fire blanket smoothly over the pan'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Herd ausschalten. Pfanne NICHT bewegen oder transportieren!'
							: 'Turn off heat source. DO NOT MOVE the burning pan!'}
					</li>
					<li>
						{data.lang === 'de'
							? 'Deckel geschlossen lassen, bis Topf vollkommen abgekühlt ist'
							: 'Leave lid in place until completely cold'}
					</li>
				</ol>
				<a
					href="/{data.lang}/guide/oil-currently-on-fire"
					class="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 font-bold min-h-[44px] py-1"
				>
					<span>{data.lang === 'de' ? 'Vollständige Anleitung' : 'Full Oil Fire Guide'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>
		</div>
	</section>

	<!-- Call to Action to Full Handbook -->
	<section
		class="p-5 sm:p-8 rounded-2xl bg-slate-900 border border-slate-700/80 text-center space-y-4"
	>
		<div class="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider">
			{data.lang === 'de' ? '// VOLLSTÄNDIGER KATALOG' : '// COMPLETE HANDBOOK'}
		</div>
		<h2 class="text-xl sm:text-2xl font-mono font-bold text-white break-words">
			{data.lang === 'de'
				? 'Suchst du eine andere spezifische Notlage?'
				: 'Looking for a specific non-immediate emergency?'}
		</h2>
		<p class="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
			{data.lang === 'de'
				? 'Das vollständige Mostly Alive Handbuch enthält 51 ausführliche Überlebensanleitungen mit Hintergrundwissen, Gedächtnisankern und Quellen.'
				: 'The complete Mostly Alive guide features 51 detailed survival articles with deep background context, memory hooks, and clinical sources.'}
		</p>
		<div class="pt-2">
			<a
				href="/{data.lang}/guide"
				class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.2)] min-h-[48px] w-full sm:w-auto"
			>
				<BookOpen class="w-4 h-4 shrink-0" />
				<span class="break-words"
					>{data.lang === 'de'
						? 'ALLE 51 ANLEITUNGEN IM HANDBUCH ANSEHEN →'
						: 'VIEW ALL 51 HANDBOOK ENTRIES →'}</span
				>
			</a>
		</div>
	</section>
</div>

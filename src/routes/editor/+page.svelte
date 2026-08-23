<script lang="ts">
	import {
		Edit3,
		Save,
		Eye,
		AlertCircle,
		ShieldCheck,
		Plus,
		Trash2,
		ArrowLeft,
		FileText,
		CheckCircle2,
		Download
	} from '@lucide/svelte';
	import { marked } from 'marked';
	import { ArticleFrontmatterSchema, CATEGORIES, type Category } from '$lib/types/content';
	import ThreatGauge from '$lib/components/ThreatGauge.svelte';
	import ImmediateActionBanner from '$lib/components/ImmediateActionBanner.svelte';
	import DoNotCard from '$lib/components/DoNotCard.svelte';
	import MemoryHook from '$lib/components/MemoryHook.svelte';
	import SourceInspector from '$lib/components/SourceInspector.svelte';

	let { data } = $props();
	let currentUser = $derived(data?.user);

	let activeLang: 'en' | 'de' = $state('en');
	let activeTab: 'edit' | 'preview' | 'split' = $state('split');
	let isCommitting = $state(false);
	let commitStatusMsg = $state<string | null>(null);

	// Article Form State
	let slug = $state('new-hazard-entry');
	let title = $state('New Survival Guideline');
	let subtitle = $state('A brief and dry description');
	let category: Category = $state('weather');
	let severity = $state<'informational' | 'caution' | 'serious' | 'critical' | 'immediate'>(
		'critical'
	);
	let urgency = $state<'immediate' | 'high' | 'medium' | 'low'>('immediate');
	let threat_level = $state(4);
	let status = $state<'draft' | 'needs-review' | 'reviewed' | 'outdated'>('draft');
	let memory_hook = $state('One memorable sentence that saves lives.');
	let immediate_action = $state<string[]>(['Step 1: Stop immediately.', 'Step 2: Seek shelter.']);
	let do_not = $state<string[]>(['Do not record a video on your phone.']);
	let sources = $state<
		Array<{
			name: string;
			url: string;
			authoritative: boolean;
			guideline_version?: string;
			jurisdiction?: string;
			notes?: string;
		}>
	>([
		{
			name: 'National Weather Service (NOAA)',
			url: 'https://www.weather.gov/safety/lightning',
			authoritative: true,
			guideline_version: '2026 Edition',
			jurisdiction: 'US / Global'
		}
	]);
	let bodyMarkdown = $state(
		`Humans are remarkably confident organisms.\n\nOccasionally the physical universe reminds us of our statistical frailty.\n\n### Why This Occurs\n\nThe phenomenon is driven by charge separation in convective storm cells.\n\n### When To Call Dispatch\n\nCall immediately if anyone is injured or structure is damaged.`
	);

	let newAction = $state('');
	let newDoNot = $state('');
	let validationErrors = $state<string[]>([]);
	let exportSuccess = $state(false);

	let renderedHtml = $derived(marked.parse(bodyMarkdown) as string);

	function addAction() {
		if (newAction.trim()) {
			immediate_action = [...immediate_action, newAction.trim()];
			newAction = '';
		}
	}

	function removeAction(index: number) {
		immediate_action = immediate_action.filter((_, i) => i !== index);
	}

	function addDoNot() {
		if (newDoNot.trim()) {
			do_not = [...do_not, newDoNot.trim()];
			newDoNot = '';
		}
	}

	function removeDoNot(index: number) {
		do_not = do_not.filter((_, i) => i !== index);
	}

	function addSource() {
		sources = [
			...sources,
			{
				name: 'Official Agency / Organization',
				url: 'https://example.gov',
				authoritative: true,
				guideline_version: 'Latest',
				jurisdiction: 'Global'
			}
		];
	}

	function removeSource(index: number) {
		sources = sources.filter((_, i) => i !== index);
	}

	function validate() {
		const payload = {
			slug,
			title,
			subtitle,
			category,
			tags: [category],
			aliases: [title.toLowerCase()],
			severity,
			urgency,
			threat_level,
			status,
			memory_hook,
			immediate_action,
			do_not,
			sources,
			reviewed_at: status === 'reviewed' ? new Date().toISOString().split('T')[0] : undefined,
			reviewer: status === 'reviewed' ? 'Maintainer Verification' : undefined
		};

		const result = ArticleFrontmatterSchema.safeParse(payload);
		if (!result.success) {
			validationErrors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
			return false;
		}

		if (status === 'reviewed') {
			const auth = sources.filter((s) => s.authoritative);
			if (auth.length === 0) {
				validationErrors = ['Reviewed articles require at least 1 authoritative source.'];
				return false;
			}
		}

		validationErrors = [];
		return true;
	}

	function generateMarkdownFile(): string {
		const yamlLines = [
			'---',
			`slug: ${JSON.stringify(slug)}`,
			`title: ${JSON.stringify(title)}`,
			`subtitle: ${JSON.stringify(subtitle)}`,
			`category: ${JSON.stringify(category)}`,
			`severity: ${JSON.stringify(severity)}`,
			`urgency: ${JSON.stringify(urgency)}`,
			`threat_level: ${threat_level}`,
			`status: ${JSON.stringify(status)}`,
			`memory_hook: ${JSON.stringify(memory_hook)}`,
			'immediate_action:',
			...immediate_action.map((a) => `  - ${JSON.stringify(a)}`),
			'do_not:',
			...do_not.map((d) => `  - ${JSON.stringify(d)}`),
			'sources:',
			...sources
				.flatMap((s) => [
					`  - name: ${JSON.stringify(s.name)}`,
					`    url: ${JSON.stringify(s.url)}`,
					`    authoritative: ${s.authoritative}`,
					s.guideline_version
						? `    guideline_version: ${JSON.stringify(s.guideline_version)}`
						: '',
					s.jurisdiction ? `    jurisdiction: ${JSON.stringify(s.jurisdiction)}` : ''
				])
				.filter(Boolean),
			'---',
			'',
			bodyMarkdown
		];
		return yamlLines.join('\n');
	}

	function downloadMarkdown() {
		if (!validate()) return;
		const content = generateMarkdownFile();
		const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${slug}.md`;
		a.click();
		URL.revokeObjectURL(url);
		exportSuccess = true;
		setTimeout(() => (exportSuccess = false), 3000);
	}
	async function commitArticle() {
		if (!validate()) return;
		isCommitting = true;
		commitStatusMsg = null;

		try {
			const content = generateMarkdownFile();
			const res = await fetch('/editor/api/commit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					filename: `${slug}.md`,
					content,
					lang: activeLang,
					commitMessage: `content(${activeLang}): update ${slug}`
				})
			});

			const resData = await res.json();
			if (!res.ok || !resData.success) {
				validationErrors = [resData.error || 'Commit failed.'];
				commitStatusMsg = null;
			} else {
				commitStatusMsg = resData.message || 'Article staged successfully.';
				setTimeout(() => (commitStatusMsg = null), 4000);
			}
		} catch (err: any) {
			validationErrors = [err?.message || 'Network error during commit.'];
		} finally {
			isCommitting = false;
		}
	}
</script>

<svelte:head>
	<title>Web Studio Editor — Mostly Alive</title>
</svelte:head>

<div class="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
	<!-- Top Bar -->
	<header
		class="border-b border-slate-800 bg-slate-950/80 px-6 py-3 flex items-center justify-between gap-4"
	>
		<div class="flex items-center gap-3">
			<a
				href="/en"
				class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
			>
				<ArrowLeft class="w-4 h-4" />
			</a>
			<div>
				<div class="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
					MOSTLY ALIVE // WEB STUDIO
				</div>
				<div class="text-xs text-slate-400">
					{slug ? `${slug}.md` : 'Untitled Entry'}
				</div>
			</div>
		</div>

		<!-- Action Controls & Authenticated User Info -->
		<div class="flex items-center gap-3">
			{#if currentUser}
				<div
					class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300"
				>
					<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
					<span>@{currentUser.username}</span>
					<span class="text-slate-500">({currentUser.userId})</span>
				</div>
			{/if}

			<div class="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-xs font-mono">
				<button
					type="button"
					onclick={() => (activeTab = 'edit')}
					class="px-2.5 py-1 rounded {activeTab === 'edit'
						? 'bg-amber-500 text-slate-950 font-bold'
						: 'text-slate-400 hover:text-white'}"
				>
					Form
				</button>
				<button
					type="button"
					onclick={() => (activeTab = 'split')}
					class="px-2.5 py-1 rounded hidden md:block {activeTab === 'split'
						? 'bg-amber-500 text-slate-950 font-bold'
						: 'text-slate-400 hover:text-white'}"
				>
					Split
				</button>
				<button
					type="button"
					onclick={() => (activeTab = 'preview')}
					class="px-2.5 py-1 rounded {activeTab === 'preview'
						? 'bg-amber-500 text-slate-950 font-bold'
						: 'text-slate-400 hover:text-white'}"
				>
					Preview
				</button>
			</div>

			<button
				type="button"
				onclick={commitArticle}
				disabled={isCommitting}
				class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
			>
				<Save class="w-3.5 h-3.5" />
				<span>{isCommitting ? 'Staging...' : 'Stage API'}</span>
			</button>

			<button
				type="button"
				onclick={downloadMarkdown}
				class="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
			>
				<Download class="w-3.5 h-3.5" />
				<span>{exportSuccess ? 'Saved!' : 'Export .md'}</span>
			</button>

			<a
				href="/editor/auth/logout"
				class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-red-400 font-mono text-xs transition-colors"
				title="Log out from Web Studio"
			>
				Logout
			</a>
		</div>
	</header>

	<!-- Main Workspace -->
	<div
		class="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 h-[calc(100vh-57px)] overflow-hidden"
	>
		<!-- Left: Form & Markdown Source -->
		<div class="overflow-y-auto p-6 space-y-6 {activeTab === 'preview' ? 'hidden md:block' : ''}">
			<!-- Validation Errors Notice -->
			{#if validationErrors.length > 0}
				<div
					class="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono space-y-1"
				>
					<div class="font-bold flex items-center gap-1.5 text-red-300">
						<AlertCircle class="w-4 h-4" />
						<span>Validation Errors:</span>
					</div>
					<ul class="list-disc list-inside space-y-0.5">
						{#each validationErrors as err}
							<li>{err}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Metadata Settings -->
			<div class="space-y-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
				<h3 class="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
					Metadata & Taxonomy
				</h3>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
					<div>
						<label for="ed-title" class="block text-slate-400 mb-1">Title</label>
						<input
							id="ed-title"
							type="text"
							bind:value={title}
							class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
						/>
					</div>

					<div>
						<label for="ed-slug" class="block text-slate-400 mb-1">Slug (kebab-case)</label>
						<input
							id="ed-slug"
							type="text"
							bind:value={slug}
							class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
						/>
					</div>

					<div>
						<label for="ed-category" class="block text-slate-400 mb-1">Category</label>
						<select
							id="ed-category"
							bind:value={category}
							class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
						>
							{#each Object.values(CATEGORIES) as cat}
								<option value={cat.id}>{cat.title.en} ({cat.id})</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="ed-status" class="block text-slate-400 mb-1">Status (Provenance)</label>
						<select
							id="ed-status"
							bind:value={status}
							class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
						>
							<option value="draft">Draft (Under Review)</option>
							<option value="needs-review">Needs Review</option>
							<option value="reviewed">Reviewed (Fully Sourced)</option>
							<option value="outdated">Outdated</option>
						</select>
					</div>

					<div>
						<label for="ed-threat" class="block text-slate-400 mb-1">Threat Level (0 to 5)</label>
						<input
							id="ed-threat"
							type="number"
							min="0"
							max="5"
							bind:value={threat_level}
							class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
						/>
					</div>

					<div>
						<label for="ed-urgency" class="block text-slate-400 mb-1">Urgency</label>
						<select
							id="ed-urgency"
							bind:value={urgency}
							class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
						>
							<option value="immediate">Immediate</option>
							<option value="high">High</option>
							<option value="medium">Medium</option>
							<option value="low">Low</option>
						</select>
					</div>
				</div>

				<div>
					<label for="ed-hook" class="block text-xs font-mono text-slate-400 mb-1"
						>Memory Hook (One Memorable Line)</label
					>
					<input
						id="ed-hook"
						type="text"
						bind:value={memory_hook}
						class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
					/>
				</div>
			</div>

			<!-- Immediate Actions List -->
			<div class="space-y-3 p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
				<h3 class="font-mono text-xs font-bold uppercase tracking-wider text-red-400">
					Immediate Actions (Safety Layer)
				</h3>
				<div class="space-y-2">
					{#each immediate_action as action, idx}
						<div class="flex items-center gap-2">
							<span class="font-mono text-xs text-slate-500 w-4">{idx + 1}.</span>
							<input
								type="text"
								bind:value={immediate_action[idx]}
								class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
							/>
							<button
								type="button"
								onclick={() => removeAction(idx)}
								class="p-1.5 rounded text-slate-500 hover:text-red-400"
								aria-label="Remove action"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					{/each}
				</div>
				<div class="flex items-center gap-2 pt-2">
					<input
						type="text"
						placeholder="Add next immediate action..."
						bind:value={newAction}
						onkeydown={(e) => e.key === 'Enter' && addAction()}
						class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
					/>
					<button
						type="button"
						onclick={addAction}
						class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1"
					>
						<Plus class="w-3.5 h-3.5" />
						<span>Add</span>
					</button>
				</div>
			</div>

			<!-- Sources & Provenance List -->
			<div class="space-y-3 p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
				<div class="flex items-center justify-between">
					<h3 class="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
						Authoritative Sources (Strict Provenance)
					</h3>
					<button
						type="button"
						onclick={addSource}
						class="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
					>
						<Plus class="w-3.5 h-3.5" />
						<span>Add Source</span>
					</button>
				</div>

				<div class="space-y-3">
					{#each sources as src, idx}
						<div
							class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-2"
						>
							<div class="flex items-center justify-between">
								<input
									type="text"
									placeholder="Agency / Organization Name"
									bind:value={src.name}
									class="flex-1 bg-transparent border-b border-slate-700 pb-1 font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
								/>
								<button
									type="button"
									onclick={() => removeSource(idx)}
									class="text-slate-500 hover:text-red-400 ml-2"
									aria-label="Remove source"
								>
									<Trash2 class="w-3.5 h-3.5" />
								</button>
							</div>
							<input
								type="url"
								placeholder="https://..."
								bind:value={src.url}
								class="w-full bg-transparent border-b border-slate-800 pb-1 text-slate-400 focus:outline-none focus:border-emerald-500"
							/>
							<div class="grid grid-cols-2 gap-2">
								<input
									type="text"
									placeholder="Guideline Version"
									bind:value={src.guideline_version}
									class="bg-transparent border-b border-slate-800 text-slate-400"
								/>
								<input
									type="text"
									placeholder="Jurisdiction"
									bind:value={src.jurisdiction}
									class="bg-transparent border-b border-slate-800 text-slate-400"
								/>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Markdown Body Editor -->
			<div class="space-y-2">
				<label
					for="ed-body"
					class="block font-mono text-xs font-bold uppercase tracking-wider text-slate-400"
				>
					Article Body (Markdown / Explanations & Humor)
				</label>
				<textarea
					id="ed-body"
					bind:value={bodyMarkdown}
					rows="12"
					class="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
				></textarea>
			</div>
		</div>

		<!-- Right: Live Interactive Preview -->
		<div
			class="overflow-y-auto p-6 md:p-10 space-y-6 bg-[#07090e] {activeTab === 'edit'
				? 'hidden md:block'
				: ''}"
		>
			<div class="font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
				[ LIVE PREVIEW // TERMINAL RENDERING ]
			</div>

			<article class="space-y-6">
				<!-- Header -->
				<div class="space-y-3 pb-6 border-b border-slate-800">
					<div class="flex items-center justify-between gap-3">
						<span
							class="font-mono text-xs uppercase font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30"
						>
							{category}
						</span>
						<ThreatGauge level={threat_level} lang={activeLang} />
					</div>
					<h1 class="text-3xl sm:text-4xl font-mono font-black text-white uppercase">
						{title}
					</h1>
					{#if subtitle}
						<p class="text-base text-slate-300">
							{subtitle}
						</p>
					{/if}
				</div>

				<!-- Safety Layer -->
				<ImmediateActionBanner actions={immediate_action} lang={activeLang} {urgency} />
				<DoNotCard items={do_not} lang={activeLang} />
				{#if memory_hook}
					<MemoryHook hook={memory_hook} lang={activeLang} />
				{/if}

				<!-- Body Render -->
				<div
					class="prose prose-invert prose-slate max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:text-amber-400 pt-4 border-t border-slate-800"
				>
					{@html renderedHtml}
				</div>

				<!-- Source Inspector Preview -->
				<SourceInspector
					{sources}
					reviewedAt={status === 'reviewed' ? new Date().toISOString().split('T')[0] : undefined}
					reviewer="Web Studio Preview"
					{status}
					lang={activeLang}
				/>
			</article>
		</div>
	</div>
</div>

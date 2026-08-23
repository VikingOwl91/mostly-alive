<script lang="ts">
	import { ShieldAlert, Terminal, Lock, ArrowLeft } from '@lucide/svelte';

	let { data } = $props();
	let errorMessage = $derived(data.error);
</script>

<svelte:head>
	<title>Restricted Access — Mostly Alive Web Studio</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-6 font-sans"
>
	<div class="max-w-md w-full space-y-6">
		<!-- Back link -->
		<a
			href="/en"
			class="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors"
		>
			<ArrowLeft class="w-3.5 h-3.5" />
			<span>Return to Guide</span>
		</a>

		<!-- Bezel Card -->
		<div
			class="rounded-2xl border border-amber-500/30 bg-slate-950 p-8 shadow-[0_0_30px_rgba(245,158,11,0.1)] space-y-6 relative overflow-hidden"
		>
			<div class="flex items-center justify-between border-b border-slate-800 pb-4">
				<div class="flex items-center gap-2 text-amber-400">
					<Terminal class="w-5 h-5" />
					<span class="font-mono text-xs font-bold uppercase tracking-wider"
						>RESTRICTED CONSOLE</span
					>
				</div>
				<span
					class="font-mono text-[10px] uppercase font-bold text-red-400 px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30"
				>
					AUTH REQUIRED
				</span>
			</div>

			<div class="space-y-2">
				<h1 class="text-2xl font-mono font-black text-white uppercase tracking-tight">
					Web Studio Access
				</h1>
				<p class="text-xs text-slate-400 leading-relaxed">
					Direct mutation, staging, and publishing of safety articles requires GitHub OAuth
					authorization linked to the designated administrator account.
				</p>
			</div>

			{#if errorMessage}
				<div
					class="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-mono flex items-start gap-2.5"
				>
					<ShieldAlert class="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
					<div>
						<div class="font-bold text-red-300">Access Denied</div>
						<div class="text-[11px] text-red-200/80 mt-0.5">{errorMessage}</div>
					</div>
				</div>
			{/if}

			<div class="space-y-4 pt-2">
				<a
					href="/editor/auth/login"
					class="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)]"
				>
					<Lock class="w-4 h-4" />
					<span>Authenticate via GitHub</span>
				</a>
			</div>

			<div
				class="border-t border-slate-800/80 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-500"
			>
				<span>SECURITY LEVEL 5</span>
				<span>HMAC-SHA256 SESSION</span>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { AlertOctagon } from '@lucide/svelte';

	interface Props {
		status: 'draft' | 'needs-review' | 'reviewed' | 'outdated' | 'archived';
		lang?: 'en' | 'de';
	}

	let { status = 'draft', lang = 'en' }: Props = $props();

	const isDraft = $derived(status === 'draft' || status === 'needs-review');
</script>

{#if isDraft}
	<div
		class="my-4 rounded-lg p-4 border border-amber-500/50 bg-amber-950/30 text-amber-200 flex items-start gap-3.5 text-sm"
		role="alert"
	>
		<div class="p-1.5 rounded bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
			<AlertOctagon class="w-5 h-5" />
		</div>
		<div class="space-y-1">
			<div class="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
				{lang === 'de' ? 'ENTWURF / IN PRÜFUNG' : 'DRAFT / UNDER REVIEW'}
			</div>
			<p class="text-slate-300 text-xs leading-relaxed">
				{lang === 'de'
					? 'Dieser Artikel befindet sich noch in der primärquellengestützten Prüfung. Im akuten Notfall wende dich bitte direkt an die offiziellen Rettungsdienste.'
					: 'This article is currently undergoing authoritative source verification. In an active emergency, always contact local emergency services immediately.'}
			</p>
		</div>
	</div>
{/if}

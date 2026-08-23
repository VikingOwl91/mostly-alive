<script lang="ts">
	import { page } from '$app/state';
	import { Globe } from '@lucide/svelte';

	interface Props {
		currentLang: 'en' | 'de';
	}

	let { currentLang = 'en' }: Props = $props();

	function getTargetUrl(targetLang: 'en' | 'de') {
		const pathname = page.url.pathname;
		if (pathname.startsWith('/en')) {
			return pathname.replace(/^\/en/, `/${targetLang}`);
		} else if (pathname.startsWith('/de')) {
			return pathname.replace(/^\/de/, `/${targetLang}`);
		} else {
			return `/${targetLang}`;
		}
	}
</script>

<div
	class="flex items-center gap-1 font-mono text-xs bg-slate-900/90 border border-slate-800 rounded-lg p-1"
>
	<Globe class="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
	<a
		href={getTargetUrl('en')}
		class="px-2 py-1 rounded transition-colors {currentLang === 'en'
			? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
			: 'text-slate-400 hover:text-slate-200'}"
	>
		EN
	</a>
	<a
		href={getTargetUrl('de')}
		class="px-2 py-1 rounded transition-colors {currentLang === 'de'
			? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
			: 'text-slate-400 hover:text-slate-200'}"
	>
		DE
	</a>
</div>

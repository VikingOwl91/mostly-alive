<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-[#07090e] text-slate-100 guide-grid-bg">
	{@render children()}
</div>

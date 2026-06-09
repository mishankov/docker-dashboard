<script lang="ts">
	import { dockerState } from '$lib/store/docker-state.svelte';

	const formatMem = (mem: string = '0') => {
		const memNum = Number(mem);
		const variants = [
			{ value: 1024 * 1024 * 1024, text: 'GiB' },
			{ value: 1024 * 1024, text: 'MiB' },
			{ value: 1024, text: 'KiB' }
		];

		for (const { value, text } of variants) {
			if (memNum > value) return (memNum / value).toFixed(2) + ' ' + text;
		}

		return memNum.toFixed(2) + ' B';
	};
</script>

<main>
	<h3>CPU</h3>
	<p>{dockerState.stats?.cpuPrec}% / {dockerState.stats?.cpuLimit}%</p>

	<h3>RAM</h3>
	<p>
		{formatMem(dockerState.stats?.memUsage)} / {formatMem(dockerState.stats?.memLimit)} ({dockerState
			.stats?.memPrec}%)
	</p>
</main>

<style>
	main {
		padding: 10px;
	}
</style>

<script lang="ts">
	import { getDockerState } from '$lib/store/docker-state.svelte';
	import { formatMemorySize } from '$lib/utils';
</script>

<main>
	<h3>CPU</h3>
	<p>{getDockerState().stats?.cpuPrec}% / {getDockerState().stats?.cpuLimit}%</p>

	<h3>RAM</h3>
	<p>
		{formatMemorySize(getDockerState().stats?.memUsage)} / {formatMemorySize(
			getDockerState().stats?.memLimit
		)} ({getDockerState().stats?.memPrec}%)
	</p>
</main>

<style>
	main {
		padding: 10px;
	}
</style>

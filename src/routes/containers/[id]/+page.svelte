<script lang="ts">
	import { resolve } from '$app/paths';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import type { LogLine } from '$lib/server/docker/index.js';
	import { dockerState } from '$lib/store/docker-state.svelte.js';
	import { streamLogs } from '$lib/store/docker.remote.js';

	const { params } = $props();

	let logs = $state<LogLine[]>([]);

	let logsGenerator = streamLogs(params.id);

	const collectLogs = async () => {
		for await (const logLine of logsGenerator) {
			if (!logLine || !logLine.timestamp) continue;
			logs.push(logLine);
		}
	};

	const container = $derived(dockerState.containers?.find((c) => c.id === params.id));

	// TODO: this should be better
	// $effect(() => {
	// 	if (container?.state === 'running') {
	// 		logsGenerator.reconnect();
	// 	}
	// });
	collectLogs();
</script>

<main>
	<header>
		<a href={resolve('/containers')}>Back</a>
		<svelte:boundary>
			<div class="container-header">
				<h2>{container?.name}</h2>
				<StatusPill status={container?.state || 'dead'} />
			</div>
			<p>ID: {container?.id}</p>
			<p>Image: {container?.image}</p>
		</svelte:boundary>
	</header>

	<p class="logs-status">
		{#if logsGenerator?.connected}
			Logs connected
		{:else}
			Logs disconnected
		{/if}
	</p>

	<div class="logs">
		{#each logs as logLine (logLine.timestamp)}
			<p id="logLine-{logLine.timestamp}">{logLine.logLine}</p>
		{/each}
	</div>
</main>

<style>
	header {
		display: flex;
		flex-direction: column;
		gap: 5px;

		padding-bottom: 10px;
	}

	.container-header {
		display: flex;
		flex-direction: row;
		gap: 5px;
	}

	main {
		padding: 10px;
	}

	.logs-status {
		color: var(--color-main-70);
	}

	.logs {
		height: 500px;
		overflow-x: auto;

		padding: 10px;

		display: flex;
		flex-direction: column;
		gap: 3px;

		border: 0.5px solid var(--color-main-30);
		border-radius: 10px;

		background-color: var(--color-main-20);
	}
</style>

<script lang="ts">
	import { resolve } from '$app/paths';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import { streamLogs } from './logs.remote.js';

	const { data, params } = $props();

	let logs = $state(await data.initialLogs);

	let logsGenerator = streamLogs({
		id: params.id,
		after: logs.at(-1)?.timestamp || ''
	});

	const collectLogs = async () => {
		for await (const logLine of logsGenerator) {
			if (!logLine || !logLine.timestamp) continue;
			logs.push(logLine);
		}
	};

	collectLogs();
</script>

<main>
	<header>
		<a href={resolve('/containers')}>Back</a>
		<svelte:boundary>
			{@const container = await data.container}
			<div class="container-header">
				<h2>{container?.Names}</h2>
				<StatusPill status={container?.State || 'dead'} />
			</div>
			<p>ID: {container?.ID}</p>
			<p>Image: {container?.Image}</p>
		</svelte:boundary>
	</header>

	<p class="logs-status">
		{#if logsGenerator.connected}
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

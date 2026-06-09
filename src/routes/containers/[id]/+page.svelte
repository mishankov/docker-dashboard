<script lang="ts">
	import { resolve } from '$app/paths';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import type { LogLine } from '$lib/server/docker/logs.js';
	import { getDockerState } from '$lib/store/docker-state.svelte.js';
	import { getLogs, streamLogs } from '$lib/store/docker.remote.js';

	const { params } = $props();

	let logs = $state<LogLine[]>(await getLogs(params.id));

	let logsGenerator = streamLogs({ id: params.id, after: logs.at(-1)?.timestamp || '' });

	const collectLogs = async () => {
		for await (const logLine of logsGenerator) {
			if (!logLine || !logLine.timestamp) continue;
			logs.push(logLine);
		}
	};

	const container = $derived(getDockerState().containers?.find((c) => c.id === params.id));

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
			Logs disconnected <button
				onclick={() => {
					logsGenerator.reconnect();
				}}>Reconnect</button
			>
		{/if}
	</p>

	<div class="logs">
		{#each logs as logLine (logLine.id)}
			<p id="logLine-{logLine.timestamp}" class={logLine.stream}>
				<span style="font-weight: bolder;">{logLine.timestamp}</span>
				{logLine.logLine}
			</p>
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

		display: flex;
		flex-direction: column;

		border: 0.5px solid var(--color-main-30);
		border-radius: 5px;

		background-color: var(--color-main-20);
	}

	.logs p {
		line-height: 25px;
		padding-left: 5px;
	}

	.stdout {
		background-color: var(--color-good-10);
		color: var(--color-good-90);
		border-left: 2px solid var(--color-good-50);
	}

	.stderr {
		background-color: var(--color-bad-10);
		color: var(--color-bad-90);
		border-left: 2px solid var(--color-bad-50);
	}
</style>

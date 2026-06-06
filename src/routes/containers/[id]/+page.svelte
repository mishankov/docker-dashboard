<script lang="ts">
	import { resolve } from '$app/paths';
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

<a href={resolve('/')}>Home</a>

<svelte:boundary>
	{@const container = await data.container}
	<h2>{container?.Names} ({container?.Status})</h2>
	<p>{container?.ID}</p>
</svelte:boundary>

<p>Logs connected: {logsGenerator.connected}</p>

{#each logs as logLine (logLine.timestamp)}
	<p id="logLine-{logLine.timestamp}">{logLine.logLine}</p>
{/each}

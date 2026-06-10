<script lang="ts">
	import { getDockerState } from '$lib/store/docker-state.svelte.js';

	const { params } = $props();
</script>

<p>{params.id}</p>

<h3>Raw data</h3>
<pre>
    {JSON.stringify(
		getDockerState().images?.find((i) => i.Id === params.id),
		null,
		2
	)}
</pre>

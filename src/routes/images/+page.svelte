<script>
	import { getDockerState } from '$lib/store/docker-state.svelte';
</script>

{#each getDockerState().images as image (image.id)}
	<h3>{image.id}</h3>
	<span>({image.containers})</span>
	{#each image.tags as tag (tag)}
		<p>{tag}</p>
	{/each}
	<p>{image.size}</p>
{/each}

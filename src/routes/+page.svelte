<script lang="ts">
	import { resolve } from '$app/paths';
	import StatusPill from '$lib/components/StatusPill.svelte';

	const { data } = $props();
</script>

<main>
	<h2>Containers</h2>

	<div class="containers-list">
		{#await data.containers}
			<p>Loading...</p>
		{:then containers}
			{#each containers as { ID, Names, State } (ID)}
				<div class="container-row">
					<a href={resolve('/containers/[id]', { id: ID })}> {Names}</a>
					<StatusPill status={State} />
				</div>
			{/each}
		{/await}
	</div>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;

		display: flex;
		flex-direction: column;
		gap: 10px;

		padding: 10px;
	}

	.containers-list {
		display: flex;
		flex-direction: column;

		padding: 10px;

		border: 0.5px solid var(--color-main-30);
		border-radius: 10px;

		background-color: var(--color-main-20);
	}
</style>

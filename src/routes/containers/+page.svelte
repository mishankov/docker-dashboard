<script lang="ts">
	import { resolve } from '$app/paths';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import { getDockerState } from '$lib/store/docker-state.svelte';
	import { trimLong } from '$lib/utils';
</script>

<main>
	<h2>Containers</h2>

	<div class="containers-list">
		{#each getDockerState().containers as { Id, Names, State, Image } (Id)}
			<div class="container-card">
				<span>
					<a href={resolve('/containers/[id]', { id: Id })}>{Names[0]}</a>
				</span>
				<span class="container-id">{trimLong(Id)}</span>
				<span class="container-image">{trimLong(Image)}</span>
				<span class="container-status"><StatusPill status={State} /> </span>
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		width: 100%;
		min-height: 100%;

		display: flex;
		flex-direction: column;
		gap: 10px;

		padding: 10px;
	}

	.containers-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 10px;

		padding: 10px;
	}

	.container-card {
		width: 300px;
		height: 120px;

		padding: 10px;

		display: flex;
		flex-direction: column;
		gap: 3px;

		border: 0.5px solid var(--color-main-30);
		border-radius: 10px;

		background-color: var(--color-main-20);
	}

	.container-image {
		color: var(--color-main-80);
	}

	.container-id {
		color: var(--color-main-80);
	}

	.container-status {
		margin-top: auto;
	}
</style>

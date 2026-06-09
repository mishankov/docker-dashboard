<script>
	import { getDockerState } from '$lib/store/docker-state.svelte';
	import { formatMemotySize } from '$lib/utils';
	formatMemorySize;
	let searchString = $state('');

	let images = $derived.by(() => {
		if (!searchString) return getDockerState().images;

		return getDockerState().images?.filter((i) => {
			return (
				i.id.includes(searchString) || (i.tags && i.tags.some((t) => t.includes(searchString)))
			);
		});
	});
</script>

<main>
	<h2>Images</h2>
	<input class="search" type="text" placeholder="Search" bind:value={searchString} />
	<table>
		<thead>
			<tr>
				<th>Id</th>
				<th>Containers</th>
				<th>Tags</th>
				<th>Size</th>
			</tr>
		</thead>
		<tbody>
			{#each images as image (image.id)}
				<tr>
					<td>{image.id.slice(7, 19)}</td>
					<td>{image.containers}</td>
					<td>
						{#each image.tags as tag (tag)}
							<p>{tag}</p>
						{/each}
					</td>
					<td>{formatMemotySize(image.size.toString())}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</main>
formatMemorySize

<style>
	main {
		width: 100%;
		min-height: 100%;

		display: flex;
		flex-direction: column;
		gap: 10px;

		padding: 10px;
	}

	.search {
		width: 300px;
	}

	table {
		border-collapse: collapse;
	}

	table,
	thead,
	tbody {
		width: fit-content;
	}

	thead {
		border-bottom: 1px solid var(--color-main-90);
	}

	th,
	td {
		text-align: left;
		width: fit-content;

		padding-left: 20px;
	}
</style>

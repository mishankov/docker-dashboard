<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import TextInput from '$lib/components/TextInput.svelte';
	import { getDockerState } from '$lib/store/docker-state.svelte';
	import { formatMemorySize, trimLong } from '$lib/utils';
	let searchString = $state('');

	let images = $derived.by(() => {
		if (!searchString) return getDockerState().images;

		return getDockerState().images?.filter((i) => {
			return (
				i.Id.includes(searchString) ||
				(i.RepoTags && i.RepoTags.some((t) => t.includes(searchString)))
			);
		});
	});
</script>

<main>
	<h2>Images</h2>
	<TextInput bind:value={searchString} placeholder="Search" />
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
			{#each images as image (image.Id)}
				<tr
					onclick={() => {
						goto(resolve('/images/[id]', { id: image.Id }));
					}}
				>
					<td>{image.Id.slice(7, 19)}</td>
					<td>{image.Containers}</td>
					<td>
						{#each image.RepoTags as tag (tag)}
							<p>{trimLong(tag, 75)}</p>
						{/each}
					</td>
					<td>{formatMemorySize(image.Size.toString())}</td>
				</tr>
			{/each}
		</tbody>
	</table>
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

		padding: 5px 10px 5px 10px;
	}

	tr:nth-child(odd) {
		background-color: var(--color-main-10);
	}

	tr:nth-child(even) {
		background-color: var(--color-main-20);
	}

	tbody tr:hover {
		background-color: var(--color-main-30);
	}
</style>

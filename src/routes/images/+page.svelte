<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import Message from '$lib/components/Message.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { getDockerState } from '$lib/store/docker-state.svelte';
	import { formatMemorySize, trimLong } from '$lib/utils';
	import { remove } from './images.remote';

	let searchString = $state('');
	let takingAction = $state(false);
	let message = $state({ message: '', type: '' as 'success' | 'error' });
	let deletedImageIds = $state<string[]>([]);

	let images = $derived.by(() => {
		return getDockerState()
			.images?.filter((i) => {
				if (!searchString) return true;
				return (
					i.Id.includes(searchString) ||
					(i.RepoTags && i.RepoTags.some((t) => t.includes(searchString)))
				);
			})
			.filter((i) => {
				if (deletedImageIds.length === 0) return true;

				return !deletedImageIds.includes(i.Id);
			});
	});
</script>

<main>
	<h2>Images</h2>
	{#if message.message}
		<Message message={message.message} type={message.type} />
	{/if}
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
					<td title={image.Id}>{image.Id.slice(7, 19)}</td>
					<td>{image.Containers}</td>
					<td>
						{#each image.RepoTags as tag (tag)}
							<p title={tag}>{trimLong(tag, 50)}</p>
						{/each}
					</td>
					<td>{formatMemorySize(image.Size.toString())}</td>
					<td>
						{#if image.Containers < 1}
							<Button
								kind="danger"
								disabled={takingAction || image.Containers > 0}
								title="Will force remove image with all its tags"
								onclick={async (e) => {
									e.preventDefault();
									e.stopPropagation();
									takingAction = true;
									message = { message: '', type: 'success' };

									const result = await remove(image.Id);

									if (result) {
										message = { message: result.message, type: 'error' };
									} else {
										deletedImageIds.push(image.Id);
										message = {
											message: `Successufuly removed image ${image.Id}`,
											type: 'success'
										};
									}

									takingAction = false;
								}}
							>
								Remove
							</Button>
						{/if}
					</td>
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

	tr {
		transition: all 100ms;
	}

	tbody tr:hover {
		background-color: var(--color-main-30);
		transition: all 50ms;
	}
</style>

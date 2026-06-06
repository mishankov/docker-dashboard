<script lang="ts">
	import type { ContainerStatus } from '$lib/server/docker';

	type Props = {
		status: ContainerStatus;
	};

	let { status }: Props = $props();
</script>

<span class={status}>{status}</span>

<style>
	span {
		border-radius: 100px;
		padding-left: 5px;
		padding-right: 5px;

		background-color: var(--color-accent-50);
		color: var(--color-main-10);
	}
</style>

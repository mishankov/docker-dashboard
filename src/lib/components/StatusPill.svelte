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
		width: fit-content;

		border-radius: 100px;
		padding-left: 5px;
		padding-right: 5px;
		padding-top: 3px;
		padding-bottom: 3px;

		background-color: var(--color-accent-50);
		color: var(--color-main-10);

		user-select: none;
	}

	.running {
		background-color: var(--color-good-50);
	}

	.exited {
		background-color: var(--color-bad-50);
	}
</style>

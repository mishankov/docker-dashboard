<script lang="ts">
	type Props = { message: string; type: 'success' | 'error' };
	let { message, type }: Props = $props();
</script>

<div class={type}>{message}</div>

<style>
	div {
		max-width: 500px;
		padding: 20px;
	}

	.success {
		background-color: var(--color-good-10);
		color: var(--color-good-90);
		border-left: 2px solid var(--color-good-50);
	}

	.error {
		background-color: var(--color-bad-10);
		color: var(--color-bad-90);
		border-left: 2px solid var(--color-bad-50);
	}
</style>

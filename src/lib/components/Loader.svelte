<script lang="ts">
	interface Props {
		size?: string;
		thickness?: string;
	}

	let { size = '24px', thickness = '3px' }: Props = $props();
</script>

<div class="loader" style="width: {size}; height: {size}; --thickness: {thickness}"></div>

<style>
	.loader {
		box-sizing: border-box;
		border: var(--thickness) solid var(--color-main-30);
		border-top-color: var(--color-accent-50);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		disabled?: boolean;
		title?: string;
		onclick?: (
			e: MouseEvent & {
				currentTarget: EventTarget & HTMLButtonElement;
			}
		) => void;
		children: Snippet;
		kind?: 'default' | 'danger';
	};

	const { disabled = false, title, onclick, kind = 'default', children }: Props = $props();
</script>

<button class={kind} {disabled} {title} {onclick}> {@render children()} </button>

<style>
	button {
		all: unset;
		border: none;
		user-select: none;

		padding: 5px 10px 5px 10px;

		background-color: var(--color-main-40);
		color: var(--color-main-90);

		transition: all 200ms;
	}

	button:hover {
		background-color: var(--color-main-30);
	}

	.danger {
		background-color: var(--color-bad-40);
		color: var(--color-bad-90);
	}

	.danger:hover {
		background-color: var(--color-bad-30);
		transition: all 50ms;
	}
</style>

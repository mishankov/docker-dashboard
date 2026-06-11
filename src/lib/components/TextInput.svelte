<script lang="ts">
	let { value = $bindable(''), placeholder = '' } = $props();
</script>

<input type="text" bind:value {placeholder} />

<style>
	input {
		all: unset;

		height: 30px;
		max-width: 500px;

		background: var(--color-main-20);
		padding: 5px 10px 5px 10px;

		border-bottom: 1px solid var(--color-main-40);

		transition: all 200ms;
	}

	input:hover {
		background: var(--color-main-30);
		border-bottom: 1px solid var(--color-main-50);

		transition: all 50ms;
	}

	input:focus {
		background: var(--color-main-30);
		border-bottom: 1px solid var(--color-main-50);

		transition: all 50ms;
	}

	input::placeholder {
		color: var(--color-main-50);
	}
</style>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import {
		initializeDockerState,
		scheduleDockerStateUpdates
	} from '$lib/store/docker-state.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	const navItems = [
		{ label: 'Dashboard', href: resolve('/') },
		{ label: 'Containers', href: resolve('/containers') }
	];

	onMount(async () => {
		await initializeDockerState();
		scheduleDockerStateUpdates();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<aside class="sidebar">
		<nav>
			<ul>
				{#each navItems as { label, href } (href)}
					<li>
						<a {href} class="nav-link" class:active={$page.url.pathname === href}>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="app-name">Docker Dashboard</div>
	</aside>

	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		width: 100vw;
		height: 100vh;
	}

	.sidebar {
		width: 200px;
		flex-shrink: 0;
		background-color: var(--color-main-10);
		border-right: 0.5px solid var(--color-main-40);
		padding: 5px;
		display: flex;
		flex-direction: column;
	}

	.sidebar nav {
		flex: 1;
	}

	.app-name {
		color: var(--color-main-30);
	}

	.sidebar nav ul {
		list-style: none;
		padding: 0;
		margin: 0;

		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.nav-link {
		display: block;
		padding: 5px;
		border-radius: 6px;
		text-decoration: none;
		color: var(--color-main-80);
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.nav-link:hover {
		background-color: var(--color-main-30);
		color: var(--color-main-90);
	}

	.nav-link.active {
		background-color: var(--color-main-40);
		color: var(--color-main-90);
		font-weight: bold;
	}

	.content {
		flex: 1;
		overflow: auto;
	}
</style>

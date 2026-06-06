<script lang="ts">
	import StatusPill from '$lib/components/StatusPill.svelte';

	let selected = $state(0);

	const mockContainers = [
		{ ID: 'abc123', Names: 'ai-chat-minio-create-bucket', Image: 'minio/mc:latest', State: 'exited' as const, Status: 'Exited (0) 2 days ago' },
		{ ID: 'def456', Names: 'ai-chat-minio', Image: 'minio/minio:latest', State: 'running' as const, Status: 'Up 3 days' },
		{ ID: 'ghi789', Names: 'ai-chat-db', Image: 'postgres:15', State: 'running' as const, Status: 'Up 3 days' },
		{ ID: 'jkl012', Names: 'ai-chat-redis', Image: 'redis:7', State: 'exited' as const, Status: 'Exited (137) 5 days ago' },
		{ ID: 'mno345', Names: 'ai-chat-proxy-1', Image: 'nginx:alpine', State: 'running' as const, Status: 'Up 1 week' },
		{ ID: 'pqr678', Names: 'practical_jones', Image: 'hello-world', State: 'exited' as const, Status: 'Exited (0) 2 weeks ago' },
		{ ID: 'stu901', Names: 'caddy', Image: 'caddy:2', State: 'exited' as const, Status: 'Exited (1) 3 weeks ago' },
		{ ID: 'vwx234', Names: 'xray', Image: 'xray:latest', State: 'exited' as const, Status: 'Exited (0) 1 month ago' },
		{ ID: 'yza567', Names: 'aas_test-db-1', Image: 'postgres:14', State: 'exited' as const, Status: 'Exited (0) 2 days ago' },
		{ ID: 'bcd890', Names: 'local-infra-web-tail-1', Image: 'amir20/dozzle:latest', State: 'exited' as const, Status: 'Exited (137) 1 day ago' },
		{ ID: 'efg123', Names: 'proxymini', Image: 'nginx:alpine', State: 'exited' as const, Status: 'Exited (0) 4 days ago' },
		{ ID: 'hij456', Names: 'glance', Image: 'glanceapp/glance:latest', State: 'exited' as const, Status: 'Exited (137) 1 week ago' },
		{ ID: 'klm789', Names: 'aas_test-proxymini-1', Image: 'nginx:alpine', State: 'exited' as const, Status: 'Exited (0) 2 days ago' },
		{ ID: 'nop012', Names: 'proxymini-proxymini-1', Image: 'nginx:alpine', State: 'exited' as const, Status: 'Exited (137) 3 days ago' },
		{ ID: 'qrs345', Names: 'prod-grafana-1', Image: 'grafana/grafana:latest', State: 'running' as const, Status: 'Up 5 days' },
	];

	const prototypes = [
		{ name: 'Data Table', description: 'Clean tabular layout with aligned columns' },
		{ name: 'Card Grid', description: 'Responsive grid of visual cards' },
		{ name: 'Status Grouped', description: 'Running and exited in separate sections' },
		{ name: 'Compact Terminal', description: 'Ultra-dense terminal-inspired list' },
		{ name: 'Rich List', description: 'Expanded rows with images and hover details' },
	];

	const runningContainers = $derived(mockContainers.filter((c) => c.State === 'running'));
	const exitedContainers = $derived(mockContainers.filter((c) => c.State !== 'running'));

	function shortId(id: string) {
		return id.slice(0, 12);
	}

	function shortImage(img: string) {
		return img.length > 25 ? img.slice(0, 22) + '...' : img;
	}
</script>

<main>
	<h2>Container Screen Prototypes</h2>

	<div class="prototype-nav">
		{#each prototypes as proto, i}
			<button class:active={selected === i} onclick={() => (selected = i)}>
				<strong>{proto.name}</strong>
				<span>{proto.description}</span>
			</button>
		{/each}
	</div>

	<div class="prototype-view">
		{#if selected === 0}
			<!-- Data Table -->
			<div class="proto-table">
				<div class="table-header">
					<span>Name</span>
					<span>Image</span>
					<span>Status</span>
					<span>ID</span>
				</div>
				{#each mockContainers as c}
					<div class="table-row">
						<span class="name">{c.Names}</span>
						<span class="image">{shortImage(c.Image)}</span>
						<span><StatusPill status={c.State} /></span>
						<span class="id">{shortId(c.ID)}</span>
					</div>
				{/each}
			</div>

		{:else if selected === 1}
			<!-- Card Grid -->
			<div class="proto-grid">
				{#each mockContainers as c}
					<div class="card" class:running={c.State === 'running'}>
						<div class="card-header">
							<div class="status-indicator" class:running={c.State === 'running'}></div>
						</div>
						<div class="card-name">{c.Names}</div>
						<div class="card-image">{c.Image}</div>
						<div class="card-footer">
							<StatusPill status={c.State} />
							<span class="card-id">{shortId(c.ID)}</span>
						</div>
					</div>
				{/each}
			</div>

		{:else if selected === 2}
			<!-- Status Grouped -->
			<div class="proto-grouped">
				{#if runningContainers.length > 0}
					<div class="group">
						<h3>Running <span class="count">{runningContainers.length}</span></h3>
						<div class="group-list">
							{#each runningContainers as c}
								<div class="group-row">
									<span class="group-dot running"></span>
									<span class="group-name">{c.Names}</span>
									<span class="group-image">{c.Image}</span>
									<span class="group-id">{shortId(c.ID)}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if exitedContainers.length > 0}
					<div class="group">
						<h3>Exited <span class="count">{exitedContainers.length}</span></h3>
						<div class="group-list">
							{#each exitedContainers as c}
								<div class="group-row">
									<span class="group-dot exited"></span>
									<span class="group-name">{c.Names}</span>
									<span class="group-image">{c.Image}</span>
									<span class="group-id">{shortId(c.ID)}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

		{:else if selected === 3}
			<!-- Compact Terminal -->
			<div class="proto-terminal">
				{#each mockContainers as c}
					<div class="term-row">
						<span class="term-status" class:running={c.State === 'running'}>{c.State === 'running' ? '▶' : '■'}</span>
						<span class="term-name">{c.Names}</span>
						<span class="term-image">{c.Image}</span>
						<span class="term-id">{shortId(c.ID)}</span>
					</div>
				{/each}
			</div>

		{:else if selected === 4}
			<!-- Rich List -->
			<div class="proto-rich">
				{#each mockContainers as c}
					<div class="rich-row" class:running={c.State === 'running'}>
						<div class="rich-main">
							<div class="rich-name">{c.Names}</div>
							<div class="rich-meta">
								<span class="rich-image">{c.Image}</span>
								<span class="rich-id">{shortId(c.ID)}</span>
							</div>
						</div>
						<div class="rich-status">
							<StatusPill status={c.State} />
							<div class="rich-detail">{c.Status}</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	main {
		width: 100vw;
		min-height: 100vh;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	h2 {
		font-size: 1.5rem;
		margin: 0;
	}

	.prototype-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.prototype-nav button {
		background: var(--color-main-20);
		border: 1px solid var(--color-main-30);
		border-radius: 8px;
		padding: 12px 16px;
		color: var(--color-main-90);
		font-family: inherit;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		transition: all 0.15s ease;
	}

	.prototype-nav button:hover {
		background: var(--color-main-30);
	}

	.prototype-nav button.active {
		background: var(--color-main-40);
		border-color: var(--color-main-50);
	}

	.prototype-nav button strong {
		font-size: 0.95rem;
	}

	.prototype-nav button span {
		font-size: 0.75rem;
		opacity: 0.7;
	}

	.prototype-view {
		flex: 1;
	}

	/* --- Data Table --- */
	.proto-table {
		border: 0.5px solid var(--color-main-30);
		border-radius: 10px;
		overflow: hidden;
		background: var(--color-main-20);
	}

	.table-header {
		display: grid;
		grid-template-columns: 2fr 1.5fr 100px 100px;
		gap: 12px;
		padding: 10px 16px;
		background: var(--color-main-30);
		font-weight: bold;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		opacity: 0.8;
	}

	.table-row {
		display: grid;
		grid-template-columns: 2fr 1.5fr 100px 100px;
		gap: 12px;
		padding: 10px 16px;
		border-bottom: 0.5px solid var(--color-main-30);
		align-items: center;
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.table-row:hover {
		background: var(--color-main-30);
	}

	.table-row .name {
		font-weight: bold;
	}

	.table-row .image,
	.table-row .id {
		opacity: 0.7;
		font-size: 0.85rem;
	}

	/* --- Card Grid --- */
	.proto-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 12px;
	}

	.card {
		background: var(--color-main-20);
		border: 0.5px solid var(--color-main-30);
		border-radius: 10px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		transition: all 0.15s ease;
		position: relative;
	}

	.card:hover {
		border-color: var(--color-main-50);
		transform: translateY(-2px);
	}

	.card.running {
		border-left: 3px solid var(--color-good-50);
	}

	.card-header {
		display: flex;
		justify-content: flex-end;
	}

	.status-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-bad-50);
	}

	.status-indicator.running {
		background: var(--color-good-50);
		box-shadow: 0 0 6px var(--color-good-50);
	}

	.card-name {
		font-weight: bold;
		font-size: 0.95rem;
		word-break: break-all;
	}

	.card-image {
		font-size: 0.8rem;
		opacity: 0.6;
		word-break: break-all;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
		padding-top: 8px;
	}

	.card-id {
		font-size: 0.75rem;
		opacity: 0.5;
	}

	/* --- Status Grouped --- */
	.proto-grouped {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.group h3 {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 10px 0;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.count {
		background: var(--color-main-30);
		padding: 2px 8px;
		border-radius: 100px;
		font-size: 0.8rem;
	}

	.group-list {
		border: 0.5px solid var(--color-main-30);
		border-radius: 10px;
		overflow: hidden;
		background: var(--color-main-20);
	}

	.group-row {
		display: grid;
		grid-template-columns: 16px 2fr 1.5fr 100px;
		gap: 12px;
		padding: 10px 16px;
		border-bottom: 0.5px solid var(--color-main-30);
		align-items: center;
	}

	.group-row:last-child {
		border-bottom: none;
	}

	.group-row:hover {
		background: var(--color-main-30);
	}

	.group-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.group-dot.running {
		background: var(--color-good-50);
		box-shadow: 0 0 4px var(--color-good-50);
	}

	.group-dot.exited {
		background: var(--color-bad-50);
	}

	.group-name {
		font-weight: bold;
	}

	.group-image {
		font-size: 0.85rem;
		opacity: 0.7;
	}

	.group-id {
		font-size: 0.8rem;
		opacity: 0.5;
	}

	/* --- Compact Terminal --- */
	.proto-terminal {
		border: 0.5px solid var(--color-main-30);
		border-radius: 10px;
		background: var(--color-main-20);
		padding: 8px 0;
		font-size: 0.85rem;
	}

	.term-row {
		display: grid;
		grid-template-columns: 24px 2fr 1.5fr 100px;
		gap: 8px;
		padding: 4px 16px;
		align-items: center;
	}

	.term-row:hover {
		background: var(--color-main-30);
	}

	.term-status {
		font-size: 0.7rem;
		color: var(--color-bad-50);
	}

	.term-status.running {
		color: var(--color-good-50);
	}

	.term-name {
		font-weight: bold;
	}

	.term-image {
		opacity: 0.6;
	}

	.term-id {
		opacity: 0.4;
		font-size: 0.8rem;
	}

	/* --- Rich List --- */
	.proto-rich {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.rich-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--color-main-20);
		border: 0.5px solid var(--color-main-30);
		border-radius: 10px;
		padding: 14px 18px;
		transition: all 0.15s ease;
		border-left: 3px solid transparent;
	}

	.rich-row:hover {
		border-color: var(--color-main-50);
		background: var(--color-main-30);
	}

	.rich-row.running {
		border-left: 3px solid var(--color-good-50);
	}

	.rich-main {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.rich-name {
		font-weight: bold;
		font-size: 1rem;
	}

	.rich-meta {
		display: flex;
		gap: 12px;
		font-size: 0.8rem;
		opacity: 0.6;
	}

	.rich-status {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 4px;
	}

	.rich-detail {
		font-size: 0.75rem;
		opacity: 0.5;
	}
</style>

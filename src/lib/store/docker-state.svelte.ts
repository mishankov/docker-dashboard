import { getContainers, getStats } from './docker.remote';

type Containers = {
	id: string;
	name: string;
	image: string;
	state: 'created' | 'restarting' | 'running' | 'removing' | 'paused' | 'exited' | 'dead';
	status: string;
};

type Stats = {
	cpuPrec: string;
	memPrec: string;
	memUsage: string;
};

type DockerState = {
	initialStateLoaded: boolean;
	containers?: Containers[];
	stats?: Stats;
};

export const dockerState: DockerState = $state({ initialStateLoaded: false, containers: [] });

export const initializeDockerState = async () => {
	// initialize containers
	dockerState.containers = [];
	(await getContainers()).forEach((c) => {
		dockerState.containers?.push({
			id: c.ID,
			name: c.Names,
			image: c.Image,
			state: c.State,
			status: c.Status
		});
	});

	// initialize stats
	const stats = await getStats();
	dockerState.stats = {
		cpuPrec: stats.CPUPrec,
		memPrec: stats.MemPerc,
		memUsage: stats.MemUsage
	};

	dockerState.initialStateLoaded = true;
};

export const scheduleDockerStateUpdates = async () => {
	while (true) {
		// update containers
		await getContainers().refresh();

		const containers: Containers[] = [];
		(await getContainers()).forEach((c) => {
			containers.push({
				id: c.ID,
				name: c.Names,
				image: c.Image,
				state: c.State,
				status: c.Status
			});
		});
		dockerState.containers = containers;

		// update stats
		await getStats().refresh();
		const stats = await getStats();
		dockerState.stats = {
			cpuPrec: stats.CPUPrec,
			memPrec: stats.MemPerc,
			memUsage: stats.MemUsage
		};

		await new Promise((resolve) => setTimeout(resolve, 3000));
	}
};

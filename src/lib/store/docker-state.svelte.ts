import type { ContainerStatus } from '$lib/server/docker/containers';
import { getContainers, getStats, getImages } from './docker.remote';

type Stats = {
	cpuPrec: string;
	cpuLimit: string;
	memPrec: string;
	memUsage: string;
	memLimit: string;
};

type Container = {
	id: string;
	name: string;
	image: string;
	state: ContainerStatus;
	status: string;
};

type Image = {
	id: string;
	tags?: string[];
	size: number;
	containers: number;
};

type DockerState = {
	initialStateLoaded: boolean;
	stats?: Stats;
	containers?: Container[];
	images?: Image[];
};

export const dockerState: DockerState = $state({ initialStateLoaded: false, containers: [] });

// TODO: run data getter in parallel
// TODO: do not dublicate logic in initializeDockerState and scheduleDockerStateUpdates
export const initializeDockerState = async () => {
	// initialize stats
	const stats = await getStats();
	dockerState.stats = {
		cpuPrec: stats.CPUPerc,
		cpuLimit: stats.CPULimit,
		memPrec: stats.MemPerc,
		memUsage: stats.MemUsage,
		memLimit: stats.MemLimit
	};

	// initialize containers
	dockerState.containers = [];
	(await getContainers()).forEach((c) => {
		dockerState.containers?.push({
			id: c.Id,
			name: c.Names[0],
			image: c.Image,
			state: c.State as ContainerStatus,
			status: c.Status
		});
	});

	// initialize images
	dockerState.images = [];
	(await getImages()).forEach((i) => {
		dockerState.images?.push({
			id: i.Id,
			tags: i.RepoTags,
			size: i.Size,
			containers: i.Containers
		});
	});
	dockerState.images.sort((a, b) => {
		if (a.containers > b.containers) return -1;
		if (a.containers < b.containers) return 1;
		return 0;
	});

	dockerState.initialStateLoaded = true;
};

export const scheduleDockerStateUpdates = async () => {
	while (true) {
		// update containers
		await getContainers().refresh();

		const containers: Container[] = [];
		(await getContainers()).forEach((c) => {
			containers.push({
				id: c.Id,
				name: c.Names[0],
				image: c.Image,
				state: c.State as ContainerStatus,
				status: c.Status
			});
		});
		dockerState.containers = containers;

		// update stats
		await getStats().refresh();
		const stats = await getStats();
		dockerState.stats = {
			cpuPrec: stats.CPUPerc,
			cpuLimit: stats.CPULimit,
			memPrec: stats.MemPerc,
			memUsage: stats.MemUsage,
			memLimit: stats.MemLimit
		};

		await new Promise((resolve) => setTimeout(resolve, 3000));
	}
};

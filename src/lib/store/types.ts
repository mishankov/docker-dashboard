import type { ContainerStatus } from '$lib/server/docker/containers';

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

export type DockerState = {
	initialStateLoaded: boolean;
	stats?: Stats;
	containers?: Container[];
	images?: Image[];
};

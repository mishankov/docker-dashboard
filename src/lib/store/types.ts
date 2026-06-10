import type { ContainerInfo, ImageInfo } from 'dockerode';

type Stats = {
	cpuPrec: string;
	cpuLimit: string;
	memPrec: string;
	memUsage: string;
	memLimit: string;
};

export type DockerState = {
	initialStateLoaded: boolean;
	stats?: Stats;
	containers?: ContainerInfo[];
	images?: ImageInfo[];
};

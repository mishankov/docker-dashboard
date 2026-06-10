import { query } from '$app/server';

import { getStats } from '$lib/server/docker';
import { listContainers } from '$lib/server/docker/containers';
import { listImages } from '$lib/server/docker/images';
import { getContainerLogs, streamContainerLogs } from '$lib/server/docker/logs';

import type { DockerState } from './types';

export const streamLogs = query.live('unchecked', (arg: { id: string; after: string }) => {
	return streamContainerLogs(arg.id, arg.after);
});
export const getLogs = query('unchecked', getContainerLogs);

export const streamState = query.live(async function* () {
	while (true) {
		const state: DockerState = { initialStateLoaded: false };

		// Stats
		const stats = getStats();
		stats.then((s) => {
			state.stats = {
				cpuPrec: s.CPUPerc,
				cpuLimit: s.CPULimit,
				memPrec: s.MemPerc,
				memUsage: s.MemUsage,
				memLimit: s.MemLimit
			};
		});

		// Containers
		const containers = listContainers();
		containers.then((cs) => {
			state.containers = cs;
		});

		// Images
		const images = listImages();
		images.then((is) => {
			state.images = is;

			state.images?.sort((a, b) => {
				if (a.Containers > b.Containers) return -1;
				if (a.Containers < b.Containers) return 1;

				if (a.RepoTags?.length && b.RepoTags?.length) {
					if (a.RepoTags[0] > b.RepoTags[0]) return 1;
					if (a.RepoTags[0] < b.RepoTags[0]) return -1;
				} else if (a.RepoTags?.length) {
					return -1;
				} else if (b.RepoTags?.length) {
					return 1;
				}

				if (a.Size > b.Size) return -1;
				if (a.Size < b.Size) return 1;
				return 0;
			});
		});

		await Promise.allSettled([stats, containers, images]);

		state.initialStateLoaded = true;
		yield state;

		await new Promise((resolve) => setTimeout(resolve, 3000));
	}
});

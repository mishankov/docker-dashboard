import { dockerService } from '$lib/server/docker';

export const load = async () => {
	const containers = dockerService.listContainers();
	return { containers };
};

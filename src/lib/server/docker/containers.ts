import { docker } from './docker';

export type ContainerStatus =
	| 'created'
	| 'restarting'
	| 'running'
	| 'removing'
	| 'paused'
	| 'exited'
	| 'dead';

export const listContainers = async () => {
	return await docker.listContainers({ all: true });
};

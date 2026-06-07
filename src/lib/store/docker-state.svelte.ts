import { getContainers } from './docker.remote';

type DockerState = {
	containers: {
		id: string;
		name: string;
		image: string;
		state: 'created' | 'restarting' | 'running' | 'removing' | 'paused' | 'exited' | 'dead';
		status: string;
	}[];
};

export const dockerState: DockerState = $state({ containers: [] });
export const someSimple = $state('kek');

export const initializeDockerState = async () => {
	// initialize containers
	dockerState.containers = [];
	(await getContainers()).forEach((c) => {
		dockerState.containers.push({
			id: c.ID,
			name: c.Names,
			image: c.Image,
			state: c.State,
			status: c.Status
		});
	});
};

export const scheduleDockerStateUpdates = async () => {
	while (true) {
		// update containers
		await getContainers().refresh();

		const containers = [];
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

		await new Promise((resolve) => setTimeout(resolve, 3000));
	}
};

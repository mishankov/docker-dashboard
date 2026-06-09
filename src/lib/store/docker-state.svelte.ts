import { streamState } from './docker.remote';
import type { DockerState } from './types';

let dockerState: DockerState = $state({ initialStateLoaded: false, containers: [] });

export const getDockerState = () => {
	return dockerState;
};

export const syncDockerState = async () => {
	for await (const state of streamState()) {
		dockerState = state;
	}
};

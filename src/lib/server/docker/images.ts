import { docker } from './docker';

export const listImages = async () => {
	return await docker.listImages({ all: true });
};

import { dockerService } from '$lib/server/docker';

export const ssr = false;
export const csr = true;

export const load = ({ params }) => {
	const container = dockerService.getContainer(params.id);
	const initialLogs = dockerService.getContainerLogs(params.id);

	return { container, initialLogs };
};

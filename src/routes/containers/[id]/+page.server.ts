import { dockerService } from '$lib/server/docker';

export const ssr = false;
export const csr = true;

export const load = ({ params }) => {
	const initialLogs = dockerService.getContainerLogs(params.id);

	return { initialLogs };
};

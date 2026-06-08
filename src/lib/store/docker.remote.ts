import { query } from '$app/server';
import { dockerService } from '$lib/server/docker';

export const getContainers = query(dockerService.listContainers);
export const getStats = query(dockerService.getStats);

export const streamLogs = query.live('unchecked', (arg: { id: string; after: string }) => {
	return dockerService.streamContainerLogs(arg.id, arg.after);
});
export const getLogs = query('unchecked', dockerService.getContainerLogs);

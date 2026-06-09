import { query } from '$app/server';
import { stats } from '$lib/server/docker';
import { listContainers } from '$lib/server/docker/containers';
import { listImages } from '$lib/server/docker/images';
import { getContainerLogs, streamContainerLogs } from '$lib/server/docker/logs';

export const getStats = query(stats);
export const getContainers = query(listContainers);

export const streamLogs = query.live('unchecked', (arg: { id: string; after: string }) => {
	return streamContainerLogs(arg.id, arg.after);
});
export const getLogs = query('unchecked', getContainerLogs);

export const getImages = query(listImages);

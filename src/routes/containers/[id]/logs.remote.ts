import { query } from '$app/server';
import { dockerService } from '$lib/server/docker';

export const streamLogs = query.live('unchecked', (arg: { id: string; after: string }) =>
	dockerService.streamContainerLogs(arg.id, arg.after)
);

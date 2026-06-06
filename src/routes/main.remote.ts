import { query } from '$app/server';
import { dockerService } from '$lib/server/docker';

export const streamStats = query.live(dockerService.streamStats);

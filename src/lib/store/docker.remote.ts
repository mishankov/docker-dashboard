import { query } from '$app/server';
import { dockerService } from '$lib/server/docker';

export const getContainers = query(dockerService.listContainers);
export const getStats = query(dockerService.getStats);

import { command } from '$app/server';
import { docker } from '$lib/server/docker/docker';

export const remove = command('unchecked', async (id: string) => {
	const image = docker.getImage(id);
	try {
		await image.remove();
	} catch (e) {
		if (e instanceof Error) {
			return { message: e.toString() };
		}
	}

	return;
});

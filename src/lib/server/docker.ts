import { execSync, spawn, spawnSync } from 'child_process';

export type ContainerStatus =
	| 'created'
	| 'restarting'
	| 'running'
	| 'removing'
	| 'paused'
	| 'exited'
	| 'dead';

export type LogLine = {
	timestamp: string;
	logLine: string;
};

const parseLogLine = (rawLine: string): LogLine => {
	return {
		timestamp: rawLine.split(' ')[0],
		logLine: rawLine.split(' ').slice(1).join(' ')
	};
};

export const dockerService = {
	listContainers: async () => {
		const output = execSync('docker container ls --all --format json', { encoding: 'utf-8' }).split(
			'\n'
		);

		const containers: {
			ID: string;
			Image: string;
			State: ContainerStatus;
			Status: string;
			Names: string;
		}[] = [];
		for (const container of output) {
			if (!container) continue;
			containers.push(JSON.parse(container));
		}

		return containers;
	},
	getContainer: async (id: string) => {
		const output = execSync('docker container ls --all --format json', { encoding: 'utf-8' }).split(
			'\n'
		);

		for (const container of output) {
			if (!container) continue;

			const parsed: {
				ID: string;
				Image: string;
				State: ContainerStatus;
				Status: string;
				Names: string;
			} = JSON.parse(container);

			if (parsed.ID === id) {
				return parsed;
			}
		}
	},

	getContainerLogs: async (id: string) => {
		const result = spawnSync(`docker`, ['logs', '--timestamps', id]);

		const logs: LogLine[] = [];

		for (const rawLine of result.stdout.toString().split('\n')) {
			if (!rawLine) continue;
			logs.push(parseLogLine(rawLine));
		}

		for (const rawLine of result.stderr.toString().split('\n')) {
			if (!rawLine) continue;
			logs.push(parseLogLine(rawLine));
		}

		logs.sort((a, b) => {
			if (a.timestamp < b.timestamp) return -1;
			if (a.timestamp > b.timestamp) return 1;
			return 0;
		});

		return logs;
	},

	streamContainerLogs: async function* (id: string, after: string) {
		const args = ['logs', '-f', '--timestamps'];
		if (after) {
			args.push('--since');
			args.push(after);
		}
		args.push(id);

		const logs = spawn('docker', args);

		const queue: LogLine[] = [];
		let done = false;

		logs.stdout.on('data', (chunk) => {
			const rawLines = chunk.toString().split('\n');
			for (const rawLine of rawLines) {
				const logLine = parseLogLine(rawLine);
				if (logLine.timestamp == after) {
					continue;
				}

				queue.push(parseLogLine(rawLine));
			}
		});

		logs.stderr.on('data', (chunk) => {
			const rawLines = chunk.toString().split('\n');
			for (const rawLine of rawLines) {
				const logLine = parseLogLine(rawLine);
				if (logLine.timestamp == after) {
					continue;
				}

				queue.push(parseLogLine(rawLine));
			}
		});

		logs.on('close', () => {
			done = true;
		});

		while (!done || queue.length > 0) {
			if (queue.length > 0) {
				yield queue.shift();
			} else {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}
	}
};

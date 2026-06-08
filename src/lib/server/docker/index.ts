import { execSync, spawn, spawnSync } from 'child_process';
import Docker from 'dockerode';

// TODO: handle different OSs
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

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
	stream: 'stdout' | 'stderr';
};

const parseLogLine = (rawLine: string, stream: 'stdout' | 'stderr'): LogLine | undefined => {
	const match = rawLine.match(/^(\S+)\s?(.*)$/);
	if (!match) return;

	return {
		timestamp: match[1],
		logLine: match[2],
		stream
	};
};

const decodeDockerLogBuffer = (buffer: Buffer, isTty: boolean) => {
	if (isTty) {
		return [{ stream: 'stdout' as const, text: buffer.toString('utf8') }];
	}

	const chunks: { stream: 'stdout' | 'stderr'; text: string }[] = [];
	let offset = 0;

	while (offset + 8 <= buffer.length) {
		const streamType = buffer.readUInt8(offset);
		const length = buffer.readUInt32BE(offset + 4);
		const start = offset + 8;
		const end = start + length;

		if (end > buffer.length) break;

		chunks.push({
			stream: streamType === 2 ? 'stderr' : 'stdout',
			text: buffer.subarray(start, end).toString('utf8')
		});

		offset = end;
	}

	return chunks;
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
		const container = docker.getContainer(id);
		const info = await container.inspect();
		const rawLogs = await container.logs({
			timestamps: true,
			stdout: true,
			stderr: true,
			follow: false,
			tail: 100
		});

		const logs: LogLine[] = [];

		for (const chunk of decodeDockerLogBuffer(rawLogs, info.Config.Tty)) {
			for (const rawLine of chunk.text.split('\n')) {
				if (!rawLine) continue;

				const logLine = parseLogLine(rawLine, chunk.stream);
				if (logLine) logs.push(logLine);
			}
		}

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
				const logLine = parseLogLine(rawLine, 'stdout');
				if (!logLine || logLine.timestamp == after) {
					continue;
				}

				queue.push(parseLogLine(rawLine, 'stdout'));
			}
		});

		logs.stderr.on('data', (chunk) => {
			const rawLines = chunk.toString().split('\n');
			for (const rawLine of rawLines) {
				const logLine = parseLogLine(rawLine);
				if (!logLine || logLine.timestamp == after) {
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
	},

	getStats: async () => {
		let CPUPrec = 0;
		let MemPerc = 0;
		let MemUsage = 0;
		const result = spawnSync('docker', ['stats', '--all', '--format', 'json', '--no-stream']);
		for (const rawLine of result.stdout.toString().split('\n')) {
			if (!rawLine) continue;
			const stat: {
				CPUPerc: string;
				MemPerc: string;
				MemUsage: string;
			} = JSON.parse(rawLine);

			CPUPrec += Number(stat.CPUPerc.replace('%', ''));
			MemPerc += Number(stat.MemPerc.replace('%', ''));

			if (stat.MemUsage) {
				const usedMem = stat.MemUsage.split(' / ')[0];

				if (usedMem.endsWith('GiB'))
					MemUsage += Number(usedMem.replace('GiB', '')) * 1024 * 1024 * 1024;
				else if (usedMem.endsWith('MiB'))
					MemUsage += Number(usedMem.replace('MiB', '')) * 1024 * 1024;
				else if (usedMem.endsWith('KiB')) MemUsage += Number(usedMem.replace('KiB', '')) * 1024;
				else if (usedMem.endsWith('B')) MemUsage += Number(usedMem.replace('B', ''));
			}
		}

		return {
			CPUPrec: CPUPrec.toFixed(2),
			MemPerc: MemPerc.toFixed(2),
			MemUsage: MemUsage.toFixed(2)
		};
	}
};

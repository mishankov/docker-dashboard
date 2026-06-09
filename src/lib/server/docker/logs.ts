import { PassThrough } from 'stream';
import { docker } from './docker';

export type LogLine = {
	id: string;
	timestamp: string;
	logLine: string;
	stream: 'stdout' | 'stderr';
};

export const getContainerLogs = async (id: string) => {
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
};

export const streamContainerLogs = async function* (id: string, after: string) {
	const container = docker.getContainer(id);
	const info = await container.inspect();

	const logStream = await container.logs({
		timestamps: true,
		stdout: true,
		stderr: true,
		follow: true,
		since: toDockerSince(after) || undefined
	});

	const queue: LogLine[] = [];
	const pending = {
		stdout: '',
		stderr: ''
	};

	let done = false;
	let error: Error | undefined;

	const pushText = (text: string, stream: 'stdout' | 'stderr') => {
		pending[stream] += text;

		const lines = pending[stream].split('\n');
		pending[stream] = lines.pop() ?? '';

		for (const rawLine of lines) {
			const line = rawLine.replace(/\r$/, '');
			if (!line) continue;

			const logLine = parseLogLine(line, stream);
			if (!logLine || logLine.timestamp === after) continue;

			queue.push(logLine);
		}
	};

	if (info.Config.Tty) {
		logStream.on('data', (chunk) => {
			pushText(chunk.toString('utf8'), 'stdout');
		});
	} else {
		const stdout = new PassThrough();
		const stderr = new PassThrough();

		stdout.on('data', (chunk) => {
			pushText(chunk.toString('utf8'), 'stdout');
		});

		stderr.on('data', (chunk) => {
			pushText(chunk.toString('utf8'), 'stderr');
		});

		container.modem.demuxStream(logStream, stdout, stderr);
	}

	logStream.on('error', (streamError) => {
		error = streamError;
		done = true;
	});

	logStream.on('end', () => {
		done = true;
	});

	logStream.on('close', () => {
		done = true;
	});

	while (!done || queue.length > 0) {
		const logLine = queue.shift();

		if (logLine) {
			yield logLine;
			continue;
		}

		if (error) {
			throw error;
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}
};

const parseLogLine = (rawLine: string, stream: 'stdout' | 'stderr'): LogLine | undefined => {
	const match = rawLine.match(/^(\S+)\s?(.*)$/);
	if (!match) return;

	return {
		id: crypto.randomUUID(),
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

const toDockerSince = (timestamp: string) => {
	if (!timestamp) return undefined;

	const normalized = timestamp.replace(/\.(\d{3})\d*Z$/, '.$1Z');
	const milliseconds = Date.parse(normalized);

	if (Number.isNaN(milliseconds)) return undefined;

	return Math.floor(milliseconds / 1000);
};

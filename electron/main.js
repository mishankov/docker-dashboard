import { app, BrowserWindow } from 'electron';
import { spawn } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';

const isDev = process.env.ELECTRON_MODE !== 'production';
const devUrl = 'http://127.0.0.1:5173';
const desktopUrl = 'http://127.0.0.1:51730';
let server;
let mainWindow;

function log(message, details = '') {
	const line = `[${new Date().toISOString()}] ${message}${details ? ` ${details}` : ''}\n`;
	console.log(line.trimEnd());
	appendFileSync(join(app.getPath('temp'), 'docker-dashboard-electron.log'), line);
}

async function waitForUrl(url) {
	for (let attempt = 0; attempt < 50; attempt += 1) {
		try {
			const response = await fetch(url);
			if (response.ok) return;
		} catch {
			// Server is still starting.
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	throw new Error(`Timed out waiting for ${url}`);
}

async function createWindow() {
	const url = isDev ? devUrl : desktopUrl;

	if (!isDev) {
		server = spawn('node', ['build/index.js'], {
			env: {
				...process.env,
				HOST: '127.0.0.1',
				PORT: '51730'
			},
			stdio: 'inherit'
		});

		await waitForUrl(url);
	}

	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800
	});

	mainWindow.on('closed', () => {
		mainWindow = undefined;
	});

	mainWindow.webContents.on('console-message', (event) => {
		log(`[renderer:${event.level}] ${event.message}`, `(${event.sourceId}:${event.lineNumber})`);
	});

	mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
		log('Failed to load', `${validatedURL}: ${errorCode} ${errorDescription}`);
	});

	mainWindow.webContents.on('did-finish-load', () => {
		log('Loaded', url);
	});

	mainWindow.webContents.on('render-process-gone', (_event, details) => {
		log('Renderer process gone', JSON.stringify(details));
	});

	log('Loading', url);
	await mainWindow.loadURL(url);

	if (isDev) {
		mainWindow.webContents.openDevTools({ mode: 'detach' });
	}
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	app.quit();
});

app.on('before-quit', () => {
	server?.kill();
});

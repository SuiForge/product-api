import { defineConfig } from '@playwright/test';

const port = 19088;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 30_000,
	expect: {
		timeout: 10_000,
	},
	fullyParallel: false,
	workers: 1,
	retries: 0,
	use: {
		baseURL,
		channel: 'chrome',
		headless: true,
		trace: 'on-first-retry',
	},
	webServer: {
		command: `bash -lc "npm run build:wallet-auth >/dev/null && PRODUCT_API_PORT=${port} PRODUCT_API_SESSION_SECRET=change-me-for-local-dev PRODUCT_API_SESSION_COOKIE_SECURE=false PRODUCT_API_PUBLIC_ORIGIN=${baseURL} go run ./cmd/server"`,
		url: `${baseURL}/health`,
		reuseExistingServer: true,
		timeout: 120_000,
	},
});

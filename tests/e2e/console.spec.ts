import { test, expect } from '@playwright/test';

const demoWalletAddress = '0x1111111111111111111111111111111111111111111111111111111111111111';

async function gotoConsole(page) {
	await page.goto('/console', { waitUntil: 'domcontentloaded' });
	await expect(page.getByRole('heading', { name: 'Google or Wallet Login' })).toBeVisible();
}

async function loginWithDemoFallback(page) {
	await gotoConsole(page);
	await page.locator('#workspace-login-form input[name="walletAddress"]').fill(demoWalletAddress);
	await page.getByRole('button', { name: 'Demo Fallback' }).click();
	await expect(page.locator('#workspace-session-result')).toContainText('authenticated');
}

test.describe('Console acceptance', () => {
	test('shows dual-auth shell and disabled Google state by default', async ({ page }) => {
		await gotoConsole(page);

		await expect(page.locator('#google-connection-badge')).toContainText('Google login unavailable');
		await expect(page.locator('#wallet-connection-badge')).toContainText('Wallet disconnected');
		await expect(page.locator('#console-app')).toHaveClass(/is-locked/);
	});

	test('demo fallback unlocks console and loads workspace walkthrough', async ({ page }) => {
		await loginWithDemoFallback(page);
		await expect(page.locator('#console-app')).toHaveClass(/is-active/);
		await expect(page.locator('#workspace-project')).not.toContainText('Waiting for data');
		await expect(page.locator('#step-workspace-status')).toContainText('Completed');
		await expect(page.getByRole('heading', { name: 'Monitor Builder' })).toBeVisible();
		await expect(page.locator('#monitor-rule-template')).toBeVisible();
		await expect(page.locator('#rule-templates-strip')).toContainText('Wallet Outflow');
		await expect(page.getByRole('heading', { name: 'Inspect Overview' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Review Alerts' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Open Replay' })).toBeVisible();
	});

	test('can create a monitor from a rule template', async ({ page }) => {
		await loginWithDemoFallback(page);
		await page.locator('#monitor-name').fill('Treasury Watch');
		await page.locator('#monitor-target-type').selectOption('wallet');
		await page.locator('#monitor-target-value').fill('0x2222222222222222222222222222222222222222222222222222222222222222');
		await page.locator('#monitor-rule-template').selectOption('wallet_outflow');
		await page.locator('#monitor-form button[type="submit"]').click();

		await expect(page.locator('#monitors-result')).toContainText('Monitor created');
		await expect(page.locator('#step-monitors-status')).toContainText('Completed');
		await expect(page.locator('#monitor-list')).toContainText('Treasury Watch');
	});


	test('can create a webhook destination and see configured routes', async ({ page }) => {
		await loginWithDemoFallback(page);
		await page.locator('#destination-form input[name="target"]').fill('https://ops.example.com/hook');
		await page.locator('#destination-form button[type="submit"]').click();

		await expect(page.locator('#destination-result')).toContainText('https://ops.example.com/hook');
		await expect(page.locator('#step-webhook-status')).toContainText('Completed');
		await expect(page.locator('#destination-list')).toContainText('https://ops.example.com/hook');
	});

	test('can send a test webhook and see delivery history', async ({ page }) => {
		await loginWithDemoFallback(page);
		await page.locator('#destination-form input[name="target"]').fill('https://example.com/hook');
		await page.locator('#destination-form button[type="submit"]').click();
		await page.getByRole('button', { name: 'Send Test Webhook' }).click();

		await expect(page.locator('#destination-result')).toContainText('delivered');
		await expect(page.locator('#delivery-list')).toContainText('risk_alert');
		await expect(page.locator('#delivery-list-meta')).toContainText('delivery');
	});

	test('can create an api key and see it in the key list', async ({ page }) => {
		await loginWithDemoFallback(page);
		await page.locator('#demo-key-form input[name="name"]').fill('ops-agent');
		await page.locator('#demo-key-form button[type="submit"]').click();

		await expect(page.locator('#demo-key-result')).toContainText('ops-agent');
		await expect(page.locator('#api-key-list')).toContainText('ops-agent');
		await expect(page.locator('#api-key-list-meta')).toContainText('key');
	});

	test('alerts flow can preload replay from a selected alert', async ({ page }) => {
		await loginWithDemoFallback(page);
		await expect(page.locator('#alerts-feed-meta')).toContainText('live alerts synced');
		await page.locator('#alerts-feed [data-alert-index="0"]').click();
		await expect(page.locator('#alerts-detail-meta')).toContainText('Selected alert');
		await expect(page.locator('#replay-evidence-id')).not.toHaveValue('');
		await page.getByRole('button', { name: 'Load Replay' }).click();

		await expect(page.locator('#replay-result')).toContainText('reasonCodes');
		await expect(page.locator('#replay-status')).not.toContainText('Ready');
	});

	test('logout re-locks the console', async ({ page }) => {
		await loginWithDemoFallback(page);
		await page.getByRole('button', { name: 'Log Out' }).click();

		await expect(page.locator('#console-app')).toHaveClass(/is-locked/);
		await expect(page.locator('#workspace-session-result')).toContainText('No active workspace session');
	});
});

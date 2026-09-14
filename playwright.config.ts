import { execFileSync } from 'node:child_process';
import { defineConfig, devices } from '@playwright/test';

/**
 * Asks the OS for an unused port by binding port 0 in a short-lived child
 * process, so the value is available synchronously while this config is built.
 *
 * The child writes with process.stdout.write and runs with colour disabled:
 * console.log(number) applies util.inspect styling, and Playwright sets
 * FORCE_COLOR in its worker processes, so an inherited environment turns the
 * port into "\x1b[33m49561\x1b[39m" and Number() yields NaN.
 */
function findFreePort(): number {
  const script =
    "const s = require('net').createServer();" +
    "s.listen(0, '127.0.0.1', () => { process.stdout.write(String(s.address().port)); s.close(); });";
  const raw = execFileSync(process.execPath, ['-e', script], {
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
  });
  const port = Number(raw.trim());
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Could not determine a free port for the test server (got ${JSON.stringify(raw)})`);
  }
  return port;
}

/**
 * Astro has no --strictPort: given an occupied port it binds the next one up
 * and prints the new number, while Playwright keeps polling the port it asked
 * for until the 60s webServer timeout. Picking an unused port keeps the suite
 * off whatever else is listening — 4321 is a common collision, and anything
 * answering there with a non-2xx/3xx status also defeats reuseExistingServer.
 *
 * Playwright re-evaluates this file in every worker process, so the chosen port
 * is published to the environment that workers inherit. Without that each
 * worker picks its own port and their baseURL no longer names the one server
 * webServer actually started. Set PLAYWRIGHT_PORT to pin it yourself.
 */
function testServerPort(): number {
  const pinned = Number(process.env.PLAYWRIGHT_PORT);
  if (Number.isInteger(pinned) && pinned > 0) {
    return pinned;
  }
  const port = findFreePort();
  process.env.PLAYWRIGHT_PORT = String(port);
  return port;
}

const PORT = testServerPort();

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});

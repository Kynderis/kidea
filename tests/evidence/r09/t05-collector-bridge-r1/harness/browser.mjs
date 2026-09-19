import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire('/web/package.json');
const { chromium } = require('playwright');

const base = 'https://observer.test:8443';
const checks = [];
const consoleErrors = [];
let browser;
let context;
let page;
let controlId = 0;
const check = (id, details = {}) => {
  checks.push({ id, status: 'PASS', ...details });
  fs.writeFileSync('/out/progress.json', JSON.stringify(checks));
};
const adminCookie = [{ name: '__Host-workshop_observer', value: 'A'.repeat(48), url: base, secure: true, httpOnly: true, sameSite: 'Strict' }];
const participantCookie = [{ ...adminCookie[0], value: 'P'.repeat(48) }];
async function snapshot() {
  const response = await context.request.get(`${base}/api/observation`);
  assert.equal(response.status(), 200);
  return response.json();
}
async function waitView(predicate, timeout = 20000) {
  const started = Date.now();
  let latest;
  while (Date.now() - started < timeout) {
    try { latest = await snapshot(); if (predicate(latest)) return latest; } catch { /* owned restart */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`VIEW_TIMEOUT ${JSON.stringify(latest)}`);
}
async function control(action) {
  const request = { id: ++controlId, action, atMs: Date.now() };
  fs.writeFileSync('/out/control-request.json', JSON.stringify(request));
  for (let attempt = 0; attempt < 200; attempt++) {
    const file = `/out/control-result-${request.id}.json`;
    if (fs.existsSync(file)) {
      const result = JSON.parse(fs.readFileSync(file));
      assert.equal(result.action, action);
      assert.equal(result.status, 'DONE');
      return result;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('CONTROL_TIMEOUT');
}

try {
  browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  context = await browser.newContext({ viewport: { width: 360, height: 900 } });
  page = await context.newPage();
  page.on('pageerror', error => consoleErrors.push(error.message));
  assert.equal((await context.request.get(`${base}/operations`)).status(), 403);
  await context.addCookies(participantCookie);
  assert.equal((await context.request.get(`${base}/operations`, { headers: { 'x-role': 'admin' } })).status(), 403);
  check('COLLECTOR-CHROME-GUEST-AND-FORGED-ROLE-DENIED');
  await context.clearCookies();
  await context.addCookies(adminCookie);
  await page.goto(`${base}/operations`);
  await page.waitForSelector('#data');
  const observed = await waitView(value => value.sources.fast.current && value.sources.slow.current && value.probes.application?.ok && value.probes.dashboard?.ok);
  assert.equal(observed.sources.fast.last.M1.state, 'BOUNDED');
  assert.equal(observed.sources.fast.last.M1.pending, 1);
  assert.equal(observed.sources.fast.last.M2.state, 'PARTIAL');
  assert.equal(observed.sources.fast.last.M3.state, 'UNKNOWN');
  assert.equal(observed.sources.fast.last.M7.state, 'UNKNOWN');
  assert.equal(observed.sources.slow.last.M8.state, 'UNKNOWN');
  assert.equal(observed.sources.slow.last.M9.state, 'UNKNOWN');
  assert.equal(observed.eligibility.writeReady, false);
  assert.equal(observed.eligibility.observationReady, false);
  check('COLLECTOR-CHROME-REAL-SCHEMA2-UNKNOWN-PRESERVED');
  const denied = await context.request.get('https://source.test:8444/internal/observer/sample/fast', { headers: { 'x-observer-nonce': 'browser_denied' } });
  assert.equal(denied.status(), 403);
  check('COLLECTOR-CHROME-NO-COLLECTOR-CREDENTIAL');
  const critical = await waitView(value => value.incidents['M1:pending']?.level === 'CRITICAL', 45000);
  const firstSeenMs = critical.incidents['M1:pending'].firstSeenMs;
  await page.locator('#refresh').click();
  await page.waitForFunction(() => document.getElementById('data').textContent.includes('M1:pending — Nghiêm trọng'), undefined, { timeout: 6000 });
  await page.screenshot({ path: '/out/critical-360.png', fullPage: true });
  check('COLLECTOR-CHROME-REAL-PENDING-AGE-CRITICAL', { firstSeenMs });
  const initial = JSON.parse(fs.readFileSync('/backend-out/initial-sample.json', 'utf8'));
  const restarted = await control('RESTART_BACKEND');
  assert.notEqual(restarted.boot, initial.boot);
  const afterRestart = await waitView(value => value.sources.fast.current && value.incidents['M1:pending']?.firstSeenMs === firstSeenMs, 15000);
  assert.equal(afterRestart.conclusion, 'CRITICAL');
  check('COLLECTOR-CHROME-BOOT-CHANGE-CRITICAL-HISTORY-PRESERVED', { initialBoot: initial.boot, restartedBoot: restarted.boot });
  await control('STOP_BACKEND');
  const stale = await waitView(value => !value.sources.fast.current, 12000);
  assert.equal(stale.conclusion, 'CRITICAL');
  assert.equal(stale.incidents['M1:pending'].firstSeenMs, firstSeenMs);
  await page.locator('#refresh').click();
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('lỗi nghiêm trọng'), undefined, { timeout: 6000 });
  check('COLLECTOR-CHROME-SOURCE-DOWN-NO-FALSE-GREEN');
  await control('REVOKE_ADMIN');
  await page.waitForFunction(() => document.getElementById('data').textContent === '' && document.getElementById('initial').textContent === '', undefined, { timeout: 8000 });
  assert.equal((await context.request.get(`${base}/operations`)).status(), 403);
  check('COLLECTOR-CHROME-SESSION-REVOCATION-CLEARS');
  assert.deepEqual(consoleErrors, []);
  fs.writeFileSync('/out/result.json', JSON.stringify({ status: 'PASS', checks, consoleErrors, scope: 'Actual C++ collector through private Caddy TLS into observer and Chrome on one Docker/Mac. Dashboard probe remains a declared fixture. No independent-host, backup, WQ, Human oncall, admission or release claim.' }, null, 2));
} catch (error) {
  fs.writeFileSync('/out/result.json', JSON.stringify({ status: 'FAIL', error: error.stack, checks, consoleErrors }, null, 2));
  if (page) {
    try { await page.screenshot({ path: '/out/failure.png', fullPage: true }); fs.writeFileSync('/out/failure.html', await page.content()); } catch { /* retain original failure */ }
  }
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
}

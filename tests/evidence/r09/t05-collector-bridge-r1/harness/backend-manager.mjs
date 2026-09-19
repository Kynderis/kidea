import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';

const token = fs.readFileSync('/config/collector-token', 'utf8');
const authorization = `Bearer ${token}`;
let child = null;
let closing = false;
let generation = 0;

function run(args) {
  const result = spawnSync('/backend', args, { encoding: 'utf8', timeout: 15000 });
  fs.appendFileSync('/out/manager.jsonl', `${JSON.stringify({ atMs: Date.now(), kind: 'RUN', args, code: result.status, stdout: result.stdout, stderr: result.stderr })}\n`);
  assert.equal(result.status, 0);
}

async function request(path, options = {}) {
  const response = await fetch(`http://127.0.0.1:8080${path}`, { signal: AbortSignal.timeout(2000), ...options });
  const text = await response.text();
  return { status: response.status, headers: Object.fromEntries(response.headers), body: text ? JSON.parse(text) : null };
}

async function ready() {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const response = await request('/internal/observer/probe/application', { headers: { authorization } });
      if (response.status === 200 && response.body?.status === 'READ_READY') return;
    } catch { /* bounded startup polling */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('BACKEND_READY_TIMEOUT');
}

function start() {
  child = spawn('/backend', ['--serve-observed-component-fixture', '/out/workshop.sqlite', '/config/collector-token'], { stdio: ['ignore', 'inherit', 'inherit'] });
  fs.appendFileSync('/out/manager.jsonl', `${JSON.stringify({ atMs: Date.now(), kind: 'START', pid: child.pid })}\n`);
  const owned = child;
  owned.on('exit', (code, signal) => fs.appendFileSync('/out/manager.jsonl', `${JSON.stringify({ atMs: Date.now(), kind: 'EXIT', pid: owned.pid, code, signal })}\n`));
}

async function stop(signal = 'SIGTERM') {
  if (!child) return;
  const owned = child;
  if (owned.exitCode === null && owned.signalCode === null) {
    owned.kill(signal);
    await new Promise(resolve => owned.once('exit', resolve));
  }
  child = null;
}

async function rawSample(nonce) {
  const response = await request('/internal/observer/sample/fast', { headers: { authorization, 'x-observer-nonce': nonce } });
  assert.equal(response.status, 200);
  assert.equal(response.body.schema, 2);
  assert.equal(response.body.source, 'backend_fast');
  assert.equal(response.body.nonce, nonce);
  assert.equal(response.body.signals.M1.pending, 1);
  return response.body;
}

const seed = JSON.parse(fs.readFileSync('/fixture/seed.json', 'utf8'));
for (const session of seed.sessions) session.expires = Math.floor(Date.now() / 1000) + 600;
fs.writeFileSync('/out/seed.json', JSON.stringify(seed), { mode: 0o600, flag: 'wx' });
run(['--initialize', '/out/workshop.sqlite', '/fixture/001.sql', '/out/seed.json']);
const fixtureAtMs = Date.now();
const fixtureScript = `
import sqlite3,sys
db=sqlite3.connect(sys.argv[1],timeout=2)
db.execute("PRAGMA foreign_keys=ON")
db.execute("INSERT INTO workshops VALUES(?,?,?,?,?,?,?,?,?,?)",('COLLECTOR-W','Collector integration fixture','Owned synthetic fixture',10,'2026-10-01T09:00:00+07:00','2026-10-01T10:00:00+07:00',1,'0','DRAFT','v1'))
db.execute("INSERT INTO outbox(epoch,workshop,version,completed) VALUES(?,?,?,0)",('epoch-t02-fixture','COLLECTOR-W','v1'))
event=db.execute("SELECT id FROM outbox").fetchone()[0]
at=int(sys.argv[2])
db.execute("INSERT INTO outbox_timing(outbox_id,transaction_at_ms,first_observed_at_ms) VALUES(?,?,?)",(event,at-40000,at-39000))
db.execute("DROP TRIGGER registration_capacity")
db.executemany("INSERT INTO registrations VALUES(?,?,?,'ACTIVE')",[(f'COLLECTOR-R{i}',f'COLLECTOR-A{i}','COLLECTOR-W') for i in range(11)])
db.commit();db.close()
`;
const fixture = spawnSync('/usr/bin/python3', ['-c', fixtureScript, '/out/workshop.sqlite', String(fixtureAtMs)], { encoding: 'utf8', timeout: 15000 });
fs.appendFileSync('/out/manager.jsonl', `${JSON.stringify({ atMs: Date.now(), kind: 'FIXTURE', code: fixture.status, stdout: fixture.stdout, stderr: fixture.stderr, ownedDatabaseOnly: true })}\n`);
assert.equal(fixture.status, 0);
start();
await ready();
const initial = await rawSample('initial_probe');
fs.writeFileSync('/out/initial-sample.json', JSON.stringify(initial, null, 2));
fs.writeFileSync('/out/backend-ready.json', JSON.stringify({ atMs: Date.now(), boot: initial.boot, sequence: initial.sequence, pending: initial.signals.M1.pending }));

const timer = setInterval(() => {
  if (closing) return;
  const file = '/control/backend.json';
  if (!fs.existsSync(file)) return;
  let request;
  try { request = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return; }
  if (request.generation <= generation) return;
  generation = request.generation;
  void (async () => {
    assert.ok(['RESTART', 'STOP'].includes(request.action));
    await stop();
    let sample = null;
    if (request.action === 'RESTART') {
      start();
      await ready();
      sample = await rawSample(`restart_${generation}`);
    }
    fs.writeFileSync(`/out/control-${generation}.json`, JSON.stringify({ generation, action: request.action, atMs: Date.now(), boot: sample?.boot ?? null, sequence: sample?.sequence ?? null }), { flag: 'wx' });
  })().catch(error => {
    fs.appendFileSync('/out/manager.jsonl', `${JSON.stringify({ atMs: Date.now(), kind: 'ERROR', message: error.message })}\n`);
    process.exitCode = 1;
  });
}, 100);

async function close() {
  if (closing) return;
  closing = true;
  clearInterval(timer);
  await stop();
}
process.on('SIGTERM', () => void close().then(() => process.exit()));
process.on('SIGINT', () => void close().then(() => process.exit()));

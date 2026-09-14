import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, lstatSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const pwsh = 'C:/Users/vuhoa/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
const script = fileURLToPath(new URL('oplock-probe.ps1', import.meta.url));
const expected = '362a356ce7f0940ec74f73a8fc2c990a2cc24a38a11c90bbd8eca947110ad139';
assert.equal(process.platform, 'win32'); assert.equal(process.version, 'v24.21.0');
assert.equal(createHash('sha256').update(readFileSync(pwsh)).digest('hex'), expected);
const output = path.join(repo, '.test-output/r02-t06'); mkdirSync(output, { recursive: true });
const runRoot = mkdtempSync(path.join(output, 'oplock-'));
console.log(`Oplock probe evidence: ${runRoot}`);
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
writeFileSync(path.join(runRoot, 'environment.json'), JSON.stringify({ startedAt: new Date().toISOString(),
  node: process.version, nodePath: process.execPath, powershell: pwsh, powershellSha256: expected,
  sources: ['native-lock-probe.cs', 'oplock-probe.cs', 'oplock-probe.ps1', 'oplock.test.mjs'].map(name => ({
    name, sha256: hash(new URL(name, import.meta.url)),
  })), scope: 'Only RWH/hardlink and RH/reparse counterexamples with attribute-handle timing; not a writer',
}, null, 2), { flag: 'wx' });
let sequence = 0;

function start(request) {
  const id = String(++sequence).padStart(3, '0'), requestPath = path.join(runRoot, `${id}-request.json`);
  writeFileSync(requestPath, JSON.stringify(request, null, 2), { flag: 'wx' });
  const child = spawn(pwsh, ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', script, '-RequestPath', requestPath],
    { cwd: repo, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const events = [], listeners = new Map();
  let stdout = '', stderr = '', pending = '', finished = false;
  const timer = setTimeout(() => child.kill(), 30000);
  child.stdout.on('data', chunk => {
    stdout += chunk; pending += chunk;
    while (pending.includes('\n')) {
      const end = pending.indexOf('\n'), line = pending.slice(0, end).trim(); pending = pending.slice(end + 1);
      try { const event = JSON.parse(line); events.push(event); listeners.get(event.event)?.resolve(event); }
      catch { /* Retained raw compiler/startup output is diagnostic evidence. */ }
    }
  });
  child.stderr.on('data', chunk => { stderr += chunk; });
  const done = new Promise(resolve => {
    child.on('error', error => { stderr += String(error); });
    child.on('close', (code, signal) => {
      clearTimeout(timer); finished = true;
      const result = { id, pid: child.pid, code, signal, events, stdout, stderr };
      writeFileSync(path.join(runRoot, `${id}-result.json`), JSON.stringify(result, null, 2), { flag: 'wx' });
      for (const [name, listener] of listeners) if (!events.some(e => e.event === name)) listener.reject(new Error(JSON.stringify(result)));
      resolve(result);
    });
  });
  return { done, events, event(name) {
    const found = events.find(event => event.event === name);
    if (found) return Promise.resolve(found);
    if (finished) return Promise.reject(new Error(`Process closed without ${name}: ${JSON.stringify(events)}`));
    return new Promise((resolve, reject) => listeners.set(name, { resolve, reject }));
  } };
}

async function probe(label, operation, directory) {
  const caseRoot = mkdtempSync(path.join(runRoot, `${label}-`));
  const target = path.join(caseRoot, directory ? 'empty-directory' : 'source.txt');
  if (directory) mkdirSync(target); else writeFileSync(target, 'OPLOCK ORIGINAL\r\n', { flag: 'wx' });
  const destination = path.join(caseRoot, directory ? 'destination' : 'alias.txt');
  if (directory) {
    mkdirSync(destination);
    writeFileSync(path.join(destination, 'sentinel.txt'), 'DESTINATION ORIGINAL\r\n', { flag: 'wx' });
  }
  const releaseFile = path.join(caseRoot, 'release.signal'), startFile = path.join(caseRoot, 'start.signal');
  const contenderRequest = { action: 'contender', path: target, other: destination, operation, startFile };
  let contender, owner, state, completeBeforeRelease, contenderResult, ownerResult, failure;
  try {
    if (operation === 'attributes-before') {
      contender = start(contenderRequest); await contender.event('armed');
    }
    owner = start({ action: 'owner', path: target, directory, releaseFile });
    const ready = await owner.event('ready');
    assert.equal(ready.grantError, 997, JSON.stringify(ready));
    assert.equal(ready.state.Metadata.ReparsePoint, false);
    if (!contender) contender = start(contenderRequest);
    if (operation === 'attributes-before') writeFileSync(startFile, 'start\n', { flag: 'wx' });
    const started = await contender.event('started');
    assert.notEqual(ready.pid, started.pid);
    const race = await Promise.race([contender.done.then(result => ({ complete: true, result })),
      delay(750).then(() => ({ complete: false }))]);
    completeBeforeRelease = race.complete;
    if (race.complete) contenderResult = race.result;
    state = { requestedLevel: ready.requestedLevel, ready, started, completeBeforeRelease,
      namespaceChangedBeforeRelease: directory ? lstatSync(target).isSymbolicLink() : existsSync(destination),
      observedBeforeRelease: owner.events.filter(event => event.event === 'break'),
      releaseSignalAt: new Date().toISOString() };
  } catch (error) { failure = error; }
  finally {
    writeFileSync(releaseFile, 'release\n', { flag: 'wx' });
    if (operation === 'attributes-before' && !existsSync(startFile)) writeFileSync(startFile, 'start\n', { flag: 'wx' });
    if (owner) ownerResult = await owner.done;
    if (contender) contenderResult = await contender.done;
    const report = { label, operation, state, owner: ownerResult, contender: contenderResult,
      setupFailure: failure?.stack ?? null,
      bytesAfter: directory ? readFileSync(path.join(destination, 'sentinel.txt'), 'utf8') : readFileSync(target, 'utf8') };
    writeFileSync(path.join(caseRoot, 'comparison.json'), JSON.stringify(report, null, 2), { flag: 'wx' });
  }
  if (failure) throw failure;
  assert.equal(ownerResult.code, 0, JSON.stringify(ownerResult));
  assert.equal(contenderResult.code, 0, JSON.stringify(contenderResult));
  assert.equal(ownerResult.events.at(-1).completionSignaled, true, JSON.stringify(ownerResult));
  const completed = contenderResult.events.find(event => event.event === 'completed');
  assert.ok(completed, JSON.stringify(contenderResult));
  // Do not turn an advisory notification into a successful protection result.
  assert.equal(completeBeforeRelease, false, `COUNTEREXAMPLE: contender completed before owner close: ${JSON.stringify(state)}; ${JSON.stringify(completed)}`);
  assert.equal(state.namespaceChangedBeforeRelease, false);
  const broken = ownerResult.events.find(event => event.event === 'break');
  assert.ok(broken?.state.AckRequired, JSON.stringify(ownerResult));
  assert.equal(completed.result.Succeeded, true, JSON.stringify(completed));
  if (directory) assert.equal(readFileSync(path.join(destination, 'sentinel.txt'), 'utf8'), 'DESTINATION ORIGINAL\r\n');
  else { assert.equal(readFileSync(target, 'utf8'), 'OPLOCK ORIGINAL\r\n'); assert.equal(readFileSync(destination, 'utf8'), 'OPLOCK ORIGINAL\r\n'); }
}

test('RWH target: CreateHardLinkW cannot complete before owner close', { timeout: 45000 }, () => probe('rwh-hardlink', 'hardlink', false));
test('RH directory: GENERIC_WRITE SET_REPARSE cannot complete before owner close', { timeout: 45000 }, () => probe('rh-junction', 'set-junction', true));
test('RH directory: WRITE_ATTRIBUTES handle opened before grant cannot mutate before close', { timeout: 45000 }, () => probe('rh-attributes-before', 'attributes-before', true));
test('RH directory: WRITE_ATTRIBUTES handle opened after grant cannot mutate before close', { timeout: 45000 }, () => probe('rh-attributes-after', 'attributes-after', true));

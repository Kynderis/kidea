// Run with the already approved Node executable. Retain every request/result and
// fixture, including failures. This does not exercise the production writer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync,
  linkSync, symlinkSync, lstatSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const script = fileURLToPath(new URL('./native-lock-probe.ps1', import.meta.url));
const pwsh = 'C:/Users/vuhoa/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
const expectedHash = '362a356ce7f0940ec74f73a8fc2c990a2cc24a38a11c90bbd8eca947110ad139';
assert.equal(process.platform, 'win32', 'Windows-only feasibility probe');
assert.equal(process.version, 'v24.21.0', 'Use the approved Node binary');
assert.equal(createHash('sha256').update(readFileSync(pwsh)).digest('hex'), expectedHash);

const output = path.join(repo, '.test-output', 'r02-t06');
mkdirSync(output, { recursive: true });
const runRoot = mkdtempSync(path.join(output, 'native-lock-'));
let sequence = 0;
const outcomes = [];
writeFileSync(path.join(runRoot, 'environment.json'), JSON.stringify({
  startedAt: new Date().toISOString(), node: process.version, nodePath: process.execPath,
  powershell: pwsh, powershellSha256: expectedHash,
  sources: ['native-lock-probe.ps1', 'native-lock-probe.cs', 'native-lock.test.mjs'].map(name => ({
    name, sha256: createHash('sha256').update(readFileSync(new URL(name, import.meta.url))).digest('hex'),
  })),
  scope: 'Synthetic native locking probe only; not writer acceptance or all-races proof',
}, null, 2));
console.log(`Native lock probe evidence: ${runRoot}`);

function fixture(label) {
  const directory = mkdtempSync(path.join(runRoot, `${label}-`));
  return { directory, file(name, content = `ORIGINAL ${label} ${name}\r\n`) {
    const location = path.join(directory, name);
    mkdirSync(path.dirname(location), { recursive: true });
    writeFileSync(location, content, { flag: 'wx' });
    return location;
  } };
}
function bytes(file) { return readFileSync(file).toString('hex'); }
function record(label, value) {
  outcomes.push({ label, ...value });
  writeFileSync(path.join(runRoot, 'observations.json'), JSON.stringify(outcomes, null, 2));
}

function start(request) {
  const id = String(++sequence).padStart(3, '0');
  const requestPath = path.join(runRoot, `${id}-request.json`);
  writeFileSync(requestPath, JSON.stringify(request, null, 2), { flag: 'wx' });
  const child = spawn(pwsh, ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', script,
    '-RequestPath', requestPath], { cwd: repo, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '', stderr = '', lines = '', settled = false;
  const events = [];
  let readyResolve, readyReject;
  const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
  // A contender does not emit ready; consume its rejection to avoid an unhandled promise.
  ready.catch(() => {});
  child.stdout.on('data', chunk => {
    const text = chunk.toString(); stdout += text; lines += text;
    while (lines.includes('\n')) {
      const position = lines.indexOf('\n'), line = lines.slice(0, position).trim();
      lines = lines.slice(position + 1);
      if (!line) continue;
      try {
        const event = JSON.parse(line); events.push(event);
        if (event.event === 'ready') { settled = true; readyResolve(event); }
      } catch { /* Compiler/startup errors remain verbatim in the retained logs. */ }
    }
  });
  child.stderr.on('data', chunk => { stderr += chunk.toString(); });
  const timeout = setTimeout(() => child.kill(), 35000);
  const done = new Promise(resolve => {
    child.on('error', error => { stderr += String(error); });
    child.on('close', (code, signal) => {
      clearTimeout(timeout);
      const result = { id, code, signal, pid: child.pid, events, stdout, stderr };
      writeFileSync(path.join(runRoot, `${id}-result.json`), JSON.stringify(result, null, 2), { flag: 'wx' });
      if (!settled) readyReject(new Error(`Holder not ready: ${JSON.stringify(result)}`));
      resolve(result);
    });
  });
  return { child, ready, done };
}

async function attempts(items) {
  const result = await start({ action: 'attempt', items }).done;
  assert.equal(result.code, 0, JSON.stringify(result));
  assert.equal(result.stderr, '', JSON.stringify(result));
  const event = result.events.find(item => item.event === 'results');
  assert.ok(event, JSON.stringify(result));
  return { ...event, process: result };
}

async function withHolder(items, operation) {
  const releaseFile = path.join(runRoot, `release-${sequence + 1}.signal`);
  const holder = start({ action: 'hold', items, releaseFile });
  let ready;
  try { ready = await holder.ready; return await operation(ready); }
  finally {
    writeFileSync(releaseFile, 'release\n', { flag: 'wx' });
    const result = await holder.done;
    assert.equal(result.code, 0, JSON.stringify(result));
    assert.equal(result.stderr, '', JSON.stringify(result));
    record(`holder-${result.id}`, { before: ready, final: result.events.find(e => e.event === 'released') });
  }
}

function blocked(result, expectedErrors = [32]) {
  assert.equal(result.Succeeded, false, JSON.stringify(result));
  assert.ok(expectedErrors.includes(result.Error), JSON.stringify(result));
}
function success(result) { assert.equal(result.Succeeded, true, JSON.stringify(result)); }

test('two-process exclusive handles block read/write/delete/rename/replacement; bytes unchanged', { timeout: 50000 }, async () => {
  const f = fixture('exclusive');
  const operations = ['read', 'write', 'delete', 'rename', 'replace-move', 'replace-api'];
  const cases = operations.map(operation => ({ operation, path: f.file(`${operation}.txt`),
    ...(operation === 'rename' ? { other: path.join(f.directory, 'renamed.txt') } : {}),
    ...(operation.startsWith('replace-') ? { other: f.file(`${operation}-incoming.txt`, 'REPLACEMENT\n') } : {}) }));
  const originals = new Map(cases.flatMap(item => [item.path, ...(item.operation.startsWith('replace-') ? [item.other] : [])]).map(file => [file, bytes(file)]));
  await withHolder(cases.map(item => ({ kind: 'target', path: item.path })), async ready => {
    const contender = await attempts(cases);
    assert.notEqual(contender.pid, ready.pid);
    contender.results.forEach(result => blocked(result, result.Operation.startsWith('replace-') ? [32, 5] : [32]));
    record('exclusive-contender', contender);
  });
  for (const [file, before] of originals) assert.equal(bytes(file), before, file);
  assert.equal(existsSync(cases.find(item => item.operation === 'rename').other), false);
  // Same native operations must actually work once the lock is gone.
  const control = await attempts(cases);
  control.results.forEach(success);
  record('exclusive-after-release-positive-controls', control);
});

test('share-read input permits another reader but blocks write/delete/rename/exclusive', { timeout: 50000 }, async () => {
  const f = fixture('input'), file = f.file('source.txt'), before = bytes(file);
  await withHolder([{ kind: 'input', path: file }], async ready => {
    const result = await attempts(['read', 'write', 'delete', 'rename', 'exclusive'].map(operation => ({
      operation, path: file, ...(operation === 'rename' ? { other: path.join(f.directory, 'renamed.txt') } : {}),
    })));
    assert.notEqual(result.pid, ready.pid);
    success(result.results[0]); result.results.slice(1).forEach(item => blocked(item));
    assert.equal(bytes(file), before);
    record('input-contender', result);
  });
  assert.equal(bytes(file), before);
});

test('existing permissive writer prevents exclusive and share-read acquisition', { timeout: 50000 }, async () => {
  const f = fixture('existing-writer'), file = f.file('source.txt'), before = bytes(file);
  await withHolder([{ kind: 'existing-writer', path: file }], async () => {
    const result = await attempts([{ operation: 'exclusive', path: file }]);
    blocked(result.results[0]);
    const failedInput = await start({ action: 'hold', items: [{ kind: 'input', path: file }],
      releaseFile: path.join(f.directory, 'unused.signal') }).done;
    assert.equal(failedInput.code, 1, JSON.stringify(failedInput));
    assert.equal(failedInput.events.at(-1).error, 32, JSON.stringify(failedInput));
    record('existing-writer-prevents-input', failedInput);
  });
  assert.equal(bytes(file), before);
});

test('held parent and ancestor directories reject rename, then allow rename after release', { timeout: 50000 }, async () => {
  const f = fixture('parents'), file = f.file('ancestor/parent/source.txt'), before = bytes(file);
  const parent = path.dirname(file), ancestor = path.dirname(parent);
  await withHolder([{ kind: 'target', path: file }], async ready => {
    const result = await attempts([parent, ancestor].map(target => ({ operation: 'rename', path: target, other: `${target}-moved` })));
    assert.notEqual(result.pid, ready.pid);
    result.results.forEach(item => blocked(item, [32, 5]));
    record('ancestor-rename-blocked', result);
  });
  assert.equal(bytes(file), before);
  const control = await attempts([{ operation: 'rename', path: ancestor, other: `${ancestor}-moved` }]);
  success(control.results[0]);
  assert.equal(bytes(path.join(`${ancestor}-moved`, 'parent/source.txt')), before);
});

test('CREATE_NEW refuses occupied name without truncation; creates only absent name', { timeout: 50000 }, async () => {
  const f = fixture('create'), occupied = f.file('occupied.txt'), before = bytes(occupied), fresh = path.join(f.directory, 'fresh.txt');
  const result = await attempts([{ operation: 'create-new', path: occupied }, { operation: 'create-new', path: fresh }]);
  blocked(result.results[0], [80]); success(result.results[1]);
  assert.equal(bytes(occupied), before);
  assert.equal(readFileSync(fresh, 'utf8'), 'CREATE_NEW CONTENT\n');
  const retry = await attempts([{ operation: 'create-new', path: fresh }]);
  blocked(retry.results[0], [80]);
  assert.equal(readFileSync(fresh, 'utf8'), 'CREATE_NEW CONTENT\n');
});

test('existing hard links are identified through handle and rejected without byte changes', { timeout: 50000 }, async () => {
  const f = fixture('hardlink-existing'), file = f.file('source.txt'), alias = path.join(f.directory, 'alias.txt');
  linkSync(file, alias);
  const before = bytes(file);
  const metadata = await attempts([{ operation: 'metadata', path: file }, { operation: 'metadata', path: alias }]);
  metadata.results.forEach(success);
  assert.equal(metadata.results[0].Metadata.NumberOfLinks, 2);
  assert.equal(metadata.results[0].Metadata.FileId, metadata.results[1].Metadata.FileId);
  const rejected = await start({ action: 'hold', items: [{ kind: 'target', path: file }], releaseFile: path.join(f.directory, 'unused.signal') }).done;
  assert.equal(rejected.code, 1, JSON.stringify(rejected));
  assert.match(rejected.events.at(-1).message, /MULTIPLE_LINKS_REJECTED/);
  assert.equal(bytes(file), before); assert.equal(bytes(alias), before);
  record('hardlink-rejected', { metadata, rejected });
});

test('junction ancestor is identified through no-follow directory handle and rejected', { timeout: 50000 }, async () => {
  const f = fixture('junction'), file = f.file('actual/source.txt'), junction = path.join(f.directory, 'junction');
  symlinkSync(path.dirname(file), junction, 'junction');
  assert.ok(lstatSync(junction).isSymbolicLink());
  const before = bytes(file);
  const metadata = await attempts([{ operation: 'metadata', path: junction }]);
  success(metadata.results[0]); assert.equal(metadata.results[0].Metadata.ReparsePoint, true);
  const rejected = await start({ action: 'hold', items: [{ kind: 'target', path: path.join(junction, 'source.txt') }],
    releaseFile: path.join(f.directory, 'unused.signal') }).done;
  assert.equal(rejected.code, 1, JSON.stringify(rejected));
  assert.match(rejected.events.at(-1).message, /REPARSE_POINT_REJECTED/);
  assert.equal(bytes(file), before);
  record('junction-rejected', { metadata, rejected });
});

test('required boundary: baseline exclusive handle must prevent new hard links (counterexample retained)', { timeout: 50000 }, async () => {
  const f = fixture('hardlink-during'), file = f.file('source.txt'), aliasDirectory = path.join(f.directory, 'aliases');
  mkdirSync(aliasDirectory);
  const alias = path.join(aliasDirectory, 'new-link.txt'), before = bytes(file);
  let hardlinkResult;
  await withHolder([{ kind: 'target', path: file }], async ready => {
    const result = await attempts([{ operation: 'hardlink', path: file, other: alias }, { operation: 'metadata', path: file }]);
    assert.notEqual(ready.pid, result.pid);
    success(result.results[1]); hardlinkResult = result.results[0];
    if (result.results[0].Succeeded) {
      assert.equal(result.results[1].Metadata.NumberOfLinks, 2);
      const aliasWrite = await attempts([{ operation: 'write', path: alias }, { operation: 'rename', path: alias, other: `${alias}-moved` }]);
      blocked(aliasWrite.results[0]);
      record('hardlink-created-during-lock', { result, aliasWrite, conclusion: 'Link count/namespace changed under exclusive handle; content remained blocked. Alias rename result is recorded separately. Baseline does not meet the namespace boundary.' });
    } else {
      assert.equal(result.results[1].Metadata.NumberOfLinks, 1);
      record('hardlink-creation-blocked-during-lock', result);
    }
  });
  assert.equal(bytes(file), before);
  if (existsSync(alias)) assert.equal(bytes(alias), before);
  if (existsSync(`${alias}-moved`)) assert.equal(bytes(`${alias}-moved`), before);
  assert.equal(hardlinkResult.Succeeded, false, 'COUNTEREXAMPLE: baseline READ|WRITE/share0 allowed a new hard link');
});

test('DELETE-access variant blocks target contenders including new hardlink', { timeout: 50000 }, async () => {
  const f = fixture('target-delete'), file = f.file('source.txt'), before = bytes(file);
  const replacementMove = f.file('incoming-move.txt', 'MOVE REPLACEMENT\n');
  const replacementApi = f.file('incoming-api.txt', 'API REPLACEMENT\n');
  const alias = path.join(f.directory, 'alias.txt');
  await withHolder([{ kind: 'target-delete', path: file }], async ready => {
    const result = await attempts([
      ...['read', 'write', 'delete', 'exclusive'].map(operation => ({ operation, path: file })),
      { operation: 'rename', path: file, other: `${file}-moved` },
      { operation: 'replace-move', path: file, other: replacementMove },
      { operation: 'replace-api', path: file, other: replacementApi },
      { operation: 'hardlink', path: file, other: alias },
      { operation: 'metadata', path: file },
    ]);
    assert.notEqual(ready.pid, result.pid);
    record('delete-access-target-contenders', result);
    result.results.slice(0, -1).forEach(item => blocked(item, [32, 5]));
    success(result.results.at(-1));
    assert.equal(result.results.at(-1).Metadata.NumberOfLinks, 1);
  });
  assert.equal(bytes(file), before);
  assert.equal(readFileSync(replacementMove, 'utf8'), 'MOVE REPLACEMENT\n');
  assert.equal(readFileSync(replacementApi, 'utf8'), 'API REPLACEMENT\n');
  assert.equal(existsSync(alias), false);
  const control = await attempts([{ operation: 'hardlink', path: file, other: alias }]);
  success(control.results[0]); assert.equal(bytes(alias), before);
});

test('DELETE-access input variant allows compatible reader and blocks mutation/hardlink', { timeout: 50000 }, async () => {
  const f = fixture('input-delete'), file = f.file('source.txt'), before = bytes(file), alias = path.join(f.directory, 'alias.txt');
  await withHolder([{ kind: 'input-delete', path: file }], async ready => {
    const result = await attempts([
      ...['read', 'read-share-read', 'write', 'delete', 'exclusive'].map(operation => ({ operation, path: file })),
      { operation: 'hardlink', path: file, other: alias }, { operation: 'metadata', path: file },
    ]);
    assert.notEqual(ready.pid, result.pid); record('delete-access-input-contenders', result);
    success(result.results[0]);
    // An existing DELETE accessor requires a subsequent reader to share DELETE.
    result.results.slice(1, -1).forEach(item => blocked(item, [32, 5]));
    success(result.results.at(-1)); assert.equal(result.results.at(-1).Metadata.NumberOfLinks, 1);
    assert.equal(bytes(file), before);
  });
  assert.equal(bytes(file), before); assert.equal(existsSync(alias), false);
});

test('observe direct conversion of held directories to junctions; retain actual result', { timeout: 50000 }, async () => {
  const f = fixture('junction-during'), destinationFile = f.file('destination/source.txt'), before = bytes(destinationFile);
  const scenarios = ['empty', 'nonempty', 'deny-write'];
  for (const scenario of scenarios) {
    const directory = path.join(f.directory, scenario); mkdirSync(directory);
    if (scenario === 'nonempty') f.file('nonempty/original.txt', 'ORIGINAL CHILD\n');
    await withHolder([{ kind: scenario === 'deny-write' ? 'directory-deny-write' : 'directory', path: directory }], async ready => {
      const result = await attempts([{ operation: 'set-junction', path: directory, other: path.dirname(destinationFile) },
        { operation: 'metadata', path: directory }]);
      assert.notEqual(ready.pid, result.pid); success(result.results[1]);
      record(`set-junction-${scenario}`, result);
      if (scenario === 'deny-write') blocked(result.results[0], [32, 5]);
      else if (result.results[0].Succeeded) assert.equal(result.results[1].Metadata.ReparsePoint, true);
    });
  }
  assert.equal(bytes(destinationFile), before);
});

test.after(() => {
  writeFileSync(path.join(runRoot, 'completed.json'), JSON.stringify({ endedAt: new Date().toISOString(),
    childProcesses: sequence, retained: true, note: 'Inspect test-run exit and result logs; file presence is not PASS.' }, null, 2), { flag: 'wx' });
});

// Real mapped views and native worker processes, synthetic projects only.
// This is byte-lock integration evidence, not an AI trial or Human approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildBase, dataAt, digest, edit, paths } from '../fixtures/r02-t04/catalog.mjs';
import { prepareInternalWrite, executeInternalWrite } from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import { readStatus } from '../../.agents/skills/kidea/scripts/status.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const powershell = 'C:/Users/vuhoa/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
const powershellSha256 = '362a356ce7f0940ec74f73a8fc2c990a2cc24a38a11c90bbd8eca947110ad139';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
assert.equal(process.platform, 'win32');
assert.equal(process.version, 'v24.21.0');
assert.equal(sha(readFileSync(powershell)), powershellSha256);
const output = path.join(repo, '.test-output', 'r02-t06');
mkdirSync(output, { recursive: true });
const runRoot = mkdtempSync(path.join(output, 'mapped-write-'));
const sourcePaths = [
  '.agents/skills/kidea/scripts/native-write.cs', '.agents/skills/kidea/scripts/native-write.ps1',
  '.agents/skills/kidea/scripts/write-internal.mjs', '.agents/skills/kidea/scripts/status.mjs',
  '.agents/skills/kidea/scripts/schema.mjs', '.agents/skills/kidea/scripts/pending-writes.mjs',
  '.agents/skills/kidea/scripts/recorded-completion.mjs',
  'tests/r02-t06/mapping-probe.cs', 'tests/r02-t06/mapping-probe.ps1',
  'tests/r02-t06/mapped-write.test.mjs', 'tests/fixtures/r02-t04/catalog.mjs',
];
const hashes = () => Object.fromEntries(sourcePaths.map(relative => [relative, sha(readFileSync(path.join(repo, relative)))]));
const initialHashes = hashes();
const save = (name, bytes) => writeFileSync(path.join(runRoot, name), bytes, { flag: 'wx' });
const saveJson = (name, value) => save(name, JSON.stringify(value, null, 2));
saveJson('environment.json', {
  at: new Date().toISOString(), node: process.version, nodePath: process.execPath,
  nodeSha256: sha(readFileSync(process.execPath)), powershell, powershellSha256,
  sources: initialHashes, scope: 'Synthetic mapped-view/native-write integration; not an AI trial or Human approval',
});
console.log(`Mapped writer evidence: ${runRoot}`);
let workerRuns = 0;

function fixture(label) {
  const { world, refs } = buildBase();
  // The isolated mapper maps a 4096-byte view. Enlarge the synthetic originals
  // before prepare and refresh their actual version/history bindings rather
  // than allowing a mapping call to extend the file or stale a snapshot.
  const padding = '\nSYNTHETIC MAPPING PAD\n'.repeat(220);
  world.files['docs/notes.md'] += padding;
  world.files['docs/features.md'] += padding;
  for (const [source, version] of [['docs/notes.md', refs.before], ['docs/features.md', refs.subject]]) {
    world.files[version.location.ref.path] = world.files[source];
    version.integrity = digest(world.files[source]);
    assert.ok(Buffer.byteLength(world.files[source]) >= 4096);
  }
  edit(world, refs.prior.location.ref.path, review => { review.subjectVersions = [refs.subject]; });
  refs.prior.integrity = digest(world.files[refs.prior.location.ref.path]);
  edit(world, paths.review, review => { review.subjectVersions = [refs.subject]; review.historyRefs = [refs.prior]; });
  edit(world, paths.checkpoint, checkpoint => {
    checkpoint.inputRefs = [refs.subject];
    checkpoint.targets[0].before.version = refs.before;
    checkpoint.observations[0].results[0].integrity = refs.before.integrity;
  });
  const root = mkdtempSync(path.join(runRoot, label + '-'));
  for (const [relative, bytes] of Object.entries(world.files)) {
    const full = path.join(root, relative);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, bytes, { flag: 'wx' });
  }
  const targets = [
    { path: 'docs/notes.md', action: 'UPDATE', plannedBytes: Buffer.from('SYNTHETIC mapped-view retry: updated notes\n') },
    { path: 'docs/new.md', action: 'CREATE', plannedBytes: Buffer.from('SYNTHETIC mapped-view retry: new output\n') },
  ];
  const context = {
    projectId: 'synthetic-r02-t04', ownerId: 'W-002', tool: dataAt(world, paths.index).createdWith,
    permissionRefs: [refs.policy], inputRefs: [refs.subject],
  };
  const authorization = {
    root, metadataRoot: '.kidea/checkpoints', targets: targets.map(({ path, action }) => ({ path, action })),
    allowRestoreUpdate: true, allowRetireOwnPending: true,
    assumptions: { localNtfs: true, noActiveSync: true, noConcurrentNamespaceChanges: true },
  };
  return { root, world, targets, prepare: () => prepareInternalWrite({ root, authorization, context, targets }) };
}

function fingerprint(root) {
  return Object.fromEntries(readdirSync(root, { recursive: true, withFileTypes: true }).map(entry => {
    const full = path.join(entry.parentPath, entry.name);
    return [path.relative(root, full).split(path.sep).join('/'), entry.isDirectory() ? 'DIRECTORY' : sha(readFileSync(full))];
  }).sort(([a], [b]) => a.localeCompare(b)));
}

async function bounded(promise, timeoutMs, message, stop) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => { stop?.(); reject(new Error(message)); }, timeoutMs);
    })]);
  } finally { clearTimeout(timer); }
}

function mapper(label, mappedPath) {
  const requestName = `${label}-mapper-request.json`;
  saveJson(requestName, { role: 'mapper', path: mappedPath, closeOriginalHandles: true });
  const child = spawn(powershell, [
    '-NoLogo', '-NoProfile', '-NonInteractive', '-File', path.join(repo, 'tests/r02-t06/mapping-probe.ps1'),
    '-RequestPath', path.join(runRoot, requestName),
  ], { cwd: repo, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
  let stdout = '', stderr = '', buffer = '', spawnError = null;
  const events = [], parseErrors = [];
  let readyResolve, readyReject, closeResolve;
  const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
  const closed = new Promise(resolve => { closeResolve = resolve; });
  child.stdout.on('data', chunk => {
    stdout += chunk; buffer += chunk;
    while (buffer.includes('\n')) {
      const newline = buffer.indexOf('\n'), line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      try {
        const event = JSON.parse(line); events.push(event);
        if (event.event === 'ready') readyResolve(event);
        if (event.event === 'error') readyReject(new Error(event.message));
      } catch (error) { parseErrors.push(error.message); readyReject(error); }
    }
  });
  child.stderr.on('data', chunk => { stderr += chunk; });
  child.stdin.on('error', error => { spawnError ??= error.message; readyReject(error); });
  child.on('error', error => { spawnError = error.message; readyReject(error); });
  child.on('close', (code, signal) => {
    readyReject(new Error(`Mapper closed before readiness: ${code}/${signal}`));
    closeResolve({ code, signal });
  });
  return {
    child, events,
    ready: bounded(ready, 20000, 'MAPPER_READY_TIMEOUT', () => child.kill()),
    async release() {
      let exit;
      try {
        if (child.exitCode === null && child.signalCode === null && !child.killed) child.stdin.end('{"action":"release"}\n');
        exit = await bounded(closed, 10000, 'MAPPER_RELEASE_TIMEOUT', () => child.kill());
        assert.deepEqual(exit, { code: 0, signal: null });
        assert.equal(spawnError, null);
        assert.deepEqual(parseErrors, []);
        assert.ok(events.some(event => event.event === 'released'));
      } finally {
        save(`${label}-mapper.stdout.jsonl`, stdout);
        save(`${label}-mapper.stderr.txt`, stderr);
        saveJson(`${label}-mapper-result.json`, { exit, spawnError, parseErrors, events, stdoutSha256: sha(Buffer.from(stdout)), stderrSha256: sha(Buffer.from(stderr)) });
      }
    },
  };
}

async function runWorker(label, prepared) {
  ++workerRuns;
  save(`${label}-request.json`, prepared.line);
  const result = await executeInternalWrite(prepared, { powershell, powershellSha256 });
  saveJson(`${label}-result.json`, result);
  save(`${label}-worker.stdout.jsonl`, result.stdout);
  save(`${label}-worker.stderr.txt`, result.stderr);
  saveJson(`${label}-hashes.json`, {
    operationId: prepared.operationId, planDigest: prepared.planDigest,
    requestSha256: sha(Buffer.from(prepared.line)),
    resultSha256: sha(Buffer.from(JSON.stringify(result, null, 2))),
    stdoutSha256: sha(Buffer.from(result.stdout)), stderrSha256: sha(Buffer.from(result.stderr)),
  });
  return result;
}

for (const [label, relative] of [['target', 'docs/notes.md'], ['input', 'docs/features.md']]) {
  test(`live writable ${label} mapping with original handles closed rejects, then explicit fresh retry succeeds`, async () => {
    const f = fixture(label);
    const prepared = f.prepare(); // Must precede mapping; native acquisition is the subject of this test.
    const before = fingerprint(f.root);
    saveJson(`${label}-before.sha256.json`, before);
    if (label === 'input') assert.ok(JSON.parse(prepared.line).inputs.some(input => input.path === relative));
    const activeMapper = mapper(label, path.join(f.root, relative));
    try {
      const ready = await activeMapper.ready;
      assert.equal(ready.role, 'mapper');
      assert.equal(ready.originalHandlesClosed, true);
      assert.ok(Number.isInteger(ready.pid) && ready.pid > 0);
      assert.deepEqual(fingerprint(f.root), before, 'creating the mapped view must not resize or edit its source');
      const result = await runWorker(`${label}-blocked`, prepared);
      assert.equal(result.state, 'REJECTED', JSON.stringify(result));
      assert.equal(result.proofAccepted, false);
      assert.equal(result.wrapperError, null);
      const terminal = result.events.findLast(event => event.event === 'RESULT');
      assert.equal(terminal.code, 'WIN32_32', JSON.stringify(result));
      assert.equal(terminal.effects, false);
      assert.equal(result.events.some(event => event.event === 'BYTES_VERIFIED'), false);
      assert.equal(activeMapper.child.exitCode, null, 'view must remain alive through native rejection');
      assert.equal(activeMapper.child.killed, false);
      assert.deepEqual(fingerprint(f.root), before, 'rejection must leave every file/directory and graph input untouched');
      assert.equal(existsSync(path.join(f.root, 'docs/new.md')), false);
      saveJson(`${label}-blocked.sha256.json`, fingerprint(f.root));
    } finally { await activeMapper.release(); }

    assert.deepEqual(fingerprint(f.root), before, 'releasing the mapping must not modify source bytes');
    const retry = f.prepare(); // Explicit caller action, never replay the persisted rejected request.
    assert.notEqual(retry.operationId, prepared.operationId);
    assert.notEqual(retry.planDigest, prepared.planDigest);
    const result = await runWorker(`${label}-released`, retry);
    assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
    assert.equal(result.proofAccepted, true);
    for (const target of f.targets) assert.deepEqual(readFileSync(path.join(f.root, target.path)), target.plannedBytes);
    for (const [source, original] of Object.entries(f.world.files)) {
      if (source !== 'docs/notes.md') assert.equal(readFileSync(path.join(f.root, source), 'utf8'), original, `unchanged source: ${source}`);
    }
    assert.deepEqual(readdirSync(path.join(f.root, '.kidea/checkpoints/pending')), []);
    assert.equal(readStatus(f.root).readState, 'OK');
    saveJson(`${label}-completed.sha256.json`, fingerprint(f.root));
  });
}

test.after(() => {
  const finalHashes = hashes();
  const inputsUnchanged = JSON.stringify(initialHashes) === JSON.stringify(finalHashes);
  saveJson('summary.json', { at: new Date().toISOString(), runRoot, workerRuns, inputsUnchanged, before: initialHashes, after: finalHashes });
  assert.equal(inputsUnchanged, true, 'source edits during this integration run invalidate its hash attribution');
});

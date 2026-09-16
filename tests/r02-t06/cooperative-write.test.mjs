// Current single-writer contract. Every mutation is confined to newly generated
// synthetic fixtures. Old Win32-lock/oplock/mapping/proof tests are historical.
// This suite does not run Codex, a sandbox, ACL changes, installs or AI trials.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, linkSync, symlinkSync, chmodSync, statSync } from 'node:fs';
import childProcess, { spawnSync } from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildBase, dataAt, envelope, paths, ref } from '../fixtures/r02-t04/catalog.mjs';
import { prepareInternalWrite, prepareInternalCleanup, executeInternalWrite } from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import { inspectStatusGraph, readStatus } from '../../.agents/skills/kidea/scripts/status.mjs';
import { validate } from '../../.agents/skills/kidea/scripts/schema.mjs';
import { directoryLinkType, fixtureGit } from '../support/host.mjs';

assert.ok(Number(process.versions.node.split('.')[0]) >= 24, 'Node.js 24 or newer is required');
const repo = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(repo, '.test-output', 'r02-t06');
mkdirSync(output, { recursive: true });
const runRoot = mkdtempSync(path.join(output, 'cooperative-'));
console.log(`Cooperative writer fixtures retained: ${runRoot}`);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const bytes = (f, p) => readFileSync(path.join(f.root, p));
const record = (f, p) => JSON.parse(bytes(f, p).toString('utf8').match(/<!-- kidea:data:start -->\r?\n```json\r?\n([\s\S]*?)\r?\n```\r?\n<!-- kidea:data:end -->/)[1]);
const checkpointPath = p => `.kidea/checkpoints/operations/${p.operationId}/checkpoint.md`;
const pendingEntries = f => existsSync(path.join(f.root, '.kidea/checkpoints/pending')) ? readdirSync(path.join(f.root, '.kidea/checkpoints/pending')) : [];
const integrity = b => ({ method: 'SHA256', value: sha(b), byteLength: b.length });
function grants(root, targets) {
  return { root, metadataRoot: '.kidea/checkpoints', targets: targets.map(({ path, action }) => ({ path, action })),
    allowRestoreUpdate: true, allowRetireOwnPending: true,
    assumptions: { localFilesystem: true, noActiveSync: true, singleKideaRun: true } };
}
function fixture(label = 'case', transform = () => {}, parent = runRoot) {
  const { world, refs } = buildBase();
  transform(world, refs);
  const root = mkdtempSync(path.join(parent, `${label}-`));
  for (const [relative, content] of Object.entries(world.files)) {
    const full = path.join(root, relative);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, content, { flag: 'wx' });
  }
  const context = { projectId: 'synthetic-r02-t04', ownerId: 'W-002', tool: dataAt(world, paths.index).createdWith,
    permissionRefs: [structuredClone(refs.policy)], inputRefs: [structuredClone(refs.subject)] };
  const targets = [{ path: 'docs/notes.md', action: 'UPDATE', plannedBytes: Buffer.from('SYNTHETIC cooperative updated notes\n') },
    { path: 'docs/new.md', action: 'CREATE', plannedBytes: Buffer.from('SYNTHETIC cooperative new content\n') }];
  const args = { root, context, targets, authorization: grants(root, targets) };
  return { root, world, refs, args, prepare: () => prepareInternalWrite(args) };
}
function targets(f, values) {
  f.args.targets = values;
  f.args.authorization.targets = values.map(({ path, action }) => ({ path, action }));
}
function fingerprint(root) {
  return Object.fromEntries(readdirSync(root, { recursive: true, withFileTypes: true }).map(e => {
    const full = path.join(e.parentPath, e.name), relative = path.relative(root, full).split(path.sep).join('/');
    return [relative, e.isSymbolicLink() ? 'LINK' : e.isDirectory() ? 'DIRECTORY' : sha(readFileSync(full))];
  }).sort(([a], [b]) => a.localeCompare(b)));
}
function unchanged(f, action) {
  const before = fingerprint(f.root);
  try { return action(); } finally { assert.deepEqual(fingerprint(f.root), before, 'preflight/status must be read-only'); }
}
function reject(f, codes) {
  unchanged(f, () => assert.throws(f.prepare, error => {
    assert.ok([codes].flat().includes(error.code), `unexpected ${error.code}: ${error.stack}`);
    return true;
  }));
}
let runs = 0;
async function execute(f, prepared = f.prepare(), options = {}) {
  const prefix = String(++runs).padStart(3, '0');
  writeFileSync(path.join(runRoot, `${prefix}-request.json`), prepared.line, { flag: 'wx' });
  const result = await executeInternalWrite(prepared, options);
  writeFileSync(path.join(runRoot, `${prefix}-result.json`), JSON.stringify(result, null, 2), { flag: 'wx' });
  return result;
}
function noTargetsChanged(f) {
  assert.equal(bytes(f, 'docs/notes.md').toString(), f.world.files['docs/notes.md']);
  assert.equal(existsSync(path.join(f.root, 'docs/new.md')), false);
}
function incomplete(f) {
  assert.ok(pendingEntries(f).length > 0, 'interruption must leave a discoverable marker');
  const status = unchanged(f, () => readStatus(f.root));
  assert.equal(status.readState, 'INCOMPLETE');
  assert.equal(status.data, null);
  assert.ok(status.diagnostics.some(d => d.code === 'WRITE_PENDING'));
  reject(f, ['GRAPH_NOT_VALID', 'INCOMPLETE_WRITE_EXISTS', 'PROJECT_BUSY']);
}

test('prepare binds detached target and input bytes without changing any fixture file', () => {
  const f = fixture('prepare');
  const p = unchanged(f, f.prepare), request = JSON.parse(p.line);
  assert.equal(Object.isFrozen(p), true);
  assert.equal(p.planDigest, sha(Buffer.from(p.line)));
  assert.equal(request.targets[0].beforeBase64, Buffer.from(f.world.files['docs/notes.md']).toString('base64'));
  assert.equal(request.targets[1].beforeBase64, null);
  const inputs = new Map(request.inputs.map(i => [i.path, i.expectedBase64]));
  for (const [relative, content] of inspectStatusGraph(f.root).reads) assert.equal(inputs.get(relative), content.toString('base64'));
  const original = p.line;
  f.args.targets[0].plannedBytes.fill(0);
  f.args.authorization.targets[0].path = 'docs/another.md';
  assert.equal(p.line, original, 'caller mutations cannot rewrite the prepared operation');
});

test('UPDATE and CREATE read back exactly, retain schema-valid recovery evidence, and do not approve a task', async () => {
  const f = fixture('success'), p = f.prepare(), result = await execute(f, p);
  assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  for (const target of f.args.targets) assert.deepEqual(bytes(f, target.path), target.plannedBytes);
  assert.deepEqual(pendingEntries(f), []);
  const c = record(f, checkpointPath(p)), errors = [];
  assert.equal(validate(c, 'checkpoint', (code, field) => errors.push({ code, field })), true, JSON.stringify(errors));
  const observed = c.observations.filter(o => o.phase === 'VERIFY').at(-1);
  assert.equal(observed.results.length, 2);
  assert.ok(observed.results.every(r => r.match === 'PLANNED'));
  assert.deepEqual(bytes(f, c.targets[0].before.version.location.ref.path), Buffer.from(f.world.files['docs/notes.md']));
  for (const t of c.targets) assert.deepEqual(integrity(bytes(f, t.planned.version.location.ref.path)), t.planned.version.integrity);
  const status = readStatus(f.root);
  assert.equal(status.readState, 'OK');
  assert.equal(status.data.items.find(i => i.id === 'W-002').executionStatus, 'IN_PROGRESS');
  assert.equal(bytes(f, paths.work).toString(), f.world.files[paths.work]);
});

test('a work record that is also a graph input can be updated consistently', async () => {
  const f = fixture('record-update'), work = dataAt(f.world, paths.work);
  work.nextAction = 'SYNTHETIC next action, not executed';
  targets(f, [{ path: paths.work, action: 'UPDATE', plannedBytes: Buffer.from(envelope(work)) }]);
  assert.equal((await execute(f)).state, 'COMPLETED_BYTES');
  assert.equal(readStatus(f.root).data.nextAction.text, work.nextAction);
});

for (const [label, mutate, codes] of [
  ['no authorization', f => { delete f.args.authorization; }, 'AUTHORIZATION_REQUIRED'],
  ['wrong authorized root', f => { f.args.authorization.root = path.dirname(f.root); }, 'AUTHORIZATION_REQUIRED'],
  ['wrong metadata root', f => { f.args.authorization.metadataRoot = '.kidea/reviews'; }, 'AUTHORIZATION_REQUIRED'],
  ['unlisted target', f => { f.args.authorization.targets[0].path = 'docs/other.md'; }, 'TARGET_NOT_AUTHORIZED'],
  ['wrong target action', f => { f.args.authorization.targets[0].action = 'CREATE'; }, 'TARGET_NOT_AUTHORIZED'],
  ['missing target grant', f => { f.args.authorization.targets.pop(); }, 'INVALID_TARGETS'],
  ['unconfirmed single writer', f => { f.args.authorization.assumptions.singleKideaRun = false; }, 'ENVIRONMENT_NOT_CONFIRMED'],
  ['missing single-writer grant', f => { delete f.args.authorization.assumptions.singleKideaRun; }, 'ENVIRONMENT_NOT_CONFIRMED'],
  ['synchronization active', f => { f.args.authorization.assumptions.noActiveSync = false; }, 'ENVIRONMENT_NOT_CONFIRMED'],
  ['no authority to retire own marker', f => { f.args.authorization.allowRetireOwnPending = false; }, 'AUTHORIZATION_REQUIRED'],
  ['wrong project', f => { f.args.context.projectId = 'other'; }, 'CONTEXT_IDENTITY'],
  ['wrong owner', f => { f.args.context.ownerId = 'W-ABSENT'; }, 'CONTEXT_IDENTITY'],
  ['missing permission evidence', f => { f.args.context.permissionRefs = []; }, 'CONTEXT_REFERENCES_REQUIRED'],
  ['missing input evidence', f => { f.args.context.inputRefs = []; }, 'CONTEXT_REFERENCES_REQUIRED'],
]) test(`preflight rejects ${label} without writing`, () => { const f = fixture('reject'); mutate(f); reject(f, codes); });

for (const p of ['../outside.md', '.kidea/checkpoints/overwrite.md', '.kidea/reviews/evidence/policy.snapshot']) {
  test(`preflight rejects unsafe or reserved update path ${p}`, () => {
    const f = fixture('unsafe'); targets(f, [{ path: p, action: 'UPDATE', plannedBytes: Buffer.from('not written') }]); reject(f, ['INVALID_TARGET', 'UNSAFE_PATH']);
  });
}
test('CREATE requires absence, including an existing zero-byte target', () => {
  const f = fixture('exists'); writeFileSync(path.join(f.root, 'docs/new.md'), '', { flag: 'wx' }); reject(f, 'TARGET_PRECONDITION');
});
test('UPDATE never silently creates a missing target', () => {
  const f = fixture('missing'); targets(f, [{ path: 'docs/not-present.md', action: 'UPDATE', plannedBytes: Buffer.from('not written') }]); reject(f, ['ENOENT', 'TARGET_PRECONDITION']);
});
test('case-insensitive duplicate target aliases are rejected', () => {
  const f = fixture('duplicate'); targets(f, [f.args.targets[0], { ...f.args.targets[0], path: 'docs/NOTES.md' }]); reject(f, 'INVALID_TARGET');
});
test('an invalid projected record relationship is rejected before any write', () => {
  const f = fixture('invalid-record'), work = dataAt(f.world, paths.work); work.currentItemId = 'W-NOT-PRESENT';
  targets(f, [{ path: paths.work, action: 'UPDATE', plannedBytes: Buffer.from(envelope(work)) }]); reject(f, 'GRAPH_NOT_VALID');
});
test('static hard-link target is rejected', () => {
  const f = fixture('hardlink'); linkSync(path.join(f.root, 'docs/notes.md'), path.join(f.root, 'docs/alias.md')); reject(f, 'UNSAFE_PATH');
});
test('static directory link cannot redirect a target outside the selected root', () => {
  const f = fixture('junction'), outside = mkdtempSync(path.join(runRoot, 'outside-'));
  writeFileSync(path.join(outside, 'existing.md'), 'SYNTHETIC outside target', { flag: 'wx' });
  symlinkSync(outside, path.join(f.root, 'linked'), directoryLinkType);
  targets(f, [{ path: 'linked/existing.md', action: 'UPDATE', plannedBytes: Buffer.from('not written') }]);
  reject(f, 'UNSAFE_PATH');
  assert.equal(readFileSync(path.join(outside, 'existing.md'), 'utf8'), 'SYNTHETIC outside target');
});

for (const p of ['docs/features.md', 'docs/notes.md']) test(`changed ${p} between prepare and execute is preserved and blocks writing`, async () => {
  const f = fixture('changed'), p0 = f.prepare();
  writeFileSync(path.join(f.root, p), 'SYNTHETIC change after preparation\n');
  const result = await execute(f, p0);
  assert.notEqual(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  assert.equal(bytes(f, p).toString(), 'SYNTHETIC change after preparation\n');
  assert.equal(existsSync(path.join(f.root, 'docs/new.md')), false);
  if (p !== 'docs/notes.md') assert.equal(bytes(f, 'docs/notes.md').toString(), f.world.files['docs/notes.md']);
});
test('a CREATE target appearing after prepare is never overwritten', async () => {
  const f = fixture('create-precondition'), p = f.prepare(); writeFileSync(path.join(f.root, 'docs/new.md'), 'SYNTHETIC already here\n', { flag: 'wx' });
  assert.notEqual((await execute(f, p)).state, 'COMPLETED_BYTES');
  assert.equal(bytes(f, 'docs/new.md').toString(), 'SYNTHETIC already here\n');
});
test('read-only UPDATE failure preserves original content, identity and read-only mode', async () => {
  const f = fixture('readonly'), target = path.join(f.root, 'docs/notes.md');
  chmodSync(target, 0o444); // Synthetic file attribute only, not an ACL change.
  const before = bytes(f, 'docs/notes.md'), identity = statSync(target), p = f.prepare();
  const result = await execute(f, p);
  assert.notEqual(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  assert.deepEqual(bytes(f, 'docs/notes.md'), before);
  assert.equal(statSync(target).ino, identity.ino);
  assert.equal(statSync(target).mode, identity.mode);
  assert.equal(statSync(target).mode & 0o222, 0, 'writer must not clear the read-only attribute');
  assert.equal(existsSync(path.join(f.root, 'docs/new.md')), false);
});
test('reusing a completed no-op UPDATE plan is rejected without creating a new pending marker', async () => {
  const f = fixture('completed-replay');
  targets(f, [{ path: 'docs/notes.md', action: 'UPDATE', plannedBytes: bytes(f, 'docs/notes.md') }]);
  const p = f.prepare(); assert.equal((await execute(f, p)).state, 'COMPLETED_BYTES');
  const before = fingerprint(f.root), second = await execute(f, p);
  assert.equal(second.state, 'REJECTED', JSON.stringify(second));
  assert.equal(second.wrapperError, 'OPERATION_ALREADY_EXISTS');
  assert.deepEqual(pendingEntries(f), []); assert.deepEqual(fingerprint(f.root), before);
});

for (const [name, content] of [['active.json', 'malformed'], ['legacy.json', '{"state":"DONE"}'], ['orphan-dir', null]]) {
  test(`any pending entry blocks without interpreting or deleting it: ${name}`, async () => {
    const f = fixture('pending'), p = f.prepare(), dir = path.join(f.root, '.kidea/checkpoints/pending'); mkdirSync(dir, { recursive: true });
    if (content === null) mkdirSync(path.join(dir, name)); else writeFileSync(path.join(dir, name), content, { flag: 'wx' });
    const before = fingerprint(f.root); incomplete(f);
    assert.notEqual((await execute(f, p)).state, 'COMPLETED_BYTES');
    assert.deepEqual(fingerprint(f.root), before, 'foreign/legacy pending evidence must not be retired');
  });
}
test('one project guard rejects an accidental overlapping Kidea run while its owner can finish', async () => {
  const f = fixture('busy'), owner = f.prepare();
  targets(f, [{ path: 'docs/contender.md', action: 'CREATE', plannedBytes: Buffer.from('must not appear') }]);
  const contender = f.prepare(); let seen = false;
  const first = await execute(f, owner, { testBarrier: 'BUSY_ACQUIRED', onBarrier: async () => {
    seen = true; const marker = bytes(f, '.kidea/checkpoints/pending/active.json');
    const second = await execute(f, contender);
    assert.notEqual(second.state, 'COMPLETED_BYTES');
    assert.deepEqual(bytes(f, '.kidea/checkpoints/pending/active.json'), marker);
    assert.equal(existsSync(path.join(f.root, 'docs/contender.md')), false);
    assert.equal(readStatus(f.root).readState, 'INCOMPLETE');
  } });
  assert.equal(seen, true); assert.equal(first.state, 'COMPLETED_BYTES', JSON.stringify(first)); assert.deepEqual(pendingEntries(f), []);
});

for (const fault of ['BEFORE_FIRST_WRITE', 'AFTER_PARTIAL_WRITE', 'AFTER_VERIFY', 'RETIRE_FAILURE']) {
  test(`fault ${fault} retains evidence and cannot publish a completed write`, async () => {
    const f = fixture('fault'), p = f.prepare(), result = await execute(f, p, { testFault: fault });
    assert.equal(result.state, 'PENDING', JSON.stringify(result)); incomplete(f);
    const c = record(f, checkpointPath(p)); assert.equal(validate(c, 'checkpoint', () => {}), true);
    for (const target of c.targets) assert.deepEqual(integrity(bytes(f, target.planned.version.location.ref.path)), target.planned.version.integrity);
    if (fault === 'BEFORE_FIRST_WRITE') noTargetsChanged(f);
    if (fault === 'AFTER_PARTIAL_WRITE') {
      assert.notDeepEqual(bytes(f, 'docs/notes.md'), Buffer.from(f.world.files['docs/notes.md']));
      assert.notDeepEqual(bytes(f, 'docs/notes.md'), f.args.targets[0].plannedBytes);
      assert.deepEqual(bytes(f, c.targets[0].before.version.location.ref.path), Buffer.from(f.world.files['docs/notes.md']));
      assert.equal(existsSync(path.join(f.root, 'docs/new.md')), false);
    }
  });
}
test('readback detects a deliberately wrong final target instead of reporting success', async () => {
  const f = fixture('readback'); let reached = false;
  const result = await execute(f, f.prepare(), { testBarrier: 'AFTER_VERIFY', onBarrier: () => {
    reached = true; writeFileSync(path.join(f.root, 'docs/new.md'), 'SYNTHETIC wrong output after write\n');
  } });
  assert.equal(reached, true); assert.equal(result.state, 'PENDING', JSON.stringify(result)); incomplete(f);
});
test('actual Node process interruption between two target writes leaves partial results and blocks replay', () => {
  const f = fixture('process-interruption'); targets(f, [f.args.targets[1], f.args.targets[0]]);
  const serializable = { ...f.args, targets: f.args.targets.map(t => ({ ...t, plannedBytes: t.plannedBytes.toString('base64') })) };
  const moduleUrl = new URL('../../.agents/skills/kidea/scripts/write-internal.mjs', import.meta.url).href;
  const childSource = `import{prepareInternalWrite,executeInternalWrite}from ${JSON.stringify(moduleUrl)};` +
    `const a=${JSON.stringify(serializable)};a.targets=a.targets.map(t=>({...t,plannedBytes:Buffer.from(t.plannedBytes,'base64')}));` +
    `await executeInternalWrite(prepareInternalWrite(a),{testBarrier:'AFTER_CREATE',onBarrier(){process.exit(86)}});process.exit(87);`;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', childSource], { cwd: f.root, encoding: 'utf8', timeout: 30000, windowsHide: true });
  writeFileSync(path.join(runRoot, 'interrupted-child.json'), JSON.stringify({ status: result.status, error: result.error?.message, stdout: result.stdout, stderr: result.stderr }, null, 2));
  assert.equal(result.status, 86, result.stderr);
  assert.equal(bytes(f, 'docs/new.md').length, 0, 'exclusive CREATE has claimed only the new empty file before interruption');
  assert.equal(bytes(f, 'docs/notes.md').toString(), f.world.files['docs/notes.md']); incomplete(f);
});

// Synthetic Git repositories only; no global config, credentials, hooks,
// stash, external remote, index mutation by the writer, or repository cleanup.
function git(f, ...args) {
  return fixtureGit(f.root, ['-c', 'user.name=Synthetic Test', '-c', 'user.email=synthetic@example.invalid', ...args]).trim();
}
function gitFixture(label, { trackNotes = true, crlf = false, grant = true } = {}) {
  const f = fixture(label, world => { if (crlf) world.files['docs/notes.md'] = 'SYNTHETIC CRLF notes\r\n'; });
  git(f, 'init', '--initial-branch=master');
  git(f, '-c', `core.autocrlf=${crlf ? 'true' : 'false'}`, 'add', '--', trackNotes ? 'docs/notes.md' : 'docs/policy.md');
  git(f, 'commit', '-m', 'Synthetic baseline only');
  if (grant) f.args.authorization.allowReadLocalGit = true;
  return f;
}
test('existing Git evidence without read permission rejects before invoking any child process', () => {
  const f = gitFixture('git-denied'), c = record(f, paths.checkpoint);
  c.targets[0].before.version.location = { kind: 'GIT', commit: git(f, 'rev-parse', 'HEAD'), path: 'docs/notes.md' };
  writeFileSync(path.join(f.root, paths.checkpoint), envelope(c));
  f.args.authorization.allowReadLocalGit = false;
  let invocations = 0; const original = childProcess.spawnSync;
  childProcess.spawnSync = () => { ++invocations; throw new Error('Child process forbidden in denied-Git test'); };
  syncBuiltinESMExports();
  try {
    unchanged(f, () => assert.throws(f.prepare, error => error.code === 'GRAPH_NOT_VALID' &&
      error.diagnostics.some(d => d.code === 'GIT_READ_NOT_AUTHORIZED')));
    assert.equal(invocations, 0, 'denied Git access must not probe Git before rejecting');
  } finally { childProcess.spawnSync = original; syncBuiltinESMExports(); }
});
test('Git preimage discovery never searches an ancestor repository when the selected root has no local .git', async () => {
  const ancestor = mkdtempSync(path.join(runRoot, 'git-ancestor-'));
  git({ root: ancestor }, 'init', '--initial-branch=master');
  writeFileSync(path.join(ancestor, 'ancestor.md'), 'SYNTHETIC ancestor project only\n', { flag: 'wx' });
  git({ root: ancestor }, 'add', '--', 'ancestor.md'); git({ root: ancestor }, 'commit', '-m', 'Synthetic ancestor baseline');
  const f = fixture('nested-project', () => {}, ancestor), before = bytes(f, 'docs/notes.md');
  f.args.authorization.allowReadLocalGit = true;
  assert.equal(existsSync(path.join(f.root, '.git')), false);
  const ancestorGit = fingerprint(path.join(ancestor, '.git'));
  let invocations = 0; const original = childProcess.spawnSync;
  childProcess.spawnSync = () => { ++invocations; throw new Error('Ancestor Git discovery is forbidden'); };
  syncBuiltinESMExports();
  try {
    const p = f.prepare(), result = await execute(f, p);
    assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
    const copy = record(f, checkpointPath(p)).targets[0].before;
    assert.equal(copy.version.location.kind, 'SNAPSHOT'); assert.deepEqual(bytes(f, copy.version.location.ref.path), before);
    assert.equal(invocations, 0, 'absence of local .git must be checked before any Git subprocess is launched');
    assert.deepEqual(fingerprint(path.join(ancestor, '.git')), ancestorGit, 'ancestor refs, objects, config and index remain untouched');
  } finally { childProcess.spawnSync = original; syncBuiltinESMExports(); }
});
test('exact raw HEAD preimage reuses Git with explicit read grant and does not mutate .git', async () => {
  const f = gitFixture('git-exact'), gitBefore = fingerprint(path.join(f.root, '.git')), head = git(f, 'rev-parse', 'HEAD'), p = f.prepare();
  const result = await execute(f, p); assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  const c = record(f, checkpointPath(p));
  assert.deepEqual(c.targets[0].before.version.location, { kind: 'GIT', commit: head, path: 'docs/notes.md' });
  assert.equal(existsSync(path.join(f.root, `.kidea/checkpoints/operations/${p.operationId}/before-0.bin`)), false);
  assert.deepEqual(fingerprint(path.join(f.root, '.git')), gitBefore, 'writer must not mutate refs/config/index/hooks or objects');
});
for (const mode of ['no-grant', 'dirty', 'untracked', 'non-git', 'crlf-normalized', 'detached-unretained']) {
  test(`Git-first fallback preserves exact raw bytes: ${mode}`, async () => {
    let f;
    if (mode === 'non-git') { f = fixture('non-git'); f.args.authorization.allowReadLocalGit = true; }
    else f = gitFixture(mode, { grant: mode !== 'no-grant', trackNotes: mode !== 'untracked', crlf: mode === 'crlf-normalized' });
    if (mode === 'dirty') writeFileSync(path.join(f.root, 'docs/notes.md'), 'SYNTHETIC uncommitted notes\n');
    if (mode === 'detached-unretained') {
      git(f, 'checkout', '--detach');
      writeFileSync(path.join(f.root, 'docs/notes.md'), 'SYNTHETIC detached unretained revision\n');
      git(f, '-c', 'core.autocrlf=false', 'add', '--', 'docs/notes.md'); git(f, 'commit', '-m', 'Synthetic unretained detached baseline');
    }
    const before = bytes(f, 'docs/notes.md'), p = f.prepare(), result = await execute(f, p);
    assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
    const copy = record(f, checkpointPath(p)).targets[0].before;
    assert.equal(copy.version.location.kind, 'SNAPSHOT'); assert.deepEqual(bytes(f, copy.version.location.ref.path), before);
    assert.deepEqual(copy.version.integrity, integrity(before));
  });
}

async function cleanupFixture(label = 'cleanup') {
  const f = fixture(label), p = f.prepare(); assert.equal((await execute(f, p)).state, 'COMPLETED_BYTES');
  const cp = checkpointPath(p), c = record(f, cp);
  writeFileSync(path.join(f.root, 'docs/cleanup-evidence.md'), '# SYNTHETIC ONLY\n<a id="verified"></a>\nCompletion and retention evidence for this fixture only.\n', { flag: 'wx' });
  const work = record(f, paths.work), review = record(f, paths.review);
  work.currentItemId = null; work.checkpointRef = ref(cp); work.items[1].executionStatus = 'DONE';
  work.items[1].resultRefs = [ref('docs/cleanup-evidence.md', 'verified')]; work.nextAction = 'SYNTHETIC closed task, not real approval';
  review.status = 'APPROVED'; review.confirmationRef = f.refs.confirmation;
  writeFileSync(path.join(f.root, paths.work), envelope(work)); writeFileSync(path.join(f.root, paths.review), envelope(review));
  const selected = ['before', 'planned'].map(copy => ({ targetPath: 'docs/notes.md', copy }));
  const copyGrants = selected.map(({ copy }) => ({ path: c.targets[0][copy].version.location.ref.path, integrity: c.targets[0][copy].version.integrity }));
  const authorization = { ...grants(f.root, [{ path: cp, action: 'UPDATE' }]), allowRestoreUpdate: false,
    cleanup: { copies: copyGrants, conditions: { ownerCompleted: true, requiredChecksPassed: true, retentionEnded: true } } };
  const cleanupArgs = { root: f.root, context: f.args.context, checkpointPath: cp, copies: selected,
    receipt: { at: '2026-09-14T12:00:00.000Z', reason: 'SYNTHETIC verified completion and retention end', evidenceRef: ref('docs/cleanup-evidence.md', 'verified') }, authorization };
  return { ...f, cp, c, selected: copyGrants.map(c => c.path), cleanupArgs };
}
test('cleanup removes only explicitly selected owned copies and retains receipt plus product and review data', async () => {
  const f = await cleanupFixture(), before = fingerprint(f.root), p = unchanged(f, () => prepareInternalCleanup(f.cleanupArgs));
  const result = await execute(f, p); assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  for (const relative of f.selected) assert.equal(existsSync(path.join(f.root, relative)), false);
  const cp = record(f, f.cp); for (const copy of ['before', 'planned']) assert.deepEqual(cp.targets[0][copy].cleanup, f.cleanupArgs.receipt);
  for (const relative of ['docs/notes.md', 'docs/new.md', paths.review, f.c.targets[1].planned.version.location.ref.path]) assert.equal(sha(bytes(f, relative)), before[relative]);
  assert.equal(readStatus(f.root).readState, 'OK'); assert.deepEqual(pendingEntries(f), []);
});
test('cleanup precondition: active owner is not completed despite asserted completion conditions', async () => {
  const f = await cleanupFixture('cleanup-owner-active'), work = record(f, paths.work);
  work.currentItemId = 'W-002'; work.items.find(item => item.id === 'W-002').executionStatus = 'IN_PROGRESS';
  writeFileSync(path.join(f.root, paths.work), envelope(work));
  assert.equal(readStatus(f.root).readState, 'OK', 'the fixture must be structurally valid before the lifecycle check');
  unchanged(f, () => assert.throws(() => prepareInternalCleanup(f.cleanupArgs), error => error.code === 'OWNER_NOT_COMPLETE'));
  for (const relative of f.selected) assert.equal(existsSync(path.join(f.root, relative)), true);
});
test('cleanup precondition: an owner gate still IN_REVIEW prevents deletion despite stored DONE', async () => {
  const f = await cleanupFixture('cleanup-gate-open'), review = record(f, paths.review);
  review.status = 'IN_REVIEW'; review.confirmationRef = null;
  writeFileSync(path.join(f.root, paths.review), envelope(review));
  assert.equal(readStatus(f.root).readState, 'OK', 'the fixture must be structurally valid before the gate check');
  unchanged(f, () => assert.throws(() => prepareInternalCleanup(f.cleanupArgs), error => error.code === 'OWNER_NOT_COMPLETE'));
  for (const relative of f.selected) assert.equal(existsSync(path.join(f.root, relative)), true);
});
test('cleanup precondition: a selected copy still used by a live ordinary Ref cannot be deleted', async () => {
  const f = await cleanupFixture('cleanup-live-ref'), work = record(f, paths.work);
  work.items[0].inputRefs.push(ref(f.selected[0]));
  writeFileSync(path.join(f.root, paths.work), envelope(work));
  assert.equal(readStatus(f.root).readState, 'OK', 'the current graph must resolve the retained copy before projected deletion');
  unchanged(f, () => assert.throws(() => prepareInternalCleanup(f.cleanupArgs), error => error.code === 'GRAPH_NOT_VALID' &&
    error.diagnostics.some(d => d.code === 'MISSING_FILE' && d.file === f.selected[0])));
  for (const relative of f.selected) assert.equal(existsSync(path.join(f.root, relative)), true);
});
for (const [label, mutate, code] of [
  ['missing grant', f => { delete f.cleanupArgs.authorization.cleanup; }, 'CLEANUP_AUTHORIZATION_REQUIRED'],
  ['retention still required', f => { f.cleanupArgs.authorization.cleanup.conditions.retentionEnded = false; }, 'CLEANUP_CONDITIONS_REQUIRED'],
  ['wrong copy hash', f => { f.cleanupArgs.authorization.cleanup.copies[0].integrity = { ...f.cleanupArgs.authorization.cleanup.copies[0].integrity, value: '0'.repeat(64) }; }, 'CLEANUP_COPY_NOT_AUTHORIZED'],
  ['restore permission cannot broaden cleanup', f => { f.cleanupArgs.authorization.allowRestoreUpdate = true; }, 'CLEANUP_AUTHORIZATION_REQUIRED'],
]) test(`cleanup rejects ${label} without deleting files`, async () => {
  const f = await cleanupFixture('cleanup-reject'); mutate(f);
  unchanged(f, () => assert.throws(() => prepareInternalCleanup(f.cleanupArgs), e => e.code === code));
});
for (const fault of ['CLEANUP_DELETE_FAILURE', 'CLEANUP_AFTER_FIRST_DELETE', 'CLEANUP_RECEIPT_FAILURE']) {
  test(`cleanup ${fault} preserves unresolved pending state and never claims all copies retired`, async () => {
    const f = await cleanupFixture('cleanup-fault'), p = prepareInternalCleanup(f.cleanupArgs), result = await execute(f, p, { testFault: fault });
    assert.equal(result.state, 'PENDING', JSON.stringify(result)); incomplete(f);
    assert.equal(bytes(f, 'docs/notes.md').toString(), 'SYNTHETIC cooperative updated notes\n');
    assert.equal(bytes(f, 'docs/new.md').toString(), 'SYNTHETIC cooperative new content\n');
    assert.ok(f.selected.some(relative => existsSync(path.join(f.root, relative))) || fault === 'CLEANUP_RECEIPT_FAILURE');
  });
}

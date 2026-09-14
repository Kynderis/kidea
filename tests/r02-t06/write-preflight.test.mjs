// Synthetic local fixtures only. These checks never launch the native writer,
// authorize a real project, or count as an AI/human acceptance trial.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs, { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { prepareInternalWrite } from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import { inspectStatusGraph, readStatus } from '../../.agents/skills/kidea/scripts/status.mjs';
import { buildBase, dataAt, edit, envelope, paths, ref, snapshot } from '../fixtures/r02-t04/catalog.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(repo, '.test-output', 'r02-t06');
mkdirSync(output, { recursive: true });
const operationId = '00000000-0000-4000-8000-000000000006';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

function fingerprint(root) {
  return Object.fromEntries(readdirSync(root, { recursive: true, withFileTypes: true }).map(entry => {
    const full = path.join(entry.parentPath, entry.name);
    const key = path.relative(root, full).split(path.sep).join('/');
    return [key, entry.isDirectory() ? 'DIRECTORY' : sha(readFileSync(full))];
  }).sort(([a], [b]) => a.localeCompare(b)));
}

function fixture(change = () => {}) {
  const base = buildBase();
  change(base.world, base.refs);
  const root = mkdtempSync(path.join(output, 'preflight-'));
  for (const [relative, bytes] of Object.entries(base.world.files)) {
    const full = path.join(root, relative);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, bytes);
  }
  const context = {
    projectId: 'synthetic-r02-t04', ownerId: 'W-002',
    tool: dataAt(base.world, paths.index).createdWith,
    permissionRefs: [structuredClone(base.refs.policy)],
    inputRefs: [structuredClone(base.refs.subject)],
  };
  const targets = [{ path: 'docs/notes.md', action: 'UPDATE', plannedBytes: Buffer.from('SYNTHETIC planned notes\n') }];
  const authorization = {
    root, metadataRoot: '.kidea/checkpoints',
    assumptions: { localNtfs: true, noActiveSync: true, noConcurrentNamespaceChanges: true },
    allowRestoreUpdate: true, allowRetireOwnPending: true,
    targets: targets.map(({ path, action }) => ({ path, action })),
  };
  return { ...base, root, request: { root, authorization, context, targets, operationId } };
}

function setTargets(f, targets) {
  f.request.targets = targets;
  f.request.authorization.targets = targets.map(({ path, action }) => ({ path, action }));
}

function plannedRecord(f, relative, change) {
  const data = dataAt(f.world, relative);
  change(data);
  return { path: relative, action: 'UPDATE', plannedBytes: Buffer.from(envelope(data)) };
}

function unchanged(root, action) {
  const before = fingerprint(root);
  try { return action(); }
  finally { assert.deepEqual(fingerprint(root), before, 'preflight must not create, remove, or alter any file/directory'); }
}

function rejected(f, code, inspect = () => {}) {
  return unchanged(f.root, () => assert.throws(() => prepareInternalWrite(f.request), error => {
    assert.equal(error.code, code);
    inspect(error);
    return true;
  }));
}

function prepared(f) {
  return unchanged(f.root, () => {
    const plan = prepareInternalWrite(f.request);
    assert.equal(Object.isFrozen(plan), true);
    assert.equal(plan.planDigest, sha(Buffer.from(plan.line)));
    assert.equal(plan.operationId, operationId);
    return { plan, request: JSON.parse(plan.line) };
  });
}

test('prepare binds the valid current graph and detached exact target bytes without writing', () => {
  const f = fixture();
  const graph = unchanged(f.root, () => inspectStatusGraph(f.root));
  assert.equal(graph.status.readState, 'OK', JSON.stringify(graph.status.diagnostics));
  assert.equal(graph.gitReadCount, 0);
  assert.equal(graph.absent.size, 0);
  const { plan, request } = prepared(f);
  assert.equal(request.protocolVersion, 1);
  assert.equal(request.root, f.root);
  assert.deepEqual(request.authorization, f.request.authorization);
  assert.deepEqual(request.context, f.request.context);
  assert.deepEqual(request.targets, [{
    path: 'docs/notes.md', action: 'UPDATE',
    beforeBase64: Buffer.from(f.world.files['docs/notes.md']).toString('base64'),
    plannedBase64: f.request.targets[0].plannedBytes.toString('base64'),
  }]);
  const inputs = new Map(request.inputs.map(input => [input.path, input.expectedBase64]));
  assert.equal(inputs.size, request.inputs.length);
  for (const [relative, bytes] of graph.reads) assert.equal(inputs.get(relative), bytes.toString('base64'));
  const original = plan.line;
  f.request.targets[0].plannedBytes.fill(0);
  f.request.authorization.targets[0].path = 'docs/out-of-scope.md';
  f.request.context.ownerId = 'OTHER';
  graph.reads.get(paths.work).fill(0);
  assert.equal(plan.line, original, 'later caller/graph mutations cannot alter serialized validated plan');
});

test('recorded APPROVED is not in-memory write authorization', () => {
  const f = fixture((world, refs) => edit(world, paths.review, review => {
    review.status = 'APPROVED'; review.confirmationRef = refs.confirmation;
  }));
  assert.equal(readStatus(f.root).data.reviews[0].recordedStatus, 'APPROVED');
  delete f.request.authorization;
  rejected(f, 'AUTHORIZATION_REQUIRED');
});

for (const assumption of ['localNtfs', 'noActiveSync', 'noConcurrentNamespaceChanges']) {
  test(`explicit environment confirmation is required: ${assumption}`, () => {
    const f = fixture();
    f.request.authorization.assumptions[assumption] = false;
    rejected(f, 'ENVIRONMENT_NOT_CONFIRMED');
  });
}

for (const [name, change] of [
  ['different root', f => { f.request.authorization.root = path.dirname(f.root); }],
  ['different metadata namespace', f => { f.request.authorization.metadataRoot = '.kidea/reviews'; }],
  ['missing restore decision', f => { delete f.request.authorization.allowRestoreUpdate; }],
  ['no permission to retire own pending', f => { f.request.authorization.allowRetireOwnPending = false; }],
]) test(`authorization boundary rejects ${name}`, () => { const f = fixture(); change(f); rejected(f, 'AUTHORIZATION_REQUIRED'); });

test('allowRestoreUpdate false is a valid explicit decision, not missing authorization', () => {
  const f = fixture(); f.request.authorization.allowRestoreUpdate = false;
  assert.equal(prepared(f).request.authorization.allowRestoreUpdate, false);
});

for (const [name, change, code] of [
  ['unlisted path', f => { f.request.authorization.targets[0].path = 'docs/policy.md'; }, 'TARGET_NOT_AUTHORIZED'],
  ['unlisted action', f => { f.request.authorization.targets[0].action = 'CREATE'; }, 'TARGET_NOT_AUTHORIZED'],
  ['missing target', f => { f.request.authorization.targets = []; }, 'INVALID_TARGETS'],
  ['extra authorized target', f => { f.request.authorization.targets.push({ path: 'docs/extra.md', action: 'CREATE' }); }, 'INVALID_TARGETS'],
]) test(`exact target allowlist rejects ${name}`, () => { const f = fixture(); change(f); rejected(f, code); });

for (const second of ['docs/notes.md', 'docs/NOTES.md']) test(`duplicate target spelling is rejected: ${second}`, () => {
  const f = fixture();
  setTargets(f, [...f.request.targets, { ...f.request.targets[0], path: second }]);
  rejected(f, 'INVALID_TARGET');
});

for (const target of ['../outside.md', '.kidea/checkpoints/CP-001.md', '.kidea/reviews/evidence/policy.snapshot']) {
  test(`unsafe or reserved update target is rejected: ${target}`, () => {
    const f = fixture(); setTargets(f, [{ ...f.request.targets[0], path: target }]); rejected(f, 'INVALID_TARGET');
  });
}

test('case alias between target and graph input is rejected', () => {
  const f = fixture();
  setTargets(f, [{ path: 'docs/POLICY.md', action: 'UPDATE', plannedBytes: Buffer.from(f.world.files['docs/policy.md']) }]);
  rejected(f, 'AMBIGUOUS_PATH_ALIAS');
});

test('case alias introduced by context reference is rejected', () => {
  const f = fixture(); f.request.context.permissionRefs[0].source.path = 'docs/POLICY.md';
  rejected(f, 'AMBIGUOUS_PATH_ALIAS');
});

test('CREATE requires absence and never reclassifies an existing file', () => {
  const f = fixture(); setTargets(f, [{ ...f.request.targets[0], action: 'CREATE' }]); rejected(f, 'TARGET_PRECONDITION');
});

test('CREATE retains null before bytes and does not create its target or metadata', () => {
  const f = fixture();
  setTargets(f, [{ path: 'docs/new-output.md', action: 'CREATE', plannedBytes: Buffer.from('SYNTHETIC new output\n') }]);
  assert.equal(prepared(f).request.targets[0].beforeBase64, null);
});

for (const [name, change] of [
  ['missing current item', work => { work.currentItemId = 'W-NOT-FOUND'; }],
  ['missing parent', work => { work.items[1].parentId = 'W-NOT-FOUND'; }],
  ['missing dependency', work => { work.items[1].dependencyIds = ['W-NOT-FOUND']; }],
  ['missing gate', work => { work.items[1].gateIds = ['RV-NOT-FOUND']; }],
]) test(`invalid projected relationship rejects before writing: ${name}`, () => {
  const f = fixture(); setTargets(f, [plannedRecord(f, paths.work, change)]);
  rejected(f, 'GRAPH_NOT_VALID', error => assert.ok(error.diagnostics.some(d => d.code === 'CONSTRAINT')));
  assert.equal(readStatus(f.root).data.currentItemId, 'W-002');
});

test('changed current version source invalidates graph even if target is unrelated', () => {
  const f = fixture(world => { world.files['docs/features.md'] += 'SYNTHETIC unreviewed source change\n'; });
  rejected(f, 'GRAPH_NOT_VALID', error => assert.ok(error.diagnostics.some(d => d.code === 'CURRENT_SOURCE_DIFFERS')));
});

test('source changed between valid current/projected graph reads is rejected', () => {
  const f = fixture();
  const before = fingerprint(f.root);
  const changed = Buffer.from(f.world.files['docs/plan.md'] + '\nSYNTHETIC concurrent edit\n');
  const originalRead = fs.readFileSync;
  let indexReads = 0, injected = false;
  // Deterministic read interception in this test process only: the third index
  // read begins projected validation, after the current graph's final recheck.
  // Restore ESM exports before asserting so no later test inherits this hook.
  fs.readFileSync = function (filename, ...args) {
    if (typeof filename === 'string' && path.resolve(filename) === path.join(f.root, paths.index)) {
      if (++indexReads === 3) { writeFileSync(path.join(f.root, 'docs/plan.md'), changed); injected = true; }
    }
    return originalRead.call(this, filename, ...args);
  };
  syncBuiltinESMExports();
  try { assert.throws(() => prepareInternalWrite(f.request), error => error.code === 'SOURCE_CHANGED'); }
  finally { fs.readFileSync = originalRead; syncBuiltinESMExports(); }
  assert.equal(injected, true, 'race fixture must actually alter the source between graph inspections');
  assert.deepEqual(fingerprint(f.root), { ...before, 'docs/plan.md': sha(changed) }, 'only the injected external edit may persist');
});

test('planned references add their existing input bytes and retain original target bytes', () => {
  const f = fixture(world => { world.files['docs/new-input.md'] = 'SYNTHETIC newly referenced source\n'; });
  const target = plannedRecord(f, paths.index, index => index.sources.push({ role: 'notes', ref: ref('docs/new-input.md') }));
  const current = unchanged(f.root, () => inspectStatusGraph(f.root));
  assert.equal(current.reads.has('docs/new-input.md'), false);
  const projected = unchanged(f.root, () => inspectStatusGraph(f.root, new Map([[target.path, target.plannedBytes]])));
  assert.equal(projected.status.readState, 'OK', JSON.stringify(projected.status.diagnostics));
  assert.equal(projected.reads.has(paths.index), false, 'overlay bytes are planned output, not claimed on-disk input');
  assert.equal(projected.reads.get('docs/new-input.md').toString(), f.world.files['docs/new-input.md']);
  setTargets(f, [target]);
  const inputs = new Map(prepared(f).request.inputs.map(input => [input.path, Buffer.from(input.expectedBase64, 'base64')]));
  assert.equal(inputs.get('docs/new-input.md').toString(), f.world.files['docs/new-input.md']);
  assert.equal(inputs.get(paths.index).toString(), f.world.files[paths.index]);
});

test('input referenced only by old graph remains bound when planned graph removes it', () => {
  const f = fixture(world => {
    world.files['docs/old-input.md'] = 'SYNTHETIC formerly referenced source\n';
    edit(world, paths.index, index => index.sources.push({ role: 'notes', ref: ref('docs/old-input.md') }));
  });
  const target = plannedRecord(f, paths.index, index => { index.sources = index.sources.filter(source => source.ref.path !== 'docs/old-input.md'); });
  const projected = unchanged(f.root, () => inspectStatusGraph(f.root, new Map([[target.path, target.plannedBytes]])));
  assert.equal(projected.status.readState, 'OK', JSON.stringify(projected.status.diagnostics));
  assert.equal(projected.reads.has('docs/old-input.md'), false);
  setTargets(f, [target]);
  const input = prepared(f).request.inputs.find(input => input.path === 'docs/old-input.md');
  assert.equal(Buffer.from(input.expectedBase64, 'base64').toString(), f.world.files['docs/old-input.md']);
});

test('context-only source and snapshot join the bound inputs', () => {
  let added;
  const f = fixture(world => {
    world.files['docs/caller-input.md'] = 'SYNTHETIC caller input\n';
    added = snapshot(world, 'docs/caller-input.md', '.kidea/reviews/evidence/caller-input.snapshot');
  });
  f.request.context.inputRefs.push(added);
  const graph = inspectStatusGraph(f.root);
  assert.equal(graph.reads.has(added.source.path), false);
  const inputs = new Map(prepared(f).request.inputs.map(input => [input.path, input.expectedBase64]));
  assert.equal(inputs.get(added.source.path), Buffer.from(f.world.files[added.source.path]).toString('base64'));
  assert.equal(inputs.get(added.location.ref.path), inputs.get(added.source.path));
});

for (const [name, change] of [
  ['project', context => { context.projectId = 'OTHER'; }],
  ['owner', context => { context.ownerId = 'W-NOT-FOUND'; }],
]) test(`context identity must exist in both graphs: ${name}`, () => {
  const f = fixture(); change(f.request.context); rejected(f, 'CONTEXT_IDENTITY');
});

for (const field of ['permissionRefs', 'inputRefs']) test(`empty ${field} cannot be inferred from project records`, () => {
  const f = fixture(); f.request.context[field] = []; rejected(f, 'CONTEXT_REFERENCES_REQUIRED');
});

test('context snapshot checksum cannot be asserted without exact source bytes', () => {
  const f = fixture(); f.request.context.inputRefs[0].integrity.value = '0'.repeat(64); rejected(f, 'CONTEXT_SOURCE_DIFFERS');
});

test('equivalent Integrity objects remain valid when property order differs', () => {
  const f = fixture();
  for (const version of [...f.request.context.permissionRefs, ...f.request.context.inputRefs]) {
    const { byteLength, method, value } = version.integrity;
    version.integrity = { byteLength, method, value };
  }
  const result = prepared(f);
  assert.deepEqual(result.request.context.inputRefs[0].integrity, f.refs.subject.integrity);
  assert.deepEqual(result.request.context.permissionRefs[0].integrity, f.refs.policy.integrity);
});

for (const [name, text] of [
  ['missing', 'SYNTHETIC context-only source without requested anchor\n'],
  ['ambiguous', '<a id="caller-scope"></a>\n<a id="caller-scope"></a>\nSYNTHETIC duplicate anchor\n'],
]) test(`context-only ${name} source anchor is rejected even with exact valid snapshot bytes`, () => {
  let added;
  const f = fixture(world => {
    world.files['docs/caller-anchor.md'] = text;
    added = snapshot(world, 'docs/caller-anchor.md', '.kidea/reviews/evidence/caller-anchor.snapshot', undefined, 'caller-scope');
  });
  f.request.context.inputRefs.push(added);
  const graph = unchanged(f.root, () => inspectStatusGraph(f.root));
  assert.equal(graph.status.readState, 'OK');
  assert.equal(graph.reads.has(added.source.path), false);
  assert.equal(graph.reads.has(added.location.ref.path), false);
  rejected(f, 'CONTEXT_ANCHOR');
});

test('public status cannot receive projected graph bytes or a capture callback', () => {
  const f = fixture();
  const target = plannedRecord(f, paths.work, work => { work.nextAction = 'SYNTHETIC projected next action'; });
  const projectedBytes = new Map([[target.path, target.plannedBytes]]);
  const projected = unchanged(f.root, () => inspectStatusGraph(f.root, projectedBytes));
  assert.equal(projected.status.readState, 'OK');
  assert.equal(projected.status.data.nextAction.text, 'SYNTHETIC projected next action');
  let captured = false;
  const result = unchanged(f.root, () => readStatus(f.root, { projectedBytes, capture: () => { captured = true; } }));
  assert.equal(result.readState, 'OK');
  assert.equal(result.data.nextAction.text, dataAt(f.world, paths.work).nextAction);
  assert.equal(captured, false);
  assert.equal(Object.hasOwn(result, 'reads'), false);
  assert.equal(result.data.reviews[0].verification.authority, 'NOT_VERIFIED');
});

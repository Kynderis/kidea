// Real native cleanup on copies of a worker-produced synthetic checkpoint.
// Fixture DONE/APPROVED labels are not Human grants or AI acceptance trials.
import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, openSync, closeSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildBase, dataAt, paths, ref, envelope, digest } from '../fixtures/r02-t04/catalog.mjs';
import { prepareInternalWrite, prepareInternalCleanup, executeInternalWrite } from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import { inspectStatusGraph, readStatus } from '../../.agents/skills/kidea/scripts/status.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const powershell = 'C:/Users/vuhoa/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
const powershellSha256 = '362a356ce7f0940ec74f73a8fc2c990a2cc24a38a11c90bbd8eca947110ad139';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
assert.equal(process.platform, 'win32');
assert.equal(process.version, 'v24.21.0');
assert.equal(sha(readFileSync(powershell)), powershellSha256);
const output = path.join(repo, '.test-output', 'r02-t06');
mkdirSync(output, { recursive: true });
const runRoot = mkdtempSync(path.join(output, 'cleanup-'));
const sourcePaths = [
  '.agents/skills/kidea/scripts/native-write.cs', '.agents/skills/kidea/scripts/native-write.ps1',
  '.agents/skills/kidea/scripts/write-internal.mjs', '.agents/skills/kidea/scripts/status.mjs',
  '.agents/skills/kidea/scripts/schema.mjs', '.agents/skills/kidea/scripts/pending-writes.mjs',
  '.agents/skills/kidea/scripts/recorded-completion.mjs',
  'tests/r02-t06/cleanup.test.mjs', 'tests/fixtures/r02-t04/catalog.mjs',
];
const sourceHashes = () => Object.fromEntries(sourcePaths.map(p => [p, sha(readFileSync(path.join(repo, p)))]));
const initialHashes = sourceHashes();
const save = (name, bytes) => writeFileSync(path.join(runRoot, name), bytes, { flag: 'wx' });
const saveJson = (name, value) => save(name, JSON.stringify(value, null, 2));
saveJson('environment.json', { at: new Date().toISOString(), node: process.version, nodePath: process.execPath,
  nodeSha256: sha(readFileSync(process.execPath)), powershell, powershellSha256, sources: initialHashes,
  scope: 'Synthetic real-worker cleanup integration; no AI trial, Human approval, or project cleanup permission' });
console.log(`Cleanup evidence: ${runRoot}`);
let seed, groupSeed, fixtureNumber = 0, workerRuns = 0, rejectedPlans = 0;
const receipt = { at: '2026-09-14T03:30:00.000Z', reason: 'SYNTHETIC caller confirmed completion, required checks and retention end.', evidenceRef: ref('docs/cleanup-evidence.md', 'verified') };
const envelopePattern = /(<!-- kidea:data:start -->\r?\n```json\r?\n)([\s\S]*?)(\r?\n```\r?\n<!-- kidea:data:end -->)/;
const full = (f, relative) => path.join(f.root, relative);
const bytes = (f, relative) => readFileSync(full(f, relative));
const record = (f, relative) => JSON.parse(bytes(f, relative).toString('utf8').match(envelopePattern)[2]);
function editRecord(f, relative, change) {
  const text = bytes(f, relative).toString('utf8'), data = record(f, relative);
  change(data);
  writeFileSync(full(f, relative), text.replace(envelopePattern, (_all, start, _json, end) => start + JSON.stringify(data, null, 2) + end));
}
function fingerprint(root) {
  return Object.fromEntries(readdirSync(root, { recursive: true, withFileTypes: true }).map(entry => {
    const filename = path.join(entry.parentPath, entry.name);
    return [path.relative(root, filename).split(path.sep).join('/'), entry.isDirectory() ? 'DIRECTORY' : sha(readFileSync(filename))];
  }).sort(([a], [b]) => a.localeCompare(b)));
}
function unchanged(f, action) {
  const before = fingerprint(f.root);
  try { return action(); } finally { assert.deepEqual(fingerprint(f.root), before, 'prepare must not alter files or directories'); }
}
function grants(root, targets, allowRestoreUpdate = true) {
  return { root, metadataRoot: '.kidea/checkpoints', targets, allowRestoreUpdate, allowRetireOwnPending: true,
    assumptions: { localNtfs: true, noActiveSync: true, noConcurrentNamespaceChanges: true } };
}
async function run(label, prepared, options = {}) {
  const prefix = `${String(++workerRuns).padStart(3, '0')}-${label}`;
  save(`${prefix}-request.json`, prepared.line);
  const result = await executeInternalWrite(prepared, { powershell, powershellSha256, ...options });
  saveJson(`${prefix}-result.json`, result);
  save(`${prefix}-worker.stdout.jsonl`, result.stdout); save(`${prefix}-worker.stderr.txt`, result.stderr);
  saveJson(`${prefix}-hashes.json`, { operationId: prepared.operationId, planDigest: prepared.planDigest,
    requestSha256: sha(Buffer.from(prepared.line)), resultSha256: sha(Buffer.from(JSON.stringify(result, null, 2))),
    stdoutSha256: sha(Buffer.from(result.stdout)), stderrSha256: sha(Buffer.from(result.stderr)) });
  return result;
}

test.before(async () => {
  const { world, refs } = buildBase();
  const root = mkdtempSync(path.join(runRoot, 'seed-'));
  for (const [relative, text] of Object.entries(world.files)) {
    const filename = path.join(root, relative); mkdirSync(path.dirname(filename), { recursive: true }); writeFileSync(filename, text, { flag: 'wx' });
  }
  const context = { projectId: 'synthetic-r02-t04', ownerId: 'W-002', tool: dataAt(world, paths.index).createdWith,
    permissionRefs: [refs.policy], inputRefs: [refs.subject] };
  const targets = [
    { path: 'docs/notes.md', action: 'UPDATE', plannedBytes: Buffer.from('SYNTHETIC actual worker output for cleanup\n') },
    { path: 'docs/new.md', action: 'CREATE', plannedBytes: Buffer.from('SYNTHETIC unselected new output\n') },
  ];
  const prepared = prepareInternalWrite({ root, context, targets, authorization: grants(root, targets.map(({ path, action }) => ({ path, action }))) });
  const result = await run('seed-write', prepared);
  assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  const checkpointPath = `.kidea/checkpoints/operations/${prepared.operationId}/checkpoint.md`;
  seed = { root, context, checkpointPath, originalOperationId: prepared.operationId };
  assert.equal(record(seed, checkpointPath).id, prepared.operationId);
  writeFileSync(full(seed, 'docs/cleanup-evidence.md'), '# SYNTHETIC ONLY\n<a id="verified"></a>\nFixture records completion, checks and retention end; these words are not a trusted grant.\n', { flag: 'wx' });
  editRecord(seed, paths.work, work => {
    work.currentItemId = null; work.checkpointRef = ref(checkpointPath);
    work.items.find(item => item.id === 'W-002').executionStatus = 'DONE';
    work.items.find(item => item.id === 'W-002').resultRefs = [receipt.evidenceRef];
    work.nextAction = 'Synthetic owner complete; parent group remains incomplete.';
  });
  editRecord(seed, paths.review, review => { review.status = 'APPROVED'; review.confirmationRef = refs.confirmation; });
  writeFileSync(full(seed, `.kidea/checkpoints/operations/${prepared.operationId}/unknown-keep.bin`), 'UNKNOWN SYNTHETIC FILE: not a granted cleanup target\n', { flag: 'wx' });
  assert.equal(readStatus(root).readState, 'OK');
  saveJson('seed.json', { root, checkpointPath, originalOperationId: prepared.operationId,
    producedByWorker: true, syntheticLabelsAddedAfterWrite: true, tree: fingerprint(root) });

  // GROUP ownership also starts with a real native WRITE checkpoint, not an
  // edited ownerId on a leaf checkpoint. Its completion is derived afterward.
  const groupRoot = mkdtempSync(path.join(runRoot, 'group-seed-'));
  cpSync(seed.root, groupRoot, { recursive: true, force: false, errorOnExist: true });
  const groupContext = { ...structuredClone(context), ownerId: 'W-001' };
  const groupTargets = [{ path: 'docs/notes.md', action: 'UPDATE', plannedBytes: Buffer.from('SYNTHETIC actual group-owned worker output\n') }];
  const groupPrepared = prepareInternalWrite({ root: groupRoot, context: groupContext, targets: groupTargets,
    authorization: grants(groupRoot, groupTargets.map(({ path, action }) => ({ path, action }))) });
  const groupResult = await run('group-seed-write', groupPrepared);
  assert.equal(groupResult.state, 'COMPLETED_BYTES', JSON.stringify(groupResult));
  groupSeed = { root: groupRoot, context: groupContext,
    checkpointPath: `.kidea/checkpoints/operations/${groupPrepared.operationId}/checkpoint.md`, originalOperationId: groupPrepared.operationId };
  // D1 now requires the STEP's own gate. Keep a separate synthetic review,
  // bound to its real scope bytes; these fixture labels still confer no rights.
  const groupReviewPath='.kidea/reviews/RV-GROUP.md',groupSnapshot='.kidea/reviews/evidence/group-scope.md';
  const groupSubject=bytes(groupSeed,'docs/plan.md');writeFileSync(full(groupSeed,groupSnapshot),groupSubject,{flag:'wx'});
  const groupReview={...record(groupSeed,paths.review),id:'RV-GROUP',revision:1,ownerIds:['W-001'],subjectRefs:[ref('docs/plan.md','scope')],subjectVersions:[{source:ref('docs/plan.md','scope'),location:{kind:'SNAPSHOT',ref:ref(groupSnapshot)},integrity:digest(groupSubject.toString('utf8'))}],historyRefs:[],validityChecks:[]};
  writeFileSync(full(groupSeed,groupReviewPath),envelope(groupReview),{flag:'wx'});
  editRecord(groupSeed, paths.work, work => {
    work.checkpointRef = ref(groupSeed.checkpointPath);
    work.items.find(item => item.id === 'W-001').decomposition = 'COMPLETE';
    work.items.find(item => item.id === 'W-001').gateIds = ['RV-GROUP'];
    work.reviewRefs.push(ref(groupReviewPath));
  });
  assert.equal(readStatus(groupRoot).readState, 'OK');
  saveJson('group-seed.json', { ...groupSeed, producedByWorker: true, syntheticCompletionDerivedFromChildren: true, tree: fingerprint(groupRoot) });
});

function fixture(label, selections = [{ targetPath: 'docs/notes.md', copy: 'before' }, { targetPath: 'docs/notes.md', copy: 'planned' }], sourceSeed = seed) {
  const root = mkdtempSync(path.join(runRoot, `${String(++fixtureNumber).padStart(3, '0')}-${label}-`));
  cpSync(sourceSeed.root, root, { recursive: true, force: false, errorOnExist: true });
  const f = { root, context: structuredClone(sourceSeed.context), checkpointPath: sourceSeed.checkpointPath };
  const checkpoint = record(f, f.checkpointPath);
  const copyGrants = selections.map(selection => {
    const target = checkpoint.targets.find(target => target.path === selection.targetPath), copy = target[selection.copy];
    return { path: copy.version.location.ref.path, integrity: structuredClone(copy.version.integrity) };
  });
  f.args = { root, context: f.context, checkpointPath: f.checkpointPath, copies: structuredClone(selections), receipt: structuredClone(receipt),
    authorization: { ...grants(root, [{ path: f.checkpointPath, action: 'UPDATE' }], false),
      cleanup: { copies: copyGrants, conditions: { ownerCompleted: true, requiredChecksPassed: true, retentionEnded: true } } } };
  f.selected = copyGrants.map(grant => grant.path);
  f.label = `${String(fixtureNumber).padStart(3, '0')}-${label}`;
  return f;
}
const prepare = f => unchanged(f, () => prepareInternalCleanup(f.args));
function reject(f, code, inspect = () => {}) {
  const before = fingerprint(f.root);
  unchanged(f, () => assert.throws(() => prepareInternalCleanup(f.args), error => {
    if (Array.isArray(code)) assert.ok(code.includes(error.code), error.stack);
    else assert.equal(error.code, code, error.stack);
    inspect(error);
    saveJson(`${f.label}-prepare-rejected.json`, { code: error.code, diagnostics: error.diagnostics, args: f.args, tree: before });
    ++rejectedPlans; return true;
  }));
}
function assertOriginalsRetained(f, before, allowed = []) {
  const changed = new Set(allowed);
  const after = fingerprint(f.root);
  for (const [relative, hash] of Object.entries(before)) if (!changed.has(relative)) assert.equal(after[relative], hash, `retained original: ${relative}`);
}
function assertPendingNoReplay(f, result, prepared) {
  assert.equal(result.state, 'PENDING', JSON.stringify(result));
  assert.equal(result.proofAccepted, false);
  assert.ok(readdirSync(full(f, '.kidea/checkpoints/pending')).includes(`${prepared.operationId}.json`));
  const before = fingerprint(f.root), status = readStatus(f.root);
  assert.equal(status.readState, 'INCOMPLETE'); assert.equal(status.data, null);
  assert.ok(status.diagnostics.some(d => d.code === 'WRITE_PENDING'));
  assert.throws(() => prepareInternalCleanup(f.args), error => error.code === 'GRAPH_NOT_VALID');
  const targets = [{ path: 'docs/no-replay.md', action: 'CREATE', plannedBytes: Buffer.from('SYNTHETIC no replay\n') }];
  assert.throws(() => prepareInternalWrite({ root: f.root, context: f.context, targets,
    authorization: grants(f.root, targets.map(({ path, action }) => ({ path, action }))) }), error => error.code === 'GRAPH_NOT_VALID');
  assert.deepEqual(fingerprint(f.root), before);
}

test('cleanup removes only selected before/planned copies, writes exact receipts and allows a later ordinary WRITE', async () => {
  const f = fixture('success');
  const originalText = bytes(f, f.checkpointPath).toString('utf8');
  writeFileSync(full(f, f.checkpointPath), 'SYNTHETIC PROSE TO KEEP\n' + originalText + '\nSYNTHETIC FOOTER TO KEEP\n');
  const before = fingerprint(f.root), oldCheckpoint = record(f, f.checkpointPath), prepared = prepare(f);
  const request = JSON.parse(prepared.line), plannedBytes = Buffer.from(request.targets[0].plannedBase64, 'base64');
  assert.ok(request.cleanup.copies.every(copy => request.inputs.some(input => input.path === copy.path)));
  const result = await run(f.label, prepared); assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  assert.equal(result.proofAccepted, true);
  for (const relative of f.selected) assert.equal(existsSync(full(f, relative)), false);
  assert.deepEqual(bytes(f, f.checkpointPath), plannedBytes);
  const expected = structuredClone(oldCheckpoint);
  expected.targets[0].before.cleanup = receipt; expected.targets[0].planned.cleanup = receipt;
  assert.deepEqual(record(f, f.checkpointPath), expected);
  assert.ok(bytes(f, f.checkpointPath).toString().startsWith('SYNTHETIC PROSE TO KEEP\n'));
  assert.ok(bytes(f, f.checkpointPath).toString().endsWith('\nSYNTHETIC FOOTER TO KEEP\n'));
  assertOriginalsRetained(f, before, [...f.selected, f.checkpointPath]);
  assert.deepEqual(readdirSync(full(f, '.kidea/checkpoints/pending')), []);
  const graph = inspectStatusGraph(f.root); assert.equal(graph.status.readState, 'OK'); assert.equal(graph.absent.size, 0);
  for (const relative of f.selected) assert.equal(graph.reads.has(relative), false, 'retired payload is not treated as live recovery input');
  assert.equal(record(f, paths.review).status, 'APPROVED');
  assert.equal(readStatus(f.root).data.reviews[0].verification.authority, 'NOT_VERIFIED');
  const targets = [{ path: 'docs/after-cleanup.md', action: 'CREATE', plannedBytes: Buffer.from('SYNTHETIC later ordinary write\n') }];
  const later = prepareInternalWrite({ root: f.root, context: f.context, targets,
    authorization: grants(f.root, targets.map(({ path, action }) => ({ path, action }))) });
  const laterResult = await run(f.label + '-later-write', later);
  assert.equal(laterResult.state, 'COMPLETED_BYTES', JSON.stringify(laterResult));
  assert.deepEqual(bytes(f, targets[0].path), targets[0].plannedBytes);
  assert.equal(readStatus(f.root).readState, 'OK');
  saveJson(`${f.label}-completed-tree.json`, fingerprint(f.root));
});

for (const copy of ['before', 'planned']) test(`one-copy cleanup keeps its unselected peer: ${copy}`, async () => {
  const f = fixture('only-' + copy, [{ targetPath: 'docs/notes.md', copy }]);
  const before = fingerprint(f.root), prepared = prepare(f), result = await run(f.label, prepared);
  assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  assert.equal(existsSync(full(f, f.selected[0])), false);
  const checkpoint = record(f, f.checkpointPath);
  assert.deepEqual(checkpoint.targets[0][copy].cleanup, receipt);
  assert.equal(checkpoint.targets[0][copy === 'before' ? 'planned' : 'before'].cleanup, null);
  assertOriginalsRetained(f, before, [...f.selected, f.checkpointPath]);
});

test('an explicitly selected older owned checkpoint can be cleaned when it is not work.checkpointRef', async () => {
  const f = fixture('old-not-current');
  editRecord(f, paths.work, work => { work.checkpointRef = ref(paths.checkpoint); });
  const currentBefore = bytes(f, paths.checkpoint), before = fingerprint(f.root);
  const result = await run(f.label, prepare(f)); assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  assert.deepEqual(bytes(f, paths.checkpoint), currentBefore);
  assert.equal(record(f, paths.work).checkpointRef.path, paths.checkpoint);
  assert.deepEqual(record(f, f.checkpointPath).targets[0].before.cleanup, receipt);
  assertOriginalsRetained(f, before, [...f.selected, f.checkpointPath]);
});

test('GROUP cleanup uses completed decomposition and children, not a synthetic stored DONE field', async () => {
  const f = fixture('group-complete', undefined, groupSeed), before = fingerprint(f.root);
  const group = record(f, paths.work).items.find(item => item.id === 'W-001');
  assert.equal(group.executionStatus, null); assert.equal(group.decomposition, 'COMPLETE');
  assert.equal(record(f, f.checkpointPath).ownerId, 'W-001');
  const result = await run(f.label, prepare(f)); assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  for (const relative of f.selected) assert.equal(existsSync(full(f, relative)), false);
  assert.deepEqual(record(f, f.checkpointPath).targets[0].before.cleanup, receipt);
  assertOriginalsRetained(f, before, [...f.selected, f.checkpointPath]);
});
test('GROUP PARTIAL decomposition rejects despite all current children DONE', () => {
  const f = fixture('group-partial', undefined, groupSeed);
  editRecord(f, paths.work, work => { work.items.find(item => item.id === 'W-001').decomposition = 'PARTIAL'; });
  reject(f, 'OWNER_NOT_COMPLETE');
});
test('STEP GROUP without its mandatory gate rejects cleanup despite completed children', () => {
  const f=fixture('group-no-gate',undefined,groupSeed);
  editRecord(f,paths.work,work=>{work.items.find(item=>item.id==='W-001').gateIds=[];});
  reject(f,'OWNER_NOT_COMPLETE');
});
test('GROUP COMPLETE decomposition with an incomplete child rejects', () => {
  const f = fixture('group-incomplete-child', undefined, groupSeed);
  editRecord(f, paths.work, work => { work.items.find(item => item.id === 'W-002').executionStatus = 'TODO'; });
  reject(f, 'OWNER_NOT_COMPLETE');
});

test('DONE/APPROVED record labels do not grant cleanup', () => {
  const f = fixture('missing-grant'); assert.equal(readStatus(f.root).data.reviews[0].recordedStatus, 'APPROVED');
  delete f.args.authorization.cleanup; reject(f, 'CLEANUP_AUTHORIZATION_REQUIRED');
});
test('cleanup cannot opt into restoring a deleted payload through UPDATE restoration', () => {
  const f = fixture('restore-not-authorized'); f.args.authorization.allowRestoreUpdate = true; reject(f, 'CLEANUP_AUTHORIZATION_REQUIRED');
});
for (const condition of ['ownerCompleted', 'requiredChecksPassed', 'retentionEnded']) for (const variant of ['false', 'missing']) {
  test(`explicit cleanup condition ${condition} cannot be ${variant}`, () => {
    const f = fixture(`${condition}-${variant}`);
    if (variant === 'false') f.args.authorization.cleanup.conditions[condition] = false;
    else delete f.args.authorization.cleanup.conditions[condition];
    reject(f, 'CLEANUP_CONDITIONS_REQUIRED');
  });
}
test('missing cleanup conditions are not inferred from evidence text', () => {
  const f = fixture('missing-conditions'); delete f.args.authorization.cleanup.conditions; reject(f, 'CLEANUP_CONDITIONS_REQUIRED');
});
test('a missing exact copy allowlist rejects cleanup', () => {
  const f = fixture('missing-copy-grants'); delete f.args.authorization.cleanup.copies; reject(f, 'CLEANUP_TARGETS_REQUIRED');
});
for (const [label, change] of [
  ['wrong-copy-path', grant => { grant.path += '.other'; }],
  ['wrong-copy-integrity', grant => { grant.integrity.value = '0'.repeat(64); }],
]) test(`copy grant must bind exact path and integrity: ${label}`, () => {
  const f = fixture(label); change(f.args.authorization.cleanup.copies[0]); reject(f, 'CLEANUP_COPY_NOT_AUTHORIZED');
});
test('receipt checkpoint UPDATE also needs the exact target grant', () => {
  const f = fixture('wrong-checkpoint-grant'); f.args.authorization.targets[0].path = paths.checkpoint; reject(f, 'TARGET_NOT_AUTHORIZED');
});
test('owner still IN_PROGRESS rejects even with completion conditions asserted', () => {
  const f = fixture('owner-active');
  editRecord(f, paths.work, work => { work.currentItemId = 'W-002'; work.items.find(item => item.id === 'W-002').executionStatus = 'IN_PROGRESS'; });
  reject(f, 'OWNER_NOT_COMPLETE');
});
test('owner gate still IN_REVIEW rejects cleanup', () => {
  const f = fixture('gate-open'); editRecord(f, paths.review, review => { review.status = 'IN_REVIEW'; review.confirmationRef = null; }); reject(f, 'OWNER_NOT_COMPLETE');
});
test('changed recovery-copy bytes reject before deletion', () => {
  const f = fixture('copy-changed'); writeFileSync(full(f, f.selected[0]), 'SYNTHETIC changed recovery payload\n');
  reject(f, 'GRAPH_NOT_VALID', error => assert.ok(error.diagnostics.some(d => d.code === 'CONTENT_MISMATCH')));
});
test('legacy checkpoint is not reclassified as this worker own operation', () => {
  const f = fixture('legacy-not-own'); f.args.checkpointPath = paths.checkpoint; reject(f, 'NOT_OWN_CHECKPOINT');
});
test('matching bytes in an unknown copy outside the operation layout never become a deletion target', () => {
  const f = fixture('unknown-copy');
  const unknown = '.kidea/checkpoints/unknown-copy.bin'; writeFileSync(full(f, unknown), bytes(f, f.selected[0]), { flag: 'wx' });
  editRecord(f, f.checkpointPath, checkpoint => { checkpoint.targets[0].before.version.location.ref.path = unknown; });
  reject(f, 'NOT_OWN_RECOVERY_COPY');
});
test('another live ordinary Ref to the selected copy prevents projected deletion', () => {
  const f = fixture('live-ref'); editRecord(f, paths.work, work => { work.items[0].inputRefs.push(ref(f.selected[0])); });
  reject(f, 'GRAPH_NOT_VALID', error => assert.ok(error.diagnostics.some(d => d.code === 'MISSING_FILE' && d.file === f.selected[0])));
});
test('a different current checkpoint still depending on the same recovery copy prevents deletion', () => {
  const f = fixture('shared-copy'), other = '.kidea/checkpoints/another-live-checkpoint.md';
  writeFileSync(full(f, other), bytes(f, f.checkpointPath), { flag: 'wx' });
  editRecord(f, other, checkpoint => { checkpoint.id = 'SYNTHETIC-OTHER-CHECKPOINT'; });
  editRecord(f, paths.work, work => { work.checkpointRef = ref(other); });
  reject(f, 'GRAPH_NOT_VALID', error => assert.ok(error.diagnostics.some(d => d.code === 'MISSING_FILE' && d.file === f.selected[0])));
});
test('a retained checkpoint reached through resultRefs still protects its shared recovery copy', () => {
  const f = fixture('generic-ref-shared-copy'), other = '.kidea/checkpoints/retained-result-checkpoint.md';
  writeFileSync(full(f, other), bytes(f, f.checkpointPath), { flag: 'wx' });
  editRecord(f, other, checkpoint => { checkpoint.id = 'SYNTHETIC-RETAINED-RESULT-CHECKPOINT'; });
  editRecord(f, paths.work, work => { work.items.find(item => item.id === 'W-002').resultRefs.push(ref(other)); });
  assert.equal(readStatus(f.root).readState, 'OK');
  reject(f, 'GRAPH_NOT_VALID');
});
for(const name of ['CHECKPOINT.MD','retained.md','retained.bin','prepared.md','observations/0001.md'])test(`directly retained checkpoint dependencies cannot be hidden by basename: ${name}`,()=>{
  const f=fixture(`retained-name-${name.replaceAll('/','-')}`),other=`.kidea/checkpoints/operations/retained-proof/${name}`;
  mkdirSync(path.dirname(full(f,other)),{recursive:true});
  writeFileSync(full(f,other),bytes(f,f.checkpointPath),{flag:'wx'});
  editRecord(f,other,checkpoint=>{checkpoint.id='SYNTHETIC-RETAINED-NAME';});
  editRecord(f,paths.work,work=>{work.items.find(item=>item.id==='W-002').resultRefs.push(ref(other));});
  assert.equal(readStatus(f.root).readState,'OK');
  reject(f,'GRAPH_NOT_VALID',error=>assert.ok(error.diagnostics.some(d=>d.code==='MISSING_FILE'&&d.file===f.selected[0])));
});
for(const marker of ['<!-- kidea:data:start -->','<!-- kidea:data:end -->'])test(`malformed retained record is not silently treated as raw evidence: ${marker}`,()=>{
  const f=fixture('malformed-retained'),other='.kidea/checkpoints/retained-evidence.bin';
  writeFileSync(full(f,other),marker,{flag:'wx'});
  editRecord(f,paths.work,work=>{work.items.find(item=>item.id==='W-002').resultRefs.push(ref(other));});
  reject(f,'GRAPH_NOT_VALID',error=>assert.ok(error.diagnostics.some(d=>d.code==='ENVELOPE')));
});
test('receipt must include an evidenceRef', () => {
  const f = fixture('missing-receipt-ref'); delete f.args.receipt.evidenceRef; reject(f, 'INVALID_CLEANUPRECEIPT');
});
test('receipt evidenceRef must resolve in the projected graph', () => {
  const f = fixture('missing-receipt-source'); f.args.receipt.evidenceRef.path = 'docs/missing-cleanup-evidence.md';
  reject(f, 'GRAPH_NOT_VALID', error => assert.ok(error.diagnostics.some(d => d.code === 'MISSING_FILE')));
});

test('native reacquisition rejects copy bytes changed after cleanup prepare', async () => {
  const f = fixture('native-copy-changed'), prepared = prepare(f);
  writeFileSync(full(f, f.selected[0]), 'SYNTHETIC external change after prepare\n'); const before = fingerprint(f.root);
  const result = await run(f.label, prepared); assert.equal(result.state, 'REJECTED', JSON.stringify(result));
  assert.equal(result.proofAccepted, false); assert.deepEqual(fingerprint(f.root), before);
  assert.equal(record(f, f.checkpointPath).targets[0].before.cleanup, null);
});

for (const fault of ['CLEANUP_DELETE_FAILURE', 'CLEANUP_AFTER_FIRST_DELETE', 'CLEANUP_RECEIPT_FAILURE']) {
  test(`cleanup fault retains pending and never publishes false completion: ${fault}`, async () => {
    const f = fixture(fault), before = fingerprint(f.root), oldCheckpoint = bytes(f, f.checkpointPath), prepared = prepare(f);
    const result = await run(f.label, prepared, { testFault: fault });
    assertPendingNoReplay(f, result, prepared);
    const remaining = f.selected.map(relative => existsSync(full(f, relative)));
    if (fault === 'CLEANUP_DELETE_FAILURE') {
      assert.deepEqual(remaining, [true, true]); assert.deepEqual(bytes(f, f.checkpointPath), oldCheckpoint);
      assert.equal(result.events.findLast(event => event.event === 'RESULT').effects, false);
    } else if (fault === 'CLEANUP_AFTER_FIRST_DELETE') {
      assert.deepEqual(remaining, [false, true]); assert.deepEqual(bytes(f, f.checkpointPath), oldCheckpoint);
      assert.equal(record(f, f.checkpointPath).targets[0].before.cleanup, null);
      assert.equal(record(f, f.checkpointPath).targets[0].planned.cleanup, null);
    } else {
      assert.deepEqual(remaining, [false, false]);
      assert.notDeepEqual(bytes(f, f.checkpointPath), Buffer.from(JSON.parse(prepared.line).targets[0].plannedBase64, 'base64'));
      // A partial checkpoint is not assumed parseable or complete. If any
      // receipt is readable, it may describe only a payload already absent.
      let partial; try { partial = record(f, f.checkpointPath); } catch { /* partial JSON is retained for reconciliation */ }
      if (partial) for (const copy of ['before', 'planned']) if (partial.targets[0][copy].cleanup !== null) {
        assert.deepEqual(partial.targets[0][copy].cleanup, receipt);
        assert.equal(existsSync(full(f, partial.targets[0][copy].version.location.ref.path)), false);
      }
    }
    assertOriginalsRetained(f, before, [...f.selected.filter((_, i) => !remaining[i]), ...(fault === 'CLEANUP_RECEIPT_FAILURE' ? [f.checkpointPath] : [])]);
    saveJson(`${f.label}-pending-tree.json`, fingerprint(f.root));
  });
}

test('kill after first actual deletion leaves pending, old null receipts and no automatic replay', async () => {
  const f = fixture('kill-first-delete'), before = fingerprint(f.root), checkpointBefore = bytes(f, f.checkpointPath), prepared = prepare(f);
  let reached = false;
  const result = await run(f.label, prepared, { testBarrier: 'CLEANUP_AFTER_FIRST_DELETE', onBarrier: (_event, control) => {
    reached = true; control.kill(); return false;
  } });
  assert.equal(reached, true); assertPendingNoReplay(f, result, prepared);
  assert.equal(existsSync(full(f, f.selected[0])), false); assert.equal(existsSync(full(f, f.selected[1])), true);
  assert.deepEqual(bytes(f, f.checkpointPath), checkpointBefore);
  assert.equal(record(f, f.checkpointPath).targets[0].before.cleanup, null);
  assert.equal(record(f, f.checkpointPath).targets[0].planned.cleanup, null);
  assertOriginalsRetained(f, before, [f.selected[0]]);
});

test('a foreign file recreated at a deleted copy path is retained and never reported absent', async () => {
  const f = fixture('foreign-recreated-copy'), before = fingerprint(f.root), checkpointBefore = bytes(f, f.checkpointPath), prepared = prepare(f);
  const foreign = Buffer.from('SYNTHETIC foreign file created after owned payload deletion\n');
  let reached = false;
  const result = await run(f.label, prepared, { testBarrier: 'CLEANUP_AFTER_FIRST_DELETE', onBarrier: () => {
    reached = true; writeFileSync(full(f, f.selected[0]), foreign, { flag: 'wx' });
  } });
  assert.equal(reached, true); assertPendingNoReplay(f, result, prepared);
  assert.deepEqual(bytes(f, f.selected[0]), foreign);
  assert.deepEqual(bytes(f, f.checkpointPath), checkpointBefore);
  assert.equal(record(f, f.checkpointPath).targets[0].before.cleanup, null);
  const terminal = result.events.findLast(event => event.event === 'RESULT');
  assert.equal(terminal.safetyLost, true);
  const deleted = terminal.deleted.find(copy => copy.path === f.selected[0]);
  assert.equal(deleted.absent, false);
  assertOriginalsRetained(f, before, [f.selected[0]]);
});

for (const which of ['checkpoint', 'copy']) test(`pre-existing editor of cleanup ${which} prevents any deletion`, async () => {
  const f = fixture('editor-' + which), prepared = prepare(f), before = fingerprint(f.root);
  const descriptor = openSync(full(f, which === 'checkpoint' ? f.checkpointPath : f.selected[0]), 'r+');
  let result;
  try { result = await run(f.label, prepared); } finally { closeSync(descriptor); }
  assert.equal(result.state, 'REJECTED', JSON.stringify(result)); assert.equal(result.proofAccepted, false);
  assert.equal(result.events.findLast(event => event.event === 'RESULT').code, 'WIN32_32');
  assert.deepEqual(fingerprint(f.root), before);
});

test('a second ordinary writer conflicts with held cleanup leases and cannot create its target', async () => {
  const f = fixture('second-writer'), prepared = prepare(f);
  const targets = [{ path: 'docs/second-writer.md', action: 'CREATE', plannedBytes: Buffer.from('SYNTHETIC contender\n') }];
  const contender = prepareInternalWrite({ root: f.root, context: f.context, targets,
    authorization: grants(f.root, targets.map(({ path, action }) => ({ path, action }))) });
  let contenderResult, reached = false;
  const result = await run(f.label, prepared, { testBarrier: 'CLEANUP_BEFORE_DELETE', onBarrier: async () => {
    reached = true; contenderResult = await run(f.label + '-contender', contender);
  } });
  assert.equal(reached, true); assert.equal(contenderResult.state, 'REJECTED', JSON.stringify(contenderResult));
  assert.equal(contenderResult.proofAccepted, false); assert.equal(existsSync(full(f, targets[0].path)), false);
  assert.equal(result.state, 'COMPLETED_BYTES', JSON.stringify(result));
  for (const relative of f.selected) assert.equal(existsSync(full(f, relative)), false);
  assert.deepEqual(readdirSync(full(f, '.kidea/checkpoints/pending')), []);
});

test.after(() => {
  const after = sourceHashes(), inputsUnchanged = JSON.stringify(initialHashes) === JSON.stringify(after);
  saveJson('summary.json', { at: new Date().toISOString(), runRoot, workerRuns, rejectedPlans, fixtures: fixtureNumber,
    inputsUnchanged, before: initialHashes, after });
  assert.equal(inputsUnchanged, true, 'source edits while cleanup integration runs invalidate hash attribution');
});

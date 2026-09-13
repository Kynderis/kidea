// Read-only QA of the fixture catalog. This is NOT the Kidea parser/validator.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildBase, buildCases, dataAt, paths, digest, sourceCommit } from './catalog.mjs';

assert.equal(process.versions.node.split('.')[0], '24');
const folder = fileURLToPath(new URL('./', import.meta.url));
const diskState = () => {
  const files = readdirSync(folder, { withFileTypes: true }).filter(e => e.isFile()).map(e => e.name).sort();
  return files.map(name => ({ name, sha256: createHash('sha256').update(readFileSync(path.join(folder,name))).digest('hex') }));
};
const diskBefore = diskState();
const fingerprint = world => createHash('sha256').update(JSON.stringify(world)).digest('hex');
const baseline = buildBase().world;
const before = fingerprint(baseline);
let ordinaryRefs = 0, versionRefs = 0, historicalSourceDifferences = 0, absentPlannedSources = 0;
function checkRef(r) {
  assert.equal(typeof r.path, 'string');
  assert.ok(!r.path.startsWith('/') && !r.path.includes('\\') && !r.path.split('/').includes('..') && !r.path.includes(':'));
  assert.ok(Object.hasOwn(baseline.files,r.path), `baseline ref missing: ${r.path}`);
  if (r.anchor !== null) assert.ok(baseline.files[r.path].includes(`id="${r.anchor}"`), `baseline anchor missing: ${r.path}#${r.anchor}`);
  ordinaryRefs++;
}
function walk(value) {
  if (!value || typeof value !== 'object') return;
  if (value.location && value.integrity && Object.hasOwn(value,'source')) {
    assert.equal(value.location.kind,'SNAPSHOT', 'Baseline intentionally uses local snapshots only');
    checkRef(value.location.ref);
    const text = baseline.files[value.location.ref.path];
    assert.deepEqual(value.integrity,digest(text), `snapshot bytes mismatch: ${value.location.ref.path}`);
    if (value.source?.anchor) assert.ok(text.includes(`id="${value.source.anchor}"`));
    if (value.source && !Object.hasOwn(baseline.files,value.source.path)) absentPlannedSources++;
    else if (value.source && baseline.files[value.source.path] !== text) historicalSourceDifferences++;
    versionRefs++;
    return; // source denotes historical/planned location, not a current Ref existence requirement.
  }
  if (Object.keys(value).length === 2 && Object.hasOwn(value,'path') && Object.hasOwn(value,'anchor')) { checkRef(value); return; }
  for (const child of Object.values(value)) walk(child);
}
for (const file of [paths.index,paths.work,paths.review,paths.checkpoint,paths.release,paths.operation]) {
  const record=dataAt(baseline,file);
  assert.equal(record.schemaVersion,2);
  assert.equal(record.projectId,'synthetic-r02-t04');
  walk(record);
}
walk(baseline.extraRefs);
assert.ok(absentPlannedSources > 0, 'CREATE planned source should not exist');
assert.ok(historicalSourceDifferences > 0, 'History/planned bytes should differ from current source');
const cases=buildCases();
assert.equal(cases.length,51);
assert.equal(new Set(cases.map(c=>c.id)).size,cases.length);
const counts={};
for (const c of cases) {
  assert.match(c.id,/^[BVACRS]\d{2}$/);
  assert.ok(c.ka.length && c.ka.every(k=>/^KA-\d{2}$/.test(k)));
  assert.ok(c.expected && c.reason);
  if(c.id!=='B01') assert.notEqual(fingerprint(c.world),before,`unchanged variant ${c.id}`);
  counts[c.id[0]]=(counts[c.id[0]]??0)+1;
}
assert.equal(fingerprint(baseline),before);
// Recipe consistency checks only: assertions about constructed inputs, not Kidea's decisions.
const byId = id => cases.find(c=>c.id===id).world;
const matchingGit = dataAt(byId('C08'),paths.checkpoint).targets[0].before.version;
assert.deepEqual(digest(byId('C08').syntheticGit[`${matchingGit.location.commit}:${matchingGit.location.path}`]),matchingGit.integrity);
const oldGit = dataAt(byId('C09'),paths.checkpoint).targets[0].before.version;
assert.notDeepEqual(digest(byId('C09').syntheticGit[`${oldGit.location.commit}:${oldGit.location.path}`]),oldGit.integrity);
assert.ok(!Object.hasOwn(byId('C03').files,'docs/new.md'));
assert.deepEqual(dataAt(byId('C04'),paths.checkpoint).observations.at(-1).results.map(r=>r.match),['OTHER','BEFORE']);
assert.equal(dataAt(byId('C11'),paths.work).items[1].executionStatus,'DONE');
assert.equal(dataAt(byId('C11'),paths.review).status,'APPROVED');
assert.ok(!Object.hasOwn(byId('C11').files,'.kidea/checkpoints/before.snapshot'));
assert.ok(Object.hasOwn(byId('C11').files,'.kidea/reviews/evidence/source.snapshot'));
assert.equal(dataAt(byId('R03'),paths.operation2).previousAttemptId,'OP-001');
assert.equal(dataAt(byId('R04'),paths.operation).observations.length,2);
assert.equal(dataAt(byId('R08'),paths.work).rounds[0].releaseRef.revision,2);
assert.equal(dataAt(byId('R08'),paths.operation).release.revision,1);
assert.deepEqual(diskState(),diskBefore);
console.log(JSON.stringify({ sourceCommit, synthetic:true, virtualBaselineFiles:Object.keys(baseline.files).length,
  baselineFingerprint:before, baselineRecordEnvelopes:6, ordinaryRefs,versionRefs,historicalSourceDifferences,absentPlannedSources,
  variantsBuiltInMemory:cases.length,counts,fixtureDiskUnchanged:true,kideaRuntimeRun:false,semanticExpectedExecuted:false,disk:diskBefore},null,2));

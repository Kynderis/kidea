import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readStatus } from '../.agents/skills/kidea/scripts/status.mjs';
import { buildBase, buildCases, edit, paths, digest, dataAt, envelope } from './fixtures/r02-t04/catalog.mjs';

const repo=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(repo,'.test-output','r02-t05');mkdirSync(output,{recursive:true});
function materialize(world) {
  const root=mkdtempSync(path.join(output,'case-'));
  for(const [p,value] of Object.entries(world.files)){const dest=path.join(root,p);mkdirSync(path.dirname(dest),{recursive:true});writeFileSync(dest,value);}
  return root;
}
function fingerprint(root) {return Object.fromEntries(readdirSync(root,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>{const p=path.join(e.parentPath,e.name);return [path.relative(root,p),createHash('sha256').update(readFileSync(p)).digest('hex')];}));}
function check(world,expected) {const root=materialize(world),before=fingerprint(root);const result=readStatus(root);assert.equal(result.readState,expected,JSON.stringify(result.diagnostics));assert.deepEqual(fingerprint(root),before);assert.equal(result.data===null,expected!=='OK');return {root,result};}

test('baseline returns actual pending work and unknown backend, not authority',()=>{
  const {result}=check(buildBase().world,'OK');
  assert.equal(result.data.currentItemId,'W-002');
  assert.equal(result.data.reviews[0].recordedStatus,'IN_REVIEW');
  assert.equal(result.data.reviews[0].verification.authority,'NOT_VERIFIED');
  assert.equal(result.data.deploymentObservations[0].observations[0].components[1].result,'UNKNOWN');
});
// These are reader results, not execution/authorization verdicts of the T04 recipes.
// R05 only changes world.extraRefs (not a source record), so is not a CLI input case.
// V07 needs semantic review even if a file declares its own change non-semantic.
const expected={V01:'INCOMPLETE',V02:'INCOMPLETE',V03:'INCOMPLETE',V04:'INVALID',V05:'INVALID',V06:'INCOMPLETE',V07:'INCOMPLETE',V08:'INCOMPLETE',A01:'OK',A02:'INVALID',A03:'OK',A04:'INVALID',A05:'INVALID',A06:'INVALID',A07:'INVALID',A08:'INVALID',A09:'INVALID',C01:'OK',C02:'OK',C03:'OK',C04:'OK',C05:'INVALID',C06:'INVALID',C07:'INCOMPLETE',C08:'INCOMPLETE',C09:'INCOMPLETE',C10:'INVALID',C11:'OK',C12:'INVALID',C13:'OK',C14:'INVALID',C15:'INVALID',C16:'OK',R01:'INCOMPLETE',R02:'OK',R03:'OK',R04:'OK',R06:'INVALID',R07:'INVALID',R08:'OK',S01:'UNSUPPORTED',S02:'INVALID',S03:'INVALID',S04:'INVALID',S05:'INVALID',S06:'UNSUPPORTED',S07:'OK',S08:'INVALID',S09:'INVALID'};
for(const c of buildCases())if(expected[c.id])test(`schema-2 ${c.id}: ${c.reason}`,()=>check(c.world,expected[c.id]));
test('strict syntax: comments, trailing commas, escaped duplicate keys',()=>{
  for(const replacement of ['"schemaVersion": 2, // comment','"schemaVersion": 2, "schema\\u0056ersion": 2,']){
    const {world}=buildBase();world.files[paths.index]=world.files[paths.index].replace('"schemaVersion": 2,',replacement);check(world,'INVALID');
  }
  const {world}=buildBase();world.files[paths.index]=world.files[paths.index].replace(/\n}\n/,',\n}\n');check(world,'INVALID');
});
test('missing INDEX does not search ancestors, init, or write',()=>{const root=materialize(buildBase().world);const nested=path.join(root,'nested');mkdirSync(nested);const before=fingerprint(root);assert.equal(readStatus(nested).readState,'INCOMPLETE');assert.deepEqual(fingerprint(root),before);});
test('detect mutation between read and output',()=>{const root=materialize(buildBase().world);const result=readStatus(root,{beforeRecheck:()=>writeFileSync(path.join(root,'docs/features.md'),'changed by test')});assert.equal(result.readState,'INCOMPLETE');assert.equal(result.data,null);assert.ok(result.diagnostics.some(d=>d.code==='SOURCE_CHANGED'));});
test('Unicode and CRLF in record preserve snapshot byte identity',()=>{const {world}=buildBase();world.files[paths.index]=world.files[paths.index].replace(/\n/g,'\r\n');check(world,'OK');});
test('invalid UTF8 does not use replacement characters',()=>{const root=materialize(buildBase().world);writeFileSync(path.join(root,paths.index),Buffer.from([0xff,0xfe]));assert.equal(readStatus(root).readState,'INVALID');});
test('junction outside root is rejected before opening target',()=>{const {world}=buildBase();const outside=materialize(world);edit(world,paths.index,d=>{d.workRef.path='escape/.kidea/work.md';});const root=materialize(world);symlinkSync(outside,path.join(root,'escape'),'junction');const r=readStatus(root);assert.equal(r.readState,'INVALID');assert.ok(r.diagnostics.some(d=>d.code==='UNSAFE_PATH'));});
test('CLI status output streams and exit codes',()=>{const {root}=check(buildBase().world,'OK');const helper=path.join(repo,'.agents/skills/kidea/scripts/kidea.mjs');const good=spawnSync(process.execPath,[helper,'status'],{cwd:root,encoding:'utf8'});assert.equal(good.status,0);assert.equal(good.stderr,'');assert.equal(JSON.parse(good.stdout).readState,'OK');const bad=spawnSync(process.execPath,[helper,'status'],{cwd:output,encoding:'utf8'});assert.equal(bad.status,1);assert.equal(bad.stdout,'');assert.equal(JSON.parse(bad.stderr).data,null);});

test('parents, dependencies, current item and source uniqueness',()=>{
  const mutations=[d=>{d.items[0].parentId='W-002';},d=>{d.items[0].dependencyIds=['W-002'];d.items[1].dependencyIds=['W-001'];},d=>{d.currentItemId='MISSING';},d=>{d.items[1].executionStatus='DONE';},d=>{d.items[1].gateIds=['missing'];}];
  for(const mutate of mutations){const {world}=buildBase();edit(world,paths.work,mutate);check(world,'INVALID');}
});
test('diagnostic positions point to original CRLF file and do not echo secret value',()=>{const {world}=buildBase();edit(world,paths.index,d=>{d.schemaVersion='SECRET_SENTINEL';});world.files[paths.index]=world.files[paths.index].replace(/\n/g,'\r\n');const {result}=check(world,'UNSUPPORTED');assert.ok(result.diagnostics[0].line>0);assert.ok(!JSON.stringify(result).includes('SECRET_SENTINEL'));});
test('real local Git commit protects exact before bytes, rejects changed identity',()=>{
  const {world,refs}=buildBase();const root=materialize(world);
  const git=args=>{const r=spawnSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
  git(['init','--quiet']);git(['add','--','docs/notes.md']);git(['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','-c','core.hooksPath=NUL','commit','--quiet','-m','Synthetic before bytes']);
  const commit=git(['rev-parse','HEAD']);
  edit(world,paths.checkpoint,d=>{d.targets[0].before.version={...refs.before,location:{kind:'GIT',commit,path:'docs/notes.md'}};});
  writeFileSync(path.join(root,paths.checkpoint),world.files[paths.checkpoint]);
  const before=fingerprint(root);assert.equal(readStatus(root).readState,'OK');assert.deepEqual(fingerprint(root),before);
  edit(world,paths.checkpoint,d=>{d.targets[0].before.version.integrity.value='0'.repeat(64);});writeFileSync(path.join(root,paths.checkpoint),world.files[paths.checkpoint]);assert.equal(readStatus(root).readState,'INCOMPLETE');
});

test('review cannot use live source as its retained snapshot',()=>{const {world}=buildBase();edit(world,paths.review,d=>{d.subjectVersions[0].location.ref.path='docs/features.md';});check(world,'INVALID');});
test('pinned release must satisfy uniqueness even when not listed as current source',()=>{
  const {world}=buildBase();edit(world,paths.index,d=>{d.sources=d.sources.filter(s=>s.ref.path!==paths.release);});
  const release=dataAt(world,paths.release);release.components.push(structuredClone(release.components[0]));
  const pin=dataAt(world,paths.work).rounds[0].releaseRef.recordVersion.location.ref.path;
  world.files[pin]=envelope(release);
  for(const p of [paths.work,paths.operation])edit(world,p,d=>{const r=d.kind==='work'?d.rounds[0].releaseRef:d.release;r.recordVersion.integrity=digest(world.files[pin]);});
  check(world,'INVALID');
});
test('history may preserve an earlier state of the same revision',()=>{const {world}=buildBase();const r=dataAt(world,paths.review);const pin=r.historyRefs[0].location.ref.path;const old=dataAt(world,pin);old.revision=r.revision;world.files[pin]=envelope(old);edit(world,paths.review,d=>{d.historyRefs[0].integrity=digest(world.files[pin]);});check(world,'OK');});
test('round release reference must match current release revision',()=>{const {world}=buildBase();edit(world,paths.work,d=>{d.rounds[0].releaseRef.revision=99;});check(world,'INVALID');});

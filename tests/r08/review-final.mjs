// Read-only evidence review. This is not a substitute for Human acceptance.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {hash,verify} from './product-build-r1/verify.mjs';
const repo=path.resolve(import.meta.dirname,'../..');process.chdir(repo);
const read=p=>JSON.parse(fs.readFileSync(p));
const plan='tests/r08/cloud-r1',manifest=read(plan+'/manifest.json');verify(plan,manifest.files,{packageManifest:true});
const id=hash(plan+'/manifest.json'),root='tests/evidence/r08/cloud-execution-r1/'+id.slice(0,10);
assert.equal(hash(root+'/source/manifest.json'),id);verify(root+'/source',manifest.files,{packageManifest:true});
const summary=read(root+'/summary.json');assert.equal(summary.pass,true);assert.equal(summary.clean,true);assert.equal(summary.manifest,id);
for(const name of ['workload','recovery']){const r=read(root+'/'+name+'-web-readback.json');assert.equal(r.code,0);assert.equal(r.sourceSHA256,hash('tests/r08/cloud-readback.mjs'));assert.ok(r.stdout.includes('bc17c508ffeed0ec622934f9b7fa72f8e78da65350e63c3eceb56fa688aa5e12  /proc/1/exe'));assert.ok(r.stdout.includes('/payload/web/build/index.js'));}
const logs=fs.readdirSync(root+'/logs').sort().map(name=>({name,data:read(root+'/logs/'+name)}));
const one=suffix=>{const items=logs.filter(r=>r.name.endsWith('-'+suffix+'.json'));assert.equal(items.length,1,suffix);return items[0].data;};
const identity=read('tests/evidence/r08/b2-execution-r1/cloud-image-identity.json');
const loads=logs.filter(r=>r.data.args?.at(-1)==='sh /home/kidealab/remote.sh load');assert.equal(loads.length,3);
for(const {data:r} of loads){assert.equal(r.code,0);assert.ok(r.stdout.includes('Loaded image ID: '+identity.classicDockerConfigID));const line=r.stdout.split('\n').find(l=>l.startsWith('["sha256:'));assert.deepEqual(JSON.parse(line),identity.sameRootfsDiffIDs);}
const first=one('before-disconnect'),progress=one('independent-progress'),alarm=one('host-loss-alert'),backup=one('off-host-backup'),restored=one('restored-database'),recovery=one('recovery');
const healthy=rows=>rows.filter(r=>r.state==='HEALTHY');
assert.ok(healthy(progress).length>healthy(first).length);assert.ok(healthy(progress).at(-1).counts.domain>healthy(first).at(-1).counts.domain);
assert.ok(alarm.slice(progress.length).some(r=>r.state==='ALERT'));
assert.deepEqual(restored,backup.info);assert.equal(recovery.at(-1).state,'HEALTHY');assert.ok(recovery.at(-1).counts.domain>backup.info.domain);
const cleanup=logs.filter(r=>r.name.endsWith('-cleanup-readback.json'));assert.equal(cleanup.length,5);for(const r of cleanup)assert.deepEqual(r.data.remaining,[]);
const attempts=fs.readdirSync('tests/evidence/r08/cloud-execution-r1').filter(n=>/^[a-f0-9]{10}$/.test(n)).map(n=>({id:n,...read('tests/evidence/r08/cloud-execution-r1/'+n+'/summary.json')}));for(const a of attempts)assert.equal(a.clean,true);
const local=read('tests/evidence/r08/final-r1/preservation.json');assert.equal(local.pass,true);
const core=read('tests/evidence/r08/final-r1/core-raw/summary.json');assert.equal(core.exitCode,0);assert.equal(core.inputsUnchanged,true);
for(const [name,expected] of Object.entries(core.before))assert.equal(hash(name),expected,'CORE_CHANGED_AFTER_FINAL:'+name);
const b2=read('tests/evidence/r08/b2-execution-r1/attempt-3/summary.json');assert.equal(b2.pass,true);
const b2Plan='tests/r08/delivery-r1',b2Manifest=read(b2Plan+'/manifest.json');verify(b2Plan,b2Manifest.files,{packageManifest:true});assert.equal(hash(b2Plan+'/manifest.json'),b2.manifest);assert.equal(hash('tests/evidence/r08/b2-execution-r1/attempt-3/source/manifest.json'),b2.manifest);
assert.equal(hash('tests/evidence/r08/delivery-inputs-r1.json'),b2Manifest.inputs);
const mutants=read('tests/evidence/r08/final-r1/mutation-output/mutations-eight-final/results.json');assert.equal(mutants.length,6);for(const r of mutants)assert.equal(r.detected,true,r.name);
const browser=read('tests/evidence/r08/final-r1/product-results/results.json');assert.equal(browser.stats.expected,18);for(const key of ['unexpected','flaky','skipped'])assert.equal(browser.stats[key],0,key);
console.log(JSON.stringify({at:new Date().toISOString(),status:'REVIEW_READY_PENDING_HUMAN',cloudManifest:id,cloudSummary:summary,attempts,loadedSameImage:loads.length,healthyBefore:healthy(first).length,healthyIndependent:healthy(progress).length,alertsAfterHostLoss:alarm.slice(progress.length).filter(r=>r.state==='ALERT').length,backupSHA256:backup.sha256,restoredCounts:{domain:restored.domain,result:restored.result,audit:restored.audit,outbox:restored.outbox},recovered:recovery.at(-1),cleanup:cleanup.map(r=>r.data),limits:['finite synthetic lab using real B1 binaries','no production/performance certification','Mac was not powered off','R09 real pilot and R09-T14 NOT_RUN','Apple Silicon NOT_RUN']},null,2));

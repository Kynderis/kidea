// Evidence review only; does not rerun workloads or grant Human acceptance.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'../..');
const dir=path.join(root,'tests/evidence/r05');
const sample=path.resolve(root,'../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const read=p=>JSON.parse(fs.readFileSync(path.join(dir,p)));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const m=read('backend-execution-r5/manifest.json');
for(const [name,item]of Object.entries(m.sources))assert.equal(sha(path.join(sample,name)),item.sha256,name);
for(const [name,item]of Object.entries(read('profile-r1/manifest.json').snapshots))assert.equal(sha(path.resolve(sample,'../../..',name)),item.sha256,name);
const core=read('backend-execution-r5/core-local/summary.json');assert.equal(core.exitCode,0);assert.equal(core.inputsUnchanged,true);
const stage=name=>{const s=m.stages.find(s=>s.stage===name);assert.ok(s,name);assert.equal(s.code,0,name);assert.equal(s.timedOut,false);return fs.readFileSync(path.join(dir,'backend-execution-r5',s.directory,'stdout.log'),'utf8');};
for(const name of ['cpp-tidy-fixed','cpp-four-presets','cpp-after-mutants','writer-sanitizers','https','layers','header','browser-https','browser-https-repeat','edge-drain-final','inventory'])stage(name);
assert.match(stage('https'),/"passed":38/);
for(const name of ['browser-https','browser-https-repeat'])assert.match(stage(name),/"passed":8,"failed":0/);
assert.equal((stage('mutations').match(/DETECTED/g)||[]).length,6);
for(const preset of ['dev','asan-ubsan','tsan','release']){
 const xml=fs.readFileSync(path.join(dir,'backend-execution-r5/cpp-results',preset+'.xml'),'utf8');
 assert.equal((xml.match(/<testcase\b/g)||[]).length,12);assert.doesNotMatch(xml,/<(?:failure|skipped)\b/);
}
const old=read('backend-execution-r4/runtime-inventory.json'),now=read('backend-execution-r5/runtime-inventory.json');
assert.deepEqual(now.webVolumeMatchesHostSource,old.webVolumeMatchesHostSource);assert.equal(now.binaries.caddy,old.binaries.caddy);
const groups=read('backend-execution-r5/matrix-status.json').groups;assert.equal(Object.keys(groups).length,22);assert.ok(Object.values(groups).every(v=>v.startsWith('PASS')));
const budgets=read('backend-execution-r5/quota-verification.json');assert.ok(budgets.maxCpu<=2&&budgets.maxMemory<=4*1024**3);assert.equal(budgets.overCapLaunchRejected,true);
const result={at:new Date().toISOString(),sourceHead:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),status:'TECHNICAL_EVIDENCE_REVIEW_PASS_SCOPED',reviewer:'Current agent, evidence/static review; not a second independent reviewer or Human acceptance',sourcesVerified:Object.keys(m.sources).length,pilotDocumentsVerified:21,groups:22,checks:['final sample hashes','pilot document hashes','core unchanged inputs and exit','final stage exits/counts','six mutation detections','four JUnit suites without skipped cases','unchanged Web/Caddy provenance','quota receipt'],limitations:['R4 resource incident remains a historical failure','finite synthetic vectors only','not all four platform profiles accepted','native/device/production/performance not certified'],r05:'IN_PROGRESS'};
fs.writeFileSync(path.join(dir,'native-plan-r1/backend-review.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));

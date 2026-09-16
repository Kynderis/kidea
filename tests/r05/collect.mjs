// Archive exact runs and pilot documents; never execute product code or replace evidence.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {repo,pilot,evidence,readTree,baseline,digest} from './support.mjs';
import {validate} from './validate.mjs';
const files=readTree(pilot),validation=validate(files);assert.deepEqual(validation.errors,[]);
const core=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/local-portability/mac-intel-2026-09-16/run-1-final/summary.json')));
for(const [f,sha] of Object.entries(core.after))assert.equal(digest(fs.readFileSync(path.join(repo,f))),sha,f);
function git(args){const r=spawnSync('git',args,{cwd:repo,maxBuffer:16*1024*1024});assert.ifError(r.error);assert.equal(r.status,0);return r.stdout;}
const historical=git(['ls-tree','-r','--name-only','HEAD','tests/evidence']).toString().trim().split('\n');
for(const f of historical)assert.equal(digest(fs.readFileSync(path.join(repo,f))),digest(git(['show','HEAD:'+f])),f);
const snapshots={};
for(const [f,b] of Object.entries(files)){
  const dest=path.join(evidence,'pilot',f);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b,{flag:'wx'});
  assert.deepEqual(fs.readFileSync(dest),b);snapshots[f]={bytes:b.length,sha256:digest(b)};
}
const runs=[];
for(const [i,name] of process.argv.slice(2).entries()){
  assert.match(name,/^check-[A-Za-z0-9]+$/);
  const from=path.join(repo,'.test-output/r05',name),to=path.join(evidence,'run-'+(i+1));fs.mkdirSync(to);
  const summary=JSON.parse(fs.readFileSync(path.join(from,'summary.json')));
  assert.equal(summary.inputsUnchanged,true);assert.deepEqual(summary.before,summary.after);
  const archived={};for(const f of ['summary.json','stdout.txt','stderr.txt']){const b=fs.readFileSync(path.join(from,f));fs.writeFileSync(path.join(to,f),b,{flag:'wx'});archived[f]=digest(b);}
  assert.equal(archived['stdout.txt'],summary.stdoutHash);assert.equal(archived['stderr.txt'],summary.stderrHash);
  const counts=Object.fromEntries(fs.readFileSync(path.join(from,'stdout.txt'),'utf8').split('\n').flatMap(l=>{const m=/^[ℹ#] (tests|pass|fail|cancelled|skipped|todo) (\d+)$/.exec(l);return m?[[m[1],+m[2]]]:[];}));
  assert.deepEqual(counts,{tests:20,pass:19,fail:1,cancelled:0,skipped:0,todo:0});
  if(i===process.argv.length-3)for(const [f,sha] of Object.entries(summary.after))assert.equal(digest(fs.readFileSync(f.startsWith('pilot/')?path.join(pilot,f.slice(6)):path.join(repo,f))),sha,f+' final source');
  runs.push({name:'run-'+(i+1),source:name,counts,exitCode:summary.exitCode,files:archived});
}
assert.ok(runs.length);
const repoInputs=['KIDEA_DESIGN.md','KIDEA_ROADMAP.md','answer.md','proposals/r05-profile-test-r1.md','proposals/r05-profile-method-r1.md','tests/evidence/r05/profile-r1.md',...fs.readdirSync(path.join(repo,'tests/r05')).map(f=>'tests/r05/'+f)];
const manifest={at:new Date().toISOString(),sourceHead:git(['rev-parse','HEAD']).toString().trim(),node:process.version,platform:process.platform,arch:process.arch,
  approval:'Human approval after answer cfffe0c; permission to draft/check, not approval of new content or installation/build',pilot,
  baseline:Object.fromEntries(Object.entries(baseline()).map(([f,b])=>[f,digest(b)])),snapshots,validation,runs,
  coreEvidenceReused:{path:'tests/evidence/local-portability/mac-intel-2026-09-16/run-1-final/summary.json',sourceFilesUnchanged:Object.keys(core.after).length,newCoreRun:false},
  historicalEvidenceFilesUnchanged:historical.length,repoInputs:Object.fromEntries(repoInputs.map(f=>[f,digest(fs.readFileSync(path.join(repo,f)))]))};
fs.writeFileSync(path.join(evidence,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({validation,runs:runs.map(({files,...r})=>r),historicalEvidenceFilesUnchanged:historical.length,coreUnchanged:36},null,2));

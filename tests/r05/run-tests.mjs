import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {repo,pilot,readTree,digest} from './support.mjs';
const tracked=['tests/r05/support.mjs','tests/r05/validate.mjs','tests/r05/profile-docs.test.mjs','tests/r05/run-tests.mjs','tests/r05/restore-pilot.mjs','tests/r05/prepare-review.mjs','proposals/r05-profile-test-r1.md','proposals/r05-profile-method-r1.md','tests/r03/link-check.mjs','tests/r03/link-check.test.mjs'];
const hashes=()=>({...Object.fromEntries(tracked.map(f=>[f,digest(fs.readFileSync(path.join(repo,f)))])),...Object.fromEntries(Object.entries(readTree(pilot)).map(([f,b])=>['pilot/'+f,digest(b)]))});
const output=path.join(repo,'.test-output/r05');fs.mkdirSync(output,{recursive:true});const dir=fs.mkdtempSync(path.join(output,'check-'));
const before=hashes(),at=new Date().toISOString();
const r=spawnSync(process.execPath,['--test','tests/r05/profile-docs.test.mjs','tests/r03/link-check.test.mjs'],{cwd:repo,encoding:'utf8',timeout:60000,maxBuffer:16*1024*1024});
for(const stream of ['stdout','stderr'])fs.writeFileSync(path.join(dir,stream+'.txt'),r[stream]??'',{flag:'wx'});
const after=hashes(),summary={at,node:process.version,platform:process.platform,arch:process.arch,sourceHead:spawnSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).stdout.trim(),
  exitCode:r.status,error:r.error?.message??null,inputsUnchanged:JSON.stringify(before)===JSON.stringify(after),before,after,stdoutHash:digest(r.stdout??''),stderrHash:digest(r.stderr??''),scope:'Document assertions and negative fixtures only; no app builds/runtime/performance'};
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summary,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({dir,exitCode:r.status,inputsUnchanged:summary.inputsUnchanged,stdout:r.stdout,stderr:r.stderr}));
process.exitCode=r.status===0&&summary.inputsUnchanged?0:1;

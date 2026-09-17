// Lightweight documentation/method checks and full core regression. No Docker or application workload.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync,execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {root,evidence,readDocs,validateScope,sha} from './web-scope.mjs';
assert.ok(Number(process.versions.node.split('.')[0])>=24,'Node >=24');
assert.notEqual(process.getuid?.(),0,'ordinary user required');
const out=path.resolve(process.argv[2]??'');assert.ok(process.argv[2],'CREATE-only output directory required');fs.mkdirSync(out);
const write=(name,value)=>fs.writeFileSync(path.join(out,name),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const list=p=>fs.readdirSync(p,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>path.join(e.parentPath,e.name));
const sources=[...list(path.join(root,'.agents/skills/kidea')), ...['web-scope.mjs','web-scope.test.mjs','run-web-scope.mjs','review-web-scope-evidence.mjs'].map(f=>path.join(root,'tests/r05',f)),path.join(evidence,'manifest.json'),...['package.json','package-lock.json'].map(f=>path.join(root,f))];
const hashInputs=()=>Object.fromEntries(sources.sort().map(f=>[path.relative(root,f),sha(fs.readFileSync(f))]));
const start={at:new Date().toISOString(),sourceHead:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),branch:execFileSync('git',['branch','--show-current'],{cwd:root,encoding:'utf8'}).trim(),remote:execFileSync('git',['remote','get-url','origin'],{cwd:root,encoding:'utf8'}).trim(),root:fs.realpathSync(root),host:{platform:process.platform,arch:process.arch,osRelease:os.release(),macOS:execFileSync('/usr/bin/sw_vers',{encoding:'utf8'}).trim(),uid:process.getuid?.()},node:{version:process.version,executable:process.execPath,sha256:sha(fs.readFileSync(process.execPath))},inputs:hashInputs()};write('start.json',start);
const stages=[];
function run(name,args,timeout){
  const r=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout,maxBuffer:32*1024**2});
  write(name+'.stdout.log',r.stdout??'');write(name+'.stderr.log',r.stderr??'');
  const receipt={name,args,exit:r.status,error:r.error?.message??null,stdout:sha(r.stdout??''),stderr:sha(r.stderr??'')};stages.push(receipt);write(name+'.receipt.json',receipt);console.log(JSON.stringify(receipt));return r;
}
const scope=validateScope(readDocs(path.resolve(root,'../kidea-workshop-pilot')));write('live-pilot.json',scope);
const test=run('scope-tests',['--test','--test-reporter=tap','tests/r05/web-scope.test.mjs'],60000);
if(test.status===0&&scope.errors.length===0){
  const review=run('evidence-review',['tests/r05/review-web-scope-evidence.mjs',path.join(out,'evidence-review.json')],60000);
  if(review.status===0){const core=run('core',['tests/r02-t07/run-tests.mjs'],360000);
    const output=/Regression evidence: (.+)/.exec(core.stdout??'')?.[1];
    if(output){fs.cpSync(output,path.join(out,'core-local'),{recursive:true,errorOnExist:true,force:false});}
  }
}
const after=hashInputs(),inputsUnchanged=JSON.stringify(after)===JSON.stringify(start.inputs);write('after.json',after);
const result={at:new Date().toISOString(),stages,inputsUnchanged,livePilotErrors:scope.errors,status:stages.length===3&&stages.every(s=>s.exit===0)&&inputsUnchanged&&scope.errors.length===0?'PASS_SCOPED':'FAIL',limits:'Method/docs/core Mac Intel checks and review of historical application evidence, not fresh app build or Human acceptance'};write('summary.json',result);console.log(JSON.stringify(result));process.exitCode=result.status==='PASS_SCOPED'?0:1;

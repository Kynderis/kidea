// Local deterministic regression only. No Docker/cloud/AI/pilot mutation.
import {spawnSync} from 'node:child_process';
import {mkdirSync,mkdtempSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {release} from 'node:os';
import {resolveGitExecutable} from '../../.agents/skills/kidea/scripts/git-versions.mjs';
const root=path.resolve(import.meta.dirname,'../..'),sha=b=>createHash('sha256').update(b).digest('hex');
const tracked=spawnSync(resolveGitExecutable(root),['ls-files','-z'],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});if(tracked.status!==0)throw Error('GIT_INVENTORY_FAILED: '+(tracked.error?.code??tracked.status));
const files=new Set(tracked.stdout.split('\0').filter(p=>/^(?:\.agents\/skills\/kidea\/|tests\/r(?:02|06|07|08|09)|tests\/(?:helper|status|support|fixtures)|package(?:-lock)?\.json)/.test(p)&&!p.startsWith('tests/evidence/')));
for(const dir of ['.agents/skills/kidea/scripts','.agents/skills/kidea/references','tests/r09'])for(const p of readdirSync(path.join(root,dir),{withFileTypes:true}))if(p.isFile())files.add(dir+'/'+p.name);
const hashes=()=>Object.fromEntries([...files].sort().map(p=>[p,sha(readFileSync(path.join(root,p)))]));
mkdirSync(path.join(root,'.test-output/r09'),{recursive:true});const output=mkdtempSync(path.join(root,'.test-output/r09/full-')),before=hashes(),results=[];
writeFileSync(path.join(output,'before.json'),JSON.stringify(before,null,2));console.log('R09 full regression evidence: '+output);
const suites=[['core',['tests/r02-t07/run-tests.mjs']],['cycles',['--test','tests/r09/work-cycle.test.mjs']],['delivery',['--test','tests/r09/delivery.test.mjs']],['recovery',['--test','tests/r09/recovery.test.mjs']],['interop',['--test','tests/r09/interop.test.mjs']],['r06',['tests/r06/run-tests.mjs']],['r06-boundaries',['tests/r06/boundaries.mjs']],['r07',['tests/r07/run-tests.mjs']],['r08-local',['--test','tests/r08/delivery.test.mjs','tests/r08/delivery-inputs.test.mjs','tests/r08/product-build.test.mjs','tests/r08/lab-r2.test.mjs']]];
for(const [name,args]of suites){const at=new Date().toISOString(),r=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:900000,maxBuffer:32*1024*1024});writeFileSync(path.join(output,name+'.stdout.txt'),r.stdout??'');writeFileSync(path.join(output,name+'.stderr.txt'),r.stderr??'');results.push({name,args,at,exitCode:r.status,error:r.error?.message??null,stdoutSHA256:sha(r.stdout??''),stderrSHA256:sha(r.stderr??'')});console.log(name,r.status===0?'PASS':'FAIL');}
const after=hashes(),summary={host:{platform:process.platform,arch:process.arch,osRelease:release(),node:process.version,nodeSHA256:sha(readFileSync(process.execPath))},results,inputsUnchanged:JSON.stringify(before)===JSON.stringify(after),before,after,output};
writeFileSync(path.join(output,'summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({output,inputsUnchanged:summary.inputsUnchanged,results:results.map(({name,exitCode})=>({name,exitCode}))}));process.exitCode=summary.inputsUnchanged&&results.every(r=>r.exitCode===0)?0:1;

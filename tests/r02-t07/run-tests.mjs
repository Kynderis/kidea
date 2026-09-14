// Frozen-source deterministic regression only: no AI sessions or cleanup.
import { spawnSync } from 'node:child_process';
import { readFileSync,writeFileSync,mkdirSync,mkdtempSync,readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root=fileURLToPath(new URL('../../',import.meta.url));
// Native lock/oplock/mapping suites belong to the retired writer. Their existing
// evidence is historical, not evidence for this cooperative implementation.
const suites=['tests/helper.test.mjs','tests/status.test.mjs','tests/r02-t06/cooperative-write.test.mjs','tests/r02-t07/init.test.mjs','tests/r02-t08/approve.test.mjs','tests/r02-t09/resume.test.mjs'];
const sources=[...readdirSync(path.join(root,'.agents/skills/kidea/scripts')).map(n=>'.agents/skills/kidea/scripts/'+n),'.agents/skills/kidea/SKILL.md','.agents/skills/kidea/references/init.md','.agents/skills/kidea/references/approve.md','.agents/skills/kidea/references/resume.md',...suites,'tests/r02-t07/run-tests.mjs','tests/fixtures/r02-t04/catalog.mjs','package.json','package-lock.json'];
const hash=b=>createHash('sha256').update(b).digest('hex');
const hashes=()=>Object.fromEntries(sources.map(f=>[f,hash(readFileSync(path.join(root,f)))]));
const output=path.join(root,'.test-output/r02-t07');mkdirSync(output,{recursive:true});const dir=mkdtempSync(path.join(output,'regression-'));
const at=new Date().toISOString(),before=hashes();writeFileSync(path.join(dir,'before.json'),JSON.stringify(before,null,2),{flag:'wx'});console.log('Regression evidence: '+dir);
const r=spawnSync(process.execPath,['--test',...suites],{cwd:root,encoding:'utf8',windowsHide:true,timeout:300000,maxBuffer:32*1024*1024});
const after=hashes();writeFileSync(path.join(dir,'stdout.txt'),r.stdout??'',{flag:'wx'});writeFileSync(path.join(dir,'stderr.txt'),r.stderr??'',{flag:'wx'});
const summary={at,node:process.version,nodeHash:hash(readFileSync(process.execPath)),suites,exitCode:r.status,error:r.error?.message??null,inputsUnchanged:JSON.stringify(before)===JSON.stringify(after),before,after,stdoutHash:hash(r.stdout??''),stderrHash:hash(r.stderr??''),output:dir};
writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summary,null,2),{flag:'wx'});console.log(JSON.stringify({exitCode:r.status,inputsUnchanged:summary.inputsUnchanged,output:dir,tail:r.stdout?.slice(-650)}));process.exitCode=r.status===0&&summary.inputsUnchanged?0:1;

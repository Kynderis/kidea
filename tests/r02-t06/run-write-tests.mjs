// Current cooperative writer evidence only. The native-write, mapped-write,
// write-preflight and cleanup suites/evidence remain historical: they assert
// the superseded native-lock/proof protocol and are not current PASS counts.
// Retain exact source hashes plus full test streams; no AI session or cleanup.
import { spawnSync } from 'node:child_process';
import { mkdirSync,readFileSync,writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../../',import.meta.url));
const suites=['tests/r02-t06/cooperative-write.test.mjs'];
const historicalSuites=['tests/r02-t06/write-preflight.test.mjs','tests/r02-t06/native-write.test.mjs','tests/r02-t06/mapped-write.test.mjs','tests/r02-t06/cleanup.test.mjs'];
const files=['.agents/skills/kidea/SKILL.md','.agents/skills/kidea/scripts/kidea.mjs','.agents/skills/kidea/scripts/status.mjs','.agents/skills/kidea/scripts/schema.mjs','.agents/skills/kidea/scripts/pending-writes.mjs','.agents/skills/kidea/scripts/recorded-completion.mjs','.agents/skills/kidea/scripts/write-internal.mjs','.agents/skills/kidea/scripts/bootstrap-plan.mjs','.agents/skills/kidea/scripts/git-versions.mjs','tests/fixtures/r02-t04/catalog.mjs',...suites,'tests/r02-t06/run-write-tests.mjs','package.json','package-lock.json'];
const hashes=()=>Object.fromEntries(files.map(p=>[p,createHash('sha256').update(readFileSync(path.join(root,p))).digest('hex')]));
const at=new Date().toISOString(),dir=path.join(root,'.test-output','r02-t06',`run-${at.replace(/[:.]/g,'-')}`);
mkdirSync(dir,{recursive:true});
const before=hashes();
const r=spawnSync(process.execPath,['--test',...suites],{cwd:root,encoding:'utf8',timeout:300000,maxBuffer:32*1024*1024,windowsHide:true});
writeFileSync(path.join(dir,'stdout.txt'),r.stdout??'');writeFileSync(path.join(dir,'stderr.txt'),r.stderr??'');
const after=hashes(),summary={at,node:process.version,model:'cooperative-single-writer',suites,historicalSuitesNotRun:historicalSuites,scope:'Synthetic tests only; no hostile concurrent-writer, ACL, power-loss or AI acceptance claim',exitCode:r.status,error:r.error?.message??null,inputsUnchanged:JSON.stringify(before)===JSON.stringify(after),before,after,output:dir};
writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));
process.exitCode=r.status===0&&summary.inputsUnchanged?0:1;

// Save full local test output and input hashes; does not execute an AI session.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const inputs=['.agents/skills/kidea/SKILL.md','.agents/skills/kidea/scripts/kidea.mjs','.agents/skills/kidea/scripts/status.mjs','.agents/skills/kidea/scripts/schema.mjs','package.json','package-lock.json','tests/helper.test.mjs','tests/status.test.mjs','tests/fixtures/r02-t04/catalog.mjs','tests/run-status-tests.mjs'];
const hashes=()=>Object.fromEntries(inputs.map(p=>[p,createHash('sha256').update(readFileSync(path.join(root,p))).digest('hex')]));
const at=new Date().toISOString();
const dir=path.join(root,'.test-output','r02-t05',`run-${at.replace(/[:.]/g,'-')}`);mkdirSync(dir,{recursive:true});
const before=hashes();
const r=spawnSync(process.execPath,['--test','tests/helper.test.mjs','tests/status.test.mjs'],{cwd:root,encoding:'utf8',timeout:120000,maxBuffer:8*1024*1024,windowsHide:true});
writeFileSync(path.join(dir,'stdout.txt'),r.stdout??'');writeFileSync(path.join(dir,'stderr.txt'),r.stderr??'');
const after=hashes();const summary={at,node:process.version,exitCode:r.status,error:r.error?.message??null,inputsUnchanged:JSON.stringify(before)===JSON.stringify(after),before,after,output:dir};
writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));
process.exitCode=r.status===0&&summary.inputsUnchanged?0:1;

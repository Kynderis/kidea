// Transparent controller-owned transport to the public CLI. No model/oracle.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
const repo=fileURLToPath(new URL('../../',import.meta.url));
const [pair,session,rootName,action]=process.argv.slice(2);
if(!['1','2','3'].includes(pair)||!['A','B'].includes(session)||!['init','status','approve','resume','change','visualize'].includes(action)||!(session==='A'?['A','denied']:['B01','B01-history','B02','B03','B04','B05','B06a','B06b','B06c','B07','B08']).includes(rootName))throw new Error('OUT_OF_SCOPE');
const base=path.join(repo,'.test-output/r02-t10/ai-agents-r1',`pair-${pair}`),root=path.join(base,rootName);
const input=readFileSync(0,'utf8');
const startedAt=new Date().toISOString();
const r=spawnSync(process.execPath,[path.join(repo,'.agents/skills/kidea/scripts/kidea.mjs'),action],{cwd:root,input,encoding:'utf8',windowsHide:true,timeout:20000,maxBuffer:4*1024*1024});
writeFileSync(path.join(base,`logs-${session}`,`${startedAt.replaceAll(':','-')}-${randomUUID()}.json`),JSON.stringify({startedAt,finishedAt:new Date().toISOString(),root,action,input,exitCode:r.status,error:r.error?.message??null,stdout:r.stdout,stderr:r.stderr},null,2),{flag:'wx'});
process.stdout.write(r.stdout??'');process.stderr.write(r.stderr??'');process.exitCode=r.status??1;

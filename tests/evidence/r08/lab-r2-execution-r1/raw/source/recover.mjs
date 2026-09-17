// Stop only resources bearing the exact run label from an existing lab receipt.
// No deletion of containers, data, evidence or historical resources.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {digest,verifyPackage} from './guard.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const [run,approval]=process.argv.slice(2);
verifyPackage(here,JSON.parse(fs.readFileSync(path.join(here,'manifest.json'))));
if(process.getuid?.()===0)throw Error('ROOT_NOT_ALLOWED');
if(!/^\d{13}-\d+$/.test(run??'')||approval!==digest(fs.readFileSync(path.join(here,'manifest.json'))))throw Error('EXACT_RUN_AND_APPROVAL_REQUIRED');
const parent=path.resolve(here,'../../../.test-output');const out=path.join(parent,`r08-lab-r2-${run}`);
if(fs.realpathSync(parent)!==parent||fs.realpathSync(out)!==out)throw Error('OUTPUT_SYMLINK');
const basis=JSON.parse(fs.readFileSync(path.join(out,'approval-basis.json')));if(basis.run!==run||basis.grant.manifestSHA256!==approval)throw Error('BASIS_MISMATCH');
const logs=[];
function docker(args){const r=spawnSync('docker',args,{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});logs.push({args,status:r.status,stdout:r.stdout,stderr:r.stderr});if(r.status!==0)throw Error('RECOVERY_COMMAND_FAILED');return r.stdout;}
try {
  const names=docker(['ps','-a','--filter',`label=kidea.r08.run=${run}`,'--format','{{.Names}}']).trim().split('\n').filter(Boolean);
  for(const name of names){if(!name.startsWith(`kidea-r08-${run}-`))throw Error('NAME_MISMATCH');const state=JSON.parse(docker(['inspect',name,'--format','{{json .State}}']));if(state.Paused)docker(['unpause',name]);if(state.Running)docker(['stop','--time=5',name]);}
  // Keep the lock after interrupted runs: reviewer reconciles evidence before a new run.
} finally {fs.writeFileSync(path.join(out,`recovery-${Date.now()}.json`),JSON.stringify(logs,null,2)+'\n',{flag:'wx'});}

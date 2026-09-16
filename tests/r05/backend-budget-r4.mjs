import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
const root=path.resolve(import.meta.dirname,'../..');
const lock=path.join(root,'.test-output/r05/docker-budget.lock');
export function assertBudget(active,planned){
 const targets=new Set(planned.map(c=>c.name));
 const all=[...active.filter(c=>!targets.has(c.name)),...planned];
 for(const c of all)if(!Number.isFinite(c.cpu)||!Number.isFinite(c.memory)||c.cpu<=0||c.memory<=0)throw Error('Missing bounded quota: '+c.name);
 const cpu=all.reduce((n,c)=>n+c.cpu,0),memory=all.reduce((n,c)=>n+c.memory,0);
 if(cpu>2||memory>4*1024**3)throw Error(`Docker quota would exceed 2 CPU/4 GiB: ${cpu} CPU, ${memory} bytes`);
 return {cpu,memory,containers:all.map(c=>c.name)};
}
function read(args){const r=spawnSync(docker,args,{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);return r.stdout;}
const resource=c=>({name:c.Name.replace(/^\//,''),cpu:c.HostConfig.NanoCpus/1e9,memory:c.HostConfig.Memory});
const owned=c=>/^E2-BW-r[1-4]$/.test(c.Config.Labels?.['kidea.run']||'');
function memory(value){const m=/^(\d+(?:\.\d+)?)([kmg])$/i.exec(value||'');if(!m)throw Error('Explicit memory unit required');return Number(m[1])*1024**({k:1,m:2,g:3}[m[2].toLowerCase()]);}
// Hold the lock until the CLI/container check finishes. A concurrent launcher
// fails closed rather than racing a preflight before Docker publishes state.
export function acquireBudget(args){
 if(!['run','start','restart'].includes(args[0]))return {release(){},receipt:null};
 fs.mkdirSync(path.dirname(lock),{recursive:true});
 fs.mkdirSync(lock); // Existing/stale lock is deliberately a hard stop.
 try {
  fs.writeFileSync(path.join(lock,'owner.json'),JSON.stringify({pid:process.pid,at:new Date().toISOString(),action:args[0]}));
  const ids=read(['ps','-q']).trim().split('\n').filter(Boolean);
  const active=ids.length?JSON.parse(read(['inspect',...ids])).filter(owned).map(resource):[];
  let planned;
  if(args[0]==='run'){
   const get=flag=>args[args.indexOf(flag)+1];
   if(!args.includes('--name')||!args.includes('--cpus')||!args.includes('--memory')||!args.includes('--label')||!/^kidea.run=E2-BW-r4$/.test(get('--label')))throw Error('Explicit owned name/label/quota required');
   planned=[{name:get('--name'),cpu:Number(get('--cpus')),memory:memory(get('--memory'))}];
  }else{
   const names=args.slice(1).filter(a=>!['--attach','--interactive'].includes(a));
   if(!names.length||names.some(n=>!/^kidea-r05-e2-r[1-4]-[-a-z0-9]+$/.test(n)))throw Error('Unknown start/restart arguments');
   const containers=JSON.parse(read(['inspect',...names]));
   if(containers.some(c=>!owned(c)))throw Error('Unowned target');
   planned=containers.map(resource);
  }
  const receipt={at:new Date().toISOString(),active,planned,...assertBudget(active,planned)};
  return {receipt,release(){fs.rmSync(lock,{recursive:true});}};
 }catch(error){fs.rmSync(lock,{recursive:true});throw error;}
}

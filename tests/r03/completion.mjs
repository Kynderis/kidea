import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const repo=path.resolve(import.meta.dirname,'../..');
const pilot='D:/Code/kynderis/kidea-workshop-pilot/docs';
const out=path.join(repo,'.test-output/r03/completion-r1');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const write=(p,b)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,b,{flag:'wx'});};
const snapshot=(files,base,dest)=>Object.fromEntries(files.map(f=>{const b=fs.readFileSync(f),r=path.relative(base,f);write(path.join(dest,r),b);return [r.replaceAll('\\','/'),{sha256:hash(b),bytes:b.length,base64:b.toString('base64')}];}));
const json=(p,v)=>write(p,JSON.stringify(v,null,2)+'\n');
if(process.argv[2]==='prepare'){
  if(fs.existsSync(out))throw Error('Evidence root exists; do not overwrite');
  for(const p of [path.dirname(pilot),pilot,path.join(pilot,'business'),...walk(pilot)])if(fs.lstatSync(p).isSymbolicLink())throw Error('Linked pilot target');
  const files=walk(pilot);if(files.length!==2)throw Error('Unexpected pilot file inventory');
  json(path.join(out,'preimages.json'),{at:new Date().toISOString(),approval:'Human: Duyệt toàn bộ gói R03; B1–B8/C1–C3/D/E at a528087',pilot:snapshot(files,pilot,path.join(out,'preimages/pilot')),skill:snapshot(walk(path.join(repo,'.agents/skills/kidea')),path.join(repo,'.agents/skills/kidea'),path.join(out,'preimages/skill')),proposal:snapshot([path.join(repo,'proposals/r03-completion-batch-r1.md')],repo,path.join(out,'preimages/repo'))});
  console.log(out);
}else if(process.argv[2]==='check'){
  const files=walk(pilot),errors=[],anchors=new Map();let links=0;
  for(const f of files){const a=[...fs.readFileSync(f,'utf8').matchAll(/<a id="([^"]+)"><\/a>/g)].map(m=>m[1]);if(new Set(a).size!==a.length)errors.push('duplicate anchor '+f);anchors.set(f.replaceAll('\\','/'),new Set(a));}
  for(const f of files)for(const m of fs.readFileSync(f,'utf8').matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
    if(/^https?:/.test(m[1]))continue;
    const [rel,id]=m[1].split('#'),target=path.resolve(path.dirname(f),rel||path.basename(f)).replaceAll('\\','/');links++;
    if(!fs.existsSync(target))errors.push('missing file '+f+' -> '+m[1]);else if(id){
      let ids=anchors.get(target);
      if(!ids){const body=fs.readFileSync(target,'utf8');ids=new Set([...body.matchAll(/<a id="([^"]+)"><\/a>/g)].map(m=>m[1]));for(const h of body.matchAll(/^#{1,6}\s+(.+)$/gm))ids.add(h[1].trim().toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu,'').replace(/\s/g,'-'));}
      if(!ids.has(id))errors.push('missing anchor '+f+' -> '+m[1]);
    }
  }
  if(files.length!==10)errors.push('Expected exactly 10 pilot files');
  const result={at:new Date().toISOString(),files:files.length,links,errors,scope:'Markdown inventory and link targets only; semantic coverage separately reviewed'};
  const dest=fs.mkdtempSync(path.join(out,'check-'));json(path.join(dest,'result.json'),result);console.log(JSON.stringify({...result,evidence:dest}));process.exitCode=errors.length?1:0;
}else if(process.argv[2]==='freeze'){
  const sources=['proposals/r03-feature-method-r1.md','proposals/r03-business-template-r1.md','proposals/r03-registration-decisions-r1.md','proposals/r03-completion-batch-r1.md',...walk(path.join(repo,'.agents/skills/kidea')).filter(f=>f.endsWith('.md')).map(f=>path.relative(repo,f))];
  json(path.join(out,'inputs.json'),snapshot(sources.map(f=>path.join(repo,f)),repo,path.join(out,'inputs')));
  fs.mkdirSync(path.join(out,'A'),{recursive:true});fs.mkdirSync(path.join(out,'B'),{recursive:true});
  console.log('Frozen inputs');
}else if(process.argv[2]==='start'){
  const session=process.argv[3];if(!['A','B'].includes(session))throw Error('session');
  const started=Date.now();json(path.join(out,session+'-session.json'),{session,started:new Date(started).toISOString(),deadline:new Date(started+900000).toISOString(),maxSeconds:900,promptHash:hash(fs.readFileSync(path.join(repo,'tests/r03/prompt-'+session+'.md'))),inputs:JSON.parse(fs.readFileSync(path.join(out,'inputs.json'))),quota:'Exactly A then B; no retries, extensions or child agents'});console.log(fs.readFileSync(path.join(out,session+'-session.json'),'utf8'));
}else if(process.argv[2]==='handoff'){
  const files=walk(path.join(out,'A'));if(!files.some(f=>f.endsWith('.md')))throw Error('No A handoff');json(path.join(out,'handoff.json'),snapshot(files,path.join(out,'A'),path.join(out,'handoff')));console.log('Frozen exact A bytes');
}else if(process.argv[2]==='capture'){
  const result={at:new Date().toISOString(),checks:[]};
  const checks=[['link-tests',process.execPath,['--test','tests/r03/link-check.test.mjs']],['skill-validator','python',['C:/Users/vuhoa/.codex/skills/.system/skill-creator/scripts/quick_validate.py','.agents/skills/kidea']],['syntax',process.execPath,['--check','tests/r03/completion.mjs']]];
  for(const [name,exe,args] of checks){const r=spawnSync(exe,args,{cwd:repo,encoding:'utf8',windowsHide:true,timeout:30000,env:{...process.env,PYTHONPATH:path.join(repo,'.tools/skill-validation/lib')}});write(path.join(out,'checks',name+'.stdout.txt'),r.stdout??'');write(path.join(out,'checks',name+'.stderr.txt'),r.stderr??'');result.checks.push({name,status:r.status,error:r.error?.message??null});}
  const pre=JSON.parse(fs.readFileSync(path.join(out,'preimages.json')));result.runtimeUnchanged=Object.entries(pre.skill).filter(([p])=>p.startsWith('scripts/')).every(([p,v])=>hash(fs.readFileSync(path.join(repo,'.agents/skills/kidea',p)))===v.sha256);
  const frozen=JSON.parse(fs.readFileSync(path.join(out,'inputs.json')));result.frozenInputsUnchanged=Object.entries(frozen).every(([p,v])=>hash(fs.readFileSync(path.join(out,'inputs',p)))===v.sha256);result.currentSkillMatchesTested=Object.entries(frozen).filter(([p])=>p.startsWith('.agents/')).every(([p,v])=>hash(fs.readFileSync(path.join(repo,p)))===v.sha256);
  result.regression=snapshot(walk(path.join(repo,'.test-output/r02-t07/regression-4dXN5E')),path.join(repo,'.test-output/r02-t07/regression-4dXN5E'),path.join(out,'regression'));
  json(path.join(out,'checks.json'),result);console.log(JSON.stringify({...result,regression:'raw files captured'}));if(result.checks.some(c=>c.status!==0)||!result.runtimeUnchanged||!result.frozenInputsUnchanged||!result.currentSkillMatchesTested)process.exitCode=1;
}else if(process.argv[2]==='verify-final'){
  const files=[...walk(pilot),...walk(path.join(repo,'.agents/skills/kidea')),...['completion.mjs','link-check.mjs','link-check.test.mjs','prompt-A.md','prompt-B.md'].map(p=>path.join(repo,'tests/r03',p))];
  const hashes=()=>Object.fromEntries(files.map(f=>[f.replaceAll('\\','/'),hash(fs.readFileSync(f))]));
  const before=hashes(),at=new Date().toISOString();
  const r=spawnSync(process.execPath,['--test','tests/r03/link-check.test.mjs'],{cwd:repo,encoding:'utf8',windowsHide:true,timeout:30000});
  const after=hashes();json(path.join(out,fs.existsSync(path.join(out,'final-verification.json'))?'final-verification-r2.json':'final-verification.json'),{at,before,after,unchanged:JSON.stringify(before)===JSON.stringify(after),exit:r.status,stdout:r.stdout,stderr:r.stderr,error:r.error?.message??null});
  const frozen=JSON.parse(fs.readFileSync(path.join(out,'inputs.json')));
  if(!Object.entries(frozen).every(([p,v])=>hash(fs.readFileSync(path.join(out,'inputs',p)))===v.sha256))throw Error('Frozen input changed');
  if(fs.existsSync(path.join(out,'handoff.json'))){const handoff=JSON.parse(fs.readFileSync(path.join(out,'handoff.json')));if(!Object.entries(handoff).every(([p,v])=>hash(fs.readFileSync(path.join(out,'handoff',p)))===v.sha256&&hash(fs.readFileSync(path.join(out,'A',p)))===v.sha256))throw Error('Handoff changed');}
  console.log(JSON.stringify({at,exit:r.status,unchanged:JSON.stringify(before)===JSON.stringify(after),frozenAndHandoffUnchanged:true}));process.exitCode=r.status===0&&JSON.stringify(before)===JSON.stringify(after)?0:1;
}else if(process.argv[2]==='archive'){
  const dest=path.join(repo,'tests/evidence/r03/completion-r1');
  json(path.join(dest,'pilot-manifest.json'),snapshot(walk(pilot),pilot,path.join(dest,'pilot')));
  json(path.join(dest,'evidence-manifest.json'),snapshot(walk(out),out,path.join(dest,'raw')));
  console.log(dest);
}else throw Error('prepare | check | freeze | start A/B | handoff | archive');

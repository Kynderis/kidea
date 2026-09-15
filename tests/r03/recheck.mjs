import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {checkDocuments,readDocuments} from './link-check.mjs';
const repo=path.resolve(import.meta.dirname,'../..'), pilot='D:/Code/kynderis/kidea-workshop-pilot/docs';
const out=path.join(repo,'.test-output/r03/recheck-r1');
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);if(fs.lstatSync(p).isSymbolicLink())throw Error('Linked input '+p);return e.isDirectory()?walk(p):[p];});
const write=(p,b)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,b,{flag:'wx'});};
const json=(p,v)=>write(p,JSON.stringify(v,null,2)+'\n');
const snapshot=(files,base,dest)=>Object.fromEntries(files.map(f=>{const b=fs.readFileSync(f),p=path.relative(base,f).replaceAll('\\','/');write(path.join(dest,p),b);return[p,{sha256:hash(b),bytes:b.length,base64:b.toString('base64')}];}));
const op=process.argv[2];
if(op==='prepare'){
 if(fs.existsSync(out))throw Error('Existing trial: do not overwrite');
 const prior=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r03/completion-r1/pilot-manifest.json')));
 for(const [p,v] of Object.entries(prior))if(hash(fs.readFileSync(path.join(pilot,p)))!==v.sha256)throw Error('Pilot changed since last evidence '+p);
 if(walk(pilot).length!==10)throw Error('Unexpected pilot inventory');
 const sourceFiles=['proposals/r03-feature-method-r1.md','proposals/r03-business-template-r1.md','proposals/r03-registration-decisions-r1.md','proposals/r03-completion-batch-r1.md','.agents/skills/kidea/SKILL.md','.agents/skills/kidea/references/business.md'];
 const sources=snapshot(sourceFiles.map(p=>path.join(repo,p)),repo,path.join(out,'inputs/sources'));
 const design=fs.readFileSync(path.join(repo,'KIDEA_DESIGN.md'),'utf8');const excerpt=design.split(/\r?\n/).slice(203,253).join('\n');write(path.join(out,'inputs/sources/pilot-scope.md'),excerpt);
 const docs=snapshot(walk(pilot),pilot,path.join(out,'inputs/docs'));
 const baseline=snapshot(walk(path.join(repo,'.agents/skills/kidea')),path.join(repo,'.agents/skills/kidea'),path.join(out,'baseline-skill'));
 const prompt=fs.readFileSync(path.join(repo,'tests/r03/prompt-recheck.md'));write(path.join(out,'prompt.md'),prompt);
 json(path.join(out,'manifest.json'),{approval:'Human: Duyệt kiểm lại R03; one independent AI up to15minutes, scoped corrections and checks; no installs/VM/additional AI',at:new Date().toISOString(),docs,sources,baseline,designExcerpt:{source:'KIDEA_DESIGN.md',lines:[204,253],sourceHash:hash(Buffer.from(design)),excerptHash:hash(Buffer.from(excerpt))},promptHash:hash(prompt)});console.log('Prepared exact current pilot snapshot');
}else if(op==='start'){
 const start=Date.now();json(path.join(out,'session.json'),{startedAt:new Date(start).toISOString(),deadline:new Date(start+900000).toISOString(),maxSeconds:900,quota:'One fresh agent; all review/correction verification stays inside this same deadline; no other agent or extension'});console.log(fs.readFileSync(path.join(out,'session.json'),'utf8'));
}else if(op==='revision'){
 json(path.join(out,'revision.json'),snapshot(walk(pilot),pilot,path.join(out,'revision/docs')));console.log('Revision frozen for same-session verification');
}else if(op==='supplement'){
 json(path.join(out,'supplement.json'),snapshot(walk(pilot),pilot,path.join(out,'supplement/docs')));console.log('Final narrow correction frozen; original session deadline unchanged');
}else if(op==='check'){
 const dir=fs.mkdtempSync(path.join(out,'check-')),files=[...walk(pilot),...walk(path.join(repo,'.agents/skills/kidea')),...['recheck.mjs','link-check.mjs','link-check.test.mjs'].map(p=>path.join(repo,'tests/r03',p))];
 const hashes=()=>Object.fromEntries(files.map(p=>[p.replaceAll('\\','/'),hash(fs.readFileSync(p))]));const before=hashes();
 const r=spawnSync(process.execPath,['--test','tests/r03/link-check.test.mjs'],{cwd:repo,encoding:'utf8',windowsHide:true,timeout:30000});
 const docs=readDocuments(pilot),links=checkDocuments(docs),after=hashes();
 const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json')));
 const frozenUnchanged=Object.entries(manifest.docs).every(([p,v])=>hash(fs.readFileSync(path.join(out,'inputs/docs',p)))===v.sha256)&&Object.entries(manifest.sources).every(([p,v])=>hash(fs.readFileSync(path.join(out,'inputs/sources',p)))===v.sha256);
 const skillUnchanged=Object.entries(manifest.baseline).every(([p,v])=>hash(fs.readFileSync(path.join(repo,'.agents/skills/kidea',p)))===v.sha256);
 const core=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r03/completion-r1/raw/regression/summary.json')));
 const coreBasisMatches=hash(fs.readFileSync(process.execPath))===core.nodeHash&&Object.entries(core.after).every(([p,v])=>hash(fs.readFileSync(path.join(repo,p)))===v);
 const provenance={links:0,errors:[]};for(const body of Object.values(docs))for(const m of body.matchAll(/\[[^\]]+\]\((D:[^)]+)\)/g)){
   provenance.links++;const [f,id]=m[1].split('#');if(!fs.existsSync(f)){provenance.errors.push(m[1]);continue;}if(!id)continue;
   const source=fs.readFileSync(f,'utf8'),ids=new Set([...source.matchAll(/<a id="([^"]+)"><\/a>/g)].map(a=>a[1]));
   for(const h of source.matchAll(/^#{1,6}\s+(.+)$/gm))ids.add(h[1].trim().toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu,'').replace(/\s/g,'-'));
   if(!ids.has(id))provenance.errors.push(m[1]);
 }
 const supplemented=fs.existsSync(path.join(out,'supplement.json'))?JSON.parse(fs.readFileSync(path.join(out,'supplement.json'))):null;
 const matchesReviewedSupplement=supplemented?Object.entries(supplemented).every(([p,v])=>hash(fs.readFileSync(path.join(pilot,p)))===v.sha256&&hash(fs.readFileSync(path.join(out,'supplement/docs',p)))===v.sha256):null;
 const result={at:new Date().toISOString(),before,after,inputsUnchanged:JSON.stringify(before)===JSON.stringify(after),frozenUnchanged,skillUnchanged,coreBasisMatches,matchesReviewedSupplement,provenance,coreEvidence:'completion-r1/raw/regression/summary.json; prior265/265, not rerun this turn',links,exit:r.status,stdout:r.stdout,stderr:r.stderr};json(path.join(dir,'result.json'),result);console.log(JSON.stringify({directory:dir,exit:r.status,links,provenance,inputsUnchanged:result.inputsUnchanged,frozenUnchanged,skillUnchanged,coreBasisMatches,matchesReviewedSupplement}));if(r.status!==0||links.errors.length||provenance.errors.length||!result.inputsUnchanged||!frozenUnchanged||!skillUnchanged||!coreBasisMatches||matchesReviewedSupplement===false)process.exitCode=1;
}else if(op==='export'){
 const dest=path.join(repo,'tests/evidence/r03/recheck-r1');json(path.join(dest,'manifest.json'),snapshot(walk(out),out,path.join(dest,'raw')));json(path.join(dest,'final-pilot.json'),snapshot(walk(pilot),pilot,path.join(dest,'pilot')));console.log(dest);
}else throw Error('prepare/start/revision/check/export');

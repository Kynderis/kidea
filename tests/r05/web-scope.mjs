// Scope amendment validation. Historical validators and runtime evidence stay immutable.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
export const root=path.resolve(import.meta.dirname,'../..');
export const evidence=path.join(root,'tests/evidence/r05/web-scope-r1');
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export function readDocs(dir){
  const out={};
  function walk(p){for(const item of fs.readdirSync(p,{withFileTypes:true})){
    const f=path.join(p,item.name);assert.ok(!item.isSymbolicLink(),f);
    if(item.isDirectory())walk(f);else out[path.relative(dir,f).split(path.sep).join('/')]=fs.readFileSync(f);
  }}walk(path.join(dir,'docs'));return out;
}
export const rows=(text,pattern)=>text.split('\n').filter(l=>pattern.test(l)).map(l=>l.split('|').slice(1,-1).map(v=>v.trim()));
export function validateScope(files,manifest=JSON.parse(fs.readFileSync(path.join(evidence,'manifest.json')))){
  const errors=[];const add=(code,detail)=>errors.push({code,detail});
  const before=readDocs(path.join(evidence,'before'));
  const names=Object.keys(manifest.files).sort();
  if(JSON.stringify(Object.keys(files).sort())!==JSON.stringify(names)||names.length!==21)add('INVENTORY','21 documents');
  for(const [f,item]of Object.entries(manifest.files)){
    if(!before[f]||sha(before[f])!==item.before)add('BASELINE_HASH',f);
    if(!files[f]||sha(files[f])!==item.after)add('SOURCE_HASH',f);
  }
  const bodies=Object.fromEntries(Object.entries(files).map(([f,b])=>[f,b.toString()]));
  const anchors={};let localLinks=0;
  for(const [f,s]of Object.entries(bodies)){
    const ids=[...s.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);
    if(new Set(ids).size!==ids.length)add('DUPLICATE_ANCHOR',f);anchors[f]=new Set(ids);
  }
  for(const [f,s]of Object.entries(bodies))for(const m of s.replace(/```[\s\S]*?```/g,'').replace(/`[^`\n]+`/g,'').matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
    if(/^[A-Za-z][A-Za-z0-9+.-]*:/.test(m[1]))continue;
    const [rel,id]=m[1].split('#'),target=rel?path.posix.normalize(path.posix.join(path.posix.dirname(f),rel)):f;localLinks++;
    if(!bodies[target])add('MISSING_LINK',f+':'+m[1]);else if(id&&!anchors[target].has(id))add('MISSING_ANCHOR',f+':'+m[1]);
  }
  const allRules=Object.entries(bodies).flatMap(([f,s])=>rows(s,/^\| (COMMON|CPP|WEB|AND|IOS)-\d\d \|/).map(c=>({id:c[0],cells:c,file:f})));
  if(allRules.length!==40||new Set(allRules.map(r=>r.id)).size!==40)add('RULE_INVENTORY','40 stable IDs');
  for(const r of allRules){
    const old=rows(before[r.file]?.toString()??'',/^\| (COMMON|CPP|WEB|AND|IOS)-\d\d \|/).find(c=>c[0]===r.id);
    if(JSON.stringify(old)!==JSON.stringify(r.cells))add('RULE_ORACLE_CHANGED',r.id);
    const expected=/^(AND|IOS)-/.test(r.id)?'FUTURE_UNSCHEDULED':'ACTIVE';
    if(manifest.rules[r.id]!==expected)add('RULE_SCOPE',r.id);
  }
  const spec=bodies['docs/engineering/tests.md']??'',groups=rows(spec,/^\| TC-\d\d \|/);
  if(groups.length!==20||new Set(groups.map(c=>c[0])).size!==20)add('GROUP_INVENTORY','20 groups');
  for(const g of groups){
    const entry=manifest.groups[g[0]];
    if(g.length!==6||g.some(v=>!v))add('GROUP_FIELDS',g[0]);
    if(!entry||entry.activeEnvironment!==g[4]||/\b(?:A|I)\b/.test(g[4]))add('VARIANT_SCOPE',g[0]);
    const old=rows(before['docs/engineering/tests.md'].toString(),/^\| TC-\d\d \|/).find(c=>c[0]===g[0]);
    if(old&&g[0]!=='TC-17'&&g[3]!==old[3])add('ACTIVE_ORACLE_CHANGED',g[0]);
    if(entry?.applicationStatus!=='NOT_RUN')add('FALSE_PASS',g[0]);
    const expectedDeferred=old?.[4].includes('A+I')?['A','I']:[];
    if(JSON.stringify(entry?.deferredVariants)!==JSON.stringify(expectedDeferred))add('DEFERRED_VARIANTS',g[0]);
  }
  const coverage=rows(spec,/^\| (?:[PRICDET]\d\d|QT\d\d|(?:UX|OP|AD|AR)-T\d\d) \|/);
  if(coverage.length!==137||new Set(coverage.map(c=>c[0])).size!==137)add('CASE_INVENTORY','137 source IDs');
  const oldCoverage=rows(before['docs/engineering/tests.md'].toString(),/^\| (?:[PRICDET]\d\d|QT\d\d|(?:UX|OP|AD|AR)-T\d\d) \|/);
  if(JSON.stringify(coverage)!==JSON.stringify(oldCoverage))add('CASE_TRACE_OR_STATUS_CHANGED','keep source mappings and NOT_RUN');
  if(manifest.sourceCases.length!==137||new Set(manifest.sourceCases.map(c=>c.id)).size!==137)add('CASE_MANIFEST','137 source IDs');
  for(const c of manifest.sourceCases){
    const row=coverage.find(r=>r[0]===c.id);
    if(!row||!row.includes(c.group)||!bodies[c.file]||!anchors[c.file].has(c.anchor))add('SOURCE_TRACE',c.id);
    if(c.applicationStatus!=='NOT_RUN')add('FALSE_PASS',c.id);
  }
  for(const term of ['360','1280','200%'])if(!bodies['docs/design/experience.md']?.includes(term))add('RESPONSIVE_LOST',term);
  for(const term of ['UNKNOWN','generation','namespace','deadline10s','process-cold','G2'])if(!spec.includes(term))add('CONTRACT_LOST',term);
  if(manifest.r05!=='IN_REVIEW_PENDING_HUMAN'||manifest.native!=='FUTURE_UNSCHEDULED')add('GATE_STATUS','Human acceptance remains separate');
  return {errors,files:names.length,rules:allRules.length,activeRules:allRules.filter(r=>!/^(AND|IOS)-/.test(r.id)).length,futureRules:allRules.filter(r=>/^(AND|IOS)-/.test(r.id)).length,sourceCases:coverage.length,technicalGroups:groups.length,localLinks};
}
export function restoreCreateOnly(target){
  const manifest=JSON.parse(fs.readFileSync(path.join(evidence,'manifest.json'))),files=readDocs(path.join(evidence,'after'));
  assert.deepEqual(validateScope(files,manifest).errors,[]);
  // mkdir without recursive/exist_ok is the no-overwrite boundary, including symlinks.
  fs.mkdirSync(target);
  for(const [f,b]of Object.entries(files)){const dest=path.join(target,f);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b,{flag:'wx'});}
  assert.deepEqual(validateScope(readDocs(target),manifest).errors,[]);
  return target;
}

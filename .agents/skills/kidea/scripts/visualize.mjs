// Read-only projection; the sole persistent output is a managed offline view.
import {readFileSync,writeFileSync,mkdirSync,renameSync,unlinkSync,realpathSync} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {inspectStatusGraph} from './status.mjs';
import {assertRuntime,assertLocalRoot,hasLocalAssumptions} from './runtime.mjs';
import {localEntry,byteIntegrity,hashBytes} from './bootstrap-plan.mjs';
import {validPath} from './schema.mjs';
import {mapDigest} from './maps.mjs';
import {renderProgress} from './view-renderer.mjs';
import {readGitContext} from './git-versions.mjs';

export const viewPath='.kidea/views/progress.html';
export const viewMarker='<!doctype html>\n<!-- kidea:managed-progress:r1 -->\n';
const fail=(code,diagnostics=[])=>{throw Object.assign(new Error(code),{code,diagnostics});};
const keys=(v,allowed)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>allowed.includes(k));
function authorize(root,request) {
  assertRuntime();assertLocalRoot(root);
  if(!path.isAbsolute(root)||realpathSync(root)!==root)fail('VIEW_ROOT_REQUIRED');
  const p=request?.permission;
  if(!keys(request,['permission','maps'])||!keys(p,['root','readProject','allowReadLocalGit','allowViewWrite','allowExportMetadata','assumptions'])||p.root!==root||p.readProject!==true||p.allowViewWrite!==true||p.allowExportMetadata!==true||typeof p.allowReadLocalGit!=='boolean'||!hasLocalAssumptions(p.assumptions))fail('VIEW_PERMISSION_REQUIRED');
  if(!keys(request.maps??{},['specification','implementation','responsibility']))fail('VIEW_MAP_SCOPE_INVALID');
  for(const v of Object.values(request.maps??{}))if(!validPath(v))fail('VIEW_MAP_SCOPE_INVALID');
}
function bytes(root,p) {const e=localEntry(root,p);if(!e?.stat.isFile())fail('VIEW_SOURCE_MISSING');if(e.stat.size>10*1024**2)fail('VIEW_INPUT_LIMIT');return readFileSync(e.full);}
function capture(root,request) {
  let git=null;
  if(localEntry(root,'.git')) {
    if(!request.permission.allowReadLocalGit)fail('VIEW_GIT_PERMISSION_REQUIRED');
    git=readGitContext(root);if(git.unmerged)fail('VIEW_GIT_CONFLICT');
  }
  const graph=inspectStatusGraph(root,new Map(),[],{allowGit:request.permission.allowReadLocalGit});
  if(graph.status.readState!=='OK')fail('VIEW_SOURCE_INVALID',graph.status.diagnostics);
  const reads=new Map(graph.reads),maps={},warnings=[];
  for(const [kind,file]of Object.entries(request.maps??{})) {
    const raw=bytes(root,file);reads.set(file,raw);let map;
    try{map=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));}catch{fail('VIEW_MAP_INVALID');}
    const {digest,...payload}=map;
    if(map.format!=='kidea-map-r1'||digest!==mapDigest(payload)||!Array.isArray(map.sources)||!Array.isArray(map.nodes)||!Array.isArray(map.edges)||!Array.isArray(map.diagnostics)||!Array.isArray(map.limits))fail('VIEW_MAP_INVALID');
    if(map.nodes.length>20000||map.edges.length>20000)fail('VIEW_INPUT_LIMIT');
    const stale=[];
    for(const source of map.sources) {
      if(!validPath(source.path)||source.integrity?.method!=='SHA256')fail('VIEW_MAP_INVALID');
      const entry=localEntry(root,source.path);
      if(!entry) {graph.absent.add(source.path);stale.push(source.path);continue;}
      const b=bytes(root,source.path);if(reads.has(source.path)&&!reads.get(source.path).equals(b))fail('VIEW_SOURCE_CHANGED');reads.set(source.path,b);
      if(hashBytes(b)!==source.integrity.value||source.integrity.byteLength!==undefined&&b.length!==source.integrity.byteLength)stale.push(source.path);
    }
    // Whitelisted fields only. Configuration/raw source/tool argv are never exported.
    const str=v=>typeof v==='string'?v:'';
    maps[kind]={file,digest,stale,completeness:str(map.completeness),verification:str(map.verification),
      nodes:map.nodes.map(n=>({id:str(n.id),name:str(n.name)||str(n.id),kind:str(n.kind),path:map.sources.some(s=>s.path===n.path)?str(n.path):'',anchor:str(n.anchor)})),
      edges:map.edges.map(e=>({from:str(e.from),to:str(e.to),kind:str(e.kind),purpose:str(e.purpose),conditions:str(e.conditions),mappingId:str(e.mappingId)})),
      diagnostics:map.diagnostics.map(d=>({code:str(d.code),file:str(d.file),id:str(d.id)})),limits:map.limits.map(str)};
    if(stale.length)warnings.push(`${kind}: nguồn map đã đổi hoặc thiếu; cần sinh lại map và review.`);
  }
  if([...reads.values()].reduce((n,b)=>n+b.length,0)>10*1024**2)fail('VIEW_INPUT_LIMIT');
  const records=[...graph.records.entries()];
  const index=records.find(([,r])=>r.kind==='index')?.[1],work=records.find(([,r])=>r.kind==='work')?.[1];
  if(!index||!work)fail('VIEW_SOURCE_INVALID');
  const releases=records.filter(([,r])=>r.kind==='release').map(([file,r])=>({file,id:r.id,revision:r.revision,productVersion:r.productVersion,components:r.components.map(c=>({id:c.id,version:c.version}))}));
  const operations=records.filter(([,r])=>r.kind==='operation').map(([file,r])=>({file,id:r.id,release:{id:r.release.id,revision:r.release.revision,path:r.release.path},previousAttemptId:r.previousAttemptId,environment:r.environment,targetId:r.targetId,startedAt:r.startedAt,
    observations:r.observations.map(o=>({id:o.id,at:o.at,components:o.components.map(c=>({id:c.id,result:c.result,detail:c.detail})),steps:o.steps.map(s=>({id:s.id,result:s.result,detail:s.detail}))}))}));
  const provenance=[...reads].map(([file,b])=>({file,...byteIntegrity(b)})).sort((a,b)=>a.file.localeCompare(b.file));
  const model={projectName:index.projectName,projectId:index.projectId,generatedAt:new Date().toISOString(),basis:mapDigest(provenance),provenance,
    currentRoundId:work.currentRoundId,currentItemId:work.currentItemId,rounds:work.rounds,items:graph.status.data.items,reviews:graph.status.data.reviews.map(r=>({id:r.id,revision:r.revision,status:r.recordedStatus,file:r.source.file})),blockers:work.blockers,nextAction:work.nextAction,releases,operations,maps,warnings};
  return {model,reads,absent:graph.absent,gitReads:graph.gitReads,records:graph.records,git};
}
function equalSnapshot(a,b) {
  return isDeepStrictEqual(a.reads,b.reads)&&isDeepStrictEqual(a.absent,b.absent)&&isDeepStrictEqual(a.gitReads,b.gitReads)&&isDeepStrictEqual(a.records,b.records)&&isDeepStrictEqual(a.git,b.git);
}
function destination(root) {const e=localEntry(root,viewPath);if(!e)return null;if(!e.stat.isFile())fail('VIEW_TARGET_INVALID');const b=readFileSync(e.full);if(!b.toString('utf8').startsWith(viewMarker))fail('VIEW_FOREIGN_TARGET');return b;}
const sameBytes=(a,b)=>a===null?b===null:b!==null&&a.equals(b);

export function visualize(root,request,{beforeRecheck,beforeReplace,afterReplace,testFault}={}) {
  let temp=null,old=null,installed=false,rendered;
  try {
    authorize(root,request);old=destination(root);
    const initial=capture(root,request);
    rendered=Buffer.from(viewMarker+renderProgress(initial.model));
    if(rendered.length>10*1024**2)fail('VIEW_OUTPUT_LIMIT');
    beforeRecheck?.();if(!equalSnapshot(initial,capture(root,request)))fail('VIEW_SOURCE_CHANGED');
    if(!sameBytes(old,destination(root)))fail('VIEW_TARGET_CHANGED');
    const dir=localEntry(root,'.kidea/views');
    if(dir&&!dir.stat.isDirectory())fail('VIEW_TARGET_INVALID');
    if(!dir)mkdirSync(path.join(root,'.kidea/views'));
    temp=`.kidea/views/.progress-${randomUUID()}.tmp`;
    writeFileSync(path.join(root,temp),rendered,{flag:'wx',mode:0o600});
    if(testFault==='AFTER_TEMP')fail('VIEW_TEST_WRITE_FAILURE');
    if(!bytes(root,temp).equals(rendered))fail('VIEW_VERIFY_FAILED');
    beforeReplace?.();if(!equalSnapshot(initial,capture(root,request)))fail('VIEW_SOURCE_CHANGED');
    if(!sameBytes(old,destination(root)))fail('VIEW_TARGET_CHANGED');
    localEntry(root,'.kidea/views');renameSync(path.join(root,temp),path.join(root,viewPath));temp=null;installed=true;
    afterReplace?.();if(testFault==='AFTER_REPLACE')fail('VIEW_TEST_VERIFY_FAILURE');
    if(!sameBytes(rendered,destination(root)))fail('VIEW_VERIFY_FAILED');
    if(!equalSnapshot(initial,capture(root,request)))fail('VIEW_SOURCE_CHANGED');
    return {state:'VIEW_UPDATED',path:viewPath,basis:initial.model.basis,generatedAt:initial.model.generatedAt,integrity:byteIntegrity(rendered),warnings:initial.model.warnings};
  }catch(e) {
    let recovery='NOT_NEEDED',recoveryPath=null;
    if(installed) {
      try {
        if(!sameBytes(rendered,destination(root)))fail('VIEW_TARGET_CHANGED');
        if(old===null)unlinkSync(path.join(root,viewPath));
        else {const backup=`.kidea/views/.restore-${randomUUID()}.tmp`;writeFileSync(path.join(root,backup),old,{flag:'wx',mode:0o600});localEntry(root,'.kidea/views');renameSync(path.join(root,backup),path.join(root,viewPath));}
        if(!sameBytes(old,destination(root)))fail('VIEW_RESTORE_FAILED');recovery='PREVIOUS_RESTORED';
      }catch{
        recovery='RECONCILIATION_REQUIRED';
        if(old!==null)try{localEntry(root,'.kidea/views');const p=`.kidea/views/.progress-recovery-${randomUUID()}.html`;writeFileSync(path.join(root,p),old,{flag:'wx',mode:0o600});recoveryPath=p;}catch{/* Report failure; never overwrite an unknown target. */}
      }
    }
    return {state:'VIEW_NOT_UPDATED',code:e.code??'VIEW_FAILED',diagnostics:e.diagnostics??[],recovery,recoveryPath};
  }finally{if(temp)try{const e=localEntry(root,temp);if(e?.stat.isFile()&&readFileSync(e.full).equals(rendered))unlinkSync(e.full);}catch{/* Preserve ambiguous artifact. */}}
}

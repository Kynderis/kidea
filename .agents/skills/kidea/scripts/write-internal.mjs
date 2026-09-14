// Internal R02-T06 primitive. No CLI command imports this module. Authorization
// comes from the trusted in-memory caller, never an APPROVED label in a record.
import { readFileSync, realpathSync, lstatSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { inspectStatusGraph,snapshotAnchorCount } from './status.mjs';
import { validPath, validate } from './schema.mjs';
import { isRecordedComplete } from './recorded-completion.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const integrity=bytes=>({method:'SHA256',value:sha(bytes),byteLength:bytes.length});
const same=isDeepStrictEqual;
const preparedPlans=new WeakSet();
const fail=code=>{throw Object.assign(new Error(code),{code});};
const inside=(root,target)=>{const rel=path.relative(root,target);return rel!== '..'&&!rel.startsWith(`..${path.sep}`)&&!path.isAbsolute(rel);};
const checked=(value,type)=>{if(!validate(value,type,()=>{}))fail('INVALID_'+type.toUpperCase());};

function cleanupGraph(root,overlay,checkpointPath) {
  const retained=new Set([checkpointPath]);
  for(let pass=0;pass<256;pass++) {
    const graph=inspectStatusGraph(root,overlay,[...retained]);
    if(graph.status.readState!=='OK')return graph;
    const added=[];
    for(const p of graph.directRefs) {
      if(!p.toLowerCase().startsWith('.kidea/checkpoints/')||retained.has(p)||graph.records.has(p))continue;
      // A direct, unversioned Ref retains a record's dependencies irrespective
      // of basename, extension or case. Only VersionRef snapshots are historical
      // by construction and do not enter directRefs. Raw byte evidence without
      // a record envelope is still bound, but is not parsed as a checkpoint.
      const data=overlay.has(p)?overlay.get(p):graph.reads.get(p);
      if(!data?.includes(Buffer.from('<!-- kidea:data:start -->'))&&!data?.includes(Buffer.from('<!-- kidea:data:end -->')))continue;
      added.push(p);
    }
    if(!added.length)return graph;
    for(const p of added)retained.add(p);
    if(retained.size>256)fail('CLEANUP_REFERENCE_LIMIT');
  }
  fail('CLEANUP_REFERENCE_LIMIT');
}

function localBytes(root,relative,missing=false) {
  if(!validPath(relative))fail('UNSAFE_PATH');
  let target=root;
  const parts=relative.split('/');
  for(const [i,part] of parts.entries()) {
    target=path.join(target,part);
    let stat;
    try{stat=lstatSync(target);}catch(e){if(missing&&i===parts.length-1&&e.code==='ENOENT')return null;throw e;}
    if(stat.isSymbolicLink()||!inside(root,realpathSync(target)))fail('UNSAFE_PATH');
    if(i<parts.length-1&&!stat.isDirectory())fail('UNSAFE_PATH');
    if(i===parts.length-1&&(!stat.isFile()||stat.nlink!==1))fail('UNSAFE_PATH');
  }
  return readFileSync(target);
}

// This stage is read-only. It is deliberately limited to an already valid
// existing project, local snapshots, and existing target parent directories.
export function prepareInternalWrite(args) { return preparePlan(args); }

function preparePlan({root,authorization,context,targets,operationId=randomUUID()},cleanup=null,priorGraph=null) {
  if(process.platform!=='win32')fail('UNSUPPORTED_HOST');
  root=realpathSync(root);
  if(!authorization||path.resolve(authorization.root)!==root||authorization.metadataRoot!=='.kidea/checkpoints')fail('AUTHORIZATION_REQUIRED');
  if(!authorization.assumptions||!['localNtfs','noActiveSync','noConcurrentNamespaceChanges'].every(k=>authorization.assumptions[k]===true))fail('ENVIRONMENT_NOT_CONFIRMED');
  if(typeof authorization.allowRestoreUpdate!=='boolean'||authorization.allowRetireOwnPending!==true)fail('AUTHORIZATION_REQUIRED');
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(operationId))fail('INVALID_OPERATION_ID');
  if(!Array.isArray(targets)||!targets.length||!Array.isArray(authorization.targets)||authorization.targets.length!==targets.length)fail('INVALID_TARGETS');
  function checkGraph(g) {
    if(g.status.readState!=='OK')throw Object.assign(new Error('GRAPH_NOT_VALID'),{code:'GRAPH_NOT_VALID',diagnostics:g.status.diagnostics});
    if(g.gitReadCount||g.absent.size)fail('UNSUPPORTED_GRAPH_INPUT');
  }
  // Discover interrupted writes before interpreting already-created/partial
  // targets as a fresh request. This still does not authorize recovery/replay.
  const current=cleanup?cleanupGraph(root,new Map(),cleanup.checkpointPath):inspectStatusGraph(root);checkGraph(current);
  const seen=new Set(),overlay=new Map(),planned=[];
  for(const t of targets) {
    if(!validPath(t.path)||!['UPDATE','CREATE'].includes(t.action)||!Buffer.isBuffer(t.plannedBytes))fail('INVALID_TARGET');
    const key=t.path.toLowerCase();
    const reserved=key.startsWith('.kidea/checkpoints/')||key==='.kidea/checkpoints';
    if(seen.has(key)||key==='.kidea'||reserved&&!(cleanup&&t.path===cleanup.checkpointPath&&t.action==='UPDATE')||t.action==='UPDATE'&&key.startsWith('.kidea/reviews/evidence/'))fail('INVALID_TARGET');
    seen.add(key);
    if(!authorization.targets.some(a=>a.path===t.path&&a.action===t.action))fail('TARGET_NOT_AUTHORIZED');
    const before=localBytes(root,t.path,t.action==='CREATE');
    if((t.action==='CREATE')!==(before===null))fail('TARGET_PRECONDITION');
    overlay.set(t.path,Buffer.from(t.plannedBytes));
    planned.push({path:t.path,action:t.action,beforeBase64:before?.toString('base64')??null,plannedBase64:t.plannedBytes.toString('base64')});
  }
  if(cleanup)for(const c of cleanup.copies)overlay.set(c.path,null);
  const projected=cleanup?cleanupGraph(root,overlay,cleanup.checkpointPath):inspectStatusGraph(root,overlay);checkGraph(projected);
  if(context?.projectId!==current.status.projectId||context.projectId!==projected.status.projectId||!current.status.data.items.some(i=>i.id===context.ownerId)||!projected.status.data.items.some(i=>i.id===context.ownerId))fail('CONTEXT_IDENTITY');
  checked(context.tool,'ToolIdentity');
  if(!context.tool.components.length||new Set(context.tool.components.map(c=>c.name)).size!==context.tool.components.length)fail('INVALID_TOOLIDENTITY');
  if(!Array.isArray(context.permissionRefs)||!context.permissionRefs.length||!Array.isArray(context.inputRefs)||!context.inputRefs.length)fail('CONTEXT_REFERENCES_REQUIRED');
  const inputs=new Map();
  function bind(p,data){if(inputs.has(p)&&!inputs.get(p).equals(data))fail('SOURCE_CHANGED');inputs.set(p,Buffer.from(data));}
  for(const graph of [priorGraph,current,projected].filter(Boolean))for(const [p,data]of graph.reads)bind(p,data);
  for(const v of [...context.permissionRefs,...context.inputRefs]) {
    checked(v,'VersionRef');
    if(v.location.kind!=='SNAPSHOT'||v.location.ref.anchor!==null||v.source===null)fail('UNSUPPORTED_REFERENCE');
    const snapshot=localBytes(root,v.location.ref.path),source=localBytes(root,v.source.path);
    if(!same(integrity(snapshot),v.integrity)||!source.equals(snapshot))fail('CONTEXT_SOURCE_DIFFERS');
    if(v.source.anchor!==null) {
      try{if(snapshotAnchorCount(snapshot,v.source.anchor)!==1)fail('CONTEXT_ANCHOR');}
      catch{fail('CONTEXT_ANCHOR');}
    }
    bind(v.location.ref.path,snapshot);bind(v.source.path,source);
  }
  const folded=new Map();
  for(const p of [...inputs.keys(),...planned.map(t=>t.path)]) {
    const key=p.toLowerCase();if(folded.has(key)&&folded.get(key)!==p)fail('AMBIGUOUS_PATH_ALIAS');folded.set(key,p);
  }
  for(const t of planned) {
    if(inputs.has(t.path)&&(t.beforeBase64===null||inputs.get(t.path).toString('base64')!==t.beforeBase64))fail('SOURCE_CHANGED');
  }
  // Return only serialized, detached data; mutating caller buffers cannot change
  // a plan after graph validation. Execution rechecks this digest and native proof.
  const request={protocolVersion:1,operationId,root,authorization:structuredClone(authorization),context:structuredClone(context),
    inputs:[...inputs].sort(([a],[b])=>a.localeCompare(b)).map(([p,b])=>({path:p,expectedBase64:b.toString('base64')})),targets:planned};
  if(cleanup)request.cleanup=structuredClone(cleanup);
  const line=JSON.stringify(request);
  const prepared=Object.freeze({line,planDigest:sha(Buffer.from(line)),operationId});
  preparedPlans.add(prepared);return prepared;
}

// Conditional deletion of the writer's own retired recovery payloads only.
// Trust in completion/checks/retention comes from the caller's explicit grant;
// matching record labels are necessary corroboration, never self-authorization.
export function prepareInternalCleanup({root,authorization,context,checkpointPath,copies,receipt,operationId=randomUUID()}) {
  root=realpathSync(root);
  if(!authorization?.cleanup||authorization.allowRestoreUpdate!==false)fail('CLEANUP_AUTHORIZATION_REQUIRED');
  if(typeof authorization.root!=='string'||path.resolve(authorization.root)!==root||authorization.metadataRoot!=='.kidea/checkpoints'||authorization.allowRetireOwnPending!==true)fail('CLEANUP_AUTHORIZATION_REQUIRED');
  if(!authorization.assumptions||!['localNtfs','noActiveSync','noConcurrentNamespaceChanges'].every(k=>authorization.assumptions[k]===true))fail('ENVIRONMENT_NOT_CONFIRMED');
  const conditions=authorization.cleanup.conditions;
  if(!conditions||!['ownerCompleted','requiredChecksPassed','retentionEnded'].every(k=>conditions[k]===true))fail('CLEANUP_CONDITIONS_REQUIRED');
  const match=/^\.kidea\/checkpoints\/operations\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/checkpoint\.md$/.exec(checkpointPath??'');
  if(!match)fail('NOT_OWN_CHECKPOINT');
  checked(receipt,'CleanupReceipt');
  if(!Array.isArray(copies)||!copies.length||!Array.isArray(authorization.cleanup.copies)||authorization.cleanup.copies.length!==copies.length)fail('CLEANUP_TARGETS_REQUIRED');
  const current=cleanupGraph(root,new Map(),checkpointPath);
  if(current.status.readState!=='OK')throw Object.assign(new Error('GRAPH_NOT_VALID'),{code:'GRAPH_NOT_VALID',diagnostics:current.status.diagnostics});
  if(current.gitReadCount||current.absent.size)fail('UNSUPPORTED_GRAPH_INPUT');
  const checkpoint=current.records.get(checkpointPath);
  if(checkpoint?.id!==match[1]||checkpoint.ownerId!==context?.ownerId||checkpoint.projectId!==context?.projectId)fail('CLEANUP_IDENTITY');
  if(!isRecordedComplete(checkpoint.ownerId,current.status.data.items,new Set(current.status.data.reviews.filter(r=>r.recordedStatus==='APPROVED').map(r=>r.id))))fail('OWNER_NOT_COMPLETE');
  const latest=[...checkpoint.observations].reverse().find(o=>o.phase==='VERIFY');
  if(!latest||!checkpoint.targets.every(t=>latest.results.some(r=>r.path===t.path&&r.match==='PLANNED'&&same(r.integrity,t.planned.version.integrity))))fail('WRITE_NOT_VERIFIED');
  const planned=structuredClone(checkpoint),selected=[],seen=new Set();
  for(const selection of copies) {
    if(!selection||!['before','planned'].includes(selection.copy)||!validPath(selection.targetPath))fail('INVALID_CLEANUP_COPY');
    const index=checkpoint.targets.findIndex(t=>t.path===selection.targetPath),copy=checkpoint.targets[index]?.[selection.copy];
    if(!copy||copy.cleanup!==null)fail('COPY_NOT_AVAILABLE');
    const relative=`.kidea/checkpoints/operations/${match[1]}/${selection.copy}-${index}.bin`,v=copy.version;
    if(v.source?.path!==selection.targetPath||v.source.anchor!==null||v.location.kind!=='SNAPSHOT'||v.location.ref.path!==relative||v.location.ref.anchor!==null||seen.has(relative))fail('NOT_OWN_RECOVERY_COPY');
    seen.add(relative);
    if(!authorization.cleanup.copies.some(g=>g.path===relative&&same(g.integrity,v.integrity)))fail('CLEANUP_COPY_NOT_AUTHORIZED');
    const actual=current.reads.get(relative);
    if(!actual||!same(integrity(actual),v.integrity))fail('COPY_BYTES_CHANGED');
    selected.push({path:relative,targetPath:selection.targetPath,copy:selection.copy,integrity:structuredClone(v.integrity)});
    planned.targets[index][selection.copy].cleanup=structuredClone(receipt);
  }
  if(receipt.evidenceRef.path===checkpointPath||seen.has(receipt.evidenceRef.path))fail('CLEANUP_EVIDENCE_NOT_BOUND');
  for(const v of [...(context.permissionRefs??[]),...(context.inputRefs??[])]) {
    if(seen.has(v.source?.path)||seen.has(v.location?.ref?.path))fail('CLEANUP_COPY_STILL_REFERENCED');
  }
  const oldBytes=current.reads.get(checkpointPath);
  // Keep all surrounding Markdown and history bytes; replace only this record's
  // already-validated data envelope. Unrelated prose is not rewritten.
  const original=new TextDecoder('utf-8',{fatal:true}).decode(oldBytes);
  const plannedText=original.replace(/(<!-- kidea:data:start -->\r?\n```json\r?\n)[\s\S]*?(\r?\n```\r?\n<!-- kidea:data:end -->)/,(_all,start,end)=>start+JSON.stringify(planned,null,2)+end);
  const cleanup={checkpointPath,copies:selected,receipt:structuredClone(receipt)};
  return preparePlan({root,authorization,context,operationId,targets:[{path:checkpointPath,action:'UPDATE',plannedBytes:Buffer.from(plannedText)}]},cleanup,current);
}

export function verifyInternalProof(prepared,event) {
  const request=JSON.parse(prepared.line);
  if(sha(Buffer.from(prepared.line))!==prepared.planDigest||event.operationId!==request.operationId||event.planDigest!==prepared.planDigest)fail('PROOF_IDENTITY');
  const targetMap=new Map(request.targets.map(t=>[t.path,t]));
  const deleted=new Map(request.cleanup?.copies.map(c=>[c.path,c])??[]);
  function checkSet(actual,expected) {
    if(!Array.isArray(actual)||actual.length!==expected.size||new Set(actual.map(x=>x.path)).size!==actual.length)fail('PROOF_PATHS');
    for(const row of actual) {
      if(!expected.has(row.path))fail('PROOF_BYTES');
      const value=expected.get(row.path);
      if(value===null){if(row.integrity!==null||row.absent!==true)fail('PROOF_BYTES');}
      else if(!same(row.integrity,integrity(value)))fail('PROOF_BYTES');
    }
  }
  checkSet(event.inputs,new Map(request.inputs.map(i=>[i.path,deleted.has(i.path)?null:Buffer.from(targetMap.get(i.path)?.plannedBase64??i.expectedBase64,'base64')])));
  if(request.cleanup) {
    if(!Array.isArray(event.deleted)||event.deleted.length!==deleted.size||new Set(event.deleted.map(c=>c.path)).size!==deleted.size)fail('PROOF_DELETIONS');
    for(const row of event.deleted)if(!deleted.has(row.path)||row.absent!==true||!same(row.integrity,deleted.get(row.path).integrity))fail('PROOF_DELETIONS');
  }
  checkSet(event.targets,new Map(request.targets.map(t=>[t.path,Buffer.from(t.plannedBase64,'base64')])));
  checked(event.checkpoint,'checkpoint');
  const c=event.checkpoint;
  if(c.id!==request.operationId||c.projectId!==request.context.projectId||c.ownerId!==request.context.ownerId||!same(c.tool,request.context.tool)||!same(c.permissionRefs,request.context.permissionRefs)||!same(c.inputRefs,request.context.inputRefs)||c.targets.length!==request.targets.length)fail('PROOF_CHECKPOINT');
  const metadata=`.kidea/checkpoints/operations/${request.operationId}/`;
  for(const [i,t] of request.targets.entries()) {
    const observed=c.targets[i];
    if(observed.path!==t.path||observed.action!==t.action)fail('PROOF_CHECKPOINT');
    for(const [kind,payload] of [['before',t.beforeBase64],['planned',t.plannedBase64]]) {
      const copy=observed[kind];
      if(payload===null){if(copy!==null)fail('PROOF_CHECKPOINT');continue;}
      if(copy?.cleanup!==null||copy.version.source?.path!==t.path||copy.version.source?.anchor!==null||copy.version.location.kind!=='SNAPSHOT'||copy.version.location.ref.anchor!==null||copy.version.location.ref.path!==`${metadata}${kind}-${i}.bin`||!same(copy.version.integrity,integrity(Buffer.from(payload,'base64'))))fail('PROOF_CHECKPOINT');
    }
  }
  const latest=[...c.observations].reverse().find(o=>o.phase==='VERIFY');
  if(!latest||latest.results.length!==request.targets.length||!request.targets.every(t=>latest.results.some(r=>r.path===t.path&&r.match==='PLANNED'&&same(r.integrity,integrity(Buffer.from(t.plannedBase64,'base64'))))))fail('PROOF_CHECKPOINT');
  return true;
}

// Runtime path/hash is provided by the trusted host integration, never the project.
// Hooks are test-only in-memory controls; no project record can request a fault.
export async function executeInternalWrite(prepared,{powershell,powershellSha256,testFault='NONE',testBarrier='NONE',onBarrier,timeoutMs=60000}={}) {
  if(!preparedPlans.has(prepared))fail('UNVALIDATED_PLAN');
  const faults=['NONE','BEFORE_FIRST_WRITE','AFTER_PARTIAL_WRITE','AFTER_PARTIAL_WRITE_SECOND','SAFETY_LOSS_AFTER_PARTIAL_WRITE','CREATE_POSTOPEN_FAILURE','PENDING_POSTOPEN_FAILURE','CLEANUP_AFTER_FIRST_DELETE','CLEANUP_DELETE_FAILURE','CLEANUP_RECEIPT_FAILURE','AFTER_CREATE','AFTER_VERIFY','RESTORE_FAILURE','JOURNAL_FAILURE','RETIRE_FAILURE'];
  const barriers=['NONE','LOCKS_ACQUIRED','PENDING_CREATED','PREPARED','BEFORE_FIRST_WRITE','AFTER_PARTIAL_WRITE','AFTER_CREATE','AFTER_VERIFY','BEFORE_RESTORE','BEFORE_RETIRE','CLEANUP_BEFORE_DELETE','CLEANUP_AFTER_FIRST_DELETE'];
  if(!faults.includes(testFault)||!barriers.includes(testBarrier)||!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000)fail('INVALID_TEST_OPTIONS');
  if(!path.isAbsolute(powershell??'')||!/^[a-f0-9]{64}$/.test(powershellSha256??'')||sha(readFileSync(powershell))!==powershellSha256)fail('RUNTIME_NOT_VERIFIED');
  if(sha(Buffer.from(prepared.line))!==prepared.planDigest)fail('PLAN_CHANGED');
  const request=JSON.parse(prepared.line);
  const script=fileURLToPath(new URL('./native-write.ps1',import.meta.url));
  const child=spawn(powershell,['-NoLogo','-NoProfile','-NonInteractive','-File',script,'-TestFault',testFault,'-TestBarrier',testBarrier],{cwd:request.root,windowsHide:true,stdio:['pipe','pipe','pipe']});
  child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');
  let stdout='',stderr='',buffer='',proofAccepted=false,wrapperError=null,wrapperErrorDetail=null,chain=Promise.resolve();
  const events=[];
  const stop=error=>{wrapperError??=error?.code??error?.message??String(error);wrapperErrorDetail??=error?.message??String(error);child.kill();};
  const timer=setTimeout(()=>stop(new Error('WORKER_TIMEOUT')),timeoutMs);
  child.stdin.on('error',error=>{wrapperError??=error.code;});
  child.stdout.on('data',chunk=>{
    stdout+=chunk.toString();buffer+=chunk.toString();
    if(stdout.length>16*1024*1024){stop(new Error('OUTPUT_LIMIT'));return;}
    while(buffer.includes('\n')) {
      const n=buffer.indexOf('\n'),line=buffer.slice(0,n).trim();buffer=buffer.slice(n+1);if(!line)continue;
      chain=chain.then(async()=>{
        const event=JSON.parse(line);events.push(event);
        if(event.event==='BARRIER') {
          if(testBarrier==='NONE'||event.point!==testBarrier||event.operationId!==request.operationId)fail('UNEXPECTED_BARRIER');
          const proceed=await onBarrier?.(event,{kill:()=>child.kill(),pid:child.pid});
          if(proceed!==false)child.stdin.write(JSON.stringify({command:'CONTINUE',point:event.point,operationId:request.operationId})+'\n');
        } else if(event.event==='BYTES_VERIFIED') {
          if(proofAccepted)fail('DUPLICATE_PROOF');
          verifyInternalProof(prepared,event);proofAccepted=true;
          child.stdin.write(JSON.stringify({command:'FINALIZE',operationId:request.operationId,planDigest:prepared.planDigest,verified:true})+'\n');
        }
      }).catch(stop);
    }
  });
  child.stderr.on('data',chunk=>{stderr+=chunk.toString();if(stderr.length>1024*1024)stop(new Error('OUTPUT_LIMIT'));});
  child.stdin.write(prepared.line+'\n');
  const exit=await new Promise(resolve=>{child.on('error',error=>{wrapperError=error.message;resolve({code:null,signal:null});});child.on('close',(code,signal)=>resolve({code,signal}));});
  clearTimeout(timer);await chain;
  const result=[...events].reverse().find(e=>typeof e.state==='string');
  const complete=!wrapperError&&exit.code===0&&proofAccepted&&result?.state==='COMPLETED_BYTES'&&result.operationId===request.operationId&&result.planDigest===prepared.planDigest;
  return {state:complete?'COMPLETED_BYTES':result?.state==='REJECTED'?'REJECTED':'PENDING',operationId:request.operationId,proofAccepted,wrapperError,wrapperErrorDetail,exit,events,stdout,stderr,
    verification:complete?'BOUND_GRAPH_AND_BYTES_NOT_APPROVAL':'NOT_COMPLETE'};
}

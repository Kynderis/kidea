// Cooperative single-writer operations. The project guard prevents accidental
// Kidea overlap; it is not an OS sandbox or protection against external writers.
// Authorization comes from the in-memory caller, never a project record.
import { readFileSync, realpathSync, lstatSync, readdirSync, mkdirSync, openSync, writeSync, ftruncateSync, fsyncSync, closeSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { inspectStatusGraph,inspectBoundGraph,snapshotAnchorCount } from './status.mjs';
import { validPath, validate } from './schema.mjs';
import { isRecordedComplete } from './recorded-completion.mjs';
import { prepareBootstrapRequest,recordBytes } from './bootstrap-plan.mjs';
import { findGitVersion,readGitVersion,readGitContext } from './git-versions.mjs';
import { assertRuntime,assertLocalRoot,hasLocalAssumptions,portablePathKey,checkedEntryName } from './runtime.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const integrity=bytes=>({method:'SHA256',value:sha(bytes),byteLength:bytes.length});
const same=isDeepStrictEqual;
const preparedPlans=new WeakSet();
const fail=code=>{throw Object.assign(new Error(code),{code});};
const inside=(root,target)=>{const rel=path.relative(root,target);return rel!== '..'&&!rel.startsWith(`..${path.sep}`)&&!path.isAbsolute(rel);};
const checked=(value,type)=>{if(!validate(value,type,()=>{}))fail('INVALID_'+type.toUpperCase());};

function cleanupGraph(root,overlay,checkpointPath,allowGit=false) {
  const retained=new Set([checkpointPath]);
  for(let pass=0;pass<256;pass++) {
    const graph=inspectStatusGraph(root,overlay,[...retained],{allowGit});
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

function localEntry(root,relative,missing=false) {
  if(!validPath(relative))fail('UNSAFE_PATH');
  let target=root;
  const parts=relative.split('/');
  for(const [i,part] of parts.entries()) {
    target=path.join(target,checkedEntryName(target,part));
    let stat;
    try{stat=lstatSync(target);}catch(e){if(missing&&e.code==='ENOENT')return null;throw e;}
    if(stat.isSymbolicLink()||!inside(root,realpathSync(target))||path.resolve(realpathSync(target)).normalize('NFC')!==path.resolve(target).normalize('NFC'))fail('UNSAFE_PATH');
    if(i<parts.length-1&&!stat.isDirectory())fail('UNSAFE_PATH');
    if(i===parts.length-1) {
      if(!stat.isDirectory()&&(!stat.isFile()||stat.nlink!==1))fail('UNSAFE_PATH');
      return {full:target,stat};
    }
  }
}
function localBytes(root,relative,missing=false) {
  const entry=localEntry(root,relative,missing);
  if(!entry)return null;
  if(!entry.stat.isFile())fail('UNSAFE_PATH');
  return readFileSync(entry.full);
}
function safeRoot(root) {
  assertLocalRoot(root);
  if(!path.isAbsolute(root)||lstatSync(root).isSymbolicLink()||!lstatSync(root).isDirectory()||path.resolve(root).normalize('NFC')!==realpathSync(root).normalize('NFC'))fail('UNSAFE_ROOT');
  return realpathSync(root);
}

// This stage is read-only. It is deliberately limited to an already valid
// existing project, local snapshots, and existing target parent directories.
export function prepareInternalWrite(args) { return preparePlan(args); }

// R06 capability: metadata only, one existing work record and one impact plan.
// Product files and review/approval records are never targets of this mode.
export function prepareInternalImpactWrite(args,{evidence=[],checkout=null,inputs=new Map(),workPath,planPath,directories=[]}={}) {
  const prefix=`.kidea/checkpoints/operations/${args.operationId}/`;
  if(planPath!=='.kidea/plans/impact.md'||!validPath(workPath)||!workPath.startsWith('.kidea/')||!evidence.length||!(inputs instanceof Map))fail('IMPACT_SCOPE');
  if(!args.targets?.some(t=>t.path===workPath&&t.action==='UPDATE')||!args.targets.some(t=>t.path===planPath))fail('IMPACT_SCOPE');
  for(const t of args.targets)if(t.path!==workPath&&t.path!==planPath&&!(t.action==='CREATE'&&new RegExp('^\\.kidea/checkpoints/(?:impact|maps)/'+args.operationId+'\\.json$').test(t.path)))fail('IMPACT_SCOPE');
  const seen=new Set();
  for(const e of evidence) {
    if(!e.path.startsWith(prefix)||!/^context-[0-9]+\.bin$/.test(e.path.slice(prefix.length))||seen.has(e.path)||!Buffer.isBuffer(e.bytes))fail('IMPACT_EVIDENCE_SCOPE');seen.add(e.path);
  }
  if(directories.some(p=>!['.kidea/plans','.kidea/checkpoints/maps','.kidea/checkpoints/impact'].includes(p))||new Set(directories).size!==directories.length||!same(args.authorization.createDirectories??[],directories))fail('IMPACT_DIRECTORY_SCOPE');
  if(checkout!==null&&args.authorization.allowReadLocalGit!==true)fail('GIT_READ_NOT_AUTHORIZED');
  if(checkout===null?localEntry(args.root,'.git',true)!==null:!same(readGitContext(args.root),checkout))fail('CHECKOUT_CHANGED');
  return preparePlan(args,null,null,null,null,{evidence,checkout,inputs,workPath,planPath,directories});
}

// Save the current continuation note and a real checkpoint, never item/gate
// transitions. Evidence is confined to this operation's metadata directory.
export function prepareInternalContinuationWrite(args,{evidence=[],checkout=null,inputs=new Map(),reviewPaths=[]}={}) {
  const prefix=`.kidea/checkpoints/operations/${args.operationId}/`;
  if(!args.targets?.length||args.targets[0].action!=='UPDATE'||!evidence.length||!Array.isArray(reviewPaths)||new Set(reviewPaths).size!==reviewPaths.length)fail('CONTINUATION_SCOPE');
  if(reviewPaths.some(p=>!/^\.kidea\/reviews\/[A-Za-z0-9][A-Za-z0-9_-]{0,79}\.md$/.test(p)))fail('CONTINUATION_SCOPE');
  for(const t of args.targets.slice(1))if(!(t.action==='UPDATE'&&reviewPaths.includes(t.path))&&!(t.action==='CREATE'&&reviewPaths.some(p=>t.path.startsWith(p.slice(0,-3).replace('.kidea/reviews/','.kidea/reviews/evidence/')+'-'+args.operationId+'-'))))fail('CONTINUATION_SCOPE');
  const seen=new Set();
  for(const e of evidence) {
    if(!validPath(e.path)||!e.path.startsWith(prefix)||!/^context-[0-9]+\.bin$/.test(e.path.slice(prefix.length))||seen.has(e.path)||!Buffer.isBuffer(e.bytes))fail('CONTINUATION_EVIDENCE_SCOPE');
    seen.add(e.path);
  }
  if(!(inputs instanceof Map))fail('CONTINUATION_INPUTS_REQUIRED');
  if(checkout!==null&&args.authorization.allowReadLocalGit!==true)fail('GIT_READ_NOT_AUTHORIZED');
  if(checkout===null?localEntry(args.root,'.git',true)!==null:!same(readGitContext(args.root),checkout))fail('CHECKOUT_CHANGED');
  return preparePlan(args,null,null,null,{evidence,checkout,inputs,reviewPaths});
}

// Narrow metadata-only reconciliation. Never relax the generic product writer.
export function prepareInternalReviewWrite(args, {reviewPath, relatedPaths=[], directories=[]}={}) {
  if(!/^\.kidea\/reviews\/(?!evidence\/)[^/]+\.md$/.test(reviewPath??''))fail('INVALID_REVIEW_PATH');
  if(directories.some(p=>!['.kidea/reviews','.kidea/reviews/evidence'].includes(p))||new Set(directories).size!==directories.length)fail('INVALID_REVIEW_DIRECTORIES');
  for(const t of args.targets)if(t.path!==reviewPath&&!relatedPaths.includes(t.path)&&!(t.action==='CREATE'&&t.path.startsWith('.kidea/reviews/evidence/')))fail('REVIEW_TARGET_SCOPE');
  for(const p of relatedPaths)if(!p.startsWith('.kidea/')||p.startsWith('.kidea/reviews/')||p.startsWith('.kidea/checkpoints/'))fail('REVIEW_TARGET_SCOPE');
  if(!same(args.authorization.createDirectories??[],directories))fail('DIRECTORY_NOT_AUTHORIZED');
  return preparePlan(args,null,null,{reviewPath,directories});
}

export function prepareInternalBootstrap(args) {
  const request=prepareBootstrapRequest(args);
  request.recoveryCheckout=args.authorization.allowReadLocalGit===true&&localEntry(args.root,'.git',true)?readGitContext(args.root):null;
  const line=JSON.stringify(request);
  const prepared=Object.freeze({line,planDigest:sha(Buffer.from(line)),operationId:request.operationId});
  preparedPlans.add(prepared);return prepared;
}

// Work transitions have one target only; existing checkpoint machinery binds
// all read inputs and retains before/planned bytes. No product/review writes.
export function prepareInternalWorkTransition(args,{evidence,checkout,inputs,workPath,mode='WORK'}={}) {
  if(!['WORK','CYCLE'].includes(mode))fail('WORK_TRANSITION_SCOPE');
  const prefix=`.kidea/checkpoints/operations/${args.operationId}/`;
  if(!Array.isArray(args.targets)||args.targets.length!==1||args.targets[0].path!==workPath||args.targets[0].action!=='UPDATE'||!validPath(workPath)||!workPath.startsWith('.kidea/'))fail('WORK_TRANSITION_SCOPE');
  if(!Array.isArray(evidence)||!evidence.length||!(inputs instanceof Map))fail('WORK_TRANSITION_INPUTS');
  const seen=new Set();
  for(const e of evidence){if(!validPath(e.path)||!e.path.startsWith(prefix)||!/^context-[0-9]+\.bin$/.test(e.path.slice(prefix.length))||seen.has(e.path)||!Buffer.isBuffer(e.bytes))fail('WORK_TRANSITION_EVIDENCE');seen.add(e.path);}
  if(checkout!==null&&args.authorization.allowReadLocalGit!==true)fail('GIT_READ_NOT_AUTHORIZED');
  if(checkout===null?localEntry(args.root,'.git',true)!==null:!same(readGitContext(args.root),checkout))fail('CHECKOUT_CHANGED');
  return preparePlan(args,null,null,null,null,null,{evidence,checkout,inputs,workPath,mode});
}

export function prepareInternalDeliveryRecord(args,{evidence,checkout,inputs,workPath,indexPath,recordPath}={}) {
  if(!validPath(recordPath)||recordPath.startsWith('.kidea/')||!recordPath.endsWith('.md')||args.targets.length!==3||args.targets[0].path!==workPath||args.targets[1].path!==indexPath||args.targets[2].path!==recordPath||args.targets.slice(0,2).some(t=>t.action!=='UPDATE'))fail('DELIVERY_SCOPE');
  const prefix=`.kidea/checkpoints/operations/${args.operationId}/`;
  if(!(inputs instanceof Map)||!Array.isArray(evidence)||!evidence.length||new Set(evidence.map(e=>e.path)).size!==evidence.length||evidence.some(e=>!e.path.startsWith(prefix)||!/^context-[0-9]+\.bin$/.test(e.path.slice(prefix.length))||!Buffer.isBuffer(e.bytes)))fail('DELIVERY_EVIDENCE');
  if(checkout===null?localEntry(args.root,'.git',true)!==null:args.authorization.allowReadLocalGit!==true||!same(readGitContext(args.root),checkout))fail('CHECKOUT_CHANGED');
  return preparePlan(args,null,null,null,null,null,null,{evidence,checkout,inputs,workPath,indexPath,recordPath});
}

function preparePlan({root,authorization,context,targets,operationId=randomUUID()},cleanup=null,priorGraph=null,review=null,continuation=null,impact=null,workflow=null,delivery=null) {
  assertRuntime();
  root=safeRoot(root);
  if(!authorization||path.resolve(authorization.root)!==root||authorization.metadataRoot!=='.kidea/checkpoints')fail('AUTHORIZATION_REQUIRED');
  if(!hasLocalAssumptions(authorization.assumptions))fail('ENVIRONMENT_NOT_CONFIRMED');
  if(typeof authorization.allowRestoreUpdate!=='boolean'||authorization.allowRetireOwnPending!==true)fail('AUTHORIZATION_REQUIRED');
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(operationId))fail('INVALID_OPERATION_ID');
  if(!Array.isArray(targets)||!targets.length||!Array.isArray(authorization.targets)||authorization.targets.length!==targets.length)fail('INVALID_TARGETS');
  function checkGraph(g,allowStale=false) {
    const permitted=allowStale&&g.status.diagnostics.length&&g.status.diagnostics.every(d=>d.code==='CURRENT_SOURCE_DIFFERS'&&d.file===review.reviewPath&&/^\.(subjectVersions|inputVersions)\[\d+\]$/.test(d.fieldOrId));
    if(g.status.readState!=='OK'&&!permitted)throw Object.assign(new Error('GRAPH_NOT_VALID'),{code:'GRAPH_NOT_VALID',diagnostics:g.status.diagnostics});
    if(g.absent.size)fail('UNSUPPORTED_GRAPH_INPUT');
  }
  // Discover interrupted writes before interpreting already-created/partial
  // targets as a fresh request. This still does not authorize recovery/replay.
  const allowGit=authorization.allowReadLocalGit===true;
  const binding=continuation??impact??workflow??delivery;
  const current=cleanup?cleanupGraph(root,new Map(),cleanup.checkpointPath,allowGit):inspectStatusGraph(root,new Map(),[],{allowGit});checkGraph(current,!!review);
  for(const d of review?.directories??[])if(localEntry(root,d,true))fail('DIRECTORY_ALREADY_EXISTS');
  for(const d of impact?.directories??[])if(localEntry(root,d,true))fail('DIRECTORY_ALREADY_EXISTS');
  const seen=new Set(),overlay=new Map(),planned=[];
  for(const t of targets) {
    if(!validPath(t.path)||!['UPDATE','CREATE'].includes(t.action)||!Buffer.isBuffer(t.plannedBytes))fail('INVALID_TARGET');
    const key=portablePathKey(t.path);
    const reserved=key.startsWith('.kidea/checkpoints/')||key==='.kidea/checkpoints';
    if(seen.has(key)||key==='.kidea'||reserved&&!(cleanup&&t.path===cleanup.checkpointPath&&t.action==='UPDATE')&&!impact||t.action==='UPDATE'&&key.startsWith('.kidea/reviews/evidence/'))fail('INVALID_TARGET');
    seen.add(key);
    if(!authorization.targets.some(a=>a.path===t.path&&a.action===t.action))fail('TARGET_NOT_AUTHORIZED');
    const before=localBytes(root,t.path,t.action==='CREATE');
    if((t.action==='CREATE')!==(before===null))fail('TARGET_PRECONDITION');
    overlay.set(t.path,Buffer.from(t.plannedBytes));
    const beforeVersion=before&&authorization.allowReadLocalGit===true?findGitVersion(root,t.path,before):null;
    planned.push({path:t.path,action:t.action,beforeBase64:before?.toString('base64')??null,beforeVersion,plannedBase64:t.plannedBytes.toString('base64')});
  }
  if(cleanup)for(const c of cleanup.copies)overlay.set(c.path,null);
  if(binding) {
    const prefix=`.kidea/checkpoints/operations/${operationId}/`,target=planned[0];
    for(const e of binding.evidence){if(localEntry(root,e.path,true))fail('EVIDENCE_ALREADY_EXISTS');overlay.set(e.path,Buffer.from(e.bytes));}
    const copy=(bytes,kind,index,beforeVersion=null)=>({version:beforeVersion??{source:{path:planned[index].path,anchor:null},location:{kind:'SNAPSHOT',ref:{path:prefix+`${kind}-${index}.bin`,anchor:null}},integrity:integrity(bytes)},cleanup:null});
    for(const [i,t]of planned.entries()){
      if(t.beforeBase64!==null&&!t.beforeVersion)overlay.set(prefix+`before-${i}.bin`,Buffer.from(t.beforeBase64,'base64'));
      overlay.set(prefix+`planned-${i}.bin`,Buffer.from(t.plannedBase64,'base64'));
    }
    const checkpoint={schemaVersion:2,projectId:context.projectId,kind:'checkpoint',id:operationId,ownerId:context.ownerId,createdAt:new Date().toISOString(),tool:context.tool,permissionRefs:context.permissionRefs,inputRefs:context.inputRefs,
      targets:planned.map((t,i)=>({path:t.path,action:t.action,before:t.beforeBase64===null?null:copy(Buffer.from(t.beforeBase64,'base64'),'before',i,t.beforeVersion),planned:copy(Buffer.from(t.plannedBase64,'base64'),'planned',i)})),observations:[],nextAction:'Continuation checkpoint preflight, not completion.'};
    overlay.set(prefix+'checkpoint.md',recordBytes(checkpoint));
    if(current.records.get(target.path)?.kind!=='work')fail('CONTINUATION_SCOPE');
  }
  const projected=cleanup?cleanupGraph(root,overlay,cleanup.checkpointPath,allowGit):inspectStatusGraph(root,overlay,[],{allowGit});checkGraph(projected);
  if(delivery) {
    const before=structuredClone(current.records.get(delivery.workPath)),after=structuredClone(projected.records.get(delivery.workPath));
    if(before?.kind!=='work'||after?.kind!=='work'||!same(after.checkpointRef,{path:`.kidea/checkpoints/operations/${operationId}/checkpoint.md`,anchor:null}))fail('DELIVERY_SCOPE');
    for(const r of [before,after]){delete r.checkpointRef;delete r.nextAction;}
    if(!same(before,after))fail('DELIVERY_WORK_SCOPE');
    const oldIndex=current.records.get(delivery.indexPath),newIndex=projected.records.get(delivery.indexPath),expected=structuredClone(oldIndex);
    if(expected?.kind!=='index')fail('DELIVERY_SCOPE');
    if(!expected.sources.some(s=>s.role==='operations'&&s.ref.path===delivery.recordPath))expected.sources.push({role:'operations',ref:{path:delivery.recordPath,anchor:null}});
    if(!same(expected,newIndex)||!['release','operation'].includes(projected.records.get(delivery.recordPath)?.kind))fail('DELIVERY_RECORD_SCOPE');
  }
  if(workflow) {
    const before=structuredClone(current.records.get(workflow.workPath)),after=structuredClone(projected.records.get(workflow.workPath));
    if(before?.kind!=='work'||after?.kind!=='work'||!same(after.checkpointRef,{path:`.kidea/checkpoints/operations/${operationId}/checkpoint.md`,anchor:null}))fail('WORK_TRANSITION_SCOPE');
    for(const row of [before,after])for(const key of ['items','currentItemId','blockers','nextAction','checkpointRef',...(workflow.mode==='CYCLE'?['rounds','currentRoundId','returnStack','reviewRefs']:[])])delete row[key];
    if(!same(before,after))fail('WORK_TRANSITION_SCOPE');
  }
  if(impact) {
    const before=structuredClone(current.records.get(impact.workPath)),after=structuredClone(projected.records.get(impact.workPath));
    if(before?.kind!=='work'||after?.kind!=='work'||projected.records.get(impact.planPath)?.kind!=='plan')fail('IMPACT_SCOPE');
    // Only orchestration fields may change; no rounds, product scope, old work
    // item/gate transitions, approval or release changes are authorized here.
    for(const r of [before,after])for(const key of ['currentItemId','planRefs','blockers','returnStack','nextAction','checkpointRef'])delete r[key];
    if(!same(before,after))fail('IMPACT_WORK_SCOPE');
    const oldPlan=current.records.get(impact.planPath);
    if(oldPlan&&oldPlan.kind!=='plan')fail('IMPACT_SCOPE');
    const work=projected.records.get(impact.workPath);
    if(!work.planRefs.some(r=>r.path===impact.planPath))fail('IMPACT_PLAN_NOT_LINKED');
    for(const item of projected.records.get(impact.planPath).items)if(item.roundId!==work.currentRoundId||!item.id.startsWith('impact-')||item.kind!=='TASK'||item.shape!=='LEAF'||item.dependencyIds.length)fail('IMPACT_ITEM_SCOPE');
  }
  if(continuation) {
    const p=planned[0].path,old=structuredClone(current.records.get(p)),next=structuredClone(projected.records.get(p));
    if(!next||next.kind!=='work'||next.currentItemId!==context.ownerId||!same(next.checkpointRef,{path:`.kidea/checkpoints/operations/${operationId}/checkpoint.md`,anchor:null}))fail('CONTINUATION_SCOPE');
    for(const r of [old,next]){delete r.nextAction;delete r.checkpointRef;}
    if(!same(old,next))fail('CONTINUATION_TRANSITION_NOT_ALLOWED');
    for(const p of continuation.reviewPaths) {
      const before=structuredClone(current.records.get(p)),after=structuredClone(projected.records.get(p));
      if(before?.kind!=='review'||before.status!=='APPROVED'||after?.status!=='APPROVED'||after.validityChecks.length!==before.validityChecks.length+1||after.validityChecks.at(-1).result!=='NON_SEMANTIC'||!same(after.validityChecks.slice(0,-1),before.validityChecks))fail('CONTINUATION_REVIEW_SCOPE');
      for(const key of ['subjectVersions','inputVersions'])if(!same(before[key].map(v=>v.source),after[key].map(v=>v.source)))fail('CONTINUATION_REVIEW_SCOPE');
      for(const r of [before,after])for(const key of ['subjectVersions','inputVersions','historyRefs','validityChecks'])delete r[key];
      if(!same(before,after))fail('CONTINUATION_REVIEW_SCOPE');
    }
  }
  const currentItems=[...current.records.values()].filter(r=>['work','plan'].includes(r.kind)).flatMap(r=>r.items);
  if(context?.projectId!==current.status.projectId||context.projectId!==projected.status.projectId||!currentItems.some(i=>i.id===context.ownerId)||!projected.status.data.items.some(i=>i.id===context.ownerId))fail('CONTEXT_IDENTITY');
  checked(context.tool,'ToolIdentity');
  if(!context.tool.components.length||new Set(context.tool.components.map(c=>c.name)).size!==context.tool.components.length)fail('INVALID_TOOLIDENTITY');
  if(!Array.isArray(context.permissionRefs)||!context.permissionRefs.length||!Array.isArray(context.inputRefs)||!context.inputRefs.length)fail('CONTEXT_REFERENCES_REQUIRED');
  const inputs=new Map(),gitInputs=new Map();
  function bind(p,data){if(inputs.has(p)&&!inputs.get(p).equals(data))fail('SOURCE_CHANGED');inputs.set(p,Buffer.from(data));}
  function bindGit(location,data){const key=JSON.stringify(location);if(gitInputs.has(key)&&gitInputs.get(key).expectedBase64!==data.toString('base64'))fail('SOURCE_CHANGED');gitInputs.set(key,{location:structuredClone(location),expectedBase64:data.toString('base64')});}
  for(const graph of [priorGraph,current,projected].filter(Boolean)) {
    for(const [p,data]of graph.reads)bind(p,data);
    for(const {location,bytes}of graph.gitReads?.values()??[])bindGit(location,bytes);
  }
  for(const [p,bytes]of binding?.inputs??[]) {
    if(!Buffer.isBuffer(bytes)||!localBytes(root,p).equals(bytes))fail('SOURCE_CHANGED');bind(p,bytes);
  }
  for(const v of [...context.permissionRefs,...context.inputRefs]) {
    checked(v,'VersionRef');
    if(!['SNAPSHOT','GIT'].includes(v.location.kind)||v.location.kind==='SNAPSHOT'&&v.location.ref.anchor!==null||v.source===null)fail('UNSUPPORTED_REFERENCE');
    if(v.location.kind==='GIT'&&!allowGit)fail('GIT_READ_NOT_AUTHORIZED');
    const createdContext=p=>binding?.evidence.some(e=>e.path===p)||review&&overlay.has(p)&&planned.find(t=>t.path===p)?.action==='CREATE';
    const resolveContext=p=>createdContext(p)?overlay.get(p):localBytes(root,p);
    const snapshot=v.location.kind==='GIT'?readGitVersion(root,v.location):resolveContext(v.location.ref.path),source=resolveContext(v.source.path);
    if(!same(integrity(snapshot),v.integrity)||!source.equals(snapshot))fail('CONTEXT_SOURCE_DIFFERS');
    if(v.source.anchor!==null) {
      try{if(snapshotAnchorCount(snapshot,v.source.anchor)!==1)fail('CONTEXT_ANCHOR');}
      catch{fail('CONTEXT_ANCHOR');}
    }
    if(v.location.kind==='GIT')bindGit(v.location,snapshot);else if(!createdContext(v.location.ref.path))bind(v.location.ref.path,snapshot);
    if(!createdContext(v.source.path))bind(v.source.path,source);
  }
  const folded=new Map();
  for(const p of [...inputs.keys(),...planned.map(t=>t.path)]) {
    const key=portablePathKey(p);if(folded.has(key)&&folded.get(key)!==p)fail('AMBIGUOUS_PATH_ALIAS');folded.set(key,p);
  }
  for(const t of planned) {
    if(inputs.has(t.path)&&(t.beforeBase64===null||inputs.get(t.path).toString('base64')!==t.beforeBase64))fail('SOURCE_CHANGED');
  }
  // Return only serialized, detached data; mutating caller buffers cannot change
  // a plan after graph validation. Execution rechecks these bytes before writing.
  const request={protocolVersion:2,operationId,root,authorization:structuredClone(authorization),context:structuredClone(context),
    inputs:[...inputs].sort(([a],[b])=>a.localeCompare(b)).map(([p,b])=>({path:p,expectedBase64:b.toString('base64')})),gitInputs:[...gitInputs.values()],targets:planned};
  request.recoveryCheckout=allowGit&&localEntry(root,'.git',true)?readGitContext(root):null;
  if(cleanup)request.cleanup=structuredClone(cleanup);
  if(review)request.review=structuredClone(review);
  if(binding)request.continuation={checkout:structuredClone(binding.checkout),evidence:binding.evidence.map(e=>({path:e.path,bytesBase64:e.bytes.toString('base64')}))};
  if(impact)request.impact={directories:impact.directories};
  const line=JSON.stringify(request);
  const prepared=Object.freeze({line,planDigest:sha(Buffer.from(line)),operationId});
  preparedPlans.add(prepared);return prepared;
}

// Conditional deletion of the writer's own retired recovery payloads only.
// Trust in completion/checks/retention comes from the caller's explicit grant;
// matching record labels are necessary corroboration, never self-authorization.
export function prepareInternalCleanup({root,authorization,context,checkpointPath,copies,receipt,operationId=randomUUID()}) {
  root=safeRoot(root);
  if(!authorization?.cleanup||authorization.allowRestoreUpdate!==false)fail('CLEANUP_AUTHORIZATION_REQUIRED');
  if(typeof authorization.root!=='string'||path.resolve(authorization.root)!==root||authorization.metadataRoot!=='.kidea/checkpoints'||authorization.allowRetireOwnPending!==true)fail('CLEANUP_AUTHORIZATION_REQUIRED');
  if(!hasLocalAssumptions(authorization.assumptions))fail('ENVIRONMENT_NOT_CONFIRMED');
  const conditions=authorization.cleanup.conditions;
  if(!conditions||!['ownerCompleted','requiredChecksPassed','retentionEnded'].every(k=>conditions[k]===true))fail('CLEANUP_CONDITIONS_REQUIRED');
  const match=/^\.kidea\/checkpoints\/operations\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/checkpoint\.md$/.exec(checkpointPath??'');
  if(!match)fail('NOT_OWN_CHECKPOINT');
  checked(receipt,'CleanupReceipt');
  if(!Array.isArray(copies)||!copies.length||!Array.isArray(authorization.cleanup.copies)||authorization.cleanup.copies.length!==copies.length)fail('CLEANUP_TARGETS_REQUIRED');
  const current=cleanupGraph(root,new Map(),checkpointPath,authorization.allowReadLocalGit===true);
  if(current.status.readState!=='OK')throw Object.assign(new Error('GRAPH_NOT_VALID'),{code:'GRAPH_NOT_VALID',diagnostics:current.status.diagnostics});
  if(current.absent.size)fail('UNSUPPORTED_GRAPH_INPUT');
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

// Test hooks exist only on the trusted internal API, never in public project
// input. A stopped process leaves the same pending marker as an ordinary error.
export async function executeInternalWrite(prepared,{testFault='NONE',testBarrier='NONE',onBarrier}={}) {
  if(!preparedPlans.has(prepared))fail('UNVALIDATED_PLAN');
  if(sha(Buffer.from(prepared.line))!==prepared.planDigest)fail('PLAN_CHANGED');
  const barriers=['NONE','BUSY_ACQUIRED','PENDING_CREATED','PREPARED','BEFORE_FIRST_WRITE','AFTER_PARTIAL_WRITE','AFTER_CREATE','AFTER_VERIFY','BEFORE_RETIRE','CLEANUP_BEFORE_DELETE','CLEANUP_AFTER_FIRST_DELETE'];
  const faults=['NONE','BEFORE_FIRST_WRITE','AFTER_PARTIAL_WRITE','AFTER_CREATE','AFTER_VERIFY','RETIRE_FAILURE','CLEANUP_DELETE_FAILURE','CLEANUP_AFTER_FIRST_DELETE','CLEANUP_RECEIPT_FAILURE'];
  if(!barriers.includes(testBarrier)||!faults.includes(testFault)||onBarrier!==undefined&&typeof onBarrier!=='function')fail('INVALID_TEST_OPTIONS');
  const request=JSON.parse(prepared.line),{root,operationId,context,authorization}=request;
  const prefix=`.kidea/checkpoints/operations/${operationId}/`,checkpointPath=prefix+'checkpoint.md';
  const pendingDirectory='.kidea/checkpoints/pending',pendingPath=pendingDirectory+'/active.json';
  const targets=request.targets.map(t=>({...t,before:t.beforeBase64===null?null:Buffer.from(t.beforeBase64,'base64'),planned:Buffer.from(t.plannedBase64,'base64')}));
  const expected=new Map(request.inputs.map(i=>[i.path,Buffer.from(i.expectedBase64,'base64')]));
  const gitVersions=new Map((request.gitInputs??[]).map(i=>[JSON.stringify(i.location),Buffer.from(i.expectedBase64,'base64')]));
  const evidence=new Map(),deleted=new Map(),events=[];
  let pendingBytes,checkpoint,pendingOwned=false,effects=false,bytesVerified=false,barrierUsed=false;
  const now=()=>new Date().toISOString();
  const record=c=>Buffer.from('# Kidea write checkpoint — byte evidence, not approval\n\n<!-- kidea:data:start -->\n```json\n'+JSON.stringify(c,null,2)+'\n```\n<!-- kidea:data:end -->\n');
  function destination(relative) {
    const parent=path.posix.dirname(relative);
    return path.join(parent==='.'?root:localEntry(root,parent).full,path.posix.basename(relative));
  }
  function directory(relative,mustBeNew=false) {
    const entry=localEntry(root,relative,true);
    if(entry) {if(mustBeNew||!entry.stat.isDirectory())fail('DIRECTORY_ALREADY_EXISTS');return;}
    mkdirSync(destination(relative));effects=true;
    if(!localEntry(root,relative)?.stat.isDirectory())fail('UNSAFE_PATH');
  }
  function writeBytes(relative,bytes,create=true) {
    const entry=localEntry(root,relative,true);
    if(create?entry!==null:!entry?.stat.isFile())fail('TARGET_PRECONDITION');
    const fd=openSync(entry?.full??destination(relative),create?'wx':'r+');
    effects=true;
    try {
      let written=0;
      while(written<bytes.length) {const n=writeSync(fd,bytes,written,bytes.length-written,written);if(!n)fail('SHORT_WRITE');written+=n;}
      ftruncateSync(fd,bytes.length);fsyncSync(fd);
    } finally {closeSync(fd);}
    if(!localBytes(root,relative).equals(bytes))fail('READBACK_DIFFERS');
  }
  function remember(relative,bytes) {writeBytes(relative,bytes);evidence.set(relative,bytes);}
  function exact(relative,bytes,code='SOURCE_CHANGED') {
    const actual=localBytes(root,relative,true);
    if(bytes===null?actual!==null:!actual?.equals(bytes))fail(code);
    return actual;
  }
  function checkInputs() {
    safeRoot(root);
    if(request.continuation&&(request.continuation.checkout===null?localEntry(root,'.git',true)!==null:!same(readGitContext(root),request.continuation.checkout)))fail('CHECKOUT_CHANGED');
    for(const [p,bytes]of expected)exact(p,bytes);
    for(const [key,bytes]of gitVersions)if(!readGitVersion(root,JSON.parse(key)).equals(bytes))fail('GIT_SOURCE_CHANGED');
    for(const t of targets)if(!expected.has(t.path))exact(t.path,t.before,'TARGET_PRECONDITION');
  }
  function checkFinalBytes() {
    if(request.continuation&&(request.continuation.checkout===null?localEntry(root,'.git',true)!==null:!same(readGitContext(root),request.continuation.checkout)))fail('CHECKOUT_CHANGED');
    for(const [p,bytes]of expected)exact(p,deleted.has(p)?null:targets.find(t=>t.path===p)?.planned??bytes);
    for(const t of targets)exact(t.path,t.planned,'TARGET_BYTES_CHANGED');
    for(const [p,bytes]of evidence)exact(p,bytes,'RECOVERY_EVIDENCE_CHANGED');
    for(const [key,bytes]of gitVersions)if(!readGitVersion(root,JSON.parse(key)).equals(bytes))fail('GIT_SOURCE_CHANGED');
    for(const p of deleted.keys())exact(p,null,'CLEANUP_ABSENCE_UNVERIFIED');
  }
  function checkPending() {
    exact(pendingPath,pendingBytes,'PENDING_CHANGED');
    if(!same(readdirSync(path.join(root,pendingDirectory)).sort(),['active.json']))fail('INCOMPLETE_WRITE_EXISTS');
  }
  async function barrier(point) {
    if(testBarrier!==point||barrierUsed)return;
    barrierUsed=true;
    const event={event:'BARRIER',point,operationId};events.push(event);
    if(await onBarrier?.(event,{pid:process.pid})===false)fail('INJECTED_STOP');
  }
  const fault=point=>{if(testFault===point)fail('INJECTED_'+point);};
  function copy(t,index,kind) {
    if(kind==='before'&&t.before===null)return null;
    const bytes=kind==='before'?t.before:t.planned;
    const version=kind==='before'&&t.beforeVersion?t.beforeVersion:{source:{path:t.path,anchor:null},location:{kind:'SNAPSHOT',ref:{path:prefix+`${kind}-${index}.bin`,anchor:null}},integrity:integrity(bytes)};
    return {version:structuredClone(version),cleanup:null};
  }
  function result(complete,error=null) {
    const state=complete?'COMPLETED_BYTES':pendingOwned||effects?'PENDING':'REJECTED';
    events.push({event:'RESULT',state,operationId,planDigest:prepared.planDigest,code:error?.code??(complete?'BOUND_BYTES_VERIFIED_NOT_TASK_APPROVAL':'WRITE_NOT_COMPLETE'),effects,checkpointRef:{path:checkpointPath,anchor:null}});
    return {state,operationId,bytesVerified,checkpointRef:{path:checkpointPath,anchor:null},wrapperError:error?.code??null,wrapperErrorDetail:error?.message??null,events,
      verification:complete?'BOUND_GRAPH_AND_BYTES_NOT_APPROVAL':'NOT_COMPLETE'};
  }
  try {
    assertRuntime();assertLocalRoot(root);
    if(request.protocolVersion!==2||!hasLocalAssumptions(authorization.assumptions))fail('ENVIRONMENT_NOT_CONFIRMED');
    if(authorization.allowReadLocalGit!==true&&(gitVersions.size||targets.some(t=>t.beforeVersion)))fail('GIT_READ_NOT_AUTHORIZED');
    checkInputs();
    if(localEntry(root,prefix.slice(0,-1),true))fail('OPERATION_ALREADY_EXISTS');
    if(request.bootstrap) {
      if(localEntry(root,'.kidea',true))fail('KIDEA_ALREADY_EXISTS');
      for(const d of request.bootstrap.directories)if(localEntry(root,d,true))fail('DIRECTORY_ALREADY_EXISTS');
    }
    directory('.kidea',!!request.bootstrap);directory('.kidea/checkpoints');directory(pendingDirectory);
    if(readdirSync(path.join(root,pendingDirectory)).length)fail('INCOMPLETE_WRITE_EXISTS');
    pendingBytes=Buffer.from(JSON.stringify({protocolVersion:2,operationId,planDigest:prepared.planDigest,checkpointRef:{path:checkpointPath,anchor:null}})+'\n');
    // wx is the single cooperative project guard. Never reclaim an existing
    // marker by age, PID, or a record claiming the previous operation was done.
    const fd=openSync(path.join(root,pendingPath),'wx');pendingOwned=true;effects=true;
    try {let offset=0;while(offset<pendingBytes.length){const n=writeSync(fd,pendingBytes,offset,pendingBytes.length-offset,offset);if(!n)fail('SHORT_WRITE');offset+=n;}fsyncSync(fd);}finally{closeSync(fd);}
    checkPending();await barrier('BUSY_ACQUIRED');await barrier('PENDING_CREATED');checkInputs();
    directory('.kidea/checkpoints/operations');directory(prefix.slice(0,-1),true);
    for(const t of targets)if(t.beforeVersion) {
      if(!readGitVersion(root,t.beforeVersion.location).equals(t.before)||!same(t.beforeVersion.integrity,integrity(t.before)))fail('GIT_PREIMAGE_CHANGED');
      gitVersions.set(JSON.stringify(t.beforeVersion.location),t.before);
    }
    checkpoint={schemaVersion:2,projectId:context.projectId,kind:'checkpoint',id:operationId,ownerId:context.ownerId,createdAt:now(),tool:context.tool,
      permissionRefs:context.permissionRefs,inputRefs:context.inputRefs,targets:targets.map((t,i)=>({path:t.path,action:t.action,before:copy(t,i,'before'),planned:copy(t,i,'planned')})),
      observations:[],nextAction:'Prepared only. Reconcile actual bytes before continuing an interrupted operation.'};
    for(const e of request.bootstrap?.evidence??[])remember(e.path,Buffer.from(e.bytesBase64,'base64'));
    for(const e of request.continuation?.evidence??[])remember(e.path,Buffer.from(e.bytesBase64,'base64'));
    for(const [i,t]of targets.entries()) {
      if(t.before!==null&&!t.beforeVersion)remember(prefix+`before-${i}.bin`,t.before);
      remember(prefix+`planned-${i}.bin`,t.planned);
    }
    remember(prefix+'prepared.md',record(checkpoint));
    // Recovery can bind the original complete request in a fresh process.
    // Its digest is already in the exclusive pending marker. Legacy pending
    // operations without this evidence remain blocked, never reconstructed.
    remember(prefix+'prepared-request.json',Buffer.from(prepared.line));
    remember(checkpointPath,record(checkpoint));
    await barrier('PREPARED');checkPending();checkInputs();
    for(const d of request.bootstrap?.directories??[])directory(d,true);
    for(const d of request.review?.directories??[])directory(d,true);
    for(const d of request.impact?.directories??[])directory(d,true);
    await barrier('BEFORE_FIRST_WRITE');fault('BEFORE_FIRST_WRITE');checkInputs();
    if(request.cleanup) {
      await barrier('CLEANUP_BEFORE_DELETE');fault('CLEANUP_DELETE_FAILURE');
      for(const c of request.cleanup.copies) {
        exact(c.path,expected.get(c.path),'COPY_BYTES_CHANGED');
        unlinkSync(localEntry(root,c.path).full);effects=true;deleted.set(c.path,c);
        exact(c.path,null,'CLEANUP_ABSENCE_UNVERIFIED');
        if(deleted.size===1){await barrier('CLEANUP_AFTER_FIRST_DELETE');fault('CLEANUP_AFTER_FIRST_DELETE');}
      }
    }
    for(const [i,t]of targets.entries()) {
      checkPending();exact(t.path,t.before,'TARGET_PRECONDITION');
      if(t.action==='CREATE'){writeBytes(t.path,Buffer.alloc(0));await barrier('AFTER_CREATE');fault('AFTER_CREATE');}
      if((testFault==='AFTER_PARTIAL_WRITE'||testBarrier==='AFTER_PARTIAL_WRITE'&&!barrierUsed)&&i===0) {
        writeBytes(t.path,t.planned.subarray(0,Math.max(1,Math.floor(t.planned.length/2))),false);
        await barrier('AFTER_PARTIAL_WRITE');fault('AFTER_PARTIAL_WRITE');
      }
      if(request.cleanup)fault('CLEANUP_RECEIPT_FAILURE');
      // UPDATE retains the existing file metadata. A partial write is possible;
      // the exact preimage and pending operation are retained, never auto-replayed.
      writeBytes(t.path,t.planned,false);
      exact(t.path,t.planned,'READBACK_DIFFERS');
    }
    checkFinalBytes();
    checkpoint.observations=[{at:now(),phase:'VERIFY',results:targets.map(t=>({path:t.path,match:'PLANNED',integrity:integrity(t.planned),detail:'Read back by the cooperative Node writer.'})),evidenceRefs:[]}];
    checkpoint.nextAction='All planned bytes verified. This is not task completion or Human approval.';
    const finalCheckpoint=record(checkpoint);
    // Keep the immutable prepared record if this small final record is torn.
    writeBytes(checkpointPath,finalCheckpoint,false);evidence.set(checkpointPath,finalCheckpoint);
    await barrier('AFTER_VERIFY');fault('AFTER_VERIFY');checkFinalBytes();
    const files=new Map([...expected,...evidence]);
    for(const t of targets)files.set(t.path,localBytes(root,t.path));
    for(const p of deleted.keys())files.set(p,null);
    const graph=inspectBoundGraph(root,files,{gitVersions,checkpointPaths:[checkpointPath,...(request.cleanup?[request.cleanup.checkpointPath]:[])]});
    if(graph.status.readState!=='OK')throw Object.assign(new Error('FINAL_GRAPH_NOT_VALID'),{code:'FINAL_GRAPH_NOT_VALID',diagnostics:graph.status.diagnostics});
    if(graph.status.projectId!==context.projectId||!graph.status.data.items.some(i=>i.id===context.ownerId))fail('CONTEXT_IDENTITY');
    bytesVerified=true;
    await barrier('BEFORE_RETIRE');fault('RETIRE_FAILURE');checkPending();checkFinalBytes();
    unlinkSync(path.join(root,pendingPath));
    // No further fallible I/O after retiring our own marker. Git/snapshot
    // retention and multi-file crash recovery remain explicit lifecycle duties.
    return result(true);
  } catch(error) {return result(false,error);}
}

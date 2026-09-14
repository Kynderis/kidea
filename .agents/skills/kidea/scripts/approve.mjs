// Review metadata only. The trusted caller establishes Human identity, intent,
// semantic readiness and scope; text on disk cannot authorize these operations.
import {readFileSync,realpathSync} from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual as same} from 'node:util';
import {randomUUID} from 'node:crypto';
import {localEntry,byteIntegrity,hashBytes,recordBytes} from './bootstrap-plan.mjs';
import {inspectStatusGraph} from './status.mjs';
import {validate} from './schema.mjs';
import {initToolIdentity} from './init.mjs';
import {findGitVersion} from './git-versions.mjs';
import {prepareInternalReviewWrite,executeInternalWrite} from './write-internal.mjs';

const fail=code=>{throw Object.assign(new Error(code),{code});};
const text=v=>typeof v==='string'&&v.trim().length>0;
const closed=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>keys.includes(k));
const ref=p=>({path:p,anchor:null});
const rewrite=(bytes,record)=>Buffer.from(new TextDecoder('utf-8',{fatal:true}).decode(bytes).replace(/(<!-- kidea:data:start -->\r?\n```json\r?\n)[\s\S]*?(\r?\n```\r?\n<!-- kidea:data:end -->)/,(_m,a,b)=>a+JSON.stringify(record,null,2)+b));

export function prepareReview(root,request) {
  if(typeof root!=='string'||!path.isAbsolute(root)||path.resolve(realpathSync(root))!==path.resolve(root))fail('ROOT_NOT_EXPLICIT');
  root=realpathSync(root);
  if(!closed(request,['operation','id','revision','expectedDigest','ownerIds','package','human','comparison','permission'])||!['CREATE','SUBMIT','FEEDBACK','REVISE','APPROVE'].includes(request.operation))fail('REVIEW_INPUT_INVALID');
  const {operation,id}=request;
  if(!/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(id??''))fail('REVIEW_ID_REQUIRED');
  if(!Array.isArray(request.ownerIds)||!request.ownerIds.length||new Set(request.ownerIds).size!==request.ownerIds.length)fail('OWNER_SCOPE_REQUIRED');
  const reviewPath=`.kidea/reviews/${id}.md`,grant=request.permission;
  if(!closed(grant,['root','reviewPath','ownerIds','allowReviewMetadata','allowLinkOwners','allowCreateEvidence','createDirectories','allowReadLocalGit','assumptions','statement'])||grant.root!==root||grant.reviewPath!==reviewPath||!same(grant.ownerIds,request.ownerIds)||grant.allowReviewMetadata!==true||grant.allowCreateEvidence!==true||!text(grant.statement))fail('AUTHORIZATION_REQUIRED');
  if(grant.allowReadLocalGit!==undefined&&typeof grant.allowReadLocalGit!=='boolean')fail('AUTHORIZATION_REQUIRED');
  if(!grant.assumptions||!['localNtfs','noActiveSync','singleKideaRun'].every(k=>grant.assumptions[k]===true))fail('ENVIRONMENT_NOT_CONFIRMED');
  const tool=initToolIdentity();tool.version='kidea-schema2-review-cooperative-r1';
  tool.components.push({name:'approve.mjs',integrity:byteIntegrity(readFileSync(new URL('./approve.mjs',import.meta.url)))});
  const graph=inspectStatusGraph(root,new Map(),[],{allowGit:grant.allowReadLocalGit===true});
  const stale=graph.status.readState!=='OK';
  if(stale&&!(operation==='REVISE'&&graph.status.diagnostics.length&&graph.status.diagnostics.every(d=>d.code==='CURRENT_SOURCE_DIFFERS'&&d.file===reviewPath&&/^\.(subjectVersions|inputVersions)\[\d+\]$/.test(d.fieldOrId))))throw Object.assign(new Error('GRAPH_NOT_VALID'),{code:'GRAPH_NOT_VALID',diagnostics:graph.status.diagnostics});
  if(graph.absent.size)fail('SOURCE_MISSING');
  const rows=[...graph.records].filter(([,r])=>['work','plan'].includes(r.kind));
  for(const owner of request.ownerIds)if(!rows.some(([,r])=>r.items.some(i=>i.id===owner)))fail('OWNER_NOT_FOUND');
  const current=graph.records.get(reviewPath),oldBytes=graph.reads.get(reviewPath);
  if(operation==='CREATE') {
    if(current||localEntry(root,reviewPath))fail('REVIEW_ALREADY_EXISTS');
    if(request.revision!==1||request.expectedDigest!==null||grant.allowLinkOwners!==true)fail('CREATE_SCOPE_REQUIRED');
  } else {
    if(!current||current.kind!=='review'||current.id!==id)fail('REVIEW_NOT_FOUND');
    if(request.revision!==current.revision||request.expectedDigest!==hashBytes(oldBytes)||!same(request.ownerIds,current.ownerIds))fail('REVIEW_VERSION_OR_SCOPE_DIFFERS');
  }
  const directories=['.kidea/reviews','.kidea/reviews/evidence'].filter(p=>!localEntry(root,p));
  if(!same(grant.createDirectories??[],directories))fail('DIRECTORY_NOT_AUTHORIZED');
  const operationId=randomUUID(),targets=[],overlay=new Map();
  const add=(p,action,bytes)=>{targets.push({path:p,action,plannedBytes:bytes});overlay.set(p,bytes);};
  let serial=0;
  const capture=(bytes,source=null)=>{
    if(source&&grant.allowReadLocalGit===true&&!overlay.has(source.path)) {
      const git=findGitVersion(root,source.path,bytes,source.anchor);if(git)return git;
    }
    const p=`.kidea/reviews/evidence/${id}-${operationId}-${serial++}.md`;
    add(p,'CREATE',bytes);return {source:source??ref(p),location:{kind:'SNAPSHOT',ref:ref(p)},integrity:byteIntegrity(bytes)};
  };
  const readRef=r=>{
    if(!validate(r,'Ref',()=>{}))fail('INVALID_SELECTED_REFERENCE');
    const entry=localEntry(root,r.path);if(!entry?.stat.isFile())fail('SOURCE_MISSING');
    return overlay.get(r.path)??readFileSync(entry.full);
  };
  const selected=refs=>{
    if(!Array.isArray(refs)||!refs.length||new Set(refs.map(r=>JSON.stringify(r))).size!==refs.length)fail('PACKAGE_REFERENCES_REQUIRED');
    return refs.map(r=>capture(readRef(r),r));
  };
  const relatedPaths=[];
  if(operation==='CREATE') {
    for(const [p,r]of rows) {
      const next=structuredClone(r);let changed=false;
      for(const i of next.items)if(request.ownerIds.includes(i.id)){i.gateIds.push(id);changed=true;}
      if(next.kind==='work'){next.reviewRefs.push(ref(reviewPath));changed=true;}
      if(changed){relatedPaths.push(p);add(p,'UPDATE',rewrite(graph.reads.get(p),next));}
    }
  }
  const review=current?structuredClone(current):{schemaVersion:2,projectId:graph.status.projectId,kind:'review',id,revision:1,ownerIds:request.ownerIds,subjectRefs:[],status:'DRAFT',confirmationRef:null,purpose:'CONTENT',feedbackRefs:[],waiverReasonRef:null,subjectVersions:[],inputVersions:[],historyRefs:[],validityChecks:[]};
  const permission=capture(Buffer.from(grant.statement));
  const requestEvidence=capture(Buffer.from(JSON.stringify({operation,id,revision:request.revision,expectedDigest:request.expectedDigest,ownerIds:request.ownerIds,package:request.package,human:request.human,comparison:request.comparison},null,2)));
  const archive=()=>{review.historyRefs=[capture(oldBytes,ref(reviewPath))];};
  const checkHuman=()=>{
    if(!closed(request.human,['intent','statement','id','revision','expectedDigest','ownerIds'])||!text(request.human.statement)||request.human.id!==id||request.human.revision!==request.revision||request.human.expectedDigest!==request.expectedDigest||!same(request.human.ownerIds,request.ownerIds))fail('CURRENT_HUMAN_CONFIRMATION_REQUIRED');
  };
  if(['CREATE','REVISE'].includes(operation)) {
    const pkg=request.package;
    if(!closed(pkg,['subjectRefs','inputRefs','purpose','waiverReason'])||!['CONTENT','NOT_APPLICABLE'].includes(pkg.purpose))fail('PACKAGE_REQUIRED');
    if(pkg.purpose==='CONTENT'?pkg.waiverReason!==null:!text(pkg.waiverReason))fail('WAIVER_REASON_REQUIRED');
    if(operation==='REVISE') {
      const cmp=request.comparison;
      if(!closed(cmp,['reason','affectedIds','currentSources'])||!text(cmp.reason)||!Array.isArray(cmp.affectedIds)||!request.ownerIds.every(o=>cmp.affectedIds.includes(o)))fail('COMPARISON_REQUIRED');
      const sources=[...current.subjectVersions,...current.inputVersions].map(v=>v.source).filter(Boolean);
      if(!Array.isArray(cmp.currentSources)||cmp.currentSources.length!==sources.length)fail('COMPARISON_SOURCE_REQUIRED');
      for(const [i,r]of sources.entries())if(!same(cmp.currentSources[i],{ref:r,integrity:byteIntegrity(readRef(r))}))fail('COMPARISON_SOURCE_DIFFERS');
      archive();review.revision++;review.status='DRAFT';review.confirmationRef=null;
      review.validityChecks.push({at:new Date().toISOString(),beforeRefs:[...current.subjectVersions,...current.inputVersions],afterRefs:[],result:'REOPEN',reason:cmp.reason,affectedIds:cmp.affectedIds});
    }
    review.purpose=pkg.purpose;review.subjectRefs=structuredClone(pkg.subjectRefs);
    review.subjectVersions=selected(pkg.subjectRefs);review.inputVersions=selected(pkg.inputRefs);
    review.waiverReasonRef=pkg.purpose==='NOT_APPLICABLE'?capture(Buffer.from(pkg.waiverReason)):null;
    if(operation==='REVISE')review.validityChecks.at(-1).afterRefs=[...review.subjectVersions,...review.inputVersions];
  } else if(operation==='SUBMIT') {
    if(review.status!=='DRAFT')fail('REVIEW_NOT_DRAFT');
    if(!closed(request.package,['conditionsMet','statement'])||request.package.conditionsMet!==true||!text(request.package.statement))fail('READINESS_REQUIRED');
    archive();review.status='IN_REVIEW';review.inputVersions.push(capture(Buffer.from(JSON.stringify(request.package))));
    // Readiness is a caller assessment, not authenticated Human approval.
  } else if(operation==='FEEDBACK') {
    checkHuman();
    if(!['REQUEST_CHANGES','REJECT','EXPLAIN'].includes(request.human.intent))fail('FEEDBACK_INTENT_REQUIRED');
    if(review.status==='APPROVED'&&request.human.intent==='EXPLAIN')fail('REVIEW_ALREADY_APPROVED');
    archive();review.feedbackRefs.push(capture(Buffer.from(JSON.stringify(request.human))));
    if(request.human.intent!=='EXPLAIN'){review.status='DRAFT';review.confirmationRef=null;}
  } else {
    checkHuman();
    if(request.human.intent!=='APPROVE')fail('APPROVAL_INTENT_REQUIRED');
    if(review.status==='APPROVED')return {state:'ALREADY_APPROVED',id,revision:review.revision,verification:'RECORDED_LABEL_NOT_AUTHENTICATED'};
    if(review.status!=='IN_REVIEW')fail('REVIEW_NOT_IN_REVIEW');
    if(!closed(request.package,['conditionsMet','statement'])||request.package.conditionsMet!==true||!text(request.package.statement))fail('READINESS_REQUIRED');
    archive();review.status='APPROVED';review.confirmationRef=capture(Buffer.from(JSON.stringify(request.human)));
  }
  if(!validate(review,'review',()=>{}))fail('INVALID_REVIEW');
  add(reviewPath,current?'UPDATE':'CREATE',current?rewrite(oldBytes,review):Buffer.concat([Buffer.from('# Gói review — nhãn ghi nhận, không xác thực Human\n\n'),recordBytes(review)]));
  const authorization={root,metadataRoot:'.kidea/checkpoints',targets:targets.map(({path,action})=>({path,action})),createDirectories:directories,allowRestoreUpdate:false,allowRetireOwnPending:true,allowReadLocalGit:grant.allowReadLocalGit===true,assumptions:grant.assumptions};
  const prepared=prepareInternalReviewWrite({root,authorization,context:{projectId:graph.status.projectId,ownerId:request.ownerIds[0],tool,permissionRefs:[permission],inputRefs:[requestEvidence]},targets,operationId},{reviewPath,relatedPaths,directories});
  // Bind all discovery bytes too: the writer must reject edits between the
  // caller's version/scope check and its own preparation.
  const bound=new Map(JSON.parse(prepared.line).inputs.map(i=>[i.path,i.expectedBase64]));
  for(const [p,b]of graph.reads)if(bound.get(p)!==b.toString('base64'))fail('SOURCE_CHANGED');
  return {state:'PREPARED_READ_ONLY',id,revision:review.revision,recordedStatus:review.status,prepared};
}

export async function approve(root,request) {
  const plan=prepareReview(root,request);if(plan.state!=='PREPARED_READ_ONLY')return plan;
  const writer=await executeInternalWrite(plan.prepared);
  return {state:writer.state==='COMPLETED_BYTES'?'REVIEW_RECORDED':'REVIEW_NOT_COMPLETE',id:plan.id,revision:plan.revision,recordedStatus:writer.state==='COMPLETED_BYTES'?plan.recordedStatus:null,writer,verification:'BOUND_BYTES_NOT_HUMAN_AUTHENTICATION_OR_TASK_COMPLETION'};
}

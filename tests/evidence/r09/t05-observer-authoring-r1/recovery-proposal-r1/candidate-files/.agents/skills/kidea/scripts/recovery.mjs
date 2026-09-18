// Explicit metadata completion after interruption; never external-effect replay.
import {readFileSync,readdirSync,realpathSync,lstatSync,openSync,writeSync,fsyncSync,ftruncateSync,closeSync,unlinkSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {parseTree} from 'jsonc-parser';
import {localEntry,byteIntegrity,hashBytes,recordBytes} from './bootstrap-plan.mjs';
import {diagnosePending} from './diagnose-pending.mjs';
import {MAX_PREPARED_REQUEST_BYTES,MAX_RECOVERY_FILE_BYTES} from './write-internal.mjs';
import {inspectBoundGraph} from './status.mjs';
import {readGitContext,readGitVersion} from './git-versions.mjs';
import {assertRuntime,assertLocalRoot,hasLocalAssumptions,portablePathKey} from './runtime.mjs';
import {validPath,validate} from './schema.mjs';
const fail=code=>{throw Object.assign(new Error(code),{code});};
const closed=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>keys.includes(k));
const markerPath='.kidea/checkpoints/pending/active.json';
function json(b){const t=new TextDecoder('utf-8',{fatal:true}).decode(b),errors=[],tree=parseTree(t,errors,{disallowComments:true,allowTrailingComma:false});if(!tree||errors.length)fail('RECOVERY_JSON');const walk=n=>{if(n.type==='object'){const keys=n.children.map(p=>p.children[0].value);if(new Set(keys).size!==keys.length)fail('RECOVERY_JSON');}for(const c of n.children??[])walk(c);};walk(tree);return JSON.parse(t);}
function inspect(root,p) {
 assertRuntime();assertLocalRoot(root);
 if(!path.isAbsolute(root)||realpathSync(root)!==root||lstatSync(root).isSymbolicLink()||!closed(p,['root','readProject','allowReadLocalGit','allowCompletePlanned','allowReplaceInterruptedGuard','ownerId','targets','statement','assumptions','toolMigration'])||p.root!==root||p.readProject!==true||typeof p.allowReadLocalGit!=='boolean')fail('RECOVERY_READ_PERMISSION');
 const reads=new Map(),read=(f,missing=false,limit=MAX_RECOVERY_FILE_BYTES)=>{const e=localEntry(root,f);if(!e){if(missing){reads.set(f,null);return null;}fail('RECOVERY_EVIDENCE_MISSING');}if(!e.stat.isFile()||e.stat.size>limit)fail('RECOVERY_FILE_UNSUPPORTED');const b=readFileSync(e.full);reads.set(f,b);return b;};
 const diagnosis=diagnosePending(root,{allowGit:p.allowReadLocalGit});
 if(diagnosis.state!=='RECONCILIATION_REQUIRED'||diagnosis.diagnostics.length||diagnosis.targets.some(t=>t.code||t.match==='UNKNOWN'))fail('RECOVERY_UNKNOWN');
 const markerBytes=read(markerPath),marker=json(markerBytes),prefix=`.kidea/checkpoints/operations/${marker.operationId}/`,requestBytes=read(prefix+'prepared-request.json',false,MAX_PREPARED_REQUEST_BYTES);
 if(hashBytes(requestBytes)!==marker.planDigest)fail('RECOVERY_REQUEST_CHANGED');
 const request=json(requestBytes),checkpointPath=prefix+'checkpoint.md';
 if(request.protocolVersion!==2||request.root!==root||request.operationId!==marker.operationId||request.cleanup||!validate(request.context?.tool,'ToolIdentity',()=>{})||!Array.isArray(request.inputs)||!Array.isArray(request.targets)||request.targets.length!==diagnosis.targets.length||!same(request.authorization.targets,request.targets.map(({path,action})=>({path,action}))))fail('RECOVERY_REQUEST_INVALID');
 // Changed code/runtime is a separate migration decision, not implicit replay.
 const changed=[],actualComponents=[];
 for(const c of request.context.tool.components){let bytes;if(c.name===`node-${process.versions.node}-${process.platform}-${process.arch}`)bytes=readFileSync(process.execPath);else if(/^[a-z][a-z0-9-]*\.mjs$/.test(c.name))bytes=readFileSync(new URL(c.name,import.meta.url));else fail('RECOVERY_TOOL_CHANGED');const actual=byteIntegrity(bytes);actualComponents.push({name:c.name,integrity:actual});if(!same(actual,c.integrity))changed.push({name:c.name,from:c.integrity,to:actual});}
 const migration=p.toolMigration??null;
 if(migration!==null) {
  if(!closed(migration,['operationId','planDigest','components','statement'])||migration.operationId!==marker.operationId||migration.planDigest!==marker.planDigest||typeof migration.statement!=='string'||!migration.statement.trim()||!Array.isArray(migration.components)||!changed.length||changed.some(c=>!['recovery.mjs','write-internal.mjs'].includes(c.name))||!same(migration.components,changed))fail('RECOVERY_MIGRATION_PERMISSION');
 } else if(changed.length)fail('RECOVERY_TOOL_CHANGED');
 const checkout=localEntry(root,'.git')?(p.allowReadLocalGit?readGitContext(root):fail('GIT_READ_NOT_AUTHORIZED')):null;
 if(!Object.hasOwn(request,'recoveryCheckout')||!same(checkout,request.recoveryCheckout)||request.continuation&&!same(checkout,request.continuation.checkout))fail('RECOVERY_CHECKOUT_CHANGED');
 const files=new Map(),gitVersions=new Map(),targets=[],names=new Set();
 for(const [i,t]of request.targets.entries()){
  if(!validPath(t.path)||names.has(portablePathKey(t.path))||!['CREATE','UPDATE'].includes(t.action)||(t.action==='CREATE')!==(t.beforeBase64===null))fail('RECOVERY_TARGET_INVALID');names.add(portablePathKey(t.path));
  const planned=Buffer.from(t.plannedBase64,'base64'),before=t.beforeBase64===null?null:Buffer.from(t.beforeBase64,'base64'),actual=read(t.path,true);
  if(!read(prefix+`planned-${i}.bin`).equals(planned))fail('RECOVERY_COPY_CHANGED');
  if(before){if(t.beforeVersion){if(!p.allowReadLocalGit)fail('GIT_READ_NOT_AUTHORIZED');const b=readGitVersion(root,t.beforeVersion.location);if(!b.equals(before))fail('RECOVERY_COPY_CHANGED');gitVersions.set(JSON.stringify(t.beforeVersion.location),b);}else if(!read(prefix+`before-${i}.bin`).equals(before))fail('RECOVERY_COPY_CHANGED');}
  const match=actual?.equals(planned)?'PLANNED':before===null?actual===null?'BEFORE':actual.length<planned.length&&planned.subarray(0,actual.length).equals(actual)?'PARTIAL_PLANNED':'OTHER':actual?.equals(before)?'BEFORE':actual!==null&&actual.length<planned.length&&planned.subarray(0,actual.length).equals(actual)?'PARTIAL_PLANNED':'OTHER';
  if(match==='OTHER')fail('RECOVERY_OTHER_BYTES');
  targets.push({path:t.path,action:t.action,match,integrity:actual===null?null:byteIntegrity(actual)});files.set(t.path,planned);
 }
 for(const i of request.inputs){const expected=Buffer.from(i.expectedBase64,'base64');if(!names.has(portablePathKey(i.path))){if(!read(i.path).equals(expected))fail('RECOVERY_SOURCE_CHANGED');files.set(i.path,expected);}}
 for(const i of request.gitInputs??[]){if(!p.allowReadLocalGit)fail('GIT_READ_NOT_AUTHORIZED');const b=readGitVersion(root,i.location);if(b.toString('base64')!==i.expectedBase64)fail('RECOVERY_GIT_CHANGED');gitVersions.set(JSON.stringify(i.location),b);}
 for(const e of [...request.bootstrap?.evidence??[],...request.continuation?.evidence??[]]){const expected=Buffer.from(e.bytesBase64,'base64');if(!read(e.path).equals(expected))fail('RECOVERY_EVIDENCE_CHANGED');files.set(e.path,expected);}
 const prepared=read(prefix+'prepared.md'),m=new TextDecoder('utf-8',{fatal:true}).decode(prepared).match(/```json\r?\n([\s\S]*?)\r?\n```/),checkpoint=m&&json(Buffer.from(m[1]));
 if(!validate(checkpoint,'checkpoint',()=>{})||checkpoint.id!==marker.operationId||checkpoint.projectId!==request.context.projectId||checkpoint.ownerId!==request.context.ownerId||checkpoint.targets.length!==targets.length||!same(checkpoint.tool,request.context.tool)||!same(checkpoint.permissionRefs,request.context.permissionRefs)||!same(checkpoint.inputRefs,request.context.inputRefs))fail('RECOVERY_CHECKPOINT_CHANGED');
 for(const [i,t]of checkpoint.targets.entries())if(t.path!==targets[i].path||t.action!==targets[i].action||!same(t.planned.version.integrity,byteIntegrity(files.get(t.path))))fail('RECOVERY_CHECKPOINT_CHANGED');
 // Bind the current checkpoint even when torn. Replace it only with a checked
 // reconstructed observation; keep the torn bytes in the recovery journal.
 read(checkpointPath,true);read(prefix+'recovery-guard.json',true);
 for(const [f,b]of reads)if(f.endsWith('.bin')&&b!==null)files.set(f,b);
 files.set(checkpointPath,recordBytes(checkpoint));
 const graph=inspectBoundGraph(root,files,{gitVersions,checkpointPaths:[checkpointPath]});
 if(graph.status.readState!=='OK'||graph.status.projectId!==request.context.projectId||!graph.status.data.items.some(i=>i.id===request.context.ownerId))throw Object.assign(new Error('RECOVERY_GRAPH_INVALID'),{code:'RECOVERY_GRAPH_INVALID',diagnostics:graph.status.diagnostics});
 const basis=hashBytes(Buffer.from(JSON.stringify({root,checkout,reads:[...reads].map(([p,b])=>[p,b===null?null:byteIntegrity(b)]),tool:request.context.tool,actualComponents,toolMigration:migration})));
 return {reads,files,gitVersions,checkpoint,request,markerBytes,prefix,checkpointPath,checkout,result:{state:'RECOVERY_READY',basis,projectId:request.context.projectId,ownerId:request.context.ownerId,operationId:marker.operationId,planDigest:marker.planDigest,checkout,targets,toolMigration:migration,interruptedRecovery:reads.get(prefix+'recovery-guard.json')!==null,verification:'EXACT_METADATA_COMPLETION_ONLY_NOT_EXTERNAL_REPLAY'}};
}
export function readRecovery(root,q){if(!closed(q,['operation','permission'])||q.operation!=='READ_RECOVERY')fail('RECOVERY_INPUT_INVALID');return inspect(root,q.permission).result;}
export function completeRecovery(root,q,{testFault=null}={}) {
 if(!closed(q,['operation','permission','expectedBasis','expectedProjectId','expectedOwnerId','expectedGit','choice'])||q.operation!=='RECOVER'||q.choice!=='COMPLETE_PLANNED')fail('RECOVERY_CHOICE_REQUIRED');
 const p=q.permission,s=inspect(root,p),{result,request,reads,prefix,checkpointPath,files,gitVersions}=s;
 if(p.allowCompletePlanned!==true||!hasLocalAssumptions(p.assumptions)||typeof p.statement!=='string'||!p.statement.trim()||p.ownerId!==result.ownerId||!same(p.targets,result.targets.map(({path,action})=>({path,action}))))fail('RECOVERY_NEW_PERMISSION_REQUIRED');
 if(q.expectedBasis!==result.basis||q.expectedProjectId!==result.projectId||q.expectedOwnerId!==result.ownerId||!same(q.expectedGit,result.checkout))fail('RECOVERY_BASIS_CHANGED');
 if(result.interruptedRecovery&&p.allowReplaceInterruptedGuard!==true)fail('RECOVERY_GUARD_PERMISSION_REQUIRED');
 const attempt=randomUUID(),guardPath=prefix+'recovery-guard.json',guard=Buffer.from(JSON.stringify({attempt,basis:result.basis,choice:q.choice})),journal=prefix+`recovery-${attempt}.json`;
 const exact=(f,b)=>{const e=localEntry(root,f),now=e?.stat.isFile()?readFileSync(e.full):null;if(b===null?now!==null:now===null||!b.equals(now))fail('RECOVERY_SOURCE_CHANGED');};
 const write=(f,b,create)=>{const e=localEntry(root,f);if(create&&e||!create&&!e)fail('RECOVERY_WRITE_PRECONDITION');const fd=openSync(e?.full??path.join(root,f),create?'wx':'r+');try{let n=0;while(n<b.length){const count=writeSync(fd,b,n,b.length-n,n);if(!count)fail('RECOVERY_SHORT_WRITE');n+=count;}ftruncateSync(fd,b.length);fsyncSync(fd);}finally{closeSync(fd);}reads.set(f,b);};
 const check=()=>{const git=localEntry(root,'.git');if(git&&!p.allowReadLocalGit)fail('GIT_READ_NOT_AUTHORIZED');if(!same(git?readGitContext(root):null,s.checkout))fail('RECOVERY_CHECKOUT_CHANGED');if(!same(readdirSync(path.join(root,'.kidea/checkpoints/pending')).sort(),['active.json']))fail('RECOVERY_UNKNOWN');for(const [f,b]of reads)exact(f,b);for(const [key,b]of gitVersions)if(!readGitVersion(root,JSON.parse(key)).equals(b))fail('RECOVERY_GIT_CHANGED');};
 check();
 // Preserve the prior guard/checkpoint and the newly granted decision before
 // replacing an explicitly reconciled interrupted recovery guard.
 write(journal,Buffer.from(JSON.stringify({request:q,beforeCheckpoint:reads.get(checkpointPath)?.toString('base64')??null,priorGuard:reads.get(guardPath)?.toString('base64')??null,targets:result.targets})),true);
 if(result.interruptedRecovery){exact(guardPath,reads.get(guardPath));unlinkSync(localEntry(root,guardPath).full);reads.set(guardPath,null);}
 write(guardPath,guard,true);
 try {
  check();if(testFault==='AFTER_GUARD')fail('INJECTED_RECOVERY_FAILURE');
  for(const d of [...request.bootstrap?.directories??[],...request.review?.directories??[],...request.impact?.directories??[]])if(!localEntry(root,d))mkdirSync(path.join(root,d));
  for(const [i,t]of request.targets.entries()) {check();const planned=files.get(t.path);if(testFault==='AFTER_PARTIAL_WRITE'&&i===0){write(t.path,planned.subarray(0,Math.max(1,Math.floor(planned.length/2))),reads.get(t.path)===null);fail('INJECTED_RECOVERY_FAILURE');}write(t.path,planned,reads.get(t.path)===null);}
  const checkpoint=structuredClone(s.checkpoint);checkpoint.observations.push({at:new Date().toISOString(),phase:'VERIFY',results:request.targets.map(t=>({path:t.path,match:'PLANNED',integrity:byteIntegrity(files.get(t.path)),detail:'Read back exact planned bytes after explicit recovery; no external command executed.'})),evidenceRefs:[]});checkpoint.nextAction='Metadata bytes reconciled. Check current inputs and external observations before continuing.';
  write(checkpointPath,recordBytes(checkpoint),reads.get(checkpointPath)===null);files.set(checkpointPath,reads.get(checkpointPath));
  check();const graph=inspectBoundGraph(root,files,{gitVersions,checkpointPaths:[checkpointPath]});if(graph.status.readState!=='OK')fail('RECOVERY_FINAL_GRAPH_INVALID');
  write(prefix+`recovery-${attempt}-verified.json`,Buffer.from(JSON.stringify({attempt,operationId:result.operationId,choice:q.choice,verification:'EXACT_PLANNED_BYTES',targets:request.targets.map(t=>({path:t.path,integrity:byteIntegrity(files.get(t.path))}))})),true);
  check();if(testFault==='BEFORE_RETIRE')fail('INJECTED_RECOVERY_FAILURE');
  // Retain the guard and journals as history, retire only the original exact
  // pending marker after full readback. No fallible I/O follows retirement.
  unlinkSync(localEntry(root,markerPath).full);
  return {state:'RECOVERY_COMPLETED',operationId:result.operationId,attempt,verification:'METADATA_ONLY_NOT_PRODUCT_COMPLETION'};
 }catch(e){return {state:'RECOVERY_NOT_COMPLETE',operationId:result.operationId,attempt,code:e.code??'RECOVERY_IO_FAILED',verification:'PENDING_RETAINED_RECONCILE_AGAIN'};}
}

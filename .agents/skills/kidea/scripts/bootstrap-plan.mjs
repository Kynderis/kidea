// CREATE-only bootstrap preflight. Trusted in-memory caller, never a project
// manifest as authority. All filesystem effects belong to the native worker.
import { readFileSync,lstatSync,realpathSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { inspectBoundGraph,snapshotAnchorCount } from './status.mjs';
import { validPath,validate } from './schema.mjs';

export const hashBytes=b=>createHash('sha256').update(b).digest('hex');
export const byteIntegrity=b=>({method:'SHA256',value:hashBytes(b),byteLength:b.length});
export const recordBytes=record=>Buffer.from('<!-- kidea:data:start -->\n```json\n'+JSON.stringify(record,null,2)+'\n```\n<!-- kidea:data:end -->\n');
const fail=code=>{throw Object.assign(new Error(code),{code});};
const check=(value,type)=>{if(!validate(value,type,()=>{}))fail('INVALID_'+type.toUpperCase());};
const same=isDeepStrictEqual;

// Walk lexical components without following a link, even to another in-root
// path. Missing parents are recorded by preflight and created only under lease.
export function localEntry(root,relative) {
  if(!validPath(relative))fail('UNSAFE_PATH');
  let full=root;
  for(const [i,part]of relative.split('/').entries()) {
    full=path.join(full,part);let stat;
    try{stat=lstatSync(full);}catch(e){if(e.code==='ENOENT')return null;throw e;}
    if(stat.isSymbolicLink()||path.resolve(realpathSync(full)).toLowerCase()!==path.resolve(full).toLowerCase())fail('UNSAFE_PATH');
    if(i===relative.split('/').length-1) {
      if(!stat.isDirectory()&&(!stat.isFile()||stat.nlink!==1))fail('UNSAFE_PATH');
      return {stat,full};
    }
    if(!stat.isDirectory())fail('UNSAFE_PATH');
  }
}
export function bootstrapByteMap(request,checkpoint) {
  const files=new Map(request.inputs.map(i=>[i.path,Buffer.from(i.expectedBase64,'base64')]));
  for(const e of request.bootstrap.evidence)files.set(e.path,Buffer.from(e.bytesBase64,'base64'));
  for(const [i,t]of request.targets.entries()) {
    const data=Buffer.from(t.plannedBase64,'base64');files.set(t.path,data);
    files.set(`.kidea/checkpoints/operations/${request.operationId}/planned-${i}.bin`,data);
  }
  files.set(`.kidea/checkpoints/operations/${request.operationId}/checkpoint.md`,recordBytes(checkpoint));
  return files;
}
export function bootstrapCheckpoint(request) {
  const prefix=`.kidea/checkpoints/operations/${request.operationId}/`;
  return {schemaVersion:2,projectId:request.context.projectId,kind:'checkpoint',id:request.operationId,ownerId:request.context.ownerId,
    createdAt:new Date().toISOString(),tool:request.context.tool,permissionRefs:request.context.permissionRefs,inputRefs:request.context.inputRefs,
    targets:request.targets.map((t,i)=>({path:t.path,action:'CREATE',before:null,planned:{version:{source:{path:t.path,anchor:null},location:{kind:'SNAPSHOT',ref:{path:prefix+`planned-${i}.bin`,anchor:null}},integrity:byteIntegrity(Buffer.from(t.plannedBase64,'base64'))},cleanup:null}})),
    observations:[],nextAction:'Bootstrap preflight only; no effect or completion is asserted.'};
}
export function validateBootstrapGraph(request,checkpoint) {
  const graph=inspectBoundGraph(request.root,bootstrapByteMap(request,checkpoint));
  if(graph.status.readState!=='OK')throw Object.assign(new Error('BOOTSTRAP_GRAPH_NOT_VALID'),{code:'BOOTSTRAP_GRAPH_NOT_VALID',diagnostics:graph.status.diagnostics});
  if(graph.status.projectId!==request.context.projectId||!graph.status.data.items.some(i=>i.id===request.context.ownerId))fail('CONTEXT_IDENTITY');
  if(graph.records.get('.kidea/work.md')?.checkpointRef?.path!==`.kidea/checkpoints/operations/${request.operationId}/checkpoint.md`)fail('BOOTSTRAP_CHECKPOINT_REQUIRED');
  return graph;
}
export function prepareBootstrapRequest({root,authorization,context,targets,inputs=[],bootstrap,operationId}) {
  if(process.platform!=='win32')fail('UNSUPPORTED_HOST');
  if(typeof root!=='string'||!path.isAbsolute(root)||path.resolve(root)!==realpathSync(root))fail('UNSAFE_ROOT');
  if(!lstatSync(root).isDirectory()||lstatSync(root).isSymbolicLink())fail('UNSAFE_ROOT');
  root=realpathSync(root);
  if(!authorization||authorization.root!==root||authorization.metadataRoot!=='.kidea/checkpoints'||authorization.bootstrap!==true||authorization.allowRestoreUpdate!==false||authorization.allowRetireOwnPending!==true)fail('AUTHORIZATION_REQUIRED');
  if(!['localNtfs','noActiveSync','noConcurrentNamespaceChanges'].every(k=>authorization.assumptions?.[k]===true))fail('ENVIRONMENT_NOT_CONFIRMED');
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(operationId??''))fail('INVALID_OPERATION_ID');
  if(localEntry(root,'.kidea'))fail('KIDEA_ALREADY_EXISTS');
  if(!Array.isArray(targets)||targets.length<2||targets.length>256||!Array.isArray(inputs)||inputs.length>4096||!bootstrap||!Array.isArray(bootstrap.directories)||!Array.isArray(bootstrap.evidence))fail('INVALID_BOOTSTRAP');
  const paths=new Map(),files=new Map(),directories=new Set();
  const claim=p=>{if(!validPath(p)||paths.has(p.toLowerCase()))fail('AMBIGUOUS_PATH_ALIAS');paths.set(p.toLowerCase(),p);};
  for(const t of targets) {
    claim(t.path);
    if(t.action!=='CREATE'||!Buffer.isBuffer(t.plannedBytes)||t.plannedBytes.length>16*1024*1024||t.path.startsWith('.kidea/')&&!['.kidea/INDEX.md','.kidea/work.md'].includes(t.path))fail('INVALID_TARGET');
    if(localEntry(root,t.path))fail('TARGET_PRECONDITION');
    const parts=t.path.split('/');parts.pop();let parent='';
    for(const part of parts) {
      parent=parent?parent+'/'+part:part;if(parent==='.kidea')continue;
      const entry=localEntry(root,parent);if(entry&&!entry.stat.isDirectory())fail('UNSAFE_PATH');if(!entry)directories.add(parent);
    }
  }
  if(!targets.some(t=>t.path==='.kidea/INDEX.md')||!targets.some(t=>t.path==='.kidea/work.md'))fail('BOOTSTRAP_RECORDS_REQUIRED');
  if(!same(authorization.targets,targets.map(t=>({path:t.path,action:t.action}))))fail('TARGET_NOT_AUTHORIZED');
  if(!same([...directories],bootstrap.directories)||!same(authorization.createDirectories,bootstrap.directories))fail('DIRECTORIES_NOT_AUTHORIZED');
  for(const i of inputs) {
    claim(i.path);const entry=localEntry(root,i.path);
    if(!entry?.stat.isFile()||!Buffer.isBuffer(i.expectedBytes)||!readFileSync(entry.full).equals(i.expectedBytes))fail('INPUT_BYTES_CHANGED');
    files.set(i.path,Buffer.from(i.expectedBytes));
  }
  const prefix=`.kidea/checkpoints/operations/${operationId}/`;
  for(const e of bootstrap.evidence) {
    claim(e.path);
    if(!e.path.startsWith(prefix)||! /^(?:permission|input-[0-9]+)\.md$/.test(e.path.slice(prefix.length))||!Buffer.isBuffer(e.bytes)||e.bytes.length>16*1024*1024)fail('INVALID_BOOTSTRAP_EVIDENCE');
    files.set(e.path,Buffer.from(e.bytes));
  }
  check(context?.tool,'ToolIdentity');
  if(!context.tool.components.length||new Set(context.tool.components.map(c=>c.name)).size!==context.tool.components.length)fail('INVALID_TOOLIDENTITY');
  for(const name of ['permissionRefs','inputRefs']) {
    if(!Array.isArray(context[name])||!context[name].length)fail('CONTEXT_REFERENCES_REQUIRED');
    for(const v of context[name]) {
      check(v,'VersionRef');
      if(v.location.kind!=='SNAPSHOT'||v.location.ref.anchor!==null||!v.source)fail('UNSUPPORTED_REFERENCE');
      const b=files.get(v.location.ref.path),source=files.get(v.source.path);
      if(!b||!source||!b.equals(source)||!same(byteIntegrity(b),v.integrity))fail('CONTEXT_SOURCE_DIFFERS');
      if(v.source.anchor!==null&&snapshotAnchorCount(b,v.source.anchor)!==1)fail('CONTEXT_ANCHOR');
    }
  }
  const request={protocolVersion:1,root,authorization:structuredClone(authorization),context:structuredClone(context),operationId,
    inputs:inputs.map(i=>({path:i.path,expectedBase64:i.expectedBytes.toString('base64')})),
    targets:targets.map(t=>({path:t.path,action:'CREATE',beforeBase64:null,plannedBase64:t.plannedBytes.toString('base64')})),
    bootstrap:{directories:[...bootstrap.directories],evidence:bootstrap.evidence.map(e=>({path:e.path,bytesBase64:e.bytes.toString('base64')}))}};
  validateBootstrapGraph(request,bootstrapCheckpoint(request));return request;
}

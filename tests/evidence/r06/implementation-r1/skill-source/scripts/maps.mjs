// Derived evidence only. These functions neither write project records nor grant
// authority to execute code. The caller selects an explicit, finite read scope.
import {readFileSync,realpathSync} from 'node:fs';
import path from 'node:path';
import {byteIntegrity,hashBytes,localEntry} from './bootstrap-plan.mjs';
import {assertRuntime,assertLocalRoot,portablePathKey} from './runtime.mjs';
import {validPath} from './schema.mjs';
import {snapshotAnchorCount} from './status.mjs';

const fail=code=>{throw Object.assign(new Error(code),{code});};
export const mapDigest=value=>hashBytes(Buffer.from(JSON.stringify(value)));
export function readMapSources(root,files,{maxBytes=16*1024*1024}={}) {
  assertRuntime();assertLocalRoot(root);
  if(!path.isAbsolute(root)||realpathSync(root)!==root)fail('MAP_ROOT_REQUIRED');
  if(!Array.isArray(files)||!files.length||!Number.isSafeInteger(maxBytes)||maxBytes<1)fail('MAP_SCOPE_REQUIRED');
  const keys=new Set(),sources=[],contents=new Map();let total=0;
  for(const file of files) {
    if(!validPath(file)||keys.has(portablePathKey(file)))fail('MAP_SCOPE_INVALID');keys.add(portablePathKey(file));
    const e=localEntry(root,file);if(!e?.stat.isFile())fail('MAP_SOURCE_MISSING');
    total+=e.stat.size;if(total>maxBytes)fail('MAP_INPUT_LIMIT');
    const bytes=readFileSync(e.full);if(bytes.length!==e.stat.size)fail('MAP_SOURCE_CHANGED');
    contents.set(file,bytes);sources.push({path:file,integrity:byteIntegrity(bytes)});
  }
  for(const [file,bytes]of contents)if(!readFileSync(localEntry(root,file).full).equals(bytes))fail('MAP_SOURCE_CHANGED');
  sources.sort((a,b)=>a.path.localeCompare(b.path));
  return {root,sources,contents,basis:mapDigest(sources)};
}
export function assertMapCurrent(input) {
  for(const s of input.sources) {
    const e=localEntry(input.root,s.path);
    if(!e?.stat.isFile()||!readFileSync(e.full).equals(input.contents.get(s.path)))fail('MAP_SOURCE_CHANGED');
  }
}
export function mapResult(input,adapter,configuration,nodes,edges,diagnostics=[],limits=[]) {
  assertMapCurrent(input);
  const result={format:'kidea-map-r1',adapter,configuration,sources:input.sources,inputBasis:input.basis,nodes,edges,diagnostics,limits,
    completeness:diagnostics.length?'INCOMPLETE':'SCOPED',verification:'STRUCTURE_ONLY_SEMANTIC_REVIEW_REQUIRED'};
  return {...result,digest:mapDigest(result)};
}
export function documentationMap(input) {
  const nodes=[],edges=[],diagnostics=[];
  for(const [file,bytes]of input.contents) {
    if(!file.endsWith('.md'))continue;
    const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
    nodes.push({id:file,path:file,kind:'document'});
    const anchors=[...text.matchAll(/<a\s+id=["']([^"']+)["'][^>]*>/g)].map(m=>m[1]);
    for(const anchor of new Set(anchors)) {
      if(anchors.filter(a=>a===anchor).length!==1)diagnostics.push({code:'DUPLICATE_ANCHOR',file,anchor});
      nodes.push({id:file+'#'+anchor,path:file,anchor,kind:'specification'});
    }
    for(const m of text.matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
      const raw=m[1].replace(/^<|>$/g,'');
      if(/^[a-z][a-z\d+.-]*:/i.test(raw)){edges.push({from:file,to:raw,kind:'external-link',verified:false});continue;}
      let target;try{target=decodeURIComponent(raw);}catch{diagnostics.push({code:'INVALID_LINK',file,target:raw});continue;}
      const [p,anchor,...extra]=target.split('#');
      const resolved=p?path.posix.normalize(path.posix.join(path.posix.dirname(file),p)):file;
      if(extra.length||!validPath(resolved)||p.startsWith('/')){diagnostics.push({code:'UNSAFE_LINK',file,target});continue;}
      const destination=input.contents.get(resolved);
      if(!destination){diagnostics.push({code:'LINK_OUTSIDE_READ_SCOPE_OR_MISSING',file,target});continue;}
      if(anchor&&snapshotAnchorCount(destination,anchor)!==1){diagnostics.push({code:'ANCHOR_NOT_UNIQUE',file,target});continue;}
      edges.push({from:file,to:resolved+(anchor?'#'+anchor:''),kind:'link',verified:true});
    }
  }
  return mapResult(input,{name:'markdown-explicit-links',version:1},{files:[...input.contents.keys()]},nodes,edges,diagnostics,
    ['Inline Markdown links and explicit HTML IDs only; other Markdown forms need review.',
     'Valid links do not prove purpose, backlink placement or semantic responsibility.']);
}

// Mapping is authored once; reverse lookup is derived. A reviewed statement is
// evidence to inspect, not authentication of its author or Human acceptance.
export function traceabilityMap(input,implementation,rows,{codeRequired=false}={}) {
  if(!Array.isArray(rows)||implementation?.format!=='kidea-map-r1')fail('TRACE_INPUT_INVALID');
  const nodes=[],edges=[],diagnostics=[],seen=new Set();
  const {digest,...payload}=implementation;
  if(digest!==mapDigest(payload)||!Array.isArray(implementation.sources))fail('IMPLEMENTATION_MAP_RECEIPT_INVALID');
  for(const source of implementation.sources)if(!input.contents.has(source.path)||mapDigest(byteIntegrity(input.contents.get(source.path)))!==mapDigest(source.integrity))diagnostics.push({code:'IMPLEMENTATION_MAP_STALE_OR_OUTSIDE_SCOPE',file:source.path});
  const implIds=new Set(implementation.nodes.map(n=>n.id));
  for(const row of rows) {
    if(!row||typeof row.id!=='string'||!row.id.trim()||seen.has(row.id)){diagnostics.push({code:'TRACE_ID_INVALID'});continue;}seen.add(row.id);
    const {spec,targets,purpose,evidence,conditions}=row;
    if(!spec||!input.contents.has(spec.path)||spec.anchor&&snapshotAnchorCount(input.contents.get(spec.path),spec.anchor)!==1||!Array.isArray(targets)||typeof purpose!=='string'||!purpose.trim()||typeof conditions!=='string'||!conditions.trim()||!Array.isArray(evidence)||!evidence.length) {
      diagnostics.push({code:'TRACE_BASIS_MISSING',id:row.id});continue;
    }
    for(const ref of evidence)if(!ref||!input.contents.has(ref.path)||ref.anchor&&snapshotAnchorCount(input.contents.get(ref.path),ref.anchor)!==1)diagnostics.push({code:'TRACE_EVIDENCE_MISSING',id:row.id});
    const id=spec.path+(spec.anchor?'#'+spec.anchor:'');nodes.push({id,kind:'specification',purpose,conditions});
    if(!targets.length)diagnostics.push({code:codeRequired?'IMPLEMENTATION_REQUIRED':'NOT_YET_IMPLEMENTED',id:row.id});
    for(const target of targets) {
      if(!implIds.has(target))diagnostics.push({code:'TRACE_TARGET_MISSING',id:row.id,target});
      else edges.push({from:id,to:target,kind:'responsibility',mappingId:row.id,purpose,conditions,evidence});
    }
  }
  if(implementation.completeness!=='SCOPED')diagnostics.push({code:'IMPLEMENTATION_MAP_INCOMPLETE'});
  return mapResult(input,{name:'traceability',version:1},{implementationDigest:implementation.digest,codeRequired},nodes,edges,diagnostics,
    ['Mechanical coverage only. Review source meaning, assertions, indirect consumers and unsupported scope.']);
}
export function reverseTrace(map,target) {return map.edges.filter(e=>e.to===target);}

// Bounded, read-only observations. Never bypass the normal status/write guard.
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {parseTree} from 'jsonc-parser';
import {isDeepStrictEqual as same} from 'node:util';
import {localEntry,byteIntegrity} from './bootstrap-plan.mjs';
import {inspectPendingWrites,pendingWritesPath} from './pending-writes.mjs';
import {readGitVersion} from './git-versions.mjs';
import {validate} from './schema.mjs';

const fail=code=>{throw Object.assign(new Error(code),{code});};
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
function json(bytes) {
  const decoded=new TextDecoder('utf-8',{fatal:true}).decode(bytes),errors=[],tree=parseTree(decoded,errors,{disallowComments:true,allowTrailingComma:false});
  if(!tree||errors.length)fail('INVALID_PENDING_JSON');
  function walk(n){if(n.type==='object'){const keys=n.children.map(p=>p.children[0].value);if(new Set(keys).size!==keys.length)fail('DUPLICATE_PENDING_KEY');}for(const c of n.children??[])walk(c);}
  walk(tree);return JSON.parse(decoded);
}
export function diagnosePending(root,{allowGit=false,beforeRecheck}={}) {
  const report={state:'RECONCILIATION_REQUIRED',verification:'READ_ONLY_OBSERVATIONS_NOT_COMPLETION',operationId:null,checkpointRef:null,targets:[],diagnostics:[]};
  const reads=new Map(),gitReads=new Map();
  const read=(p,missing=false)=>{
    const entry=localEntry(root,p);
    if(!entry){if(missing){reads.set(p,null);return null;}fail('EVIDENCE_MISSING');}
    if(!entry.stat.isFile()||entry.stat.size>32*1024*1024)fail('UNSUPPORTED_EVIDENCE');
    const bytes=readFileSync(entry.full);reads.set(p,bytes);return bytes;
  };
  let before;
  try {
    before=inspectPendingWrites(root);if(!before.pending)return {...report,state:'NO_PENDING'};
    if(!same(readdirSync(path.join(root,pendingWritesPath)).sort(),['active.json']))fail('UNKNOWN_PENDING_ENTRY');
    const marker=json(read(pendingWritesPath+'/active.json'));
    if(!marker||!same(Object.keys(marker).sort(),['checkpointRef','operationId','planDigest','protocolVersion'])||marker.protocolVersion!==2||!uuid.test(marker.operationId)||!/^[a-f0-9]{64}$/.test(marker.planDigest))fail('INVALID_PENDING_MARKER');
    const prefix=`.kidea/checkpoints/operations/${marker.operationId}/`;
    if(!same(marker.checkpointRef,{path:prefix+'checkpoint.md',anchor:null}))fail('INVALID_PENDING_CHECKPOINT');
    report.operationId=marker.operationId;report.checkpointRef=marker.checkpointRef;
    // Immutable prepared evidence survives a torn final checkpoint. Do not
    // trust an arbitrary path supplied by a malformed marker.
    const data=read(prefix+'prepared.md'),text=new TextDecoder('utf-8',{fatal:true}).decode(data);
    if(text.split('<!-- kidea:data:start -->').length!==2||text.split('<!-- kidea:data:end -->').length!==2)fail('INVALID_PREPARED_RECORD');
    const match=text.match(/<!-- kidea:data:start -->\r?\n```json\r?\n([\s\S]*?)\r?\n```\r?\n<!-- kidea:data:end -->/);
    if(!match)fail('INVALID_PREPARED_RECORD');
    const checkpoint=json(Buffer.from(match[1]));
    if(!validate(checkpoint,'checkpoint',()=>{})||checkpoint.id!==marker.operationId||!checkpoint.targets.length||new Set(checkpoint.targets.map(t=>t.path.toLowerCase())).size!==checkpoint.targets.length)fail('INVALID_PREPARED_RECORD');
    for(const [i,t]of checkpoint.targets.entries()) {
      const row={path:t.path,action:t.action,match:'UNKNOWN',matchesBefore:null,matchesPlanned:null,integrity:null,code:null};
      report.targets.push(row);
      try {
        if((t.action==='CREATE')!==(t.before===null))fail('INVALID_RECOVERY_COPY');
        const version=(copy,kind)=>{
          if(!copy)return null;
          const v=copy.version;
          if(copy.cleanup!==null||!same(v.source,{path:t.path,anchor:null}))fail('INVALID_RECOVERY_COPY');
          let bytes;
          if(v.location.kind==='GIT'&&kind==='before') {
            if(!allowGit)fail('GIT_READ_NOT_AUTHORIZED');
            bytes=readGitVersion(root,v.location);gitReads.set(JSON.stringify(v.location),bytes);
          } else {
            if(!same(v.location,{kind:'SNAPSHOT',ref:{path:prefix+`${kind}-${i}.bin`,anchor:null}}))fail('INVALID_RECOVERY_COPY');
            bytes=read(v.location.ref.path);
          }
          if(!same(byteIntegrity(bytes),v.integrity))fail('EVIDENCE_BYTES_DIFFER');return bytes;
        };
        const old=version(t.before,'before'),planned=version(t.planned,'planned'),actual=read(t.path,true);
        row.integrity=actual===null?null:byteIntegrity(actual);
        row.matchesBefore=old===null?actual===null:actual!==null&&old.equals(actual);
        row.matchesPlanned=actual!==null&&planned.equals(actual);
        row.match=row.matchesPlanned?'PLANNED':row.matchesBefore?'BEFORE':'OTHER';
      }catch(error){row.code=error.code??'READ_FAILED';}
    }
    beforeRecheck?.();
    for(const [p,old]of reads){const entry=localEntry(root,p);const latest=entry?.stat.isFile()?readFileSync(entry.full):null;if(old===null?latest!==null:latest===null||!old.equals(latest))fail('DIAGNOSTIC_SOURCE_CHANGED');}
    for(const [key,old]of gitReads)if(!readGitVersion(root,JSON.parse(key)).equals(old))fail('DIAGNOSTIC_SOURCE_CHANGED');
    if(inspectPendingWrites(root).fingerprint!==before.fingerprint)fail('DIAGNOSTIC_PENDING_CHANGED');
  } catch(error) {
    report.diagnostics.push({code:error.code??'DIAGNOSTIC_UNAVAILABLE'});
    for(const row of report.targets){row.match='UNKNOWN';row.matchesBefore=null;row.matchesPlanned=null;row.integrity=null;}
  }
  return report;
}

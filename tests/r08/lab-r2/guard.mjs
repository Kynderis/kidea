import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function verifyPackage(dir,manifest) {
  if(manifest.revision!=='r08-lab-r2.1'||manifest.profile!=='release-protocol-fixture')throw Error('REVISION');
  const names=fs.readdirSync(dir).filter(n=>n!=='manifest.json').sort();
  if(JSON.stringify(names)!==JSON.stringify(Object.keys(manifest.files).sort()))throw Error('FILE_SET');
  for(const [name,hash] of Object.entries(manifest.files)) {
    if(path.basename(name)!==name||fs.lstatSync(path.join(dir,name)).isSymbolicLink()||digest(fs.readFileSync(path.join(dir,name)))!==hash)throw Error(`SOURCE_CHANGED:${name}`);
  }
}
export function preflight({target,grant,revision,manifest,attempt,attempts=[],busy=false,sourceValid=true}) {
  if(!['lab-dev','lab-prod'].includes(target)||!grant.targets.includes(target)||grant.realProduction!==false)throw Error('TARGET_AUTHORITY');
  if(revision!==manifest.revision||grant.manifestSHA256!==manifest.digest)throw Error('REVISION_APPROVAL');
  if(!/^[a-z][a-z0-9-]{0,39}$/.test(attempt)||attempts.includes(attempt))throw Error('ATTEMPT_ID');
  if(busy)throw Error('OVERLAP');
  if(!sourceValid)throw Error('SOURCE_CHANGED');
}
export function classify(backend,web,expected) {
  if(!backend||!web)return 'UNKNOWN';
  if(backend.target!==expected.target||backend.artifact!==expected.backend||backend.config!==expected.config||backend.schema!==1||web.status!==200||web.artifact!==expected.web)return 'PARTIAL_OR_MISMATCH';
  return 'VERIFIED';
}
export function retryDecision(observed) {return observed?.migrations?.some(x=>x.id==='fixture-schema-2')?'DO_NOT_REPLAY': 'REQUIRES_STATE_RECONCILIATION';}
export function freshHeartbeat(record,now) {return Number.isFinite(record?.at)&&now>=record.at&&now-record.at<=2000;}

// Semantic judgments belong to the trusted caller; hashes only bind evidence.
import {isDeepStrictEqual as same} from 'node:util';
import {byteIntegrity} from './bootstrap-plan.mjs';
const fail=code=>{throw Object.assign(new Error(code),{code});};
const text=v=>typeof v==='string'&&v.trim().length>0;
const closed=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>keys.includes(k));
export function preserveReview(current,comparison,{read,capture,oldBytes,reviewPath,knownIds}) {
  if(current.status!=='APPROVED'||!current.confirmationRef)fail('REVIEW_NOT_APPROVED');
  if(!closed(comparison,['result','reason','affectedIds','beforeRefs','currentSources','assessment'])||comparison.result!=='NON_SEMANTIC'||!text(comparison.reason))fail('NON_SEMANTIC_COMPARISON_REQUIRED');
  const before=[...current.subjectVersions,...current.inputVersions];
  if(!same(comparison.beforeRefs,before))fail('COMPARISON_BEFORE_DIFFERS');
  if(!Array.isArray(comparison.affectedIds)||!current.ownerIds.every(id=>comparison.affectedIds.includes(id))||new Set(comparison.affectedIds).size!==comparison.affectedIds.length||comparison.affectedIds.some(id=>!knownIds.includes(id)))fail('COMPARISON_SCOPE_DIFFERS');
  const dimensions=['scope','permissions','prerequisites','checks','dependencies'];
  if(!closed(comparison.assessment,dimensions)||!dimensions.every(k=>closed(comparison.assessment[k],['unchanged','reason'])&&comparison.assessment[k].unchanged===true&&text(comparison.assessment[k].reason)))fail('SEMANTIC_ASSESSMENT_REQUIRED');
  const sources=before.map(v=>v.source);
  if(sources.some(r=>!r)||!same(comparison.currentSources,sources.map(r=>({ref:r,integrity:byteIntegrity(read(r))}))))fail('COMPARISON_SOURCE_DIFFERS');
  const next=structuredClone(current);
  const refresh=v=>same(v.integrity,byteIntegrity(read(v.source)))?structuredClone(v):capture(read(v.source),v.source);
  next.subjectVersions=current.subjectVersions.map(refresh);
  next.inputVersions=current.inputVersions.map(refresh);
  next.historyRefs=[capture(oldBytes,{path:reviewPath,anchor:null})];
  next.validityChecks.push({at:new Date().toISOString(),beforeRefs:structuredClone(before),afterRefs:[...next.subjectVersions,...next.inputVersions],result:'NON_SEMANTIC',reason:comparison.reason,affectedIds:comparison.affectedIds});
  return next;
}

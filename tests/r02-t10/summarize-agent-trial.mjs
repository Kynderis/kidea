// Read-only evaluator for retained trial roots; generated summary only.
import {readFileSync,readdirSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const repo=fileURLToPath(new URL('../../',import.meta.url)),run=path.join(repo,'.test-output/r02-t10/ai-agents-r1');
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const record=p=>JSON.parse(readFileSync(p,'utf8').match(/```json\r?\n([\s\S]*?)\r?\n```/)[1]);
const hashes=root=>Object.fromEntries(readdirSync(root,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>{const p=path.join(e.parentPath,e.name);return [path.relative(root,p).replaceAll('\\','/'),hash(readFileSync(p))];}).sort(([a],[b])=>a.localeCompare(b)));
const manifest=read(path.join(run,'manifest.json'));
const summary={at:new Date().toISOString(),result:'INCOMPLETE_NOT_ACCEPTED',sessionsStarted:3,sessionsNotStarted:3,mechanism:manifest.mechanism,manifest,controllerDeadline:'2026-09-15T10:14:54Z',timingLimitation:'Controller used manifest timestamp +300s, earlier than actual agent starts; dispatch timestamps were not separately captured. Conservative cutoff truncated sessions. Pair1 APPROVE finished at 10:14:55.991Z, ~2 seconds after cutoff; no SAVE or new dependent session followed.',pairs:[]};
for(let n=1;n<=3;n++){
  const pair=path.join(run,`pair-${n}`),root=path.join(pair,'A');
  const logs=readdirSync(path.join(pair,'logs-A')).filter(p=>p.endsWith('.json')).sort().map(p=>({file:p,...read(path.join(pair,'logs-A',p))}));
  const calls=logs.map(l=>({...l,request:JSON.parse(l.input),response:JSON.parse(l.exitCode===0?l.stdout:l.stderr)}));
  assert.equal(calls.find(c=>c.action==='init').response.code,'AUTHORIZATION_REQUIRED');
  assert.equal(calls.filter(c=>c.action==='init').length,2);
  assert.equal(calls.filter(c=>c.action==='init')[1].response.state,'INITIALIZED');
  assert.equal(calls.some(c=>c.action==='resume'),false);
  const denied=hashes(path.join(pair,'denied'));
  assert.deepEqual(denied,{'permission.md':manifest.baseline[`pair-${n}/denied/permission.md`]});
  const work=record(path.join(root,'.kidea/work.md')),review=record(path.join(root,'.kidea/reviews/R-001.md'));
  assert.equal(work.currentItemId,'W-001');assert.ok(work.items.every(i=>i.executionStatus===null));
  assert.equal(review.status,n===1?'APPROVED':'IN_REVIEW');assert.equal(review.feedbackRefs.length,1);
  assert.equal(existsSync(path.join(pair,'B01')),false);
  summary.pairs.push({pair:n,agent:`/root/trial_a${n}`,cases:{A01:'FAIL_INITIAL_REQUEST_ROOT_SPELLING',A02:'PASS',A03:'PARTIAL_SECOND_CALL_INITIALIZED_NOT_ALREADY_INITIALIZED',A04:'PARTIAL_NO_SAVED_HANDOFF',...Object.fromEntries(['B01','B02','B03','B04','B05','B06a','B06b','B06c','B07','B08'].map(k=>[k,'NOT_RUN_A_HANDOFF_INCOMPLETE']))},reviewStatus:review.status,projectId:work.projectId,reviewDigest:hash(readFileSync(path.join(root,'.kidea/reviews/R-001.md'))),finalFiles:hashes(root),denied,calls});
}
summary.currentSkillHashes=hashes(path.join(repo,'.agents/skills/kidea'));
summary.changedSkillFiles=Object.keys(manifest.skillHashes).filter(p=>manifest.skillHashes[p]!==summary.currentSkillHashes[p]);
assert.deepEqual(summary.changedSkillFiles,['SKILL.md']);
summary.counts={PASS:3,FAIL:3,PARTIAL:6,NOT_RUN:30,totalPlanned:42};
summary.postFix={change:'SKILL.md explains Resolve-Path/realpath for selected cwd and permission.root, with serialized JSON. No runtime changes.',independentAiRerun:false,rootRequestTests:1,functionalCases:22,functionalCommands:24,functionalReport:'.test-output/r02-t10/functional-flow-j37iSL/report.json',functionalReportHash:hash(readFileSync(path.join(repo,'.test-output/r02-t10/functional-flow-j37iSL/report.json'))),validator:'quick_validate PASS with existing .tools/skill-validation/lib via process-scoped PYTHONPATH; initial global Python attempt lacked yaml; no install'};
const target=path.join(repo,'tests/evidence/r02-t10-agent-trial-r1.json');
writeFileSync(target,JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({target,counts:summary.counts,sessionsStarted:3,changedSkillFiles:summary.changedSkillFiles,sha256:hash(readFileSync(target))}));

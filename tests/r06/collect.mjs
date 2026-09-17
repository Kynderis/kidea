// CREATE-only evidence packaging. No workload, replay or historical mutation.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {byteIntegrity} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const output=path.join(repo,'tests/evidence/r06/implementation-r1');
const parse=p=>JSON.parse(fs.readFileSync(path.join(repo,p)));
const hash=p=>byteIntegrity(fs.readFileSync(p)).value;
const tree=root=>Object.fromEntries(fs.readdirSync(root,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>{const p=path.join(e.parentPath,e.name);return [path.relative(root,p),byteIntegrity(fs.readFileSync(p))];}));
const historical=parse('tests/evidence/r05/web-scope-r1/historical-hashes.json');
for(const [p,h]of Object.entries(historical))assert.equal(hash(path.join(repo,p)),h,p);
const pilot='/Users/kendrick/Desktop/kidea-workshop-pilot';
const docs=parse('tests/evidence/r05/web-scope-r1/manifest.json').files;
for(const [p,h]of Object.entries(docs))assert.equal(hash(path.join(pilot,p)),h.after,p);
const backend=parse('tests/evidence/r05/backend-execution-r5/manifest.json').sources;
for(const [p,h]of Object.entries(backend))assert.equal(hash(path.join(pilot,'samples/r05/backend-integration-r1',p)),h.sha256,p);
const web=parse('tests/evidence/r05/web-execution-r2/manifest.json').sampleSource;
for(const [p,h]of Object.entries(web))assert.equal(hash(path.join(pilot,'samples/r05/web',p)),typeof h==='string'?h:h.hash,p);
const core='.test-output/r02-t07/regression-mVDBks';
const coreSummary=parse(core+'/summary.json');assert.equal(coreSummary.exitCode,0);assert.equal(coreSummary.inputsUnchanged,true);
for(const [p,h]of Object.entries(coreSummary.after))assert.equal(hash(path.join(repo,p)),h,p);
const finalRun='.test-output/r06/2026-09-17T04-29-50-265Z';
const finalSummary=parse(finalRun+'/summary.json');assert.ok(finalSummary.results.every(r=>r.status==='PASS'));
for(const [p,h]of Object.entries(finalSummary.source))assert.equal(hash(path.join(repo,p)),h.value,p);
const boundary='.test-output/r06/boundaries-2026-09-17T04-32-47-456Z';assert.ok(parse(boundary+'/summary.json').results.every(r=>r.status==='PASS'));
const sessions=[];
for(const [id,file]of [['1','rollout-2026-09-17T11-33-34-01a0ada4-3176-7052-a9bc-a0d963319530.jsonl'],['2','rollout-2026-09-17T11-33-46-01a0ada4-610f-7531-a5e1-833edb874856.jsonl']]) {
  const dir=path.join(repo,'.test-output/r06/trials-r1/session-'+id),manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json')));
  assert.deepEqual(tree(path.join(dir,'skill')),manifest.source);
  for(const [variant,before]of Object.entries(manifest.input))assert.deepEqual(tree(path.join(dir,variant)),before);
  const records=fs.readFileSync('/Users/kendrick/.codex/sessions/2026/09/17/'+file,'utf8').trim().split('\n').map(s=>JSON.parse(s));
  const metadata=records.find(r=>r.type==='session_meta').payload,turn=records.find(r=>r.type==='turn_context').payload;
  const complete=records.findLast(r=>r.type==='event_msg'&&r.payload.type==='task_complete')?.payload;assert.ok(complete);assert.ok(complete.duration_ms<=15*60*1000);
  const answer=records.findLast(r=>r.type==='response_item'&&r.payload.type==='message'&&r.payload.role==='assistant'&&r.payload.phase==='final_answer');assert.ok(answer);
  const transcript=records.filter(r=>r.type==='response_item'&&['function_call','function_call_output','custom_tool_call','custom_tool_call_output'].includes(r.payload.type));
  sessions.push({id,dir,manifest,model:turn.model,effort:turn.effort,provider:metadata.model_provider,sessionId:metadata.id,complete:{startedAt:complete.started_at,completedAt:complete.completed_at,durationMs:complete.duration_ms},answer:answer.payload.content.map(c=>c.text??'').join('\n'),transcript});
}
fs.mkdirSync(output); // refuse overwrite, including a prior partial collector
const put=(p,b)=>{fs.mkdirSync(path.dirname(path.join(output,p)),{recursive:true});fs.writeFileSync(path.join(output,p),b,{flag:'wx'});};
const runs=fs.readdirSync(path.join(repo,'.test-output/r06')).filter(p=>p!=='trials-r1');
for(const run of runs)fs.cpSync(path.join(repo,'.test-output/r06',run),path.join(output,'runs',run),{recursive:true,errorOnExist:true,force:false});
fs.cpSync(path.join(repo,core),path.join(output,'core'),{recursive:true,errorOnExist:true,force:false});
fs.cpSync(path.join(repo,'.agents/skills/kidea'),path.join(output,'skill-source'),{recursive:true,errorOnExist:true,force:false});
for(const session of sessions) {
  const prefix='trials/session-'+session.id;
  put(prefix+'/response.md',session.answer+'\n');put(prefix+'/tool-transcript.json',JSON.stringify(session.transcript,null,2));
  put(prefix+'/manifest.json',JSON.stringify(session.manifest,null,2));put(prefix+'/prompt.txt',fs.readFileSync(path.join(session.dir,'prompt.txt')));
  for(const variant of Object.keys(session.manifest.input))fs.cpSync(path.join(session.dir,variant),path.join(output,prefix,variant),{recursive:true,errorOnExist:true,force:false});
}
const source=Object.fromEntries([...Object.keys(coreSummary.after),...fs.readdirSync(path.join(repo,'tests/r06')).map(p=>'tests/r06/'+p),'.agents/skills/kidea/references/change.md'].map(p=>[p,byteIntegrity(fs.readFileSync(path.join(repo,p)))]));
const summary={at:new Date().toISOString(),baseHead:'a3ddf160a7147f934cb35e022c6c287f6066023e',source,host:{platform:process.platform,arch:process.arch,node:process.version,uid:process.getuid?.(),os:spawnSync('/usr/bin/sw_vers',[],{encoding:'utf8',timeout:10000}).stdout},
  preserved:{historicalEvidence:Object.keys(historical).length,pilotDocs:Object.keys(docs).length,backendSources:Object.keys(backend).length,webSources:Object.keys(web).length},
  deterministic:{main:finalSummary.results,adversarial:parse(boundary+'/summary.json').results,core:283,sourceUnchanged:true},
  trials:sessions.map(({id,model,effort,provider,sessionId,complete})=>({id,model,effort,provider,sessionId,...complete,inputsUnchanged:true})),
  limitations:['Mac Intel evidence only. No new Windows/Apple Silicon run.','C++ syntax/AST on finite sources; no backend build or Docker execution.','Web/parser unsupported dynamic dispatch remains explicit.','Human R06 acceptance pending; no production/pilot certification.'],files:tree(output)};
put('summary.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({output,preserved:summary.preserved,files:Object.keys(summary.files).length,trials:summary.trials},null,2));

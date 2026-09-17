import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {resume,readResume} from '../../.agents/skills/kidea/scripts/resume.mjs';
import {prepareWorkCycle} from '../../.agents/skills/kidea/scripts/work-cycle.mjs';
import {readStatus} from '../../.agents/skills/kidea/scripts/status.mjs';
import {hashBytes} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
import {ready,review,record,ref,put,assumptions,definition,readRequest,work} from './support.mjs';
const base=path.resolve(import.meta.dirname,'../../.test-output/r09');mkdirSync(base,{recursive:true});const run=mkdtempSync(path.join(base,'cycle-'));console.log('Cycle evidence:',run);
const struct=i=>{const v=structuredClone(i);for(const k of ['gateIds','resultRefs','executionStatus'])delete v[k];return v;};
const fingerprints=root=>Object.fromEntries(readdirSync(root,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>{const p=path.join(e.parentPath,e.name);return [path.relative(root,p),hashBytes(readFileSync(p))];}));
let serial=0;
async function request(root,plan,owners=[record(root).currentItemId]){const id='cycle-'+(++serial),p=`docs/${id}.json`;put(root,p,JSON.stringify(plan,null,2));await review(root,id,owners,[ref(p),ref('docs/plan.md'),ref('docs/results.md')]);const base=readRequest(root,[ref(p)]),r=readResume(root,base);return {...base,operation:plan.operation,permission:{...base.permission,allowWorkCycle:true,ownerId:r.context.currentItem.id,statement:'Synthetic cycle authority.',assumptions},expectedBasis:r.basis,expectedProjectId:r.context.projectId,expectedOwnerId:r.context.currentItem.id,expectedGit:r.context.checkout,proposalRef:ref(p),reviewId:id,conditionsMet:true,statement:'Synthetic reviewed plan and impact.'};}
function replan(root){const old=record(root).items;return {operation:'REPLAN_WORK',reason:'Synthetic remove B and retain A; reassess downstream step obligations.',nextAction:'Review W-001 then continue A.',nextItemId:'W-001',items:old.filter(i=>i.id!=='B').map(i=>i.kind==='STEP'?{...struct(i),...definition}:struct(i)),dispositions:old.map(i=>({id:i.id,decision:i.id==='B'?'RETIRE':i.kind==='STEP'?'REASSESS':'PRESERVE',reason:'Explicit fixture disposition, including unchanged downstream steps.'}))};}
function newRound(root){return {operation:'CREATE_ROUND',reason:'Synthetic change while MVP is unfinished.',nextAction:'Keep current work until explicit switch.',baselineRef:ref('docs/results.md'),round:{id:'CHANGE-1',name:'Synthetic change',type:'CHANGE',scopeRefs:[ref('docs/plan.md')],targetVersion:null,releaseRef:null},items:Array.from({length:10},(_,i)=>({id:`C-${i+1}`,roundId:'CHANGE-1',name:`Step ${i+1}`,kind:'STEP',parentId:null,shape:'GROUP',decomposition:'UNEXPANDED',...definition,dependencyIds:i?[`C-${i}`]:[]}))};}
function reject(root,q,code){const before=fingerprints(root);assert.throws(()=>prepareWorkCycle(root,q),e=>e.code===code,code);assert.deepEqual(fingerprints(root),before);}
test('reviewed retirement preserves unfinished work, old approval bytes and the continuation',async()=>{
 const root=await ready(run),oldReview=readFileSync(path.join(root,'.kidea/reviews/initial.md'));const q=await request(root,replan(root),['A','W-001']);assert.equal((await resume(root,q)).state,'WORK_RECORDED');
 const w=record(root);assert.equal(w.currentItemId,'W-001');assert.equal(w.items.some(i=>i.id==='B'),false);assert.equal(w.items.find(i=>i.id==='A').executionStatus,'IN_PROGRESS');assert.equal(w.returnStack.at(-1).itemId,'A');assert.deepEqual(readFileSync(path.join(root,'.kidea/reviews/initial.md')),oldReview);assert.equal(w.reviewRefs.some(r=>r.path.endsWith('/initial.md')),false);assert.equal(readStatus(root).readState,'OK');
 await work(root,'SELECT',{nextItemId:'A'});assert.equal(record(root).returnStack.length,0);assert.equal(record(root).items.find(i=>i.id==='A').executionStatus,'IN_PROGRESS');
});
test('forged approval, stale basis and missing authority are rejected without writes',async()=>{
 const root=await ready(run),q=await request(root,replan(root),['A','W-001']);for(const [edit,code]of [[x=>x.reviewId='missing','CYCLE_APPROVAL_REQUIRED'],[x=>x.expectedBasis='old','CYCLE_BASIS_CHANGED'],[x=>x.permission.allowWorkCycle=false,'CYCLE_PERMISSION_REQUIRED']]){const n=structuredClone(q);edit(n);reject(root,n,code);}
});
test('changed producer requires reassessing no-diff consumer and parent',async()=>{
 const root=await ready(run),w=record(root),p={operation:'REPLAN_WORK',reason:'Synthetic changed A',nextAction:'Review',nextItemId:'A',items:w.items.map(struct),dispositions:w.items.map(i=>({id:i.id,decision:i.id==='A'?'REASSESS':'PRESERVE',reason:'Fixture'}))};const q=await request(root,p,['A','W-001']);reject(root,q,'CYCLE_CONSUMER_REASSESS_REQUIRED');
});
test('new round creation and switch preserve MVP, prohibit implicit round completion',async()=>{
 const root=await ready(run),q=await request(root,newRound(root));assert.equal((await resume(root,q)).state,'WORK_RECORDED');assert.equal(record(root).currentItemId,'A');
 const sw=await request(root,{operation:'SWITCH_ROUND',reason:'Explicit fixture priority choice',nextAction:'Prepare change step1',targetRoundId:'CHANGE-1',nextItemId:'C-1'});assert.equal((await resume(root,sw)).state,'WORK_RECORDED');const w=record(root);assert.equal(w.currentRoundId,'CHANGE-1');assert.equal(w.items.find(i=>i.id==='A').executionStatus,'IN_PROGRESS');assert.equal(w.returnStack.at(-1).itemId,'A');
 const back=await request(root,{operation:'RETURN_ROUND',reason:'Fixture return',nextAction:'Continue A'});reject(root,back,'CYCLE_ROUND_INCOMPLETE');
});
test('BUGFIX requires pinned release baseline and exact ten-step dependency chain',async()=>{
 const root=await ready(run),p=newRound(root);p.round.type='BUGFIX';const q=await request(root,p);reject(root,q,'CYCLE_BUGFIX_RELEASE_REQUIRED');
 const broken=newRound(root);broken.items[3].dependencyIds=['C-5'];reject(root,await request(root,broken),'CYCLE_STEP_DEPENDENCIES');
});
test('missing dispositions, silently changed preserved work, mandatory step retirement and dependency cycles block',async()=>{
 const root=await ready(run);
 const missing=replan(root);missing.dispositions.pop();reject(root,await request(root,missing),'CYCLE_DISPOSITION_REQUIRED');
 const changed=replan(root);changed.items.find(i=>i.id==='A').name='Changed without reassessment';reject(root,await request(root,changed),'CYCLE_PRESERVE_CHANGED');
 const retired=replan(root);retired.dispositions.find(d=>d.id==='W-002').decision='RETIRE';reject(root,await request(root,retired),'CYCLE_RETIRE_SCOPE');
 const cycle=replan(root);cycle.items.find(i=>i.id==='A').dependencyIds=['A'];cycle.dispositions.find(d=>d.id==='A').decision='REASSESS';reject(root,await request(root,cycle),'GRAPH_NOT_VALID');
});
test('ten actual public step completions allow returning to the unchanged unfinished MVP',async()=>{
 const root=await ready(run);assert.equal((await resume(root,await request(root,newRound(root)))).state,'WORK_RECORDED');assert.equal((await resume(root,await request(root,{operation:'SWITCH_ROUND',reason:'Fixture priority',nextAction:'Prepare',targetRoundId:'CHANGE-1',nextItemId:'C-1'}))).state,'WORK_RECORDED');
 for(let n=1;n<=10;n++) {
  const id=`C-${n}`,child={id:`T-${n}`,roundId:'CHANGE-1',name:'Synthetic output',kind:'TASK',parentId:id,shape:'LEAF',decomposition:null,...definition,dependencyIds:[],gateIds:[],resultRefs:[],executionStatus:'TODO'};
  await work(root,'DECOMPOSE',{definition,children:[child]});await review(root,`step-${n}`,[id]);await work(root,'RESOLVE_BLOCKERS',{blockers:record(root).blockers.filter(b=>b.itemId===id)});await work(root,'SELECT',{nextItemId:child.id});await work(root,'START');await work(root,'COMPLETE',{resultRefs:[ref('docs/results.md')]});if(n<10)await work(root,'SELECT',{nextItemId:`C-${n+1}`});
 }
 assert.equal((await resume(root,await request(root,{operation:'RETURN_ROUND',reason:'Completed synthetic round',nextAction:'Continue original A'}))).state,'WORK_RECORDED');const w=record(root);assert.equal(w.currentRoundId,'ROUND-001');assert.equal(w.currentItemId,'A');assert.equal(w.items.find(i=>i.id==='A').executionStatus,'IN_PROGRESS');assert.equal(w.items.find(i=>i.id==='B').executionStatus,'TODO');assert.equal(w.returnStack.length,0);
});

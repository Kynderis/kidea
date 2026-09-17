import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {initialize} from '../../.agents/skills/kidea/scripts/init.mjs';
import {resume,readResume} from '../../.agents/skills/kidea/scripts/resume.mjs';
import {approve} from '../../.agents/skills/kidea/scripts/approve.mjs';
import {hashBytes} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
export const assumptions={localFilesystem:true,noActiveSync:true,singleKideaRun:true};
export const ref=path=>({path,anchor:null});
export function put(root,p,bytes){mkdirSync(path.dirname(path.join(root,p)),{recursive:true});writeFileSync(path.join(root,p),bytes);}
export const record=(root,p='.kidea/work.md')=>JSON.parse(readFileSync(path.join(root,p),'utf8').match(/```json\r?\n([\s\S]*?)\r?\n```/)[1]);
export const definition={scopeRef:ref('docs/plan.md'),inputRefs:[ref('docs/plan.md')],completionRef:ref('docs/plan.md')};
export const readRequest=(root,extra=[])=>({operation:'READ',permission:{root,readProject:true,allowReadLocalGit:false},requiredFiles:[ref('docs/plan.md'),ref('docs/results.md'),...extra]});
export async function fresh(base){const root=mkdtempSync(path.join(base,'case-'));assert.equal((await initialize(root,{projectName:'Synthetic R09',humanRequest:'Fixture only, not pilot approval.',featureSource:{mode:'NEW',path:'docs/features.md',anchor:null},profiles:[],permission:{root,metadataRoot:'.kidea/checkpoints',targets:[{path:'.kidea/INDEX.md',action:'CREATE'},{path:'.kidea/work.md',action:'CREATE'},{path:'docs/features.md',action:'CREATE'}],createDirectories:['docs'],allowRestoreUpdate:false,allowRetireOwnPending:true,bootstrap:true,assumptions,statement:'Synthetic init authority.'}})).state,'INITIALIZED');put(root,'docs/plan.md','Synthetic scope and completion.\n');put(root,'docs/results.md','Synthetic verification evidence.\n');return root;}
export async function review(root,id,owners,sources=[ref('docs/plan.md'),ref('docs/results.md')]){
 for(const operation of ['CREATE','SUBMIT','APPROVE']){
  const p=`.kidea/reviews/${id}.md`,exists=existsSync(path.join(root,p)),r=exists?record(root,p):null;
  const q={operation,id,revision:r?.revision??1,expectedDigest:exists?hashBytes(readFileSync(path.join(root,p))):null,ownerIds:owners,permission:{root,reviewPath:p,ownerIds:owners,allowReviewMetadata:true,allowLinkOwners:true,allowCreateEvidence:true,allowReadLocalGit:false,createDirectories:['.kidea/reviews','.kidea/reviews/evidence'].filter(p=>!existsSync(path.join(root,p))),assumptions,statement:'Synthetic approval for exact fixture only.'},package:operation==='CREATE'?{subjectRefs:sources,inputRefs:sources,purpose:'CONTENT',waiverReason:null}:{conditionsMet:true,statement:'Synthetic evidence reviewed.'}};
  if(operation==='APPROVE')q.human={intent:'APPROVE',statement:'Synthetic explicit fixture approval.',id,revision:q.revision,expectedDigest:q.expectedDigest,ownerIds:owners};
  const r2=await approve(root,q);assert.equal(r2.state,'REVIEW_RECORDED',JSON.stringify(r2));
 }
}
export function workRequest(root,operation,transition,extra=[]){const base=readRequest(root,extra),r=readResume(root,base);assert.ok(r.context,JSON.stringify(r));return {...base,operation,permission:{...base.permission,allowWorkTransition:true,ownerId:r.context.currentItem.id,statement:'Synthetic work transition.',assumptions},expectedBasis:r.basis,expectedProjectId:r.context.projectId,expectedOwnerId:r.context.currentItem.id,expectedGit:r.context.checkout,transition:{conditionsMet:true,reason:'Synthetic assessed conditions.',nextAction:'Continue fixture.',evidenceRefs:[ref('docs/plan.md')],...transition}};}
export async function work(root,op,t={},extra=[]){const r=await resume(root,workRequest(root,op,t,extra));assert.equal(r.state,'WORK_RECORDED',JSON.stringify(r));return r;}
export async function ready(base){const root=await fresh(base),w=record(root);await work(root,'DECOMPOSE',{definition,children:['A','B'].map((id,i)=>({id,roundId:w.currentRoundId,name:id,kind:'TASK',parentId:w.currentItemId,shape:'LEAF',decomposition:null,...definition,dependencyIds:i?['A']:[],gateIds:[],resultRefs:[],executionStatus:'TODO'}))});await review(root,'initial',['W-001']);await work(root,'RESOLVE_BLOCKERS',{blockers:record(root).blockers.filter(b=>b.itemId==='W-001')});await work(root,'SELECT',{nextItemId:'A'});await work(root,'START');return root;}

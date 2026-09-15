// Mechanical readback complements, rather than replaces, the controller's
// review of each agent's semantic explanation and scoped decisions.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const repo=fileURLToPath(new URL('../../',import.meta.url)),run=path.join(repo,'.test-output/r02-t10/ai-agents-r2');
const hash=b=>createHash('sha256').update(b).digest('hex');
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const rec=p=>JSON.parse(readFileSync(p,'utf8').match(/```json\r?\n([\s\S]*?)\r?\n```/)[1]);
const hashes=root=>Object.fromEntries(readdirSync(root,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>{const p=path.join(e.parentPath,e.name);return [path.relative(root,p).replaceAll('\\','/'),hash(readFileSync(p))];}).sort(([a],[b])=>a.localeCompare(b)));
const manifest=json(path.join(run,'manifest.json'));
const report={at:new Date().toISOString(),manifest,kind:'MECHANICAL_READBACK_PLUS_SEPARATE_HUMAN_CONTROLLER_SEMANTIC_REVIEW',pairs:[],notAnOsIsolationCertificate:true};
const same=(a,b)=>assert.deepEqual(a,b);
const normalize=m=>Object.fromEntries(Object.entries(m).map(([k,v])=>[k.replaceAll('\\','/'),v]));
const reviewPath='.kidea/reviews/RV-001.md';
for(let n=1;n<=3;n++){
  const pair=path.join(run,`pair-${n}`),a=path.join(pair,'A');
  const p={pair:n,sessions:{},checks:[],cases:{},calls:{}};report.pairs.push(p);
  const check=(id,fn)=>{try{fn();p.checks.push({id,result:'PASS'});}catch(e){p.checks.push({id,result:'FAIL',detail:e.message});}};
  for(const session of ['A','B']){
    const s=path.join(pair,`session-${session}.json`);if(!existsSync(s)){p.sessions[session]='NOT_RUN';p.calls[session]=[];continue;}
    p.sessions[session]=json(s);
    p.calls[session]=readdirSync(path.join(pair,`logs-${session}`)).filter(x=>x.endsWith('.json')).sort().map(x=>{const r=json(path.join(pair,`logs-${session}`,x));return {log:x,...r,before:normalize(r.before),after:normalize(r.after),request:r.input.trim()?JSON.parse(r.input):{},response:JSON.parse(r.exitCode===0?r.stdout:r.stderr)};});
    check(`${session}-commands-within-deadline`,()=>{for(const c of p.calls[session]){assert.ok(Date.parse(c.startedAt)>=Date.parse(p.sessions[session].startedAt));assert.ok(Date.parse(c.finishedAt)<=Date.parse(p.sessions[session].deadline));assert.equal(c.error,null);}});
  }
  const ac=p.calls.A,bc=p.calls.B;
  const init=ac.filter(c=>c.action==='init'),ap=ac.filter(c=>c.action==='approve');
  check('A01',()=>{assert.equal(init.length,2);assert.equal(init[0].response.state,'INITIALIZED');assert.match(readFileSync(path.join(a,'docs/features.md'),'utf8'),/MVP: chưa có feature được duyệt/);assert.equal(init[0].request.humanRequest,'Tôi muốn ứng dụng ghi chú. Thanh toán mới là ý tưởng, chưa chọn vào MVP.');});
  check('A02',()=>same(hashes(path.join(pair,'denied')),{'permission.md':manifest.baseline[`pair-${n}/denied/permission.md`]}));
  check('A03',()=>{assert.equal(init[1].response.state,'ALREADY_INITIALIZED');same(init[1].before,init[1].after);assert.equal(init[1].response.status.projectId,init[0].response.projectId);});
  check('A04',()=>{
    const submit=ap.filter(c=>c.request.operation==='SUBMIT'),feedback=ap.find(c=>c.request.operation==='FEEDBACK'),approved=ap.find(c=>c.request.operation==='APPROVE');
    assert.equal(submit.length,2);assert.ok(feedback&&approved);const rp='.kidea/reviews/R-001.md';
    assert.equal(feedback.request.human.intent,'REQUEST_CHANGES');assert.equal(feedback.request.expectedDigest,submit[0].after[rp]);assert.equal(feedback.request.human.expectedDigest,submit[0].after[rp]);
    assert.equal(approved.request.expectedDigest,submit[1].after[rp]);assert.equal(approved.request.human.expectedDigest,submit[1].after[rp]);same(approved.request.human.ownerIds,['W-001']);assert.equal(approved.request.human.revision,submit[1].request.revision);
    assert.ok(Date.parse(feedback.startedAt)>Date.parse(submit[0].finishedAt));assert.ok(Date.parse(approved.startedAt)>Date.parse(submit[1].finishedAt));
    assert.equal(rec(path.join(a,rp)).status,'APPROVED');const saved=ac.find(c=>c.action==='resume'&&c.request.operation==='SAVE');assert.equal(saved?.response.state,'CONTINUATION_SAVED');
    const w=rec(path.join(a,'.kidea/work.md'));assert.equal(w.currentItemId,'W-001');assert.ok(w.items.every(i=>i.executionStatus===null));assert.match(w.nextAction,/người dùng/);assert.match(w.nextAction,/phạm vi/);
    assert.equal(hash(readFileSync(path.join(a,'docs/features.md'))),init[0].after['docs/features.md']);
  });
  const baselinePath=path.join(pair,'handoff-baseline.json');
  if(!existsSync(baselinePath)){for(const id of ['B01','B02','B03','B04','B05','B06a','B06b','B06c','B07','B08'])p.cases[id]='NOT_RUN';continue;}
  const base=json(baselinePath);base.a=normalize(base.a);for(const key of Object.keys(base.branches))base.branches[key]=normalize(base.branches[key]);p.handoffBaseline=base;
  const calls=name=>bc.filter(c=>path.basename(c.root)===name);
  const unchanged=name=>{same(hashes(path.join(pair,name)),base.branches[name]);for(const c of calls(name))same(c.before,c.after);};
  const rread=name=>calls(name).find(c=>c.action==='resume'&&c.request.operation==='READ')?.response;
  check('B01',()=>{same(base.a,base.branches.B01);unchanged('B01');unchanged('B01-history');assert.equal(rread('B01')?.context.currentItem.id,'W-001');assert.equal(rread('B01')?.executionAuthorized,false);assert.match(rread('B01').context.nextAction,/người dùng/);const h=rread('B01-history');assert.ok(h.context.dependencies.some(d=>d.id==='DEP-1'&&d.recordedComplete));assert.equal(h.context.returnStack[0].itemId,'W-001');});
  check('B02',()=>{
    const root=path.join(pair,'B02'),attempts=calls('B02').filter(c=>c.action==='resume'&&c.request.operation==='SAVE'),saved=attempts.find(c=>c.response.state==='CONTINUATION_SAVED');assert.equal(saved?.response.state,'CONTINUATION_SAVED');for(const c of attempts.filter(c=>c!==saved))same(c.before,c.after);
    const r=rec(path.join(root,reviewPath)),previous=rec(path.join(root,r.historyRefs[0].location.ref.path));same(r.confirmationRef,previous.confirmationRef);assert.equal(r.revision,previous.revision);assert.equal(r.status,'APPROVED');assert.equal(hash(readFileSync(path.join(root,r.historyRefs[0].location.ref.path))),base.branches.B02[reviewPath]);
    const cmp=saved.request.reviewComparisons[0];same(cmp.checkpoint,saved.request.checkpoint);for(const field of ['scope','permissions','prerequisites','checks','dependencies']){assert.equal(cmp.comparison.assessment[field].unchanged,true);assert.ok(cmp.comparison.assessment[field].reason.length>20);}
    const oldWork=rec(path.join(root,previous.subjectVersions.find(v=>v.source.path==='.kidea/work.md').location.ref.path)),work=rec(path.join(root,'.kidea/work.md'));for(const key of Object.keys(oldWork).filter(k=>!['nextAction','checkpointRef'].includes(k)))same(work[key],oldWork[key]);
    assert.equal(hash(readFileSync(path.join(root,'docs/features.md'))),base.branches.B02['docs/features.md']);
  });
  for(const id of ['B03','B04'])check(id,()=>{
    const root=path.join(pair,id),c=calls(id).find(c=>c.action==='approve'&&c.request.operation==='REVISE');assert.equal(c?.response.state,'REVIEW_RECORDED');assert.equal(calls(id).some(c=>['APPROVE','REVALIDATE'].includes(c.request.operation)),false);
    const r=rec(path.join(root,reviewPath));assert.equal(r.status,'DRAFT');assert.equal(r.revision,3);assert.equal(r.confirmationRef,null);assert.ok(r.historyRefs.length);assert.equal(hash(readFileSync(path.join(root,'docs/features.md'))),base.branches[id]['docs/features.md']);if(id==='B04'){assert.equal(r.purpose,'CONTENT');assert.equal(r.waiverReasonRef,null);}
  });
  check('B05',()=>{unchanged('B05');assert.equal(rread('B05')?.state,'READ_BLOCKED');});
  for(const [id,matches]of [['B06a',['BEFORE','BEFORE']],['B06b',['OTHER','BEFORE']],['B06c',['PLANNED','PLANNED']]])check(id,()=>{unchanged(id);const r=rread(id);assert.equal(r?.state,'RECONCILIATION_REQUIRED');assert.equal(r.context,null);same(r.pending.targets.map(t=>t.match),matches);assert.ok(existsSync(path.join(pair,id,'.kidea/checkpoints/pending/active.json')));});
  check('B07',()=>{unchanged('B07');const r=rread('B07');assert.equal(r?.executionAuthorized,false);assert.equal(r.context.operationalObservations[0].observations[0].components[1].result,'UNKNOWN');});
  check('B08-files-unchanged',()=>{unchanged('B08');assert.ok(calls('B08').every(c=>c.response.code==='NOT_IMPLEMENTED'||c.action==='status'||(c.action==='resume'&&c.request.operation==='READ')));});
  for(const id of ['A01','A02','A03','A04','B01','B02','B03','B04','B05','B06a','B06b','B06c','B07'])p.cases[id]=p.checks.find(c=>c.id===id)?.result??'NOT_RUN';
  p.cases.B08='REQUIRES_CONTROLLER_NARRATIVE_CHECK';
}
report.currentSkillHashes=hashes(path.join(repo,'.agents/skills/kidea'));same(report.currentSkillHashes,manifest.skillHashes);
report.unchangedSkill=true;
report.failedChecks=report.pairs.flatMap(p=>p.checks.filter(c=>c.result==='FAIL').map(c=>({pair:p.pair,...c})));
report.commands=report.pairs.reduce((sum,p)=>sum+p.calls.A.length+p.calls.B.length,0);
const regression=path.join(repo,'.test-output/r02-t07/regression-c5vE1l');
report.regression={summary:json(path.join(regression,'summary.json')),stdout:readFileSync(path.join(regression,'stdout.txt'),'utf8'),stderr:readFileSync(path.join(regression,'stderr.txt'),'utf8')};
assert.equal(hash(report.regression.stdout),report.regression.summary.stdoutHash);
assert.equal(hash(report.regression.stderr),report.regression.summary.stderrHash);
const target=path.join(repo,'tests/evidence/r02-t10-agent-trial-r2.json');writeFileSync(target,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({target,commands:report.commands,failedChecks:report.failedChecks,cases:report.pairs.map(p=>({pair:p.pair,cases:p.cases}))}));

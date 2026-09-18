from pathlib import Path
import json,subprocess,hashlib
root=Path('/Users/kendrick/Desktop/kidea');pilot=Path('/Users/kendrick/Desktop/kidea-workshop-pilot');out=Path(__file__).parent
node='/Users/kendrick/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node';cli=str(root/'.agents/skills/kidea/scripts/kidea.mjs')
def record():return json.loads((pilot/'.kidea/work.md').read_text().split('```json\n')[1].split('\n```')[0])
def call(q,label):
 (out/(label+'-request.json')).write_text(json.dumps(q,ensure_ascii=False,indent=2)+'\n')
 v=subprocess.run([node,cli,'resume'],cwd=pilot,input=json.dumps(q),text=True,capture_output=True)
 (out/(label+'-result.json')).write_text(v.stdout);(out/(label+'-stderr.log')).write_text(v.stderr)
 result=json.loads(v.stdout)
 if v.returncode:raise RuntimeError((label,result))
 return result
counter=0
def transition(op,reason,nextAction,extra=None,results=None):
 global counter
 w=record();owner=w['currentItemId'];item=next(i for i in w['items'] if i['id']==owner)
 refs=[item['scopeRef'],item['completionRef'],*item['inputRefs'],{'path':'docs/workflow/legacy-provenance-r1.json','anchor':None}]+(results or [])
 refs=[r for n,r in enumerate(refs) if r not in refs[:n]]
 counter+=1;label=f'{counter:02}-{owner}-{op}'
 q={'operation':'READ','permission':{'root':str(pilot),'readProject':True,'allowReadLocalGit':True},'requiredFiles':refs};read=call(q,label+'-read')
 q.update(operation=op,expectedBasis=read['basis'],expectedProjectId=read['context']['projectId'],expectedGit=read['context']['checkout'],expectedOwnerId=owner)
 q['permission'].update(allowWorkTransition=True,ownerId=owner,statement='Human approved full R09 execution and exact R09-REPLAN-LEGACY-r1 package with Tôi phê duyệt nhé. Record only evidence-backed content reconciliation and scoped backend/Web intermediate progress; preserve unfinished implementation and final acceptance.',assumptions={'localFilesystem':True,'noActiveSync':True,'singleKideaRun':True})
 q['transition']={'conditionsMet':True,'reason':reason,'nextAction':nextAction,'evidenceRefs':refs,**(extra or {})}
 result=call(q,label);assert result['state']=='WORK_RECORDED',result
 print(label+' WORK_RECORDED',flush=True)
# The 21 inherited files retain accepted content. The explicit package approves
# reconciliation of this content, not application runtime or future acceptance.
provenance=json.loads((pilot/'docs/workflow/legacy-provenance-r1.json').read_text())
for d in provenance['documents']:
 assert hashlib.sha256((pilot/d['path']).read_bytes()).hexdigest()==d['sha256']
assert record()['currentItemId']=='W-001'
for n in range(1,9):
 step=f'W-{n:03}';w=record();assert w['currentItemId']==step
 blockers=[b for b in w['blockers'] if b['itemId']==step]
 transition('RESOLVE_BLOCKERS','The original missing-content-review blocker is satisfied by the exact approved replan/provenance package, which binds the already accepted inherited content. Runtime verification remains in step9/10.','Record inherited content reconciliation only.',{'blockers':blockers})
 transition('SELECT','Enter the scoped inherited-content reconciliation leaf under its approved step.','Verify fixed inherited inputs; no runtime completion.',{'nextItemId':step+'-CONTENT'})
 transition('START','Accepted inherited input content and scope are bound by the Human-approved package; semantic boundaries retain all runtime and future obligations.','Record existing accepted content without claiming tests ran.')
 item=next(i for i in record()['items'] if i['id']==step+'-CONTENT')
 results=item['inputRefs']+[{'path':'docs/workflow/legacy-provenance-r1.json','anchor':None}]
 transition('COMPLETE','The inherited content is unchanged against accepted provenance; the approved package explicitly reconciles these design/definition outputs. This completes content only, not runtime tests or implementation.','Continue to the next approved content step.',{'resultRefs':results},results)
 transition('SELECT','Previous content step is reconciled; enter the next sequential step without accepting its future outputs.','Resolve only the existing planning-review blocker.',{'nextItemId':f'W-{n+1:03}'})
# Step9 remains incomplete. Two ordinary intermediate leaves use actual receipts.
w=record();transition('RESOLVE_BLOCKERS','The missing planning-review blocker is resolved by the approved implementation decomposition. Final output acceptance is retained for the last implementation leaf.','Record verified backend and Web intermediate results.',{'blockers':[b for b in w['blockers'] if b['itemId']=='W-009']})
for leaf,resultpaths in [('W-009-BACKEND',['docs/workflow/evidence/backend-r10.json']),('W-009-WEB',['docs/workflow/evidence/https-r3.json','docs/workflow/evidence/https-manifest-r3.json'])]:
 transition('SELECT','Enter an ordinary intermediate leaf whose exact scope is in the approved checkpoint.','Bind actual immutable run receipts.',{'nextItemId':leaf})
 transition('START','The scoped prerequisites and planning gate are current; recorded backend/Web receipts were reviewed with all FAILs and EXr2 retained.','Record only the first implementation slice.')
 results=[{'path':p,'anchor':None} for p in resultpaths]
 transition('COMPLETE','Bound backend four-preset and Web real-HTTPS evidence satisfies this intermediate scope. EXr2 remains a limitation; admin/events/ops, full G2 and final acceptance are not complete.','Continue the unfinished implementation work.',{'resultRefs':results},results)
transition('SELECT','Both prerequisite intermediate slices are recorded; enter the already approved max2ACTIVE impact while MVP is unfinished.','Read impact sources and create the scoped public change record.',{'nextItemId':'W-009-MAX2'})
transition('START','Human approved the max2ACTIVE scenario and its exact work decomposition. Begin impact analysis, retaining unfinished admin/ops and all final gates.','Apply the public impact workflow before changing inherited rules.')
print('STOP_AT_APPROVED_MAX2_IN_PROGRESS',flush=True)

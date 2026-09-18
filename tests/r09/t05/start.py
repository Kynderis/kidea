from pathlib import Path
import json,subprocess,hashlib
root=Path('/Users/kendrick/Desktop/kidea');pilot=Path('/Users/kendrick/Desktop/kidea-workshop-pilot');out=root/'tests/evidence/r09/t05-start-r1';out.mkdir(exist_ok=False)
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

assert record()['currentItemId']=='W-009-MAX2'
refs=[{'path':'docs/t04/report-r1.md','anchor':None},{'path':'.kidea/reviews/R09-T04-OUTPUT-r1.md','anchor':None}]
transition('COMPLETE','Human approved exact T04 output and public CLOSE restored this unfinished MVP leaf. The scoped quota impact and implemented-code regression are complete; final whole-product G2 remains pending.','Continue T05 admin/events/operations.',{'resultRefs':refs},refs)
transition('SELECT','T04 is accepted and closed; continue the existing approved next leaf.','Implement remaining admin/events/operations without claiming full MVP complete.',{'nextItemId':'W-009-ADMIN-OPS'})
transition('START','Full R09 execution grant permits implementation and bounded checks; inherited design and T04 approval remain in force.','Implement and test T05 with all remaining obligations retained.')

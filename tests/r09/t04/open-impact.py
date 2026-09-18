from pathlib import Path
import json,subprocess
root=Path('/Users/kendrick/Desktop/kidea');p=Path('/Users/kendrick/Desktop/kidea-workshop-pilot');out=root/'tests/evidence/r09/t04-impact-r1';out.mkdir(exist_ok=True)
node='/Users/kendrick/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node';cli=str(root/'.agents/skills/kidea/scripts/kidea.mjs')
w=json.loads((p/'.kidea/work.md').read_text().split('```json\n')[1].split('\n```')[0]);assert w['currentItemId']=='W-009-MAX2';assert next(i for i in w['items'] if i['id']=='W-009-MAX2')['executionStatus']=='IN_PROGRESS'
g=json.loads((p/'docs/t04/impact-graph.json').read_text())
def call(q,label):
 (out/(label+'-request.json')).write_text(json.dumps(q,ensure_ascii=False,indent=2)+'\n')
 v=subprocess.run([node,cli,'change'],cwd=p,input=json.dumps(q),text=True,capture_output=True)
 (out/(label+'-result.json')).write_text(v.stdout);(out/(label+'-stderr.log')).write_text(v.stderr)
 d=json.loads(v.stdout);assert v.returncode==0,d;return d
q={'operation':'READ','permission':{'root':str(p),'readProject':True,'allowReadLocalGit':True},'graph':g,'requiredFiles':[{'path':'docs/t04/impact-graph.json','anchor':None}]}
r=call(q,'open-read');assert r['state']=='IMPACT_PREPARED',r
q.update(operation='OPEN',expectedBasis=r['basis'],expectedProjectId=r['context']['projectId'],expectedRoundId='ROUND-001',expectedOwnerId='W-009-MAX2',expectedGit=r['context']['checkout'])
q['permission'].update(allowImpactWrite=True,roundId='ROUND-001',ownerId='W-009-MAX2',statement='Human approved T04 max2ACTIVE in R09 decision D, full R09 execution, and exact work replan R09-REPLAN-LEGACY-r1. Open the scoped change through the public API, preserve the unfinished MVP return point and all output gates.',assumptions={'localFilesystem':True,'noActiveSync':True,'singleKideaRun':True})
print(json.dumps(call(q,'open'),ensure_ascii=False),flush=True)

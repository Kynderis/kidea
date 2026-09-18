from pathlib import Path
import json,subprocess
repo=Path('/Users/kendrick/Desktop/kidea');pilot=Path('/Users/kendrick/Desktop/kidea-workshop-pilot').resolve();out=repo/'tests/evidence/r09/t04-assessment-r1';out.mkdir(exist_ok=False)
node='/Users/kendrick/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node';cli=str(repo/'.agents/skills/kidea/scripts/kidea.mjs')
rows=json.loads((repo/'tests/r09/t04/semantic-assessments.json').read_text());graph=json.loads((pilot/'docs/t04/impact-graph.json').read_text());refs=[{'path':p,'anchor':None} for p in ['docs/t04/report-r1.md','docs/t04/evidence/index.json','docs/t04/evidence/backend.json','docs/t04/evidence/https.json','docs/t04/evidence/mutations.json','docs/t04/evidence/query-plan.txt','docs/architecture/traceability.md']]
assert json.loads((pilot/'docs/t04/evidence/https.json').read_text())['status']=='PASS'
def call(q,label):
 (out/(label+'-request.json')).write_text(json.dumps(q,ensure_ascii=False,indent=2)+'\n');v=subprocess.run([node,cli,'change'],cwd=pilot,input=json.dumps(q),text=True,capture_output=True)
 (out/(label+'-result.json')).write_text(v.stdout);(out/(label+'-stderr.log')).write_text(v.stderr);d=json.loads(v.stdout);assert v.returncode==0,d;return d
completed=[]
for sequence in range(10):
 read={'operation':'READ','permission':{'root':str(pilot),'readProject':True,'allowReadLocalGit':True},'requiredFiles':refs}
 r=call(read,f'{sequence+1:02}-read');assert r['state']=='IMPACT_CONTEXT',r;c=r['context'];current=c['currentItem'];nodeId=next(n['id'] for n in graph['nodes'] if n['name']==current['name']);a=dict(next(v for v in rows if v['nodeId']==nodeId));assert nodeId not in completed
 a.update(inputBasis=r['inputBasis'],assumptions='Single local Intel pilot, fixed source and fake data. Scoped T04 change only; performance, independent recovery, full-product G2, release and R09 Human acceptance remain pending.',evidenceRefs=refs,downstream=[e['to'] for e in graph['edges'] if e['from']==nodeId],resolved=True)
 q=dict(read,operation='ASSESS',expectedBasis=r['basis'],expectedProjectId=c['projectId'],expectedRoundId='ROUND-001',expectedOwnerId=current['id'],expectedGit=c['checkout'],assessment=a)
 q['permission']=dict(read['permission'],allowImpactWrite=True,roundId='ROUND-001',ownerId=current['id'],statement='Human approved T04 rule D and continuous R09 implementation/testing. Record evidence-based impact conclusions only; do not approve output or close the impact.',assumptions={'localFilesystem':True,'noActiveSync':True,'singleKideaRun':True})
 result=call(q,f'{sequence+1:02}-assess');assert result['state']=='IMPACT_RECORDED',result;completed.append(nodeId);print(nodeId,result['state'],flush=True)
(out/'summary.json').write_text(json.dumps({'assessed':completed,'humanOutputApproval':False,'impactClosed':False},indent=2)+'\n')

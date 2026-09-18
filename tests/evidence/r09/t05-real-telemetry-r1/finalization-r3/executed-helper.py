from pathlib import Path
import json,re,hashlib,subprocess,time,os
repo=Path('/Users/kendrick/Desktop/kidea');selected='/Users/kendrick/Desktop/kidea-workshop-pilot';node='/Users/kendrick/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node';helper=repo/'.agents/skills/kidea/scripts/kidea.mjs'
p=Path(subprocess.check_output([node,'-e','process.stdout.write(require("node:fs").realpathSync(process.argv[1]))',selected],text=True));out=repo/'tests/evidence/r09/t05-real-telemetry-r1/finalization-r3';out.mkdir();timings=[]
sha=lambda data:hashlib.sha256(data).hexdigest()
def data(path):return json.loads(re.search(r'```json\n([\s\S]*?)\n```',path.read_text())[1])
def history_hash(v):
 loc=v['location'];body=subprocess.check_output(['git','-C',str(p),'show',loc['commit']+':'+loc['path']])if loc['kind']=='GIT'else(p/loc['ref']['path']).read_bytes();assert sha(body)==v['integrity']['value'];return {'location':loc,'sha256':sha(body),'bytes':len(body)}
def budget():
 a=json.loads((repo/'tests/evidence/r09/full-scope/authorization.json').read_text());sizes={k:int(subprocess.check_output(['du','-sk',k],text=True).split()[0])*1024 for k in a['baselineAllocatedBytes']};used=sum(max(0,v-a['baselineAllocatedBytes'][k])for k,v in sizes.items());s=os.statvfs(repo);free=s.f_bavail*s.f_frsize;assert used+128*1024**2<a['cumulativeNewDiskLimitBytes']and free>=a['minimumFreeBytes'];return{'newBytes':used,'freeBytes':free,'baselineUnchanged':True,'gitReserveBytes':128*1024**2}
def call(action,name,request):
 budget();(out/(name+'-request.json')).write_text(json.dumps(request,indent=2)+'\n');print('public',name,'start',flush=True);started=time.monotonic()
 r=subprocess.run([node,str(helper),action],cwd=p,input=json.dumps(request),text=True,capture_output=True,timeout=14400)
 timing={'name':name,'seconds':time.monotonic()-started,'exit':r.returncode};timings.append(timing);(out/'public-helper-timing.json').write_text(json.dumps({'scope':'Actual bounded public workflow timing; not WQ or performance PASS','timings':timings},indent=2)+'\n')
 (out/(name+'-result.json')).write_text(json.dumps({'exit':r.returncode,'stdout':r.stdout,'stderr':r.stderr},indent=2)+'\n');assert r.returncode==0,(name,r.stderr);v=json.loads(r.stdout);print('public',name,v['state'],timing['seconds'],flush=True);return v
folder='tests/t05/real-telemetry-evidence-r1/'
report={'path':'tests/t05/real-telemetry-checkpoint-r1.md','anchor':None}
evidence=[{'path':folder+n,'anchor':None}for n in ['source.json','checks.json','integration.json','backend-results.json','backend-manifest.json','coverage-preservation.json','facets.md']]
proof=json.loads((p/folder/'checks.json').read_text());assert proof['status']=='PASS';assert proof['backendPresets']==4 and proof['telemetryChecksPerPreset']==167 and proof['nativeFinalTests']==40
source=[{'path':n,'anchor':None}for n in subprocess.check_output(['git','diff','--name-only','aba73cf246f2ccfd8a30d0322048dc0a5934bebb','--','backend','contracts','scripts/t05','docs/t05','web/src','web/tests/unit/operations.test.mjs'],cwd=p,text=True).splitlines()]
refs=[report]+evidence+source
for ref in refs:assert(p/ref['path']).is_file()
review_path=p/'.kidea/reviews/R09-T04-OUTPUT-r1.md';new=data(review_path);assert new['revision']==10 and new['status']=='DRAFT'
prepared=json.loads((repo/'tests/evidence/r09/t05-real-telemetry-r1/review-preparation.json').read_text())
receipt=json.loads((repo/'tests/evidence/r09/t05-real-telemetry-r1/finalization-r2/review-revise-r10-result.json').read_text());assert receipt['exit']==0 and json.loads(receipt['stdout'])['state']=='REVIEW_RECORDED'
pending=p/'.kidea/checkpoints/pending';assert not pending.exists()or not list(pending.iterdir())
assert len(new['historyRefs'])==1;prior=new['historyRefs'][0];prior_hash=history_hash(prior);assert prior_hash['sha256']==prepared['digestAtRead'];loc=prior['location'];prior_bytes=subprocess.check_output(['git','-C',str(p),'show',loc['commit']+':'+loc['path']])if loc['kind']=='GIT'else(p/loc['ref']['path']).read_bytes();old=json.loads(re.search(r'```json\n([\s\S]*?)\n```',prior_bytes.decode())[1]);assert old['revision']==9 and old['status']=='DRAFT'and new['ownerIds']==old['ownerIds'];history_before=[history_hash(v)for v in old['historyRefs']]
base='48d4fc3d2c0fee9c5441744a3ae448a98aa39b91';work_before=json.loads(re.search(r'```json\n([\s\S]*?)\n```',subprocess.check_output(['git','-C',str(p),'show',base+':.kidea/work.md']).decode())[1]);assert data(p/'.kidea/work.md')==work_before
reviews_before={}
for name in subprocess.check_output(['git','-C',str(p),'ls-tree','-r','--name-only',base,'--','.kidea/reviews'],text=True).splitlines():
 body=subprocess.check_output(['git','-C',str(p),'show',base+':'+name]);reviews_before[name]=sha(body)
 if name!=str(review_path.relative_to(p)):assert sha((p/name).read_bytes())==sha(body),name
current=[]
for v in old['subjectVersions']+old['inputVersions']:
 l=v['location'];body=subprocess.check_output(['git','-C',str(p),'show',l['commit']+':'+l['path']])if l['kind']=='GIT'else(p/l['ref']['path']).read_bytes();assert sha(body)==v['integrity']['value'];current.append(v)
changed=[v['path']for v in prepared['changedSources']]
read={'operation':'READ','permission':{'root':str(p),'readProject':True,'allowReadLocalGit':True},'requiredFiles':refs};r=call('resume','resume-read-final',read);assert r['state']=='WAITING';c=r['context'];assert c['currentItem']['id']=='W-009-ADMIN-OPS';reviews_presave={str(f.relative_to(p)):sha(f.read_bytes())for f in(p/'.kidea/reviews').rglob('*.md')}
request={**read,'operation':'SAVE','expectedBasis':r['basis'],'expectedProjectId':c['projectId'],'expectedGit':c['checkout'],'permission':{**read['permission'],'allowSaveContinuation':True,'assumptions':{'localFilesystem':True,'noActiveSync':True,'singleKideaRun':True},'statement':'Human full R09 execution plus current continue authorize saving the verified partial real telemetry/primary W5 milestone. Change only current work nextAction/checkpointRef and generated bounded checkpoint evidence; preserve all owners/statuses/gates/blockers/return stack/review/history. No Human acceptance, task completion, oncall, PROD or deployment.'},'checkpoint':{'itemId':'W-009-ADMIN-OPS','completed':proof['completed'],'remaining':proof['remaining'],'nextAction':proof['nextAction'],'sourceRefs':refs}}
r=call('resume','resume-save-final',request);assert r['state']=='CONTINUATION_SAVED';after=data(p/'.kidea/work.md');assert set(after)==set(work_before);fields=[k for k in work_before if after[k]!=work_before[k]];assert set(fields)=={'nextAction','checkpointRef'};assert {str(f.relative_to(p)):sha(f.read_bytes())for f in(p/'.kidea/reviews').rglob('*.md')}==reviews_presave
assert history_hash(data(review_path)['historyRefs'][0])==prior_hash;assert [history_hash(v)for v in old['historyRefs']]==history_before
(out/'preservation.json').write_text(json.dumps({'status':'PASS','oldFixedVersionsRead':len(current),'semanticSourceChanges':changed,'reviewRevision':10,'reviewStatus':'DRAFT','allOtherReviewsAndHistoryUnchanged':True,'selectedPriorReviewArchivedWithoutChange':True,'previousReviewIntegrity':prior_hash,'oldHistoryRefsRetainedInArchivedPriorReview':True,'oldHistoryVersionHashes':history_before,'changedWorkFields':fields,'allOtherWorkDataUnchanged':True,'currentOwner':'W-009-ADMIN-OPS','executionStatus':'IN_PROGRESS','notHumanAcceptance':True,'reviewOperationReceipt':'../finalization-r2/review-revise-r10-result.json','budget':budget()},indent=2)+'\n');print('public finalization PASS',flush=True)

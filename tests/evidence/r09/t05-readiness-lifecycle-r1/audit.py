from pathlib import Path
import hashlib,json,subprocess,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parent
errors=[]
def require(v,msg):
 if not v: errors.append(msg)
def load(p): return json.loads((root/p).read_text())
def sha(p): return hashlib.sha256((root/p).read_bytes()).hexdigest()
summary=load('summary.json'); results=load('final/results.json'); manifest=load('final/manifest.json')
require(summary['sourceCommit']=='4ee234e2d182ec37e0254df73c6d0bb70c694768','source commit')
require(sha('final/manifest.json')==summary['manifestSha256']=='3c9d85dfcb0b151a7556f7d8572062b90341be5f7a7e64902a8331808a27e338','manifest hash')
require(manifest['sourceCommit']==summary['sourceCommit'] and manifest['revision']=='r09-t05-readiness-build-r1','manifest source')
require(results['state']=='EVIDENCE_READY_WITH_TSAN_LIMITATION_REVIEW_REQUIRED' and len(results['results'])==4 and all(x['code']==0 and x['reason'] is None for x in results['results']),'four preset result')
for preset in ['dev','asan-ubsan','tsan','release']:
 base=Path('final')/preset
 xml=ET.parse(root/base/'ctest.xml').getroot(); require(xml.attrib.get('tests')=='50','ctest count '+preset); require(xml.attrib.get('failures')==('7' if preset=='tsan' else '0'),'ctest failures '+preset)
 require((root/base/'lifecycle.stdout.txt').read_text().strip()=='lifecycle checks: 14' and (root/base/'lifecycle.stderr.txt').stat().st_size==0,'lifecycle '+preset)
 http=load(base/'http/assertions.json'); require(len(http['entries'])==34 and all(x['status']=='PASS' for x in http['entries']) and http['serverExit']==0,'http '+preset)
 require(load(base/'http/server.process.json')['code']==0 and (root/base/'http/server.stderr.txt').stat().st_size==0,'http server '+preset)
 shutdown=load(base/'shutdown/results.json'); require(len(shutdown)==2 and all(x['status']=='PASS' and x['exit']==0 for x in shutdown),'shutdown '+preset)
 session=load(base/'session/results.json'); require(len(session['results'])==8 and all(x['status']=='PASS' for x in session['results']) and session['server']['code']==0,'session '+preset)
 require((root/base/'updates.stdout.txt').read_text().splitlines()[-1]=='checks=77','updates '+preset)
 require((root/base/'telemetry.stdout.txt').read_text().splitlines()[-1]=='checks=174','telemetry '+preset)
 require((root/base/'backup.stdout.txt').read_text().splitlines()[-1]=='checks=20','backup '+preset)
 for name in ['updates.stderr.txt','telemetry.stderr.txt','backup.stderr.txt','http.stderr.txt']:
  require((root/base/name).stat().st_size==0,'nonempty '+str(base/name))
 require(load(base/'compiler-scratch-compaction.json')['status']=='PASS','compaction '+preset)
cases=load('final/tsan/cases-classification.json'); known=[v for v in cases['results'].values() if v['state']=='KNOWN_WAL_REPORT_REVIEW_REQUIRED']
require(cases['assertionCount']==856 and len(known)==7 and sum(v['reports'] for v in known)==14 and all(v['exception']=='EX-T02-WAL-01-r2' for v in known),'tsan exact')
require(load('final/tsan/http-classification.json')=={'state':'CLEAN','reports':0},'tsan http clean')
require(load('final/tsan/controls-classification.json')['state']=='CONTROLS_VERIFIED','tsan controls')
observer=(root/'final/dev/observer-tests.stdout.txt').read_text(); require('ℹ tests 35' in observer and 'ℹ pass 35' in observer and (root/'final/dev/observer-tests.stderr.txt').stat().st_size==0,'observer')
web=(root/'final/web/unit.stdout.txt').read_text(); require('ℹ tests 102' in web and 'ℹ pass 102' in web and (root/'final/web/unit.stderr.txt').stat().st_size==0,'web unit')
require('0 errors and 0 warnings' in (root/'final/web/check.stdout.txt').read_text() and (root/'final/web/check.stderr.txt').stat().st_size==0,'web check')
require((root/'final/web/lint.stderr.txt').stat().st_size==0 and '✔ done' in (root/'final/web/build.stdout.txt').read_text(),'web lint/build')
webhash=load('final/web/source-hashes.json'); require(len(webhash['files'])==48,'web source count')
repo=Path('/Users/kendrick/Desktop/kidea-workshop-pilot')
for p,h in webhash['files'].items(): require((repo/'web'/p).is_file() and hashlib.sha256((repo/'web'/p).read_bytes()).hexdigest()==h,'web source '+p)
failed=load('attempts/frozen-r2-results.json'); failhttp=load('attempts/frozen-r2-asan-http-assertions.json')
require(failed['state']=='FAIL' and failed['results'][-1]['preset']=='asan-ubsan','failed run retained')
require(any(x['status']=='FAIL' for x in failhttp['entries']),'failed assertion retained')
env=load('final/environment.json'); require(env['uid']!=0 and env['architecture']=='x86_64' and env['node'].startswith('v24.') and env['containersAfter']=='','environment')
git=subprocess.run(['git','cat-file','-t',summary['sourceCommit']],cwd=repo,text=True,capture_output=True); require(git.returncode==0 and git.stdout.strip()=='commit','source commit available')
validation={'state':'PASS' if not errors else 'FAIL','checks':{'presets':4,'ctestPerPreset':50,'lifecyclePerPreset':14,'httpPerPreset':34,'tsanKnownCases':len(known),'tsanKnownReports':sum(v['reports'] for v in known),'webSourceFiles':len(webhash['files'])},'errors':errors}
(root/'validation.json').write_text(json.dumps(validation,indent=2)+'\n')
if errors: raise SystemExit('\n'.join(errors))
print(json.dumps(validation,indent=2))

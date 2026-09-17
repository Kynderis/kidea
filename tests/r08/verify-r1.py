"""Finite local evidence checks; not semantic or deployment certification."""
from pathlib import Path
import hashlib,json,re,subprocess,datetime,os,platform
root=Path(__file__).resolve().parents[2];os.chdir(root)
out=root/'tests/evidence/r08/implementation-r1'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def check_map(mapping,base):
    bad=[]
    for name,value in mapping.items():
        p=base/name
        if not p.is_file() or sha(p)!=value:bad.append(name)
    return {'count':len(mapping),'mismatches':bad}
r={ 'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'mechanical checks only; no semantic/AI/lab PASS'}
freeze=json.loads((out/'oracle-freeze.json').read_text());r['oracleUnchanged']=sha('tests/r08/oracle.md')==freeze['oracleSHA256']
paths=['.agents/skills/kidea/SKILL.md','.agents/skills/kidea/references/coding-testing.md','.agents/skills/kidea/references/delivery.md','tests/r08/oracle.md','tests/r08/scenario-review.md','tests/r08/verify-r1.py']
r['source']={p:sha(p) for p in paths}
broken=[]
for name in paths[:3]:
    for target in re.findall(r'\]\(([^)]+)\)',Path(name).read_text()):
        if '://' not in target and not target.startswith('#') and not (Path(name).parent/target.split('#')[0]).exists():broken.append([name,target])
r['brokenLocalLinks']=broken
r['reviewIDs']=re.findall(r'^## (C\d\d) ',Path(paths[4]).read_text(),re.M)
r['r05Evidence']=check_map(json.loads(Path('tests/evidence/r05/web-scope-r1/historical-hashes.json').read_text()),root)
receipt=json.loads(Path('tests/evidence/r07/implementation-r1/receipt.json').read_text())
r['r07Evidence']=check_map(receipt['payload'],root/'tests/evidence/r07/implementation-r1')
baseline=json.loads(Path('tests/evidence/r07/implementation-r1/final-2026-09-17T05-53-02-534Z/summary.json').read_text())
mapping={p:v['value'] for p,v in baseline['source'].items() if p.startswith('.agents/skills/kidea/scripts/') or p.startswith('tests/') or p in ['package.json','package-lock.json']}
r['runtimeAndTestsVsR07']=check_map(mapping,root)
m=json.loads(Path('tests/evidence/r05/web-scope-r1/manifest.json').read_text())
r['pilotDocs']=check_map({p:v['after'] for p,v in m['files'].items()},Path('/Users/kendrick/Desktop/kidea-workshop-pilot'))
r['pilotMetadataExists']=Path('/Users/kendrick/Desktop/kidea-workshop-pilot/.kidea').exists()
r['environment']={'platform':platform.platform(),'machine':platform.machine(),'uid':os.getuid(),'cwd':str(root),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()}
r['pass']=r['oracleUnchanged'] and not broken and r['reviewIDs']==['C%02d'%i for i in range(1,15)] and all(not r[k]['mismatches'] for k in ['r05Evidence','r07Evidence','runtimeAndTestsVsR07','pilotDocs'])
(out/'checks.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps({k:v for k,v in r.items() if k!='source'},indent=2));raise SystemExit(0 if r['pass'] else 1)

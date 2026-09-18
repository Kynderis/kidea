from pathlib import Path
import json,subprocess,hashlib,uuid,shutil,datetime
repo=Path('/Users/kendrick/Desktop/kidea');pilot=Path('/Users/kendrick/Desktop/kidea-workshop-pilot');run=Path('/Users/kendrick/Desktop/kidea-t02-build-lab/t02-be72d72c-9405-4dfa-88d3-ddfe608d5330')
assert json.loads((run/'results.json').read_text())['state']=='EVIDENCE_READY_WITH_TSAN_LIMITATION_REVIEW_REQUIRED'
auth=json.loads((repo/'tests/evidence/r09/full-scope/authorization.json').read_text());used=sum(max(0,int(subprocess.check_output(['du','-sk',p],text=True).split()[0])*1024-b) for p,b in auth['baselineAllocatedBytes'].items());assert used+512*1024**2<=auth['cumulativeNewDiskLimitBytes'];assert shutil.disk_usage(repo).free>=auth['minimumFreeBytes']
name='r09-t04-mutants-'+uuid.uuid4().hex;out=repo/'.test-output'/name;out.mkdir();(out/'mutants').mkdir();(out/'run').mkdir();(out/'run').chmod(0o777)
s=(pilot/'backend/src/store.cpp').read_text();qs='''Statement quota(db_, "SELECT count(*) FROM registrations WHERE actor=? "
                             "AND state='ACTIVE'");''';assert qs in s
mutants={'baseline':s,'no-quota':s.replace('quota.number(0) >= 2','quota.number(0) >= 2000000'),'counts-cancelled':s.replace(qs,qs.replace("AND state='ACTIVE'","AND state IN('ACTIVE','CANCELLED')")),'recount-retry':s.replace('if (prior.status)\n    return prior;','if (prior.status && prior.body["code"] != "LIMIT_REACHED")\n    return prior;',1),'wrong-duplicate':s.replace('finalBody("ALREADY_REGISTERED", "NO_CHANGE")','finalBody("LIMIT_REACHED", "REJECTED")',1)}
for n,v in mutants.items():
 if n!='baseline':assert v!=s
 (out/'mutants'/f'{n}.cpp').write_text(v)
vendor=(pilot/json.loads((pilot/'containers/t02/vendor-lock.json').read_text())['root']).resolve();build=run/'dev/build';script=repo/'tests/r09/t04/mutations-child.mjs';image='sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92'
bound=[Path(__file__).resolve(),script,pilot/'backend/src/store.cpp',pilot/'backend/tests/tests.cpp',build/'dev/compile_commands.json',build/'dev/CMakeFiles/workshop_tests.dir/tests/tests.cpp.o',build/'dev/libworkshop_test_core.a',build/'dev/libworkshop_sqlite.a',build/'dev/vendor/cmark/src/libcmark.a',*list((pilot/'backend/include').rglob('*.hpp')),*list((out/'mutants').glob('*.cpp'))]
lock=json.loads((pilot/'containers/t02/vendor-lock.json').read_text())
for rel,v in lock['files'].items():
 f=vendor/rel;assert hashlib.sha256(f.read_bytes()).hexdigest()==v['sha256'];bound.append(f)
hashes={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in bound}
args=['docker','run','--rm','--pull=never','--name',name,'--network=none','--read-only','--user','1000:1000','--cpus=2','--memory=2g','--memory-swap=2g','--pids-limit=128','--cap-drop=ALL','--security-opt=no-new-privileges','--tmpfs','/tmp:rw,nosuid,size=134217728']
for src,dst,w in [(pilot,'/src',False),(vendor,'/vendor',False),(build,'/build',False),(script.parent,'/plan',False),(out/'mutants','/mutants',False),(out/'run','/out',True)]:args+=['--mount',f'type=bind,src={src},dst={dst}'+('' if w else ',readonly')]
args += [image,'timeout','--kill-after=10','300','node','/plan/mutations-child.mjs']
(out/'manifest.json').write_text(json.dumps({'createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'args':args,'hashes':hashes,'usedBefore':used,'reserveBytes':512*1024**2,'scope':'Intentional negative mutants, not product PASS or replacement runtime'},indent=2)+'\n')
v=subprocess.run(args,capture_output=True,text=True,timeout=330);(out/'stdout.txt').write_text(v.stdout);(out/'stderr.txt').write_text(v.stderr);(out/'process.json').write_text(json.dumps({'exit':v.returncode},indent=2)+'\n')
assert all(hashlib.sha256(Path(p).read_bytes()).hexdigest()==h for p,h in hashes.items())
print(out,flush=True);assert v.returncode==0,v.stderr
print((out/'run/result.json').read_text(),flush=True)

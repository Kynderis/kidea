"""CREATE-only local observer component attempt. No install, cloud, host ports or product writes."""
from pathlib import Path
import json,subprocess,os,time,hashlib,uuid,datetime,threading,traceback,shutil
root=Path(__file__).resolve().parents[3];pilot=root.parent/'kidea-workshop-pilot';plan=Path(__file__).parent
node=Path('/Users/kendrick/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node')
authority=json.loads((root/'tests/evidence/r09/full-scope/authorization.json').read_text())
old=json.loads((root/'tests/evidence/r09/t05-admin-observation-integration-r3/manifest.json').read_text())
runid='r09-observer-'+str(uuid.uuid4());work=root/'.test-output'/runid;work.mkdir()
for name in ['config','state','control','source','observer','browser','logs']:(work/name).mkdir(mode=0o700)
started=time.monotonic();owned=[];network=False;serial=0;error=None;controller=None;closed=threading.Event();control_error=[]
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def budget():
 delta={p:max(0,int(subprocess.check_output(['du','-sk',p],text=True).split()[0])*1024-base)for p,base in authority['baselineAllocatedBytes'].items()}
 st=os.statvfs(root);free=st.f_bavail*st.f_frsize
 assert sum(delta.values())+128*1024**2<authority['cumulativeNewDiskLimitBytes'] and free>=authority['minimumFreeBytes']
 assert time.monotonic()-started<600,'COMPONENT_DEADLINE_10min'
 return {'newBytes':sum(delta.values()),'freeBytes':free,'sameBaseline':True}
def command(args,timeout=60,check=True,log=True):
 global serial
 r=subprocess.run(args,capture_output=True,timeout=timeout)
 if log:
  serial+=1;(work/'logs'/f'{serial:03d}.json').write_text(json.dumps({'command':list(map(str,args)),'exit':r.returncode,'stdout':r.stdout.decode(errors='replace'),'stderr':r.stderr.decode(errors='replace')},indent=2)+'\n')
 if check:assert r.returncode==0,(args,r.stderr.decode())
 return r.stdout.decode().strip()
def write(p,v):
 temp=p.with_name(p.name+'.tmp');temp.write_text(json.dumps(v));temp.chmod(0o600);temp.replace(p)
def create(role,image,args,mounts):
 name=runid+'-'+role
 command(['docker','create','--pull=never','--name',name,'--label','kidea.r09.owner='+runid,'--network',runid,'--network-alias',role+'.test',
 '--user',f'{os.getuid()}:{os.getgid()}','--cpus','1','--memory','2g','--memory-swap','2g','--pids-limit','256','--read-only','--cap-drop','ALL',
 '--security-opt','no-new-privileges','--tmpfs','/tmp:rw,nosuid,size=256m','--shm-size','256m','--log-opt','max-size=4m','--log-opt','max-file=2',
 *sum((['--mount',f'type=bind,src={src},dst={dst}'+(''if rw else ',readonly')]for src,dst,rw in mounts),[]),
 '-e','PATH=/opt/node/bin:/usr/local/bin:/usr/bin:/bin','--entrypoint','timeout',image,'--signal=TERM','--kill-after=35','540',*args])
 owned.append((role,name));command(['docker','start',name]);return name
try:
 assert os.getuid()!=0;before=budget();assert command(['docker','ps','-q'])=='','OTHER_ACTIVE_WORKLOAD'
 for image in [old['image'],old['browserImage']]:assert command(['docker','image','inspect',image,'--format','{{.Id}}'])==image
 openssl=shutil.which('openssl');assert openssl and Path(openssl).is_absolute()
 command([openssl,'req','-x509','-newkey','rsa:2048','-nodes','-days','1','-subj','/CN=observer-component',
 '-addext','subjectAltName=DNS:observer.test,DNS:source.test,DNS:localhost,IP:127.0.0.1',
 '-keyout',str(work/'config/key.pem'),'-out',str(work/'config/cert.pem')])
 (work/'config/key.pem').chmod(0o600)
 now=int(time.time()*1000);profile={'run':{'id':'observer-'+runid[-36:],'operator':'SyntheticFixtureOperator','confirmed':True,'startMs':now,'endMs':now+540000},
 'sources':{g:{'id':g,'clock':{'offsetMs':0,'uncertaintyMs':0,'measuredAtMs':now,'validForMs':540000}}for g in ['fast','slow']},
 'storageTargets':['data','logs','backup','temp'],'topology':{'independentHostVerified':False,'receiverVerified':False}}
 write(work/'config/observer.json',{'model':profile,'stateDirectory':'/state/private','sessionsFile':'/control/sessions.json','keyFile':'/config/key.pem',
 'certFile':'/config/cert.pem','caFile':'/config/cert.pem','port':8443,'bind':'0.0.0.0','targets':{k:{'url':'https://source.test:8444/'+p,'headersFile':'/config/headers.json'}
 for k,p in [('fast','sample/fast'),('slow','sample/slow'),('application','probe/application'),('dashboard','probe/dashboard')]}})
 write(work/'config/headers.json',{'authorization':'Bearer FakeCollectorToken'})
 write(work/'control/sessions.json',[{'token':'A'*48,'role':'admin','expiresAtMs':now+540000},{'token':'P'*48,'role':'participant','expiresAtMs':now+540000}])
 write(work/'control/mode.json',{'pendingCritical':False,'invalidFast':False})
 files={str(p):sha(p)for d in [pilot/'observer',plan]for p in sorted(d.rglob('*'))if p.is_file()and'__pycache__'not in p.parts and'node_modules'not in p.parts}
 manifest={'runId':runid,'createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':files,'images':[old['image'],old['browserImage']],
 'uid':os.getuid(),'gid':os.getgid(),'perContainerCPU':1,'perContainerMemoryBytes':2*1024**3,'publishedHostPorts':[],
 'maxAttemptSeconds':600,'containerDeadlineSeconds':540,'profile':profile,'commands':{'source':['node','/plan/manager.mjs','source'],
 'observer':['node','/plan/manager.mjs','observer'],'browser':['sh','/plan/browser-bootstrap.sh']},'baseline':'tests/evidence/r09/full-scope/authorization.json',
 'scope':'Actual TLS/Chromium, observer durability/owned Node process faults; every M1-M9 source value is synthetic. No backend source modification or write-ready wiring. No independent-host, AI lifetime, Human oncall, real backup, E1 or WQ claim.',
 'clockBasis':'Both source and observer use the same Docker Linux kernel CLOCK_REALTIME; offset0/uncertainty0 is same-clock fixture scope, not cross-host calibration.',
 'budgetBefore':before,'privateEphemeralTLSKeyRetainedIgnored':True,'fakeCredentialsOnly':True,
 'tools':{k:sha(root/'.test-output/r08-delivery-inputs-r1'/k)for k in ['node','certutil']}}
 write(work/'manifest.json',manifest);write(work/'frozen-manifest-sha.json',{'sha256':sha(work/'manifest.json')})
 command(['docker','network','create','--internal','--label','kidea.r09.owner='+runid,runid]);network=True
 tools=root/'.test-output/r08-delivery-inputs-r1'
 common=[(plan,'/plan',False),(pilot/'observer','/observer',False),(work/'config','/config',False),(tools/'node','/opt/node/bin/node',False),(work/'control','/control',False)]
 create('source',old['image'],['node','/plan/manager.mjs','source'],common+[(work/'source','/out',True)])
 for _ in range(100):
  if(work/'source/source-ready.json').exists():break
  time.sleep(.1)
 else:raise Exception('SOURCE_START_TIMEOUT')
 create('observer',old['image'],['node','/plan/manager.mjs','observer'],common+[(work/'observer','/out',True),(work/'state','/state',True)])
 def control_loop():
  last=0;generation={'source':0,'observer':0}
  while not closed.wait(.05):
   f=work/'browser/control-request.json'
   if not f.exists():continue
   try:
    try:q=json.loads(f.read_text())
    except json.JSONDecodeError:continue
    if q['id']<=last:continue
    assert q['id']==last+1 and set(q)=={'id','action','atMs'}
    action=q['action'];changed=int(time.time()*1000)
    if action in ['PENDING_CRITICAL','INVALID_FAST','VALID_FAST']:
     mode=json.loads((work/'control/mode.json').read_text())
     if action=='PENDING_CRITICAL':mode['pendingCritical']=True
     else:mode['invalidFast']=action=='INVALID_FAST'
     write(work/'control/mode.json',mode)
    elif action=='REVOKE_ADMIN':write(work/'control/sessions.json',[])
    else:
     role,op={'STOP_SOURCE':('source','STOP'),'STOP_OBSERVER':('observer','STOP'),
      'RESTART_OBSERVER':('observer','RESTART'),'CRASH_RESTART_OBSERVER':('observer','CRASH_RESTART')}[action]
     target=runid+'-'+role;info=json.loads(command(['docker','inspect',target]))[0];assert info['Config']['Labels']['kidea.r09.owner']==runid
     generation[role]+=1;g=generation[role];write(work/'control'/f'{role}.json',{'generation':g,'action':op})
     for _ in range(150):
      if(work/role/f'control-{g}.json').exists():break
      time.sleep(.1)
     else:raise Exception('MANAGER_CONTROL_TIMEOUT')
    write(work/'browser'/f"control-result-{q['id']}.json",{'id':q['id'],'action':action,'status':'DONE','changedAtMs':changed,'endedAtMs':int(time.time()*1000)})
    last=q['id']
   except Exception:control_error.append(traceback.format_exc());closed.set()
 controller=threading.Thread(target=control_loop);controller.start()
 create('browser',old['browserImage'],['sh','/plan/browser-bootstrap.sh'],[(plan,'/plan',False),(pilot/'web','/web',False),
 (tools/'node','/opt/node/bin/node',False),(tools/'certutil','/usr/local/bin/certutil',False),(work/'config','/config',False),(work/'browser','/out',True)])
 assert command(['docker','wait',runid+'-browser'],timeout=240)=='0','BROWSER_EXIT'
 assert not control_error,control_error
 result=json.loads((work/'browser/result.json').read_text());assert result['status']=='PASS'
 for p,h in files.items():assert sha(p)==h,p
 after=budget();write(work/'budget-final.json',after)
except Exception:error=traceback.format_exc()
finally:
 closed.set()
 if controller:controller.join(timeout=20)
 for role,name in reversed(owned):
  try:
   info=json.loads(command(['docker','inspect',name]))[0];assert info['Config']['Labels']['kidea.r09.owner']==runid
   if info['State']['Running']:command(['docker','stop','--time=35',name])
   (work/'logs'/f'{role}.txt').write_text(command(['docker','logs',name]));write(work/'logs'/f'{role}-state.json',json.loads(command(['docker','inspect',name]))[0])
   command(['docker','rm',name])
  except Exception:error=(error or '')+'\nCLEANUP '+traceback.format_exc()
 if network:
  try:command(['docker','network','rm',runid])
  except Exception:error=(error or '')+'\nNETWORK '+traceback.format_exc()
 write(work/'result.json',{'status':'FAIL'if error else'PASS','runId':runid,'manifestHash':sha(work/'manifest.json')if(work/'manifest.json').exists()else None,
 'elapsedSeconds':time.monotonic()-started,'error':error,'controlErrors':control_error,'noProductAcceptance':True})
 print(str(work),flush=True)
 if error:print(error,flush=True)

if error:
 raise SystemExit(1)

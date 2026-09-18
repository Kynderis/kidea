from pathlib import Path
import subprocess,json,hashlib,uuid
p=Path('/Users/kendrick/Desktop/kidea-workshop-pilot');e=Path('/Users/kendrick/Desktop/kidea/tests/evidence/r09/t04-authoring-r1');e.mkdir(exist_ok=True)
image='sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92'
files=['backend/src/store.cpp','backend/tests/tests.cpp'];manifest={'image':image,'operation':'clang-format-18 through stdin/stdout; no source mount','network':'none','cpu':1,'memoryBytes':1073741824,'perFileSeconds':60,'files':{f:hashlib.sha256((p/f).read_bytes()).hexdigest() for f in files}}
(e/'format-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
for f in files:
 name='r09-t04-format-'+uuid.uuid4().hex;args=['docker','run','--rm','--pull=never','--name',name,'--network=none','--read-only','--user','1000:1000','--cpus=1','--memory=1g','--memory-swap=1g','--pids-limit=64','--cap-drop=ALL','--security-opt=no-new-privileges','-i',image,'timeout','--kill-after=5','50','clang-format-18','--style=LLVM']
 v=subprocess.run(args,input=(p/f).read_bytes(),capture_output=True,timeout=60)
 (e/(Path(f).name+'.format-stderr.log')).write_bytes(v.stderr)
 assert v.returncode==0,(v.returncode,v.stderr)
 (e/(Path(f).name+'.before-format')).write_bytes((p/f).read_bytes());(p/f).write_bytes(v.stdout)
print('Formatted two C++ files with cached compiler image; no installed host tools.')

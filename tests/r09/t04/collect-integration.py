from pathlib import Path
import json,shutil,hashlib,sys
src=Path(sys.argv[1]);dst=Path(sys.argv[2]);assert (src/'result.json').is_file();out=dst/'run';out.mkdir(exist_ok=False)
# Include all raw logs and fake application fixtures; exclude the disposable CA
# private keys and browser execution profile, neither of which is evidence.
for name in ['result.json','logs','app','fixtures']:
 p=src/name
 if p.is_dir():shutil.copytree(p,out/name)
 else:shutil.copyfile(p,out/name)
(out/'browser').mkdir()
for p in (src/'browser').iterdir():
 if p.is_file():shutil.copyfile(p,out/'browser'/p.name)
for p in out.rglob('*'):
 if p.is_file():assert p.suffix not in ['.key','.pem'],p
result=json.loads((out/'result.json').read_text());browser=json.loads((out/'browser/result.json').read_text()) if (out/'browser/result.json').exists() else None
(dst/'collection.json').write_text(json.dumps({'source':str(src.resolve()),'run':result,'browser':browser,'files':[{'path':str(p.relative_to(out)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(out.rglob('*')) if p.is_file()],'excluded':['ephemeral CA private keys','browser profile'],'notProductAcceptance':True},indent=2)+'\n')
print(json.dumps({'run':result,'browser':browser},indent=2))

from pathlib import Path
import sqlite3, shutil, subprocess, json, hashlib
r=Path('/Users/kendrick/Desktop/kidea');e=r/'tests/evidence/r09/t05-real-telemetry-r1';src=e/'integration-r3/run';out=e/'audit-negative-proofs-r1';out.mkdir()
plan=r/'tests/r09/t03-integration';results=[]
for name,mutation,wanted in [
 ('baseline',None,'PASS'),
 ('undeclared-late-denied',"INSERT INTO admin_audit SELECT * FROM admin_audit WHERE 0",'FAIL'),
 ('undeclared-late-write','late','FAIL'),
 ('missing-observation-denial','missing','FAIL'),
 ('undeclared-observation-write','inner','FAIL')]:
 f=out/name;(f/'app').mkdir(parents=True);(f/'browser').mkdir()
 shutil.copyfile(src/'app/workshop.sqlite',f/'app/workshop.sqlite')
 for x in (src/'browser').glob('*.json'):shutil.copyfile(x,f/'browser'/x.name)
 db=sqlite3.connect(f/'app/workshop.sqlite')
 op=json.loads((f/'browser/operations-evidence.json').read_text())['created']['command']['intentId']
 ob=json.loads((f/'browser/admin-observation-evidence.json').read_text())['intents'][0]['command']['intentId']
 a=db.execute('SELECT rowid FROM admin_audit WHERE intent_id=?',(ob,)).fetchone()[0];b=db.execute('SELECT rowid FROM admin_audit WHERE intent_id=?',(op,)).fetchone()[0]
 if name.startswith('undeclared-late'):
  cols=[v[1] for v in db.execute('PRAGMA table_info(admin_audit)')];row=list(db.execute('SELECT * FROM admin_audit WHERE intent_id=?',(op,)).fetchone());row[cols.index('id')]=None;row[cols.index('intent_id')]='UNDECLARED-NEGATIVE-FIXTURE';row[cols.index('action')]='DENIED' if name.endswith('denied')else'CREATE';db.execute('INSERT INTO admin_audit ('+','.join(cols)+') VALUES ('+','.join('?'for _ in cols)+')',row)
 elif mutation=='missing':db.execute("DELETE FROM admin_audit WHERE rowid=(SELECT min(rowid) FROM admin_audit WHERE action='DENIED' AND rowid>? AND rowid<?)",(a,b))
 elif mutation=='inner':db.execute("UPDATE admin_audit SET action='EDIT' WHERE rowid=(SELECT min(rowid) FROM admin_audit WHERE action='DENIED' AND rowid>? AND rowid<?)",(a,b))
 db.commit();db.close();codes=[]
 for script in ['matrix-audit.py','operations-audit.py']:
  q=subprocess.run(['python3',str(plan/script),str(f)],capture_output=True);(f/(script+'.stdout.log')).write_bytes(q.stdout);(f/(script+'.stderr.log')).write_bytes(q.stderr);codes.append(q.returncode)
 got='PASS'if codes==[0,0]else'FAIL';assert got==wanted,(name,codes)
 results.append({'fixture':name,'expected':wanted,'actual':got,'matrixExit':codes[0],'opsExit':codes[1]})
(out/'results.json').write_text(json.dumps({'status':'PASS','scope':'Independent clones of newly-owned synthetic final database; original raw DB unchanged. Full old22/new5 auditors reject untracked later write/denial, missing old denial and untracked old-phase write. No production data or oracle changed.','fixtures':results},indent=2)+'\n')
print('audit negative proofs PASS',flush=True)

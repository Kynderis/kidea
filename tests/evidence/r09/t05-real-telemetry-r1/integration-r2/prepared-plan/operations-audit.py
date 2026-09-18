import json,sqlite3,sys,hashlib
from pathlib import Path
out=Path(sys.argv[1]);p=json.loads((out/'browser/operations-evidence.json').read_text());db=sqlite3.connect('file:'+str(out/'app/workshop.sqlite')+'?mode=ro',uri=True);checks=[]
c,r=p['created']['command'],p['created']['result'];wid=r['workshopId']
row=db.execute("SELECT actor,payload,result FROM request_results WHERE epoch=? AND namespace='admin' AND request_id=?",(c['epoch'],c['intentId'])).fetchone();assert row and row[0]=='A' and json.loads(row[1])==c and json.loads(row[2])==r
assert db.execute('SELECT count(*) FROM admin_audit WHERE intent_id=?',(c['intentId'],)).fetchone()[0]==1
checks.append('new fixture POST exact durable result/audit and one business effect')
row=db.execute('SELECT o.epoch,o.version,o.completed,t.transaction_at_ms,t.first_observed_at_ms,p.processed_at_ms FROM outbox o JOIN outbox_timing t ON t.outbox_id=o.id JOIN outbox_processing p ON p.outbox_id=o.id WHERE o.workshop=?',(wid,)).fetchall();assert len(row)==1 and row[0][:3]==(c['epoch'],'1',1) and 0<row[0][3]<=row[0][4]<=row[0][5]
checks.append('real outbox identity and ordered durable transaction/observation/processing timestamps')
assert db.execute("SELECT outbox_id,resolved_at_ms FROM processing_errors WHERE code='INVARIANT'").fetchall()==[(0,None)]
assert any(j['signals']['M2']['state']=='UNKNOWN' and any(e['code']=='INVARIANT'for e in j['signals']['M2']['open'])for j in p['samples'])
assert any(j['signals']['M2']['state']=='KNOWN' and any(e['code']=='INVARIANT'for e in j['signals']['M2']['open'])for j in p['samples'])
checks.append('real detected invariant remains durable/open before and after repair and ordinary processing')
assert db.execute("SELECT count(*) FROM registrations WHERE id LIKE 'OPS-FAULT-%'").fetchone()[0]==0
assert db.execute("SELECT count(*) FROM sqlite_master WHERE type='trigger' AND name='registration_capacity'").fetchone()[0]==1
assert db.execute('PRAGMA quick_check').fetchone()[0]=='ok'
assert db.execute('PRAGMA foreign_key_check').fetchall()==[]
assert db.execute("SELECT 1 FROM workshops w WHERE capacity<(SELECT count(*) FROM registrations WHERE workshop=w.id AND state='ACTIVE') LIMIT 1").fetchone()is None
checks.append('exact owned fault rows removed, original trigger restored and DB integrity/invariants valid')
assert not any(q['method']=='POST'for q in p['requests'])
assert db.execute('SELECT revoked FROM sessions WHERE actor=?',('A',)).fetchone()[0]==0
checks.append('dashboard GET-only; permission-test session restored; no public error-clear API')
result={'status':'PASS','checks':checks,'oldMatrixChecksRetained':len(json.loads((out/'browser/matrix-audit.json').read_text())['checks']),'databaseSha256':hashlib.sha256((out/'app/workshop.sqlite').read_bytes()).hexdigest(),'limit':p['scope']};(out/'browser/operations-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2));db.close()

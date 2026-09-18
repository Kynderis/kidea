"""Exact synthetic capacity fault on the newly-owned integration database only."""
import sqlite3,sys,json
from pathlib import Path
mode=sys.argv[1]
assert mode in ('OPS_FAULT_INVARIANT','OPS_REPAIR_INVARIANT')
path=Path('/out/workshop.sqlite');db=sqlite3.connect(path,timeout=1)
db.execute('BEGIN IMMEDIATE')
rows=db.execute("SELECT id,capacity FROM workshops WHERE title='OPS telemetry authority fixture'").fetchall()
assert len(rows)==1 and rows[0][1]==10
wid=rows[0][0];trigger_path=Path('/out/ops-fault-trigger.sql')
try:
 if mode=='OPS_FAULT_INVARIANT':
  assert not trigger_path.exists()
  assert db.execute('SELECT count(*) FROM registrations WHERE workshop=?',(wid,)).fetchone()[0]==0
  trigger=db.execute("SELECT sql FROM sqlite_master WHERE type='trigger' AND name='registration_capacity'").fetchone()[0]
  expected=next(s.strip().rstrip(';') for s in Path('/src/backend/schema/001.sql').read_text().splitlines()if s.startswith('CREATE TRIGGER registration_capacity'))
  assert trigger.strip().rstrip(';')==expected
  trigger_path.write_text(trigger)
  db.execute('DROP TRIGGER registration_capacity')
  db.executemany("INSERT INTO registrations(id,actor,workshop,state) VALUES(?,?,?,'ACTIVE')",[(f'OPS-FAULT-{i}',f'OPS-FAULT-{i}',wid)for i in range(11)])
 else:
  assert trigger_path.exists()
  assert db.execute("SELECT count(*) FROM registrations WHERE workshop=? AND id LIKE 'OPS-FAULT-%' AND actor=id",(wid,)).fetchone()[0]==11
  result=db.execute("DELETE FROM registrations WHERE workshop=? AND id LIKE 'OPS-FAULT-%' AND actor=id",(wid,));assert result.rowcount==11
  db.execute(trigger_path.read_text())
 db.commit()
 print(json.dumps({'action':mode,'workshopId':wid,'capacity':10,'active':db.execute("SELECT count(*) FROM registrations WHERE workshop=? AND state='ACTIVE'",(wid,)).fetchone()[0],'syntheticFixtureOnly':True}))
except BaseException:
 db.rollback();raise
finally:db.close()

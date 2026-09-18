from pathlib import Path
import json, sqlite3, sys, traceback, hashlib

out = Path(sys.argv[1])
checks = []
result = {'status': 'FAIL', 'checks': checks, 'notProductAcceptance': True,
          'scope': 'read-only durable SQL audit after owned backend shutdown; no crash/restore claim'}
try:
    evidence = json.loads((out / 'browser/matrix-evidence.json').read_text())
    db_path = out / 'app/workshop.sqlite'
    db = sqlite3.connect(db_path.resolve().as_uri() + '?mode=ro', uri=True)
    db.row_factory = sqlite3.Row
    assert db.execute('PRAGMA quick_check').fetchone()[0] == 'ok'
    checks.append('SQL quick_check')
    ids = set()
    applied = {}
    for item in evidence['intents']:
        command, expected = item['command'], item['result']
        intent = command['intentId']
        assert intent not in ids
        ids.add(intent)
        rows = db.execute('SELECT * FROM admin_audit WHERE intent_id=?', (intent,)).fetchall()
        assert len(rows) == 1, intent
        row = rows[0]
        assert row['actor'] == 'A' and row['epoch'] == command['epoch']
        assert row['action'] == command['action'] and row['result'] == expected['code']
        names, changes = json.loads(row['changed_fields']), json.loads(row['changes'])
        assert row['result_at'] >= row['received_at']
        wid = expected.get('workshopId', '')
        assert row['workshop'] == wid
        remembered = db.execute("SELECT actor,result FROM request_results WHERE epoch=? AND namespace='admin' AND owner='' AND request_id=?", (command['epoch'], intent)).fetchall()
        assert len(remembered) == 1 and remembered[0]['actor'] == 'A'
        assert json.loads(remembered[0]['result']) == expected
        if expected['effect'] == 'APPLIED':
            applied[wid] = applied.get(wid, 0) + 1
            wanted = set(command['fields']) if command['action'] == 'EDIT' else {'state'} if command['action'] == 'STATE' else {'title', 'description', 'capacity', 'schedule', 'state'}
            assert set(names) == wanted and {c['field'] for c in changes} == wanted
            for change in changes:
                if change['field'] in ('title', 'description'):
                    assert set(change) == {'field', 'beforeRevision', 'afterRevision'}
                else:
                    assert set(change) == {'field', 'before', 'after'}
        else:
            assert names == [] and changes == []
    checks.append('one durable result/audit per actual admin intent including GET-only reconciliation')
    checks.append('APPLIED deltas versus NO_CHANGE/REJECTED empty deltas')
    for wid, count in applied.items():
        workshop = db.execute('SELECT version,capacity FROM workshops WHERE id=?', (wid,)).fetchone()
        registrations = db.execute('SELECT state FROM registrations WHERE workshop=?', (wid,)).fetchall()
        assert all(row['state'] == 'ACTIVE' for row in registrations)
        assert len(registrations) <= workshop['capacity']
        expected_version = count + len(registrations)
        assert int(workshop['version']) == expected_version
        versions = sorted(int(row[0]) for row in db.execute('SELECT version FROM outbox WHERE workshop=?', (wid,)))
        assert versions == list(range(1, expected_version + 1)), wid
    checks.append('exact durable version/outbox obligations: changes only, no event for rejected/no-op/read')
    audit = '\n'.join(json.dumps(dict(row), sort_keys=True) for row in db.execute('SELECT * FROM admin_audit'))
    for marker in ['FAKE-LAB-', 'FAKE-CSRF-', 'FAKE-PRIVATE-CONTENT-']:
        assert marker not in audit, marker
    checks.append('audit has no fake session token/CSRF/private body marker')
    assert evidence['race'] is not None and evidence['race']['after']['active'] == 10
    assert evidence['race']['after']['capacity'] == 10
    checks.append('capacity race preserves ten real registrations and capacity invariant')
    reverse = evidence['reverseRace']
    assert reverse and reverse['after']['active'] == reverse['after']['capacity'] == 9
    assert reverse['after']['version'] == reverse['committed']['version']
    assert reverse['registration']['code'] == 'FULL'
    rejected = db.execute("SELECT result FROM request_results WHERE namespace='registration' AND owner='SOCK-13' AND request_id=?", (reverse['command']['requestId'],)).fetchall()
    assert len(rejected) == 1 and json.loads(rejected[0][0]) == reverse['registration']
    checks.append('reverse race: durable FULL and no registration/version/outbox effect')
    assert len(evidence['unreceived']) == 2
    for missing in evidence['unreceived']:
        intent = missing['command']['intentId']
        assert missing['status'] == 202 and missing['result']['finality'] == 'UNKNOWN'
        assert db.execute('SELECT count(*) FROM request_results WHERE request_id=?', (intent,)).fetchone()[0] == 0
        assert db.execute('SELECT count(*) FROM admin_audit WHERE intent_id=?', (intent,)).fetchone()[0] == 0
        wid = missing['command']['workshopId']
        actual = db.execute('SELECT title,version FROM workshops WHERE id=?', (wid,)).fetchone()
        assert actual['title'] == missing['after']['title'] and actual['version'] == missing['after']['version']
    checks.append('unreceived intent absent after repeated GET-only UNKNOWN reconciliation')
    assert {entry['action'] for entry in evidence['doubleClicks']} == {'CREATE', 'EDIT', 'STATE'}
    assert len(evidence['doubleClicks']) == 3 and all(entry['posts'] == 1 for entry in evidence['doubleClicks'])
    checks.append('double pointer click CREATE/EDIT/STATE each has one durable admin audit/result')
    result.update(status='PASS', adminIntents=len(ids), workshops=len(applied),
                  databaseSha256=hashlib.sha256(db_path.read_bytes()).hexdigest())
    db.close()
except Exception:
    result['error'] = traceback.format_exc()
finally:
    (out / 'browser/matrix-audit.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
if result['status'] != 'PASS':
    sys.exit(1)

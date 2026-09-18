from pathlib import Path
import json, sqlite3, sys, traceback, hashlib
sys.dont_write_bytecode = True
from admin_sensitive_audit import audit_sensitive
from admin_observation_audit import audit_observation

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
    assert len(evidence['unreceived']) == 4
    for missing in evidence['unreceived']:
        intent = missing['command']['intentId']
        assert missing['status'] == 202 and missing['result']['state'] == 'UNKNOWN'
        assert db.execute('SELECT count(*) FROM request_results WHERE request_id=?', (intent,)).fetchone()[0] == 0
        assert db.execute('SELECT count(*) FROM admin_audit WHERE intent_id=?', (intent,)).fetchone()[0] == 0
        if missing['command']['action'] == 'CREATE':
            assert db.execute('SELECT count(*) FROM workshops WHERE title=?', (missing['command']['fields']['title'],)).fetchone()[0] == 0
        else:
            wid = missing['command']['workshopId']
            actual = db.execute('SELECT title,version FROM workshops WHERE id=?', (wid,)).fetchone()
            assert actual['title'] == missing['after']['title'] and actual['version'] == missing['after']['version']
    checks.append('unreceived intent absent after repeated GET-only UNKNOWN reconciliation')
    assert {entry['action'] for entry in evidence['doubleClicks']} == {'CREATE', 'EDIT', 'STATE'}
    assert len(evidence['doubleClicks']) == 3 and all(entry['posts'] == 1 for entry in evidence['doubleClicks'])
    checks.append('double pointer click CREATE/EDIT/STATE each has one durable admin audit/result')
    boundary = json.loads((out / 'browser/admin-boundaries-evidence.json').read_text())
    boundary_ids, boundary_applied = set(), {}
    for item in boundary['intents']:
        command, expected, actor = item['command'], item['result'], item['actor']
        intent = command['intentId']
        assert intent not in boundary_ids and intent not in ids
        boundary_ids.add(intent)
        rows = db.execute('SELECT * FROM admin_audit WHERE intent_id=?', (intent,)).fetchall()
        assert len(rows) == 1 and rows[0]['actor'] == actor and rows[0]['epoch'] == command['epoch']
        row = rows[0]
        assert row['action'] == command['action'] and row['result'] == expected['code']
        assert row['workshop'] == expected['workshopId']
        remembered = db.execute("SELECT actor,payload,result FROM request_results WHERE epoch=? AND namespace='admin' AND owner='' AND request_id=?", (command['epoch'], intent)).fetchall()
        assert len(remembered) == 1 and remembered[0]['actor'] == actor
        assert json.loads(remembered[0]['result']) == expected
        assert json.loads(remembered[0]['payload']) == command
        names, changes = json.loads(row['changed_fields']), json.loads(row['changes'])
        wanted = set(command['fields']) if command['action'] == 'EDIT' else {'state'} if command['action'] == 'STATE' else {'title', 'description', 'capacity', 'schedule', 'state'}
        assert expected['effect'] == 'APPLIED'
        assert set(names) == wanted and {c['field'] for c in changes} == wanted
        for change in changes:
            assert set(change) == ({'field', 'beforeRevision', 'afterRevision'} if change['field'] in ('title', 'description') else {'field', 'before', 'after'})
        wid = expected['workshopId']
        boundary_applied[wid] = boundary_applied.get(wid, 0) + 1
    for wid, count in boundary_applied.items():
        w = db.execute('SELECT * FROM workshops WHERE id=?', (wid,)).fetchone()
        active = db.execute("SELECT count(*) FROM registrations WHERE workshop=? AND state='ACTIVE'", (wid,)).fetchone()[0]
        assert active <= w['capacity']
        assert int(w['version']) == count + active
        versions = sorted(int(r[0]) for r in db.execute('SELECT version FROM outbox WHERE workshop=?', (wid,)))
        assert versions == list(range(1, count + active + 1))
    checks.append('boundary A/B intents bind actor/payload/result/field delta and exact versions/outbox')
    publication = boundary['publication']
    assert publication['status'] == 503 and publication['result']['state'] == 'UNKNOWN'
    assert len(publication['lookups']) == 2 and all(r['status'] == 202 and r['result']['state'] == 'UNKNOWN' for r in publication['lookups'])
    assert publication['posts'] == 2 and publication['saved']['state'] == 'DRAFT'
    w = db.execute('SELECT title,state,version FROM workshops WHERE id=?', (publication['id'],)).fetchone()
    assert dict(w) == {k: publication['saved'][k] for k in ('title', 'state', 'version')}
    missing_commands = [publication['failedCommand']] + [item['command'] for item in boundary['absentState']]
    assert len(boundary['absentState']) == 2
    for missing in boundary['absentState']:
        assert missing['status'] == 202 and missing['result']['state'] == 'UNKNOWN' and missing['posts'] == 1
        assert missing['before'] == missing['after'] or all(missing['before'][k] == missing['after'][k] for k in missing['before'] if k != 'observedAt')
        w = db.execute('SELECT state,version FROM workshops WHERE id=?', (missing['command']['workshopId'],)).fetchone()
        assert dict(w) == {k: missing['after'][k] for k in ('state', 'version')}
    for command in missing_commands:
        assert db.execute('SELECT count(*) FROM request_results WHERE request_id=?', (command['intentId'],)).fetchone()[0] == 0
        assert db.execute('SELECT count(*) FROM admin_audit WHERE intent_id=?', (command['intentId'],)).fetchone()[0] == 0
    checks.append('failed publication audit rolls back STATE/result/event, retains prior committed EDIT; absent STATE stays absent')
    packet = boundary['packet']
    assert packet['first'] == packet['replay'] and packet['mismatch']['code'] == 'REQUEST_CONFLICT'
    assert packet['cross'] == {'state': 'ERROR', 'code': 'UNAVAILABLE'} and packet['crossGetStatus'] == 404
    assert db.execute('SELECT count(*) FROM workshops WHERE title=?', ('Mismatched packet title',)).fetchone()[0] == 0
    assert db.execute('SELECT count(*) FROM workshops WHERE title=?', ('Packet exact same intent',)).fetchone()[0] == 1
    ns = boundary['namespaces']
    rows = db.execute('SELECT namespace,owner,actor,result FROM request_results WHERE request_id=?', (ns['literal'],)).fetchall()
    assert {(r['namespace'], r['owner'], r['actor']) for r in rows} == {('registration', 'BOUNDARY-U', 'BOUNDARY-U'), ('registration', 'BOUNDARY-V', 'BOUNDARY-V'), ('admin', '', 'B')}
    expected = {('registration', 'BOUNDARY-U'): ns['ur'], ('registration', 'BOUNDARY-V'): ns['vr'], ('admin', ''): ns['br']}
    assert all(json.loads(r['result']) == expected[(r['namespace'], r['owner'])] for r in rows)
    for actor, reply in [('BOUNDARY-U', ns['ur']), ('BOUNDARY-V', ns['vr'])]:
        row = db.execute('SELECT actor,workshop,state FROM registrations WHERE id=?', (reply['registrationId'],)).fetchone()
        assert dict(row) == {'actor': actor, 'workshop': ns['registration']['workshopId'], 'state': 'ACTIVE'}
    checks.append('same literal ID isolated by registration owner/admin namespace; replay/conflict/other-admin denied without domain effects')
    switch = boundary['actorSwitch']
    assert switch['posts'] == 1 and switch['otherAdminStatus'] == 404
    checks.append('A/B/A browser recovery only GETs original durable A result; marker never becomes B intent')
    assert {r['variant'] for r in boundary['twoForms']} == {'different-fields', 'same-field-A-then-B', 'same-field-B-then-A'}
    for item in boundary['twoForms']:
        assert item['posts'] == [1, 1]
        wanted = dict(item['before'])
        for step in item['steps']:
            wanted.update(step['patch'])
        row = db.execute('SELECT title,description,capacity,state,version FROM workshops WHERE id=?', (item['id'],)).fetchone()
        assert all(row[k] == wanted[k] for k in ('title', 'description', 'capacity', 'state'))
        assert int(row['version']) == int(item['before']['version']) + 2
    checks.append('two forms preserve different dirty fields; same field follows both committed orders')
    result.update(boundaryAdminIntents=len(boundary_ids), boundaryWorkshops=len(boundary_applied))
    result.update(audit_sensitive(db, out, checks))
    result.update(audit_observation(db, out, checks))
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

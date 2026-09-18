import json


def audit_observation(db, out, checks):
    proof = json.loads((out / 'browser/admin-observation-evidence.json').read_text())
    assert len(proof['intents']) == 48 and len(proof['registrations']) == 30
    applied = {}
    for item in proof['intents']:
        c, r = item['command'], item['result']
        rows = db.execute('SELECT * FROM admin_audit WHERE intent_id=?', (c['intentId'],)).fetchall()
        assert len(rows) == 1
        row = rows[0]
        assert row['actor'] == item['actor'] and row['action'] == c['action'] and row['result'] == r['code']
        saved = db.execute("SELECT payload,result,actor FROM request_results WHERE namespace='admin' AND request_id=?", (c['intentId'],)).fetchall()
        assert len(saved) == 1 and saved[0]['actor'] == item['actor']
        assert json.loads(saved[0]['payload']) == c and json.loads(saved[0]['result']) == r
        names, changes = json.loads(row['changed_fields']), json.loads(row['changes'])
        if r['effect'] == 'APPLIED':
            wid = r['workshopId'];applied[wid] = applied.get(wid, 0) + 1
            wanted = set(c['fields']) if c['action'] == 'EDIT' else {'state'} if c['action'] == 'STATE' else {'title','description','capacity','schedule','state'}
            assert set(names) == wanted and {v['field'] for v in changes} == wanted
            for change in changes:
                field = change['field']
                if field in ('capacity','schedule'):
                    assert change['after'] == c['fields'][field]
                if field == 'state':
                    assert change['after'] == ('DRAFT' if c['action'] == 'CREATE' else c['targetState'])
        else:
            assert r['effect'] == 'NO_CHANGE' and r['code'] == 'UNCHANGED' and not names and not changes
    mutations = {}
    for item in proof['registrations']:
        c, r = item['command'], item['result'];cancel = item['path'].endswith('/cancel')
        expected = {**c,'action':'CANCEL' if cancel else 'REGISTER','registrationId':item['path'].split('/')[-2] if cancel else ''}
        rows = db.execute("SELECT payload,result FROM request_results WHERE namespace='registration' AND owner=? AND request_id=?", (item['actor'],c['requestId'])).fetchall()
        assert len(rows) == 1 and json.loads(rows[0]['payload']) == expected and json.loads(rows[0]['result']) == r
        assert r['effect'] == 'APPLIED' and r['code'] == ('CANCELLED' if cancel else 'REGISTERED')
        mutations[c['workshopId']] = mutations.get(c['workshopId'],0) + 1
    for wid, count in applied.items():
        expected = count + mutations.get(wid,0)
        w = db.execute('SELECT * FROM workshops WHERE id=?',(wid,)).fetchone()
        assert int(w['version']) == expected
        assert sorted(int(row[0]) for row in db.execute('SELECT version FROM outbox WHERE workshop=?',(wid,))) == list(range(1,expected+1))
    checks.append('observation exact admin/participant actor, payload, durable result, audit and schedule/capacity/state delta; versions/outbox count every actual change')
    assert len(proof['denied']) == 57
    denied_admin = 0
    for item in proof['denied']:
        c = item['command'];admin = item['path'].endswith('/admin/intents')
        key = c['intentId'] if admin else c['requestId']
        assert not db.execute('SELECT 1 FROM request_results WHERE request_id=?',(key,)).fetchall()
        if admin:
            denied_admin += 1
            rows = db.execute('SELECT * FROM admin_audit WHERE intent_id=?',(key,)).fetchall();assert len(rows) == 1
            row = rows[0];actor = {'owner':'PERM-OWNER','other':'PERM-OTHER'}.get(item['role'],'UNAUTHENTICATED')
            assert row['actor'] == actor and row['action'] == 'DENIED' and row['result'] == 'UNAVAILABLE'
            assert not json.loads(row['changed_fields']) and not json.loads(row['changes'])
    assert denied_admin == 36
    checks.append('36 denied admin packets have only DENIED audit; all57 denied admin/personal packets have no request result or domain/outbox mutation')
    assert {(v['kind'],v['operation']) for v in proof['dialogs']} == {(kind,op) for kind in ['capacity','schedule','state'] for op in ['register','cancel']}
    assert len(proof['faults']) == 9 and all(v['posts'] == 0 for v in proof['faults'])
    for item in proof['dialogs'] + proof['faults'] + proof['permissionFixtures']:
        after = item['after'];wid = item['id'];w = db.execute('SELECT * FROM workshops WHERE id=?',(wid,)).fetchone()
        assert all(w[k] == after[k] for k in ['state','capacity','version'])
        assert w['start'] == after['schedule']['start'] and w['end'] == after['schedule']['end']
        assert db.execute("SELECT count(*) FROM registrations WHERE workshop=? AND state='ACTIVE'",(wid,)).fetchone()[0] == after['active']
        if item in proof['faults'] or item in proof['permissionFixtures']:
            before = item['before'];assert after == {**before,'observedAt':after['observedAt']}
    for item in proof['dialogs']:
        before, changed = item['before'],item['changed'];assert item['posts'] == 1
        assert all(before[k] == changed[k] for k in ['state','capacity','schedule','title','description'])
        assert changed['active'] == before['active'] + (1 if item['operation']=='register' else -1)
        assert int(changed['version']) == int(before['version']) + 1
    checks.append('N-only live source changes invalidate six sensitive dialogs; nine read/session faults send no POST and preserve durable domain state')
    assert {(v['state'],v['role']) for v in proof['permissions']} == {(state,role) for state in ['DRAFT','OPEN','PAUSED'] for role in ['guest','owner','other','admin-only','invalid-cookie']}
    assert len(proof['sockets']) == 52
    assert all(not v['messages'] for v in proof['sockets'] if not v['allowed'])
    assert proof['revocation']['posts'] == 0
    for fixture in proof['permissionFixtures']:
        if fixture['state'] == 'DRAFT':continue
        for registration, state in [('original','CANCELLED'),('active','ACTIVE')]:
            row = db.execute('SELECT actor,state,workshop FROM registrations WHERE id=?',(fixture[registration]['registrationId'],)).fetchone()
            assert row['actor'] == 'PERM-OWNER' and row['state'] == state and row['workshop'] == fixture['id']
    checks.append('15 HTTP/SSR/WSS role-state cells and52 sockets preserve private owners/ACTIVE+CANCELLED history; actual SQL revocation changes no workshop/result/event')
    return {'observationAdminIntents':len(proof['intents']),'observationWorkshops':len(applied),'observationRegistrationRequests':len(proof['registrations']),'deniedAdminPackets':denied_admin,'deniedPersonalPackets':len(proof['denied'])-denied_admin}

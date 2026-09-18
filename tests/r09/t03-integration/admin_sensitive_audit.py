import json


def audit_sensitive(db, out, checks):
    proof = json.loads((out / 'browser/admin-sensitive-evidence.json').read_text())
    assert len(proof['intents']) == 56 and len(proof['registrations']) == 17
    applied, ids = {}, set()
    for item in proof['intents']:
        c, r, actor = item['command'], item['result'], item['actor']
        assert c['intentId'] not in ids
        ids.add(c['intentId'])
        rows = db.execute('SELECT * FROM admin_audit WHERE intent_id=?', (c['intentId'],)).fetchall()
        assert len(rows) == 1
        row = rows[0]
        assert row['actor'] == actor and row['epoch'] == c['epoch'] and row['action'] == c['action']
        assert row['result'] == r['code'] and row['workshop'] == r['workshopId']
        remembered = db.execute("SELECT actor,payload,result FROM request_results WHERE namespace='admin' AND request_id=?", (c['intentId'],)).fetchall()
        assert len(remembered) == 1 and remembered[0]['actor'] == actor
        assert json.loads(remembered[0]['payload']) == c and json.loads(remembered[0]['result']) == r
        names, changes = json.loads(row['changed_fields']), json.loads(row['changes'])
        if r['effect'] == 'APPLIED':
            wid = r['workshopId']
            applied[wid] = applied.get(wid, 0) + 1
            wanted = set(c['fields']) if c['action'] == 'EDIT' else {'state'} if c['action'] == 'STATE' else {'title','description','capacity','schedule','state'}
            assert set(names) == wanted and {v['field'] for v in changes} == wanted
            for v in changes:
                assert set(v) == ({'field','beforeRevision','afterRevision'} if v['field'] in ('title','description') else {'field','before','after'})
                if v['field'] == 'capacity':
                    assert v['after'] == c['fields']['capacity']
                if v['field'] == 'state':
                    assert v['after'] == ('DRAFT' if c['action'] == 'CREATE' else c['targetState'])
        else:
            assert r['code'] == 'UNCHANGED' and r['effect'] == 'NO_CHANGE' and not names and not changes
    checks.append('sensitive admin exact actor/payload/result/audit/delta; duplicate PAUSE is NO_CHANGE without event')
    mutations = {}
    for item in proof['registrations']:
        c, r, actor = item['command'], item['result'], item['actor']
        expected = {**c, 'action':'CANCEL' if item['path'].endswith('/cancel') else 'REGISTER', 'registrationId':item['path'].split('/')[-2] if item['path'].endswith('/cancel') else ''}
        rows = db.execute("SELECT actor,payload,result FROM request_results WHERE namespace='registration' AND owner=? AND request_id=?", (actor,c['requestId'])).fetchall()
        assert len(rows) == 1 and rows[0]['actor'] == actor
        assert json.loads(rows[0]['payload']) == expected and json.loads(rows[0]['result']) == r
        if r['effect'] == 'APPLIED':
            wid = c['workshopId']
            mutations[wid] = mutations.get(wid, 0) + 1
        else:
            assert r['code'] == 'PAUSED' and r['effect'] == 'REJECTED'
    for wid, count in applied.items():
        w = db.execute('SELECT * FROM workshops WHERE id=?', (wid,)).fetchone()
        active = db.execute("SELECT count(*) FROM registrations WHERE workshop=? AND state='ACTIVE'", (wid,)).fetchone()[0]
        assert 0 <= active <= w['capacity']
        expected = count + mutations.get(wid,0)
        assert int(w['version']) == expected
        assert sorted(int(v[0]) for v in db.execute('SELECT version FROM outbox WHERE workshop=?',(wid,))) == list(range(1,expected+1))
    checks.append('sensitive version/outbox count all actual register/cancel and admin changes; NO_CHANGE/PAUSED rejection add no event')
    assert len(proof['forms']) == 7 and len(proof['dialogs']) == 4 and len(proof['pauseRaces']) == 4
    for item in proof['forms'] + proof['dialogs'] + proof['pauseRaces']:
        w = db.execute('SELECT capacity,state,version,start,end FROM workshops WHERE id=?',(item['id'],)).fetchone()
        after = item['after']
        assert all(w[k] == after[k] for k in ['capacity','state','version'])
        assert w['start'] == after['schedule']['start'] and w['end'] == after['schedule']['end']
        assert db.execute("SELECT count(*) FROM registrations WHERE workshop=? AND state='ACTIVE'",(item['id'],)).fetchone()[0] == after['active']
    assert {v['kind'] for v in proof['dialogs']} == {'capacity','schedule','state-capacity','state-state'}
    assert all(v['posts'] == 1 for v in proof['dialogs'])
    checks.append('all sensitive fields match durable SQL; changed live confirmation sources require a fresh single POST')
    assert {(v['operation'],v['order']) for v in proof['pauseRaces']} == {(op,order) for op in ['register','cancel'] for order in ['participant-first','pause-first']}
    for v in proof['pauseRaces']:
        assert v['posts'] == [1,1]
        assert [s['side'] for s in v['steps']] == (['participant','pause'] if v['order']=='participant-first' else ['pause','participant'])
        if v['operation'] == 'cancel':
            row = db.execute('SELECT actor,state FROM registrations WHERE id=?',(v['registration']['registrationId'],)).fetchone()
            assert row['actor'] == v['actor'] and row['state'] == ('CANCELLED' if v['order']=='participant-first' else 'ACTIVE')
        else:
            assert db.execute('SELECT count(*) FROM registrations WHERE actor=? AND workshop=?',(v['actor'],v['id'])).fetchone()[0] == (1 if v['order']=='participant-first' else 0)
    checks.append('both real PAUSE/register and PAUSE/cancel commit orders preserve exact registration IDs and current MVP rule')
    return {'sensitiveAdminIntents':len(ids),'sensitiveWorkshops':len(applied),'sensitiveRegistrationRequests':len(proof['registrations'])}

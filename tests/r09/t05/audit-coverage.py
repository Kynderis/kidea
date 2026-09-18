"""Source-preserving coverage ledger; component PASS never implies system PASS."""
from pathlib import Path
import collections
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET

repo, pilot, integration, destination = (Path(arg).resolve() for arg in sys.argv[1:])
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
original = pilot / 'tests/t02/coverage.json'
rows = json.loads(original.read_text())
assert len(rows) == 137 and len({r['id'] for r in rows}) == 137
browser_path = integration / 'run/browser/result.json'
browser = json.loads(browser_path.read_text())
assert browser['status'] == 'PASS'
assert json.loads((integration / 'run/result.json').read_text())['status'] == 'PASS'
audit_path = integration / 'run/browser/matrix-audit.json'
assert json.loads(audit_path.read_text())['status'] == 'PASS'
checks = {c['name']: c['status'] for c in browser['checks']}
assert set(checks.values()) == {'PASS'}
ctest_path = repo / 'tests/evidence/r09/t05-events-build-r4/run/release/out/release/ctest.xml'
ctests = {c.attrib['name']: c for c in ET.parse(ctest_path).getroot().findall('testcase')}
assert len(ctests) == 50 and not any(c.find('failure') is not None or c.find('error') is not None or c.find('skipped') is not None for c in ctests.values())

# These mappings name executed checks, not unexecuted source-row variants.
mapping = {
 'E07': ['real-commit-lost-response-reload-GET-only'],
 'E08': ['updates-heartbeat-is-not-domain-event-noop-no-fake-snapshot', 'matrix-all-nine-STATE-cells-noop-rejection-version-and-read-only-result', 'updates-real-CANCELLED-not-resurrected-and-seats-reconciled'],
 'E09': ['private-SSR-no-cross-user-data', 'updates-real-public-admin-private-authoritative-version-audience', 'updates-public-DRAFT-no-snapshot'],
 'AD-T01': ['admin-create-real-commit-loss-reload-GET-only-exact-ID', 'admin-invalid-field-preserves-input-without-POST'],
 'AD-T02': [f'matrix-admin-{s}-four-field-UI-patch-schedule-confirm-state-ID-stable' for s in ['DRAFT','OPEN','PAUSED']],
 'AD-T03': ['matrix-all-nine-STATE-cells-noop-rejection-version-and-read-only-result', 'matrix-real-server-four-field-rejections-and-unknown-state-no-version-change'],
 'AD-T04': ['matrix-real-registration-wins-capacity-race-server-field-error-keeps-input-no-auto-retry', 'matrix-real-capacity-wins-race-tenth-registration-FULL-no-version-event'],
 'AD-T05': ['admin-state-separate-confirm-Escape-no-write'] + [f'sensitive-PAUSE-{op}-{order}-real-held-browser-requests-serial-results' for op in ['register','cancel'] for order in ['participant-first','pause-first']],
 'AD-T06': ['admin-changed-observation-invalidates-sensitive-confirmation', 'matrix-admin-OPEN-four-field-UI-patch-schedule-confirm-state-ID-stable'] + [f'sensitive-live-{kind}-change-invalidates-dialog-zero-POST-until-new-confirmation' for kind in ['capacity','schedule','state-capacity','state-state']],
 'AD-T07': ['admin-dirty-only-patch-no-implicit-publish', 'boundary-saved-EDIT-real-STATE-audit-abort-503-UNKNOWN-no-rollback-of-edit-no-replay'],
 'AD-T08': ['admin-create-real-commit-loss-reload-GET-only-exact-ID', 'matrix-EDIT-real-commit-lost-reply-reload-GET-only', 'matrix-STATE-real-commit-lost-reply-reload-GET-only-keeps-saved-content', 'matrix-real-duplicate-titles-distinct-authoritative-IDs', 'matrix-unreceived-POST-real-absent-lookup-UNKNOWN-two-reloads-GET-only-no-replacement', 'matrix-CREATE-unreceived-real-absent-lookup-UNKNOWN-two-reloads-no-title-search-no-POST-replay'] + [f'matrix-double-pointer-click-{action}-one-POST-one-version-durable-result' for action in ['CREATE','EDIT','STATE']] + ['boundary-STATE-unreceived-real-absent-lookup-UNKNOWN-two-reloads-no-POST-replay'],
 'AD-T09': ['admin-draft-never-public-or-anonymous-SSR', 'admin-actor-switch-hides-form-and-denies-old-result', 'updates-real-admin-revocation-hides-form-without-replaying-intent', 'boundary-browser-admin-A-B-A-intent-marker-isolated-GET-only-recovery'],
 'AD-T10': ['matrix-all-nine-STATE-cells-noop-rejection-version-and-read-only-result'],
 'AD-T11': ['matrix-EDIT-real-commit-lost-reply-reload-GET-only'],
 'AD-T12': ['proxy-forgery-and-CSRF-denied'],
 'AD-T13': ['admin-reviewed-rebase-preserves-other-editors-fields', 'admin-changed-observation-invalidates-sensitive-confirmation'] + [f'boundary-two-real-admin-forms-{variant}-dirty-patches-serialize-no-whole-record-overwrite' for variant in ['different-fields','same-field-A-then-B','same-field-B-then-A']],
 'AD-T14': [f'matrix-admin-{s}-four-field-UI-patch-schedule-confirm-state-ID-stable' for s in ['DRAFT','OPEN','PAUSED']] + ['collection-pages-real-content-update-keeps-ID-links-and-private-history'],
 'UX-T01': ['real-JS-off-intro-list-detail-navigation', 'PAUSED-public-SSR-and-participant-controls'],
 'UX-T02': ['collection-pages-real-DRAFT-admin-only-private-empty-subscription', 'me-injected-session-503-hides-then-recovers-same-actor-history-no-POST'],
 'UX-T03': ['real-commit-lost-response-reload-GET-only'],
 'UX-T04': ['cancel-rebook-old-result-immutable'],
 'UX-T05': ['PAUSED-preserves-old-result-and-denies-new-registration', 'baseline-PAUSED-cancel-rejected-before-T09'],
 'UX-T06': ['Escape-no-write-exact-id-cancel'],
 'UX-T07': ['updates-real-app-blackout-local-stale-then-valid-signal-no-mutation-replay', 'admin-same-version-conflict-blocks-writes-until-authoritative-reconcile'],
 'UX-T08': ['private-SSR-no-cross-user-data', 'invalid-session-clears-private-page', 'me-real-session-revocation-clears-private-collection'],
 'UX-T10': ['admin-responsive-360-no-horizontal-overflow', 'collection-pages-360-and-SUBSCRIBE-before-reconcile-GET'],
 'UX-T11': ['collection-pages-real-content-update-keeps-ID-links-and-private-history'],
 'UX-T12': ['public-SSR-JS-off-TLS', 'private-SSR-no-cross-user-data'],
 'UX-T13': ['real-JS-off-intro-list-detail-navigation'],
 'UX-T15': ['admin-invalid-field-preserves-input-without-POST'],
 'AR-T01': ['last-seat-FULL-other-user', 'matrix-real-registration-wins-capacity-race-server-field-error-keeps-input-no-auto-retry'],
 'AR-T02': ['last-seat-FULL-other-user'],
 'AR-T03': ['matrix-real-registration-wins-capacity-race-server-field-error-keeps-input-no-auto-retry', 'matrix-real-capacity-wins-race-tenth-registration-FULL-no-version-event'],
 'AR-T04': ['real-commit-lost-response-reload-GET-only'],
 'AR-T05': ['admin-create-real-commit-loss-reload-GET-only-exact-ID', 'boundary-admin-literal-intent-exact-replay-payload-conflict-other-admin-no-result-leak'],
 'AR-T06': ['admin-create-real-commit-loss-reload-GET-only-exact-ID', 'matrix-CREATE-unreceived-real-absent-lookup-UNKNOWN-two-reloads-no-title-search-no-POST-replay'],
 'AR-T07': ['admin-reviewed-rebase-preserves-other-editors-fields', 'admin-changed-observation-invalidates-sensitive-confirmation'] + [f'boundary-two-real-admin-forms-{variant}-dirty-patches-serialize-no-whole-record-overwrite' for variant in ['different-fields','same-field-A-then-B','same-field-B-then-A']],
 'AR-T08': ['updates-heartbeat-is-not-domain-event-noop-no-fake-snapshot'],
 'AR-T09': ['admin-same-version-conflict-blocks-writes-until-authoritative-reconcile'],
 'AR-T10': ['updates-real-app-blackout-local-stale-then-valid-signal-no-mutation-replay', 'updates-real-known-close-reconnect-SUBSCRIBE-before-GET-no-POST'],
 'AR-T11': ['updates-Origin-CSRF-epoch-role-cookie-URL-denied', 'updates-real-session-revocation-closes-channel-hides-private-history'],
 'AR-T12': ['real-JS-off-intro-list-detail-navigation', 'private-SSR-no-cross-user-data'],
 'AR-T19': ['boundary-registration-literal-ID-U-V-admin-namespaces-isolated-real-HTTP'],
 'AR-T20': ['me-injected-older-GET-cannot-resurrect-live-CANCELLED-no-POST', 'me-real-session-revocation-clears-private-collection'],
 'AR-T22': ['updates-real-global-128-pending-active-limit', 'updates-real-no-ACK-reader-eight-frame-bound-and-close', 'updates-real-writer-durable-result-while-reader-credit-full'],
 'QT05': ['admin-same-version-conflict-blocks-writes-until-authoritative-reconcile'],
 'QT09': ['proxy-forgery-and-CSRF-denied', 'updates-Origin-CSRF-epoch-role-cookie-URL-denied'],
 'QT10': ['admin-draft-never-public-or-anonymous-SSR', 'private-SSR-no-cross-user-data'],
 'QT15': ['real-JS-off-intro-list-detail-navigation', 'PAUSED-public-SSR-and-participant-controls'],
 'QT16': ['admin-responsive-360-no-horizontal-overflow', 'collection-pages-360-and-SUBSCRIBE-before-reconcile-GET'],
}
sensitive_forms = ['sensitive-two-forms-mixed-A-B-confirmed-before-decision-exact-patches'] + [f'sensitive-two-forms-{kind}-{order}-confirmed-before-decision-exact-patches' for kind in ['capacity','schedule','state'] for order in ['A-B','B-A']]
sensitive_dialogs = [f'sensitive-live-{kind}-change-invalidates-dialog-zero-POST-until-new-confirmation' for kind in ['capacity','schedule','state-capacity','state-state']]
sensitive_pauses = [f'sensitive-PAUSE-{op}-{order}-real-held-browser-requests-serial-results' for op in ['register','cancel'] for order in ['participant-first','pause-first']]
mapping['AD-T13'] += sensitive_forms
mapping['AR-T07'] += sensitive_forms + sensitive_dialogs
mapping['AR-T03'] += sensitive_pauses
observation_dialogs = [f'observation-N-only-{kind}-{op}-real-WSS-closes-old-confirmation-fresh-single-POST' for kind in ['capacity','schedule','state'] for op in ['register','cancel']]
observation_faults = [f'observation-{kind}-no-POST-no-stale-comparison-no-domain-change' for kind in ['snapshot-503','snapshot-malformed','snapshot-older','snapshot-conflict','session-503','session-401','session-403','actor-confirm-read','actor-begin-read']]
permission_cells = [f'permission-{state}-{role}-HTTP-SSR-WSS-current-server-authority' for state in ['DRAFT','OPEN','PAUSED'] for role in ['guest','owner','other','admin-only','invalid-cookie']]
permission_guards = ['permission-forged-role-actor-epoch-CSRF-Origin-no-data','permission-real-SQL-admin-revocation-closes-dialog-hides-private-data-zero-POST']
mapping['P01'] = permission_cells + ['PAUSED-public-SSR-and-participant-controls']
for ident in ['P02','P03','P06','AD-T09','E09','QT09','QT10']:
    mapping.setdefault(ident, []).extend(permission_cells + permission_guards)
for ident in ['AD-T06','AD-T13','AR-T07']:
    mapping[ident] += observation_dialogs
for ident in ['AD-T06','AD-T09','AR-T09']:
    mapping[ident] += observation_faults
gaps = {
 'P02':'Current create/edit/state authority and forged roles proved; monitoring not implemented/tested.',
 'P03':'Current own/cross-owner HTTP/SSR/WSS history and denied personal mutations proved; complete invalid-ID and all state/mutation permutations remain.',
 'P06':'Distinct ACTIVE/CANCELLED histories proved over HTTP/SSR/WSS; complete client history/lifecycle variants remain.',
 'E07':'Real commit with lost reply and GET-only lookup proved; complete uncertain durability versus stale-view variants remain.',
 'E08':'Actual mutation snapshots/no-op and new admin SQL event/version audit covered; complete six-action retry/reject event matrix remains.',
 'E09':'Audience and SSR protection covered; full HTTP/SSR/socket/log and monitoring permutations remain.',
 'AD-T01':'Server INVALID_FIELDS has no field detail; complete invalid CREATE UI field matrix remains unproven.',
 'AD-T05':'Both register/cancel and PAUSE orders now executed with real held browser POSTs and durable results; preserve MVP block on new PAUSED cancels until T09.',
 'AD-T06':'Six N-only register/cancel changes and nine controlled read/session faults now executed; complete lifecycle/arrival-point and observation/error permutations remain.',
 'AD-T07':'Actual SQLite audit-aborted publication after committed EDIT now preserves distinct historical confirmation and UNKNOWN; no physical I/O/crash proof inferred.',
 'AD-T08':'Committed and unreceived loss, reload, double pointer clicks cover all three actions; duplicate titles keep exact IDs. Operational/platform cases remain separate.',
 'AD-T09':'Current implemented HTTP/SSR/WSS role/state matrix and real revocation proved; monitoring, deployment/cache and complete lifecycle permutations remain.',
 'AD-T11':'Fault injection is component TX/SQLFAIL; admin process crash pre/post commit and real I/O failures not all proved.',
 'AD-T12':'New durable audit excludes fake token/CSRF/private body markers; full public export/forged actor matrix not proved.',
 'AD-T13':'Adds real capacity/schedule/state forms in both commit orders and mixed-field patches, preserving prior text-field tests; complete arrival-point/observation-error permutations remain.',
 'AD-T14':'All-state field edits/IDs proved; audience and delayed view variants not exhaustively combined with each edit.',
 'AD-T15':'No controlled quota/old recovery-point/epoch restoration exercise; no automatic deletion/replay authorized.',
 'AR-T04':'Component crash covers registrations; admin and outbox emission crash boundaries remain incomplete.',
 'AR-T07':'Real capacity/schedule/state forms cover both commit orders and six N-only dialog changes; complete arrival-point/error permutations remain.',
 'AR-T10':'Executed blackout is greater than 5s, not the specified 30s; no complete backlog/heartbeat-silence matrix.',
 'AR-T13':'Online SQLite backup with concurrent WAL and interrupted verified destination not implemented/tested.',
 'AR-T14':'New-host restore, epoch rotation/revocation and remembered client intents not tested.',
 'AR-T15':'Independent monitoring/observer and persistent incidents not implemented/tested.',
 'AR-T16':'Storage/measurement/backup age warning-stop scenarios not implemented/tested.',
 'AR-T17':'WQ1/WQ2 offered load, clock manifest, end-to-end p95/errors/queue/RSS not measured.',
 'AR-T18':'Old/new client-server compatibility, migration and rollback pairs not executed.',
 'AR-T19':'Q03/I05 component proves actor namespace; same literal requestID via real HTTP/browser still needs explicit proof.',
 'AR-T20':'Old GET after CANCELLED covered; complete rebook, equal-version cross-workshop and epoch switch variants remain.',
 'AR-T21':'Session/shutdown components reused; missing backup/observer readiness and complete postcommit drain scenarios remain.',
 'AR-T22':'Functional socket limits covered; every HTTP/rate/queue bound and approved WQ without omitted samples remains.',
 'UX-T02':'Loading/valid empty/network/permission transitions not fully exercised on each W1/W3 surface.',
 'UX-T09':'Boundary emoji/TZ/past content rendering matrix not executed across all Web surfaces.',
 'UX-T10':'360px evidence is limited; all flows keyboard/focus/1280px/200% not verified on current source.',
 'UX-T11':'Stable ID after edit covered; invalid URL/ID/config origin variants remain.',
 'UX-T14':'Remembered client result older than restored recovery point not exercised.',
 'UX-T15':'Field feedback partial; operations collector loss/nonadmin scope UI missing.',
 'QT01':'WQ1 end-to-end nearest-rank p95, missed offers, timeout/error accounting missing.',
 'QT02':'After-deadline lost reply versus final domain result not tested by approved WQ protocol.',
 'QT03':'WQ2 all repeated concurrency schedules and metrics missing.',
 'QT04':'30s blackout/backlog catch-up within 10s under approved load not measured.',
 'QT06':'Independent telemetry/collector/dashboard loss scenarios missing.',
 'QT07':'Component process crash is not RTO <=5min read/register/monitor recovery exercise.',
 'QT08':'Independent storage loss RPO15/RTO60 restore exercise missing.',
 'QT11':'Backend D01-D09 markup/boundary rejection is component evidence; complete current UI input/render matrix missing.',
 'QT12':'Pilot data/log/backup 2GiB, 80% warning/stop and WQ resource measurements missing; tool budget guard is different.',
 'QT13':'100 local actions p95 <=100ms not measured.',
 'QT14':'30 defined cold starts p95 <=3s not measured.',
 'QT16':'All-flow keyboard/focus and 360/1280px/200% matrix incomplete; no accessibility certification.',
}
component_links = {'AR-T02':['C01','R03'], 'AR-T03':['C02','C03','C04'], 'AR-T04':['CRASH','TX'],
 'AR-T05':['I05','K3K4'], 'AR-T08':['TX','SQLFAIL'], 'AR-T19':['Q03','I05'],
 'AD-T04':['C02'], 'AD-T05':['C03','C04'], 'AD-T11':['TX','SQLFAIL'], 'QT11':[f'D{i:02}' for i in range(1,10)], 'QT07':['CRASH']}
units = repo / 'tests/evidence/r09/t05-admin-observation-authoring-r1/web-r2/checks.json'
web_checks = json.loads(units.read_text())
assert set(web_checks)=={'test:unit','check','lint','build','test:server','content-regression','sensitive-regression','observation-regression'} and all(value==0 for value in web_checks.values()), 'full final Web gates'
matrix = json.loads((integration / 'run/browser/matrix-evidence.json').read_text())
assert matrix['race']['after']['capacity'] == matrix['race']['after']['active'] == 10
assert matrix['reverseRace']['after']['capacity'] == matrix['reverseRace']['after']['active'] == 9
assert matrix['reverseRace']['registration']['code'] == 'FULL'
missing_create = [item for item in matrix['unreceived'] if item['command']['action'] == 'CREATE']
assert len(missing_create) == 2 and all(item['status'] == 202 and item['result']['state'] == 'UNKNOWN' for item in missing_create)
assert {item['action'] for item in matrix['doubleClicks']} == {'CREATE', 'EDIT', 'STATE'}
assert all(item['posts'] == 1 for item in matrix['doubleClicks'])
boundary_path = integration / 'run/browser/admin-boundaries-evidence.json'
boundary = json.loads(boundary_path.read_text())
assert boundary['publication']['status'] == 503 and boundary['publication']['result']['state'] == 'UNKNOWN'
assert boundary['publication']['posts'] == 2
assert boundary['publication']['saved']['title'] == boundary['publication']['after']['title']
assert boundary['publication']['saved']['state'] == boundary['publication']['after']['state'] == 'DRAFT'
assert len(boundary['publication']['lookups']) == 2 and all(r['status'] == 202 and r['result']['state'] == 'UNKNOWN' for r in boundary['publication']['lookups'])
assert len(boundary['absentState']) == 2 and all(r['status'] == 202 and r['result']['state'] == 'UNKNOWN' and r['posts'] == 1 for r in boundary['absentState'])
assert boundary['packet']['first'] == boundary['packet']['replay']
assert boundary['packet']['mismatch']['code'] == 'REQUEST_CONFLICT' and boundary['packet']['crossGetStatus'] == 404
assert boundary['namespaces']['actors'] == ['BOUNDARY-U','BOUNDARY-V']
assert boundary['namespaces']['ur']['registrationId'] != boundary['namespaces']['vr']['registrationId']
assert boundary['namespaces']['regConflict']['code'] == 'REQUEST_CONFLICT'
assert [r['status'] for r in boundary['namespaces']['lookups']] == [200,200,200,404,404,401,404]
assert boundary['actorSwitch']['posts'] == 1 and boundary['actorSwitch']['otherAdminStatus'] == 404
assert {r['variant'] for r in boundary['twoForms']} == {'different-fields','same-field-A-then-B','same-field-B-then-A'}
assert all(r['posts'] == [1,1] for r in boundary['twoForms'])
wire_path = integration / 'run/browser/requests.json'
wire = json.loads(wire_path.read_text())
def browser_posts(workshop):
    return [json.loads(r['body']) for r in wire if r['method'] == 'POST' and r['path'] == '/api/v1/admin/intents' and json.loads(r['body']).get('workshopId') == workshop]
assert len(browser_posts(boundary['publication']['id'])) == 2
assert len(browser_posts(boundary['absentState'][0]['command']['workshopId'])) == 1
assert browser_posts(boundary['actorSwitch']['command']['workshopId']) == [boundary['actorSwitch']['command']]
for item in boundary['twoForms']:
    assert len(browser_posts(item['id'])) == 2
    assert {r['intentId'] for r in browser_posts(item['id'])} == {step['command']['intentId'] for step in item['steps']}
sensitive_path = integration / 'run/browser/admin-sensitive-evidence.json'
sensitive = json.loads(sensitive_path.read_text())
assert len(sensitive['forms']) == 7 and len(sensitive['dialogs']) == 4 and len(sensitive['pauseRaces']) == 4
assert {(v['kind'],v['order']) for v in sensitive['forms']} == {('mixed','A-B')} | {(kind,order) for kind in ['capacity','schedule','state'] for order in ['A-B','B-A']}
assert {v['kind'] for v in sensitive['dialogs']} == {'capacity','schedule','state-capacity','state-state'}
for item in sensitive['forms']:
    assert item['posts'] == [1,1]
    assert len(browser_posts(item['id'])) == 2
    assert {c['intentId'] for c in browser_posts(item['id'])} == {v['command']['intentId'] for v in item['steps']}
for item in sensitive['dialogs']:
    assert item['posts'] == 1 and browser_posts(item['id']) == [item['command']], 'sensitive dialogs wire replay'
assert {(v['operation'],v['order']) for v in sensitive['pauseRaces']} == {(op,order) for op in ['register','cancel'] for order in ['participant-first','pause-first']}
for item in sensitive['pauseRaces']:
    assert item['posts'] == [1,1] and len(browser_posts(item['id'])) == 1
    writes = [json.loads(v['body']) for v in wire if v['method']=='POST' and v['path']==item['path'] and json.loads(v['body']).get('workshopId')==item['id']]
    assert writes == [item['command']], 'sensitive PAUSE wire replay'
    assert [v['side'] for v in item['steps']] == (['participant','pause'] if item['order']=='participant-first' else ['pause','participant'])
    assert item['result']['code'] == ('PAUSED' if item['order']=='pause-first' else 'REGISTERED' if item['operation']=='register' else 'CANCELLED')
    assert item['after']['state']=='PAUSED'
    assert item['after']['active'] == (int(item['order']=='participant-first') if item['operation']=='register' else int(item['order']=='pause-first'))
observation_path = integration / 'run/browser/admin-observation-evidence.json'
observation = json.loads(observation_path.read_text())
assert len(observation['dialogs']) == 6 and {(v['kind'],v['operation']) for v in observation['dialogs']} == {(kind,op) for kind in ['capacity','schedule','state'] for op in ['register','cancel']}, 'observation dialogs'
assert len(observation['faults']) == 9 and {v['kind'] for v in observation['faults']} == {'snapshot-503','snapshot-malformed','snapshot-older','snapshot-conflict','session-503','session-401','session-403','actor-confirm-read','actor-begin-read'}, 'observation faults'
for item in observation['dialogs']:
    assert item['posts'] == 1 and browser_posts(item['id']) == [item['command']], 'observation dialog wire replay'
    assert all(item['before'][k] == item['changed'][k] for k in ['capacity','schedule','state','title','description']), 'N-only source'
    assert item['changed']['active'] == item['before']['active'] + (1 if item['operation']=='register' else -1)
for item in observation['faults']:
    assert item['posts'] == 0 and browser_posts(item['id']) == [], 'observation fault wire replay'
    assert item['after'] == {**item['before'],'observedAt':item['after']['observedAt']}, 'observation fault domain mutation'
assert len(observation['permissions']) == 15 and {(v['state'],v['role']) for v in observation['permissions']} == {(state,role) for state in ['DRAFT','OPEN','PAUSED'] for role in ['guest','owner','other','admin-only','invalid-cookie']}, 'permission cells'
assert len(observation['sockets']) == 52 and sum(v.get('denial')=='visibility' for v in observation['sockets'])==4, 'denied socket frames'
for socket in observation['sockets']:
    if socket['allowed']:continue
    if socket.get('denial')=='visibility':
        assert socket['audience']=='public' and socket['id'] in {v['id'] for v in observation['permissionFixtures'] if v['state']=='DRAFT'} and socket['role'] in ['guest','owner','other','admin-only'] and len(socket['messages'])==1, 'denied socket frames'
        assert set(socket['messages'][0])=={'message','receipt'} and isinstance(socket['messages'][0]['receipt'],str) and socket['messages'][0]['receipt'], 'denied socket frames'
        assert socket['messages'][0]['message']=={'type':'SUBSCRIBED','epoch':'epoch-t02-fixture','audience':'public'}, 'denied socket frames'
    else:assert not socket['messages'], 'denied socket frames'
for item in observation['permissions']:
    assert len(item['cells']) == 10, 'permission HTTP/SSR cells'
    admin = item['role'] == 'admin-only'
    personal = item['role'] in ['owner','other']
    denied = 401 if item['role'] in ['guest','invalid-cookie'] else 404
    for cell in item['cells']:
        route = cell['route']
        expected = (404 if '/intents/' in route else 200) if route.startswith('/admin') and admin else denied if route.startswith('/admin') else (200 if personal else 401 if cell['method']=='SSR_GET' else denied) if route.startswith('/me') else 404 if item['state']=='DRAFT' else 200
        assert cell['status'] == expected, 'permission cell authority'
        if cell['method']=='SSR_GET' and expected!=200:
            assert cell['privateMarkerAbsent'], 'permission SSR leak'
        if route=='/me/registrations' and personal:
            actor = 'PERM-OWNER' if item['role']=='owner' else 'PERM-OTHER'
            assert all(g['actor']==actor for g in cell['body']), 'permission private owner'
            if item['role']=='other':assert cell['body']==[], 'permission cross-owner history'
for n, item in enumerate(observation['permissions']):
    for offset, audience in enumerate(['public','admin','private']):
        socket = observation['sockets'][3*n+offset]
        assert (socket['role'],socket['audience'],socket['id']) == (item['role'],audience,'*' if audience=='private' else item['id']), 'permission socket cells'
        expected = (item['state']!='DRAFT' and item['role']!='invalid-cookie') if audience=='public' else item['role']=='admin-only' if audience=='admin' else item['role'] in ['owner','other']
        assert socket['allowed'] == expected, 'permission socket authority'
        if not expected:
            visibility = audience=='public' and item['state']=='DRAFT' and item['role']!='invalid-cookie'
            assert (socket.get('denial')=='visibility')==visibility, 'permission socket denial class'

assert observation['revocation']['posts'] == 0 and browser_posts(observation['revocation']['id']) == [], 'revocation wire replay'
assert len(json.loads(audit_path.read_text())['checks']) == 22, 'complete SQL audit'
covered_functional = {'P01','AD-T05','AD-T02','AD-T03','AD-T04','AD-T07','AD-T08','AD-T10','AR-T05','AR-T06','AR-T19'}
for row in rows:
    source = pilot / row['source']['path']
    assert sha(source) == row['source']['sha256'], source
    assert row['expected'] in source.read_text(), row['id']
    evidence = []
    names = [row['id']] if row['id'] in ctests else component_links.get(row['id'], [])
    for name in names:
        assert name in ctests
        evidence.append({'kind':'REUSED_RELEASE_COMPONENT','path':str(ctest_path.relative_to(repo)), 'sha256':sha(ctest_path), 'selector':f'testcase[@name="{name}"]', 'status':'PASS', 'limit':'Not a new backend build; previous four-preset policy, including limited old TSan EX r2, retained.'})
    for name in mapping.get(row['id'], []):
        assert checks[name] == 'PASS', name
        evidence.append({'kind':'REAL_HTTPS_WSS_FUNCTIONAL','path':str(browser_path.relative_to(repo)), 'sha256':sha(browser_path), 'selector':name, 'status':'PASS'})
    if row['id'] in {'AD-T07','AD-T08','AD-T09','AD-T13','AR-T05','AR-T07','AR-T19'}:
        evidence.append({'kind':'BROWSER_ALL_REQUESTS','path':str(wire_path.relative_to(repo)), 'sha256':sha(wire_path), 'selector':'all request events including after route removal/reload; no new or replayed POST for bounded workshop IDs', 'status':'PASS'})
        evidence.append({'kind':'REAL_ADMIN_BOUNDARY_DETAILS','path':str(boundary_path.relative_to(repo)), 'sha256':sha(boundary_path), 'selector':'publication/absentState/packet/namespaces/actorSwitch/twoForms as applicable; explicit fake SQLite trigger', 'status':'PASS'})
    if row['id'] in {'P01','P02','P03','P06','AD-T06','AR-T09','AD-T02','AD-T03','AD-T04','AD-T07','AD-T08','AD-T09','AD-T10','AD-T12','AD-T13','AR-T05','AR-T06','AR-T07','AR-T19'}:
        evidence.append({'kind':'DURABLE_SQL_READ_ONLY','path':str(audit_path.relative_to(repo)), 'sha256':sha(audit_path), 'selector':'checks; see bound matrix-evidence.json for exact intents', 'status':'PASS'})
    if row['id'] in {'AD-T05','AD-T06','AD-T13','AR-T03','AR-T07'}:
        evidence.append({'kind':'REAL_SENSITIVE_ADMIN_AND_PAUSE_DETAILS','path':str(sensitive_path.relative_to(repo)), 'sha256':sha(sensitive_path), 'selector':'forms/dialogs/pauseRaces; exact literal requests, held before decision, current PAUSED cancel rule','status':'PASS'})
    if row['id'] in {'P01','P02','P03','P06','AD-T06','AD-T09','AD-T13','AR-T07','AR-T09','E09','QT09','QT10'}:
        evidence.append({'kind':'OBSERVATION_PERMISSION_DETAILS','path':str(observation_path.relative_to(repo)), 'sha256':sha(observation_path), 'selector':'six actual N-only WSS changes; nine explicitly injected HTTP/session read faults; fifteen implemented HTTP/SSR/WSS role-state cells; real SQL revocation as applicable','status':'PASS','limit':'Read fault replies are controlled browser fixtures; not physical restore/epoch, monitoring, deployment/cache or operational proof.'})
    if row['id'] in {'AD-T06','AD-T09','AD-T13','AR-T07','AR-T09'}:
        evidence.append({'kind':'OBSERVATION_BROWSER_ALL_REQUESTS','path':str(wire_path.relative_to(repo)), 'sha256':sha(wire_path), 'selector':'six N-only workshops one fresh command each; nine read/session fault workshops zero POST including after route removal', 'status':'PASS'})
    if re.fullmatch('E0[1-6]',row['id']) or row['id'] == 'QT05':
        evidence.append({'kind':'CURRENT_WEB_UNIT_SUITE','path':str(units.relative_to(repo)), 'sha256':sha(units), 'selector':'93-test suite; inspect web/tests/unit/updates.test.mjs and collections.test.mjs', 'status':'PASS','limit':'Suite support only; not exhaustive live variant coverage.'})
    if row['id'] == 'AR-T21':
        for family in ['session','shutdown']:
            proof = ctest_path.parent / family / 'results.json'
            value = json.loads(proof.read_text())
            items = value['results'] if isinstance(value,dict) else value
            assert all(item['status'] == 'PASS' for item in items)
            evidence.append({'kind':'REUSED_SESSION_SHUTDOWN_COMPONENT','path':str(proof.relative_to(repo)), 'sha256':sha(proof), 'selector':'results: '+str(len(items))+' checks', 'status':'PASS','limit':'Not backup/observer readiness or a measured full recovery/drain exercise.'})
    row['originalRuntime'] = row.pop('runtime')
    row['evidence'] = evidence
    row['runtime'] = 'COVERED_FUNCTIONAL' if row['id'] in covered_functional else 'PARTIAL' if evidence else 'NOT_RUN'
    row['remaining'] = 'No missing clause found within this functional source row; platform/load/operational obligations remain separate.' if row['runtime']=='COVERED_FUNCTIONAL' else gaps.get(row['id'],
      'Independent operations thresholds, failure persistence and observer recovery not implemented/tested.' if row['id'].startswith('OP-') else
      'Component source vectors are executed; complete equivalent current Web/HTTP/WSS variants and explicit source-clause closure still require evidence.' if names else
      'Full source-row semantics/variants have no complete runtime proof; execute this exact obligation without relaxing its expected result.')
result = {'schema':1,'scope':'137 original obligations, source-preserving audit; not pilot acceptance/G2/R09 completion',
 'originalLedger':{'path':'tests/t02/coverage.json','sha256':sha(original),'rows':137,'unchanged':True},
 'summary':dict(collections.Counter(r['runtime'] for r in rows)), 'rows':rows,
 'amendments':[{'id':f'Q{i:02}','runtime':'COMPONENT_PASS_INTEGRATION_PARTIAL','source':{'path':'docs/t04/max2.md','anchor':'verification','sha256':sha(pilot/'docs/t04/max2.md')},'componentSelector':f'ctest testcase Q{i:02}',
 'evidencePath':str(ctest_path.relative_to(repo)), 'evidenceSha256':sha(ctest_path),
 'remaining':'Max2 amendment retained outside original 137; all actor, quota, race and reload variants must remain in final acceptance.'} for i in range(1,5)],
 'platforms':{'MacIntel':'bounded current functional evidence','AppleSilicon':'NOT_RUN','Android/iOS':'Future unscheduled'},
 'next':'Complete missing administration failure/concurrency branches, then operational monitoring, backup/readiness/restore and approved workload measurements.'}
destination.mkdir(parents=True,exist_ok=False)
(destination/'coverage.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
lines=['# T05 coverage audit — 2026-09-18','',result['scope'],'',f"Summary: {result['summary']}. Four Max2 amendment cases retained separately. Original NOT_RUN ledger unchanged; this audit does not promote an entire source row because a component test has its ID.",'','| ID | Assessment | Executed proof selectors | Remaining |','| --- | --- | --- | --- |']
for row in rows:
    names='; '.join(e['selector'] for e in row['evidence']) or 'None'
    lines.append('| '+ ' | '.join(x.replace('|','\\|').replace('\n',' ') for x in [row['id'],row['runtime'],names,row['remaining']])+' |')
lines += ['','Exact expected source text, current source hashes and proof hashes are retained in coverage.json. COVERED_FUNCTIONAL is limited to the named row on the tested stack; it does not certify performance, all platforms, safety acceptance or Human approval.','']
(destination/'coverage.md').write_text('\n'.join(lines))
print(json.dumps(result['summary']))

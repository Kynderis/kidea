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
 'AD-T05': ['admin-state-separate-confirm-Escape-no-write'],
 'AD-T06': ['admin-changed-observation-invalidates-sensitive-confirmation', 'matrix-admin-OPEN-four-field-UI-patch-schedule-confirm-state-ID-stable'],
 'AD-T07': ['admin-dirty-only-patch-no-implicit-publish', 'matrix-STATE-real-commit-lost-reply-reload-GET-only-keeps-saved-content'],
 'AD-T08': ['admin-create-real-commit-loss-reload-GET-only-exact-ID', 'matrix-EDIT-real-commit-lost-reply-reload-GET-only', 'matrix-STATE-real-commit-lost-reply-reload-GET-only-keeps-saved-content', 'matrix-real-duplicate-titles-distinct-authoritative-IDs', 'matrix-unreceived-POST-real-absent-lookup-UNKNOWN-two-reloads-GET-only-no-replacement', 'matrix-CREATE-unreceived-real-absent-lookup-UNKNOWN-two-reloads-no-title-search-no-POST-replay'] + [f'matrix-double-pointer-click-{action}-one-POST-one-version-durable-result' for action in ['CREATE','EDIT','STATE']],
 'AD-T09': ['admin-draft-never-public-or-anonymous-SSR', 'admin-actor-switch-hides-form-and-denies-old-result', 'updates-real-admin-revocation-hides-form-without-replaying-intent'],
 'AD-T10': ['matrix-all-nine-STATE-cells-noop-rejection-version-and-read-only-result'],
 'AD-T11': ['matrix-EDIT-real-commit-lost-reply-reload-GET-only'],
 'AD-T12': ['proxy-forgery-and-CSRF-denied'],
 'AD-T13': ['admin-reviewed-rebase-preserves-other-editors-fields', 'admin-changed-observation-invalidates-sensitive-confirmation'],
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
 'AR-T05': ['admin-create-real-commit-loss-reload-GET-only-exact-ID'],
 'AR-T06': ['admin-create-real-commit-loss-reload-GET-only-exact-ID', 'matrix-CREATE-unreceived-real-absent-lookup-UNKNOWN-two-reloads-no-title-search-no-POST-replay'],
 'AR-T07': ['admin-reviewed-rebase-preserves-other-editors-fields', 'admin-changed-observation-invalidates-sensitive-confirmation'],
 'AR-T08': ['updates-heartbeat-is-not-domain-event-noop-no-fake-snapshot'],
 'AR-T09': ['admin-same-version-conflict-blocks-writes-until-authoritative-reconcile'],
 'AR-T10': ['updates-real-app-blackout-local-stale-then-valid-signal-no-mutation-replay', 'updates-real-known-close-reconnect-SUBSCRIBE-before-GET-no-POST'],
 'AR-T11': ['updates-Origin-CSRF-epoch-role-cookie-URL-denied', 'updates-real-session-revocation-closes-channel-hides-private-history'],
 'AR-T12': ['real-JS-off-intro-list-detail-navigation', 'private-SSR-no-cross-user-data'],
 'AR-T20': ['me-injected-older-GET-cannot-resurrect-live-CANCELLED-no-POST', 'me-real-session-revocation-clears-private-collection'],
 'AR-T22': ['updates-real-global-128-pending-active-limit', 'updates-real-no-ACK-reader-eight-frame-bound-and-close', 'updates-real-writer-durable-result-while-reader-credit-full'],
 'QT05': ['admin-same-version-conflict-blocks-writes-until-authoritative-reconcile'],
 'QT09': ['proxy-forgery-and-CSRF-denied', 'updates-Origin-CSRF-epoch-role-cookie-URL-denied'],
 'QT10': ['admin-draft-never-public-or-anonymous-SSR', 'private-SSR-no-cross-user-data'],
 'QT15': ['real-JS-off-intro-list-detail-navigation', 'PAUSED-public-SSR-and-participant-controls'],
 'QT16': ['admin-responsive-360-no-horizontal-overflow', 'collection-pages-360-and-SUBSCRIBE-before-reconcile-GET'],
}
gaps = {
 'E07':'Real commit with lost reply and GET-only lookup proved; complete uncertain durability versus stale-view variants remain.',
 'E08':'Actual mutation snapshots/no-op and new admin SQL event/version audit covered; complete six-action retry/reject event matrix remains.',
 'E09':'Audience and SSR protection covered; full HTTP/SSR/socket/log and monitoring permutations remain.',
 'AD-T01':'Server INVALID_FIELDS has no field detail; complete invalid CREATE UI field matrix remains unproven.',
 'AD-T05':'Both register/cancel versus PAUSE orders remain component C03/C04; real concurrent browser orders not all executed.',
 'AD-T06':'Full sensitive-dialog variants including PAUSE/capacity and source changes need individual proof.',
 'AD-T07':'Lost publish reply after successful commit does not prove actual failed publish after saved EDIT; that branch is missing.',
 'AD-T08':'Real lost replies/reloads and double pointer clicks cover all three actions; unreceived CREATE/EDIT remain UNKNOWN with no replay. Explicit absent STATE lookup variant remains; no whole A-ERROR matrix certification.',
 'AD-T09':'Complete G/U/admin-only/missing/forged/revoked scope matrix across HTTP/SSR/WSS and caches remains.',
 'AD-T11':'Fault injection is component TX/SQLFAIL; admin process crash pre/post commit and real I/O failures not all proved.',
 'AD-T12':'New durable audit excludes fake token/CSRF/private body markers; full public export/forged actor matrix not proved.',
 'AD-T13':'Two live forms same/different fields and every arrival point need full concurrency proof.',
 'AD-T14':'All-state field edits/IDs proved; audience and delayed view variants not exhaustively combined with each edit.',
 'AD-T15':'No controlled quota/old recovery-point/epoch restoration exercise; no automatic deletion/replay authorized.',
 'AR-T04':'Component crash covers registrations; admin and outbox emission crash boundaries remain incomplete.',
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
units = repo / 'tests/evidence/r09/t05-matrix-authoring-r1/web-r2/checks-final.json'
assert all(value == 0 for value in json.loads(units.read_text()).values())
matrix = json.loads((integration / 'run/browser/matrix-evidence.json').read_text())
assert matrix['race']['after']['capacity'] == matrix['race']['after']['active'] == 10
assert matrix['reverseRace']['after']['capacity'] == matrix['reverseRace']['after']['active'] == 9
assert matrix['reverseRace']['registration']['code'] == 'FULL'
missing_create = [item for item in matrix['unreceived'] if item['command']['action'] == 'CREATE']
assert len(missing_create) == 2 and all(item['status'] == 202 and item['result']['state'] == 'UNKNOWN' for item in missing_create)
assert {item['action'] for item in matrix['doubleClicks']} == {'CREATE', 'EDIT', 'STATE'}
assert all(item['posts'] == 1 for item in matrix['doubleClicks'])
covered_functional = {'AD-T02','AD-T03','AD-T04','AD-T10','AR-T06'}
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
    if row['id'] in {'AD-T02','AD-T03','AD-T04','AD-T08','AD-T10','AD-T12','AR-T06'}:
        evidence.append({'kind':'DURABLE_SQL_READ_ONLY','path':str(audit_path.relative_to(repo)), 'sha256':sha(audit_path), 'selector':'checks; see bound matrix-evidence.json for exact intents', 'status':'PASS'})
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

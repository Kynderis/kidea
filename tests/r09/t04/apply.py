# Scoped authoring after public T04 impact OPEN. Does not touch .kidea metadata.
from pathlib import Path
import json,hashlib
p=Path('/Users/kendrick/Desktop/kidea-workshop-pilot')
work=json.loads((p/'.kidea/work.md').read_text().split('```json\n')[1].split('\n```')[0])
assert (p/'.kidea/plans/impact.md').exists(), 'Public impact must exist before code changes'
plan=(p/'.kidea/plans/impact.md').read_text();assert 'docs/t04/max2.md' in plan
f=p/'backend/src/store.cpp';s=f.read_text();old='''      } else if ((*w)["active"].asInt64() >= (*w)["capacity"].asInt64())
        result.body = finalBody("FULL", "REJECTED");
      else {
        const auto newId = id(db_);'''
new='''      } else {
        Statement quota(db_, "SELECT count(*) FROM registrations WHERE actor=? "
                             "AND state='ACTIVE'");
        quota.bind(1, actor.actor);
        if (!quota.row())
          throw StorageError("QUOTA_READ");
        if (quota.number(0) >= 2)
          result.body = finalBody("LIMIT_REACHED", "REJECTED");
        else if ((*w)["active"].asInt64() >= (*w)["capacity"].asInt64())
          result.body = finalBody("FULL", "REJECTED");
        else {
        const auto newId = id(db_);'''
assert s.count(old)==1;s=s.replace(old,new);tail='''        result.body["registrationId"] = newId;
      }
    }
  }
  result.body["workshopId"] = wid;''';assert s.count(tail)==1;s=s.replace(tail,'''        result.body["registrationId"] = newId;
        }
      }
    }
  }
  result.body["workshopId"] = wid;''');f.write_text(s)
f=p/'backend/tests/tests.cpp';s=f.read_text();assert 'void quota()' not in s;s=s.replace('void registration() {',Path(__file__).with_name('quota-tests.cpp.fragment').read_text()+'\nvoid registration() {');s=s.replace('    else if (selected.starts_with("R"))','    else if (selected.starts_with("Q"))\n      quota();\n    else if (selected.starts_with("R"))');f.write_text(s)
f=p/'backend/tests/cases.cmake';s=f.read_text();s=s.replace(' K3K4 ADMISSION)',' K3K4 ADMISSION Q01 Q02 Q03 Q04)');f.write_text(s)
f=p/'contracts/openapi.json';s=f.read_text();assert s.count('"FULL",')==1;f.write_text(s.replace('"FULL",','"FULL",\n              "LIMIT_REACHED",'))
f=p/'web/src/lib/reply.ts';s=f.read_text();s=s.replace("FULL:'REJECTED'","FULL:'REJECTED',LIMIT_REACHED:'REJECTED'").replace("'ALREADY_REGISTERED','FULL'","'ALREADY_REGISTERED','FULL','LIMIT_REACHED'").replace("['PAUSED','FULL']","['PAUSED','FULL','LIMIT_REACHED']").replace("FULL:'Không còn chỗ tại thời điểm xử lý.'","FULL:'Không còn chỗ tại thời điểm xử lý.',LIMIT_REACHED:'Tại thời điểm xử lý, bạn đã đạt hạn mức hai đăng ký đang hiệu lực.'");f.write_text(s)
f=p/'web/tests/unit/state.test.mjs';s=f.read_text();s+='''\ntest('quota rejection is historical REGISTER-only result',()=>{const r={state:'FINAL',code:'LIMIT_REACHED',effect:'REJECTED',workshopId:'W'};assert.equal(decodeReply(r,intent()).code,'LIMIT_REACHED');assert.equal(decodeReply(r,{...intent(),registrationId:'A'}),null);assert.equal(decodeReply({...r,effect:'APPLIED'},intent()),null);const current=new ClientState('U','E');current.merge(h({registrations:[]}),current.context);assert.equal(decodeReply(r,intent()).code,'LIMIT_REACHED');assert.equal(current.history.get('W').registrations.length,0);});\n''';f.write_text(s)
labels={
'Q01':['zero-active-accepts','one-active-accepts','two-active-rejects','quota-reject-no-domain-event','duplicate-before-quota','quota-is-per-actor','quota-before-full','paused-before-quota','cancel-releases-quota','old-rejection-immutable-after-cancel','cancelled-excluded-fresh-intent-accepts','repeat-cancel-no-extra-quota','repeat-cancel-does-not-free-active','repeat-cancel-and-limit-no-event'],
'Q02':['legacy-over-limit-blocks-new','legacy-rows-retained-no-event','legacy-duplicate-keeps-original','legacy-first-cancel-allowed','legacy-at-two-still-blocked','legacy-second-cancel-allowed','legacy-below-two-accepts','legacy-history-not-deleted'],
'Q03':[prefix+suffix for suffix in ['register-first','cancel-first'] for prefix in ['cancel-order-','registration-order-','counts-events-order-','retry-preserves-order-']],
'Q04':[prefix+str(n) for n in range(10) for prefix in ['cross-workshop-one-winner-','cross-workshop-atomic-count-event-','cross-workshop-retry-both-results-']]}
f=p/'tests/t02/tsan/expected.json';old=json.loads(f.read_text());assert len(old['cases'])==46 and len(old['observations'])==796
before=hashlib.sha256(f.read_bytes()).hexdigest();new=json.loads(f.read_text());new['cases']+=list(labels)
for case,variants in labels.items():new['observations'] += [{'caseId':case,'sequence':i,'status':'PASS','variant':v} for i,v in enumerate(variants)]
assert new['observations'][:796]==old['observations'];new['origin']+='; T04 adds60 independently authored quota assertions, all original796 retained unchanged.';f.write_text(json.dumps(new,indent=2)+'\n')
f=p/'scripts/t02/tsan-gate.mjs';s=f.read_text();assert 'tests:46' in s;f.write_text(s.replace('tests:46','tests:expected.cases.length'))
f=p/'tests/t02/tsan/gate.test.mjs';s=f.read_text();s=s.replace("const xml='<testsuite tests=\"46\"", "const xml='<testsuite tests=\"'+expected.cases.length+'\"");f.write_text(s)
(p/'docs/t04/oracle-extension.json').write_text(json.dumps({'originalOracleSHA256':before,'originalCases':46,'originalAssertions':796,'allOriginalEntriesPreserved':True,'additionalCases':4,'additionalAssertions':sum(map(len,labels.values())),'origin':'Independently authored expected labels before executing tests; no expected result inferred from runtime'},indent=2)+'\n')
print('Applied scoped source/test changes; no compile or PASS claimed.')

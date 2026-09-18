# Authoring patch for after the immutable R8 run. Does not apply it.
from pathlib import Path
import difflib,json
root=Path('/Users/kendrick/Desktop/kidea-workshop-pilot')
changes={}
f='backend/include/workshop/model.hpp';old=(root/f).read_text();new=old.replace('  bool admin{};\n};','  bool admin{};\n  std::string csrf;\n};');assert old!=new;changes[f]=(old,new)
f='backend/src/store.cpp';old=(root/f).read_text();new=old.replace('return Identity{q.text(0), q.number(1) == 1, q.number(2) == 1};','return Identity{q.text(0), q.number(1) == 1, q.number(2) == 1, q.text(3)};')
needle='  if (adminRoute && (!actor || !actor->admin))'
insert='''  if (route == "/session") {
    if (!actor)
      return reply(401, "UNAVAILABLE");
    Json body;
    body["actor"] = actor->actor;
    body["epoch"] = meta("epoch");
    body["participant"] = actor->participant;
    body["admin"] = actor->admin;
    body["csrf"] = actor->csrf;
    return {200, body};
  }
'''
assert needle in new;new=new.replace(needle,insert+needle);changes[f]=(old,new)
f='contracts/openapi.json';old=(root/f).read_text();p=json.loads(old);p['paths']['/session']={'get':{'operationId':'get_session','description':'Current authenticated lab session; no-store; cookie token is never returned. No role supplied by client is trusted.','security':[{'session':[]}],'responses':{'200':{'description':'Current actor/epoch/CSRF and server roles','content':{'application/json':{'schema':{'$ref':'#/components/schemas/Session'}}}},'401':{'description':'Missing, expired or revoked session'}}}}
p['components']['schemas']['Session']={'type':'object','properties':{'actor':{'type':'string','minLength':1},'epoch':{'type':'string','minLength':1},'csrf':{'type':'string','minLength':1},'participant':{'type':'boolean'},'admin':{'type':'boolean'}},'required':['actor','epoch','csrf','participant','admin'],'additionalProperties':False};changes[f]=(old,json.dumps(p,ensure_ascii=False,indent=2)+'\n')
out=Path(__file__).with_name('backend-session.patch');out.write_text(''.join(''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+f,tofile='b/'+f)) for f,(old,new) in changes.items()));print(out)

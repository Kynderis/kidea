import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {sleep} from './socket-client.mjs';

export async function checkAdminSensitive({context,base,record,closeExisting}){
 await closeExisting();const a=await context('A'),b=await context('B'),users=[];
 const evidence={intents:[],registrations:[],forms:[],dialogs:[],pauseRaces:[]};let serial=0,actorNumber=0;
 const epoch='epoch-t02-fixture',api='/api/v1/admin/intents';
 const schedule=n=>({start:`2026-11-${String(n).padStart(2,'0')}T09:00:00+07:00`,end:`2026-11-${String(n).padStart(2,'0')}T10:00:00+07:00`});
 async function admin(body,c=a,actor='A'){await sleep(1100);const command={epoch,intentId:'sensitive-'+(++serial),...body},r=await c.request.post(base+api,{headers:{origin:base,'x-csrf-token':'FAKE-CSRF-'+actor},data:command});assert.equal(r.status(),200);const result=await r.json();evidence.intents.push({actor,command,result});return result;}
 async function read(id){const r=await a.request.get(base+'/api/v1/admin/workshops/'+id);assert.equal(r.status(),200);return r.json();}
 async function user(){const actor='SENSITIVE-'+(actorNumber++),c=await context(actor);users.push(c);return {actor,c};}
 async function register(u,id){await sleep(1100);const command={epoch,requestId:'sensitive-register-'+(++serial),workshopId:id},path='/api/v1/registrations',r=await u.c.request.post(base+path,{headers:{origin:base,'x-csrf-token':'FAKE-CSRF-'+u.actor},data:command});assert.equal(r.status(),200);const result=await r.json();assert.equal(result.code,'REGISTERED');evidence.registrations.push({actor:u.actor,path,command,result});return result;}
 async function create(title,occupied=true){const id=(await admin({action:'CREATE',fields:{title,description:'FAKE-PRIVATE-CONTENT-sensitive',capacity:10,schedule:schedule(6)}})).workshopId;assert.equal((await admin({action:'STATE',workshopId:id,targetState:'OPEN'})).code,'UPDATED');const u=await user(),registration=occupied?await register(u,id):null;return {id,u,registration};}
 async function page(c,id){const p=await c.newPage();await p.goto(base+'/admin/workshops/'+id);await p.locator('fieldset:not([disabled])').waitFor();return p;}
 async function fill(p,patch){if(patch.capacity!==undefined)await p.getByLabel('Sức chứa',{exact:true}).fill(String(patch.capacity));if(patch.schedule){await p.getByLabel('Bắt đầu, kèm múi giờ').fill(patch.schedule.start);await p.getByLabel('Kết thúc, kèm múi giờ').fill(patch.schedule.end);}}
 async function begin(p,state=false){await p.getByRole('button',{name:state?'Tạm dừng':'Lưu nội dung',exact:true}).click();await p.getByRole('dialog').waitFor();}
 async function held(p,path){let release,arrive;const gate=new Promise(r=>release=r),arrival=new Promise(r=>arrive=r),commands=[];await p.route('**'+path,async route=>{commands.push(route.request().postDataJSON());arrive();await gate;await route.continue();});const response=p.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===path).then(value=>({value}),error=>({error}));return {p,path,release,arrival,commands,response};}
 async function arrived(h){const outcome=await Promise.race([h.arrival.then(()=>null),h.response]);if(outcome!==null)throw outcome.error??new Error('POST_BEFORE_BARRIER');assert.equal(h.commands.length,1);}
 async function resolve(h){await sleep(1100);h.release();const outcome=await h.response;if(outcome.error)throw outcome.error;assert.equal(outcome.value.status(),200);return outcome.value.json();}
 async function final(h){await h.p.waitForFunction(id=>Object.keys(sessionStorage).filter(k=>k.startsWith('workshop-admin:')).some(k=>{const s=JSON.parse(sessionStorage.getItem(k));return s.command.intentId===id&&s.state==='FINAL';}),h.commands[0].intentId);}
 async function cleanup(heldRequests){for(const h of heldRequests)h.release();await Promise.all(heldRequests.map(h=>h.p.unrouteAll({behavior:'wait'})));}
 try{
  const variants=[['mixed','A-B',{capacity:9},{schedule:schedule(7)}],['capacity','A-B',{capacity:9},{capacity:8}],['capacity','B-A',{capacity:9},{capacity:8}],['schedule','A-B',{schedule:schedule(7)},{schedule:schedule(8)}],['schedule','B-A',{schedule:schedule(7)},{schedule:schedule(8)}],['state','A-B',null,null],['state','B-A',null,null]];
  for(const [kind,order,patchA,patchB]of variants){
   const {id}=await create('Sensitive forms '+kind+' '+order),pa=await page(a,id),pb=await page(b,id),before=await read(id),requests=[];
   try{
    for(const [p,actor,patch]of [[pa,'A',patchA],[pb,'B',patchB]]){if(patch)await fill(p,patch);await begin(p,kind==='state');const text=await p.getByRole('dialog').innerText();assert.match(text,kind==='state'?/Tạm dừng đăng ký và hủy mới/:kind==='schedule'||actor==='B'&&kind==='mixed'?/Giữ các đăng ký hiện có/:/Giảm sức chứa/);const h=await held(p,api);requests.push({...h,actor,patch});await p.getByRole('button',{name:'Xác nhận thay đổi',exact:true}).click();await arrived(h);assert.equal(h.commands[0].action,kind==='state'?'STATE':'EDIT');if(patch)assert.deepEqual(h.commands[0].fields,patch);}
    const ordered=order==='A-B'?requests:[requests[1],requests[0]],steps=[];
    for(const [i,h]of ordered.entries()){const result=await resolve(h);assert.equal(result.code,kind==='state'&&i===1?'UNCHANGED':'UPDATED');evidence.intents.push({actor:h.actor,command:h.commands[0],result});await final(h);steps.push({actor:h.actor,command:h.commands[0],result,after:await read(id)});}
    const after=await read(id),wanted=Object.assign({},before,...ordered.map(h=>h.patch??{state:'PAUSED'}));for(const k of ['title','description','capacity','schedule','state','active'])assert.deepEqual(after[k],wanted[k]);assert.equal(BigInt(after.version),BigInt(before.version)+(kind==='state'?1n:2n));evidence.forms.push({kind,order,id,before,steps,after,posts:requests.map(h=>h.commands.length)});
   }finally{await cleanup(requests);await pa.close();await pb.close();}
   record('sensitive-two-forms-'+kind+'-'+order+'-confirmed-before-decision-exact-patches');
  }
  for(const kind of ['capacity','schedule','state-capacity','state-state']){
   const {id}=await create('Changed confirmation '+kind),p=await page(a,id),before=await read(id),patch=kind==='capacity'?{capacity:8}:kind==='schedule'?{schedule:schedule(7)}:null;let posts=0;p.on('request',r=>{if(r.method()==='POST'&&new URL(r.url()).pathname===api)posts++;});
   try{
    if(patch)await fill(p,patch);await begin(p,!patch);const dialogBefore=await p.getByRole('dialog').innerText();
    const other=kind==='state-state'?{action:'STATE',workshopId:id,targetState:'PAUSED'}:{action:'EDIT',workshopId:id,fields:kind==='schedule'?{schedule:schedule(8)}:{capacity:9}};assert.equal((await admin(other,b,'B')).code,'UPDATED');const changed=await read(id);
    if(patch)await p.getByRole('region',{name:'Dữ liệu mới',exact:true}).waitFor();else if(kind==='state-capacity')await p.waitForFunction(()=>document.querySelector('input[inputmode="numeric"]')?.value==='9');else await p.getByRole('button',{name:'Mở lại',exact:true}).waitFor();
    assert.equal(await p.locator('dialog[open]').count(),0);assert.equal(posts,0);if(patch){assert.equal(await p.getByLabel(kind==='capacity'?'Sức chứa':'Bắt đầu, kèm múi giờ',{exact:true}).inputValue(),kind==='capacity'?'8':patch.schedule.start);await p.getByRole('button',{name:'Đã xem bản mới, giữ các trường tôi sửa',exact:true}).click();}
    await p.getByRole('button',{name:kind==='state-state'?'Mở lại':patch?'Lưu nội dung':'Tạm dừng',exact:true}).click();await p.getByRole('dialog').waitFor();assert.equal(posts,0);const reply=p.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===api);await sleep(1100);await p.getByRole('button',{name:'Xác nhận thay đổi',exact:true}).click();const r=await reply;assert.equal(r.status(),200);const command=r.request().postDataJSON(),result=await r.json();assert.equal(result.code,'UPDATED');assert.equal(posts,1);if(patch)assert.deepEqual(command.fields,patch);evidence.intents.push({actor:'A',command,result});await final({p,commands:[command]});evidence.dialogs.push({kind,id,before,changed,dialogBefore,command,result,after:await read(id),posts});
   }finally{await p.close();}
   record('sensitive-live-'+kind+'-change-invalidates-dialog-zero-POST-until-new-confirmation');
  }
  for(const operation of ['register','cancel'])for(const order of ['participant-first','pause-first']){
   const {id,u,registration}=await create('PAUSE race '+operation+' '+order,operation==='cancel'),pa=await page(a,id),pp=await u.c.newPage(),before=await read(id),requests=[];
   try{
    await pp.goto(base+'/workshops/'+id);await pp.getByRole('button',{name:operation==='register'?'Đăng ký':'Hủy đăng ký',exact:true}).waitFor();await begin(pa,true);assert.match(await pa.getByRole('dialog').innerText(),/Tạm dừng đăng ký và hủy mới/);const ah=await held(pa,api);requests.push(ah);await pa.getByRole('button',{name:'Xác nhận thay đổi',exact:true}).click();await arrived(ah);
    const path=operation==='register'?'/api/v1/registrations':'/api/v1/registrations/'+registration.registrationId+'/cancel',ph=await held(pp,path);requests.push(ph);await pp.getByRole('button',{name:operation==='register'?'Đăng ký':'Hủy đăng ký',exact:true}).click();if(operation==='cancel')await pp.getByRole('button',{name:'Xác nhận hủy',exact:true}).click();await arrived(ph);const ordered=order==='participant-first'?[ph,ah]:[ah,ph],steps=[];let result;
    for(const h of ordered){const actual=await resolve(h);if(h===ah){assert.equal(actual.code,'UPDATED');evidence.intents.push({actor:'A',command:h.commands[0],result:actual});await final(h);}else{result=actual;assert.equal(actual.code,order==='pause-first'?'PAUSED':operation==='register'?'REGISTERED':'CANCELLED');evidence.registrations.push({actor:u.actor,path,command:h.commands[0],result:actual});}steps.push({side:h===ah?'pause':'participant',after:await read(id)});}
    const after=await read(id);assert.equal(after.state,'PAUSED');assert.equal(after.active,operation==='register'?(order==='participant-first'?1:0):(order==='participant-first'?0:1));assert.equal(BigInt(after.version),BigInt(before.version)+(order==='participant-first'?2n:1n));const lookup=await u.c.request.get(base+'/api/v1/requests/'+ph.commands[0].requestId);assert.equal(lookup.status(),200);assert.deepEqual(await lookup.json(),result);await cleanup(requests);await pp.reload();await pp.getByText('Workshop tạm dừng nhận thao tác mới.',{exact:true}).waitFor();for(const name of ['Đăng ký','Kiểm tra và đăng ký','Hủy đăng ký'])assert.equal(await pp.getByRole('button',{name,exact:true}).count(),0);evidence.pauseRaces.push({operation,order,id,actor:u.actor,registration,before,steps,after,command:ph.commands[0],path,result,posts:requests.map(h=>h.commands.length)});
   }finally{await cleanup(requests);await pa.close();await pp.close();}
   record('sensitive-PAUSE-'+operation+'-'+order+'-real-held-browser-requests-serial-results');
  }
 }catch(error){for(const [i,p]of [...a.pages(),...b.pages()].entries())try{writeFileSync('/out/sensitive-failure-'+i+'.html',await p.content());}catch{}throw error;}
 finally{writeFileSync('/out/admin-sensitive-evidence.json',JSON.stringify(evidence,null,2));for(const c of [a,b,...users])await c.close();}
}

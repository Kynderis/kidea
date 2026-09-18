import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {sleep} from './socket-client.mjs';

// Functional coverage of approved AD/AR clauses. This is not a load profile.
// Each request keeps the original HTTP caller budget and success oracle.
export async function checkMatrix({context,base,record,closeExisting}){
 await closeExisting();await sleep(1100);
 const a=await context('A');const participants=new Map();let serial=0;
 const evidence={intents:[],ui:[],responses:[],race:null,scope:'real TLS/backend; only lost replies and the capacity race timing are controlled'};
 a.on('response',r=>{if(new URL(r.url()).pathname.startsWith('/api/'))evidence.responses.push({method:r.request().method(),path:new URL(r.url()).pathname,status:r.status()});});
 const prefix='matrix-';
 const read=async id=>{const r=await a.request.get(base+'/api/v1/admin/workshops/'+id);assert.equal(r.status(),200);return r.json();};
 async function post(body){await sleep(150);const command={epoch:'epoch-t02-fixture',intentId:prefix+(++serial),...body};const r=await a.request.post(base+'/api/v1/admin/intents',{headers:{origin:base,'x-csrf-token':'FAKE-CSRF-A'},data:command});assert.equal(r.status(),200);const result=await r.json();evidence.intents.push({command,result});return result;}
 async function participant(actor){if(!participants.has(actor))participants.set(actor,await context(actor));return participants.get(actor);}
 async function register(actor,id,label){const c=await participant(actor);const r=await c.request.post(base+'/api/v1/registrations',{headers:{origin:base,'x-csrf-token':'FAKE-CSRF-'+actor},data:{epoch:'epoch-t02-fixture',requestId:prefix+label,workshopId:id}});assert.equal(r.status(),200);const result=await r.json();assert.equal(result.code,'REGISTERED');return result;}
 const fields=state=>({title:'Ma trận quản trị '+state,description:'Văn bản giả để kiểm từng trường.',capacity:10,schedule:{start:'2026-11-01T09:00:00+07:00',end:'2026-11-01T10:00:00+07:00'}});
 async function create(state){const r=await post({action:'CREATE',fields:fields(state)});assert.equal(r.code,'CREATED');if(state!=='DRAFT')assert.equal((await post({action:'STATE',workshopId:r.workshopId,targetState:'OPEN'})).code,'UPDATED');return r.workshopId;}
 async function pageFor(id){const p=await a.newPage();await p.goto(base+'/admin/workshops/'+id);await p.getByLabel('Tên',{exact:true}).waitFor();await p.getByText('Đang đối chiếu cập nhật trực tiếp.',{exact:true}).waitFor();return p;}
 const postResponse=p=>p.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/api/v1/admin/intents');
 async function save(p,id,patch,dialogExpected){
  const before=await read(id);let reply;
  if(!dialogExpected)reply=postResponse(p);
  await p.getByRole('button',{name:'Lưu nội dung',exact:true}).click();
  if(dialogExpected){await p.getByRole('dialog').waitFor();reply=postResponse(p);await p.getByRole('button',{name:'Xác nhận thay đổi',exact:true}).click();}
  const response=await reply;assert.equal(response.status(),200);const command=response.request().postDataJSON(),result=await response.json();assert.equal(result.code,'UPDATED');assert.deepEqual(command.fields,patch);evidence.intents.push({command,result});
  try{await p.getByText('Lần đó đã lưu thay đổi.',{exact:true}).waitFor();await p.getByRole('button',{name:'Lưu nội dung',exact:true}).waitFor({state:'visible'});await p.locator('fieldset:not([disabled])').waitFor();}catch(error){writeFileSync('/out/matrix-save-failure.html',await p.content());throw error;}
  const after=await read(id);assert.equal(after.state,before.state);assert.equal(after.id,before.id);assert.equal(BigInt(after.version),BigInt(before.version)+1n);
  for(const key of ['title','description','capacity','schedule'])assert.deepEqual(after[key],key in patch?patch[key]:before[key]);evidence.ui.push({state:before.state,patch,before,after});return after;
 }
 async function loseReply(p,id,action,activate){
  const writes=[];const route=async route=>{const command=route.request().postDataJSON();writes.push(command);assert.equal(command.action,action);const actual=await route.fetch();assert.equal(actual.status(),200);const result=await actual.json();assert.equal(result.code,'UPDATED');evidence.intents.push({command,result,lostReply:true});await route.abort('failed');};
  await p.route('**/api/v1/admin/intents',route);await activate();await p.getByText('Chưa xác nhận kết quả. Không tự gửi lại thao tác; dùng Kiểm tra kết quả.',{exact:true}).waitFor();assert.equal(writes.length,1);const committed=await read(id);
  await p.reload();await p.getByRole('button',{name:'Kiểm tra kết quả',exact:true}).waitFor();assert.equal(writes.length,1);await p.getByRole('button',{name:'Kiểm tra kết quả',exact:true}).click();await p.getByText('Lần đó đã lưu thay đổi.',{exact:true}).waitFor();await p.locator('fieldset:not([disabled])').waitFor();assert.equal(writes.length,1);const after=await read(id);for(const field of ['id','epoch','version','title','description','capacity','schedule','state','active'])assert.deepEqual(after[field],committed[field]);
  await p.unrouteAll({behavior:'wait'});return committed;
 }
 try{
  for(const [index,state]of ['DRAFT','OPEN','PAUSED'].entries()){
   const id=await create(state);
   if(state!=='DRAFT')await register('SOCK-'+index,id,'active-'+state);
   if(state==='PAUSED')assert.equal((await post({action:'STATE',workshopId:id,targetState:'PAUSED'})).code,'UPDATED');
   const p=await pageFor(id);const writes=[];p.on('request',r=>{if(r.method()==='POST')writes.push(r.postDataJSON());});
   await p.getByLabel('Tên',{exact:true}).fill('Tên mới '+state);await save(p,id,{title:'Tên mới '+state},false);
   const marker='FAKE-PRIVATE-CONTENT-'+state;await p.getByLabel('Mô tả văn bản thuần').fill(marker);await save(p,id,{description:marker},false);
   await p.getByLabel('Sức chứa',{exact:true}).fill('11');await save(p,id,{capacity:11},false);
   const schedule={start:'2026-11-02T09:00:00+07:00',end:'2026-11-02T10:00:00+07:00'};await p.getByLabel('Bắt đầu, kèm múi giờ').fill(schedule.start);await p.getByLabel('Kết thúc, kèm múi giờ').fill(schedule.end);
   if(state!=='DRAFT'){
    const count=writes.length;await p.getByRole('button',{name:'Lưu nội dung',exact:true}).click();await p.getByRole('dialog').waitFor();assert.match(await p.getByRole('dialog').innerText(),/Giữ các đăng ký hiện có; không gửi thông báo tự động/);await p.getByRole('button',{name:'Quay lại',exact:true}).click();assert.equal(writes.length,count);
    await p.getByRole('button',{name:'Lưu nội dung',exact:true}).click();await p.getByRole('dialog').waitFor();await p.keyboard.press('Escape');assert.equal(writes.length,count);
   }
   const current=await save(p,id,{schedule},state!=='DRAFT');assert.equal(current.active,state==='DRAFT'?0:1);
   assert.equal(await p.getByRole('button',{name:state==='DRAFT'?'Xuất bản':state==='OPEN'?'Tạm dừng':'Mở lại',exact:true}).count(),1);assert.equal(await p.getByRole('button',{name:'Chuyển về bản nháp',exact:true}).count(),0);
   if(state==='DRAFT'){
    const title=current.title;await loseReply(p,id,'STATE',async()=>{await p.getByRole('button',{name:'Xuất bản',exact:true}).click();await p.getByRole('dialog').waitFor();await p.getByRole('button',{name:'Xác nhận thay đổi',exact:true}).click();});assert.equal((await read(id)).title,title);assert.equal((await read(id)).state,'OPEN');record('matrix-STATE-real-commit-lost-reply-reload-GET-only-keeps-saved-content');
   }
   if(state==='PAUSED'){
    await p.getByLabel('Tên',{exact:true}).fill('Tên sau phản hồi thất lạc');const actual=await loseReply(p,id,'EDIT',async()=>{await p.getByRole('button',{name:'Lưu nội dung',exact:true}).click();});assert.equal(actual.title,'Tên sau phản hồi thất lạc');assert.equal(actual.state,'PAUSED');record('matrix-EDIT-real-commit-lost-reply-reload-GET-only');
   }
   await p.close();record('matrix-admin-'+state+'-four-field-UI-patch-schedule-confirm-state-ID-stable');
  }
  const decisions={DRAFT:{DRAFT:'UNCHANGED',OPEN:'UPDATED',PAUSED:'STATE_REJECTED'},OPEN:{DRAFT:'STATE_REJECTED',OPEN:'UNCHANGED',PAUSED:'UPDATED'},PAUSED:{DRAFT:'STATE_REJECTED',OPEN:'UPDATED',PAUSED:'UNCHANGED'}};
  for(const from of Object.keys(decisions))for(const target of Object.keys(decisions[from])){
   const id=await create(from);if(from==='PAUSED')assert.equal((await post({action:'STATE',workshopId:id,targetState:'PAUSED'})).code,'UPDATED');const before=await read(id);const result=await post({action:'STATE',workshopId:id,targetState:target});assert.equal(result.code,decisions[from][target]);const after=await read(id);assert.equal(after.state,result.code==='UPDATED'?target:from);assert.equal(BigInt(after.version),BigInt(before.version)+(result.code==='UPDATED'?1n:0n));
   for(let n=0;n<2;n++){await sleep(150);const looked=await a.request.get(base+'/api/v1/admin/intents/'+evidence.intents.at(-1).command.intentId);assert.equal(looked.status(),200);assert.deepEqual(await looked.json(),result);}
  }
  record('matrix-all-nine-STATE-cells-noop-rejection-version-and-read-only-result');
  const id=await create('DRAFT');const before=await read(id);
  for(const patch of [{title:''},{description:''},{capacity:0},{schedule:{start:'2026-11-03T10:00:00+07:00',end:'2026-11-03T09:00:00+07:00'}}])assert.equal((await post({action:'EDIT',workshopId:id,fields:patch})).code,'INVALID_FIELDS');
  assert.equal((await post({action:'STATE',workshopId:id,targetState:'ARCHIVED'})).code,'STATE_REJECTED');const after=await read(id);assert.equal(after.version,before.version);assert.equal(after.state,'DRAFT');record('matrix-real-server-four-field-rejections-and-unknown-state-no-version-change');
  // Distinct IDs remain authoritative even for identical titles.
  const twin=await create('DRAFT');assert.notEqual(twin,id);assert.equal((await read(twin)).title,before.title);record('matrix-real-duplicate-titles-distinct-authoritative-IDs');
  // Nine occupied seats; the tenth registration commits after the final
  // confirmation GET, before the single admin POST reaches the backend.
  const raceId=await create('OPEN');for(let n=0;n<9;n++)await register('SOCK-'+n,raceId,'race-'+n);
  const p=await pageFor(raceId);await p.getByLabel('Sức chứa',{exact:true}).fill('9');await p.getByRole('button',{name:'Lưu nội dung',exact:true}).click();await p.getByRole('dialog').waitFor();assert.match(await p.getByRole('dialog').innerText(),/10 → 9; đang có 9 đăng ký/);
  let count=0;await p.route('**/api/v1/admin/intents',async route=>{count++;const command=route.request().postDataJSON();assert.deepEqual(command.fields,{capacity:9});await register('SOCK-9',raceId,'race-last');await route.continue();});const reply=postResponse(p);await p.getByRole('button',{name:'Xác nhận thay đổi',exact:true}).click();const response=await reply;assert.equal(response.status(),200);const result=await response.json();assert.equal(result.code,'BELOW_ACTIVE');evidence.intents.push({command:response.request().postDataJSON(),result});await p.getByText('Lần đó bị từ chối: sức chứa thấp hơn số đăng ký đang hiệu lực.',{exact:false}).first().waitFor();await p.locator('fieldset:not([disabled])').waitFor();assert.equal(await p.getByLabel('Sức chứa',{exact:true}).inputValue(),'9');assert.equal(await p.getByLabel('Sức chứa',{exact:true}).getAttribute('aria-invalid'),'true');const race=await read(raceId);assert.equal(race.capacity,10);assert.equal(race.active,10);assert.equal(count,1);evidence.race={id:raceId,after:race,result};await p.unrouteAll({behavior:'wait'});await p.close();record('matrix-real-registration-wins-capacity-race-server-field-error-keeps-input-no-auto-retry');
 }finally{
  writeFileSync('/out/matrix-evidence.json',JSON.stringify(evidence,null,2));for(const c of participants.values())await c.close();await a.close();
 }
}

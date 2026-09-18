import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {sleep} from './socket-client.mjs';

// Functional coverage of approved AD/AR clauses. This is not a load profile.
// Each request keeps the original HTTP caller budget and success oracle.
export async function checkMatrix({context,base,record,closeExisting}){
 await closeExisting();await sleep(1100);
 const a=await context('A');const participants=new Map();let serial=0;
 const evidence={intents:[],ui:[],responses:[],race:null,reverseRace:null,unreceived:[],doubleClicks:[],scope:'real TLS/backend; reply loss, request hold/drop and capacity race ordering are controlled; domain results are real'};
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
  // This suite checks functional variants, not offered-load throughput. Allow
  // the unchanged HTTP caller bucket to recover between separate UI actions.
  await sleep(1100);
  const before=await read(id);let reply;
  if(!dialogExpected)reply=postResponse(p);
  await p.getByRole('button',{name:'Lưu nội dung',exact:true}).click();
  if(dialogExpected){await p.getByRole('dialog').waitFor();reply=postResponse(p);await p.getByRole('button',{name:'Xác nhận thay đổi',exact:true}).click();}
  const response=await reply;assert.equal(response.status(),200);const command=response.request().postDataJSON(),result=await response.json();assert.equal(result.code,'UPDATED');assert.deepEqual(command.fields,patch);evidence.intents.push({command,result});
  await p.waitForFunction(id=>Object.keys(sessionStorage).filter(k=>k.startsWith('workshop-admin:')).some(k=>{const v=JSON.parse(sessionStorage.getItem(k));return v.command.intentId===id&&v.state==='FINAL';}),command.intentId);
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
  let count=0;await p.route('**/api/v1/admin/intents',async route=>{count++;const command=route.request().postDataJSON();assert.deepEqual(command.fields,{capacity:9});await register('SOCK-9',raceId,'race-last');await route.continue();});const reply=postResponse(p);await p.getByRole('button',{name:'Xác nhận thay đổi',exact:true}).click();const response=await reply;assert.equal(response.status(),200);const result=await response.json();assert.equal(result.code,'BELOW_ACTIVE');evidence.intents.push({command:response.request().postDataJSON(),result});await p.getByText('Lần đó bị từ chối: sức chứa thấp hơn số đăng ký đang hiệu lực.',{exact:false}).first().waitFor();await p.locator('fieldset:not([disabled])').waitFor();assert.equal(await p.getByLabel('Sức chứa',{exact:true}).inputValue(),'9');assert.equal(await p.getByLabel('Sức chứa',{exact:true}).getAttribute('aria-invalid'),'true');const race=await read(raceId);assert.equal(race.capacity,10);assert.equal(race.active,10);assert.equal(count,1);evidence.race={id:raceId,after:race,result};await p.screenshot({path:'/out/matrix-capacity-rejected.png',fullPage:true});await p.unrouteAll({behavior:'wait'});await p.close();record('matrix-real-registration-wins-capacity-race-server-field-error-keeps-input-no-auto-retry');
  // Opposite ordering: hold the tenth participant request until the capacity
  // change commits. Neither side uses mocked domain results or a SQL mutation.
  await sleep(1100);const reverseId=await create('OPEN');
  for(let n=0;n<9;n++)await register('SOCK-'+(n+4),reverseId,'reverse-'+n);
  const rp=await pageFor(reverseId);await rp.getByLabel('Sức chứa',{exact:true}).fill('9');
  await rp.getByRole('button',{name:'Lưu nội dung',exact:true}).click();await rp.getByRole('dialog').waitFor();
  const tenth=await participant('SOCK-13'),tp=await tenth.newPage();await tp.goto(base+'/workshops/'+reverseId);
  await tp.getByRole('button',{name:'Đăng ký',exact:true}).waitFor();
  let releaseTenth,arriveTenth;const held=new Promise(resolve=>releaseTenth=resolve),arrived=new Promise(resolve=>arriveTenth=resolve);let tenthWrites=0;
  await tp.route('**/api/v1/registrations',async route=>{tenthWrites++;arriveTenth();await held;await route.continue();});
  const tenthReply=tp.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/api/v1/registrations');
  await tp.getByRole('button',{name:'Đăng ký',exact:true}).click();await arrived;
  try{
   const adminReply=postResponse(rp);await rp.getByRole('button',{name:'Xác nhận thay đổi',exact:true}).click();
   const r=await adminReply;assert.equal(r.status(),200);const applied=await r.json();assert.equal(applied.code,'UPDATED');evidence.intents.push({command:r.request().postDataJSON(),result:applied});
   await rp.locator('fieldset:not([disabled])').waitFor();const committed=await read(reverseId);assert.equal(committed.capacity,9);assert.equal(committed.active,9);
   releaseTenth();const rejected=await tenthReply;assert.equal(rejected.status(),200);const full=await rejected.json();assert.equal(full.code,'FULL');
   await tp.getByText('Không còn chỗ tại thời điểm xử lý.',{exact:false}).waitFor();assert.equal(tenthWrites,1);
   const final=await read(reverseId);assert.equal(final.capacity,9);assert.equal(final.active,9);assert.equal(final.version,committed.version);
   evidence.reverseRace={id:reverseId,committed,after:final,registration:full,command:rejected.request().postDataJSON()};
  }finally{releaseTenth();await tp.unrouteAll({behavior:'wait'});await tp.close();await rp.close();}
  record('matrix-real-capacity-wins-race-tenth-registration-FULL-no-version-event');
  // Real absent-intent lookup is 202/UNKNOWN, not a fabricated 404. A dropped
  // POST must remain unresolved across reload and repeated GETs, with no replay.
  await sleep(1100);const missingId=await create('DRAFT'),mp=await pageFor(missingId),missingBefore=await read(missingId);let dropped=null,dropCount=0;
  await mp.route('**/api/v1/admin/intents',async route=>{dropCount++;dropped=route.request().postDataJSON();await route.abort('failed');});
  await mp.getByLabel('Tên',{exact:true}).fill('Chưa tới máy chủ');await mp.getByRole('button',{name:'Lưu nội dung',exact:true}).click();
  await mp.getByText('Chưa xác nhận kết quả. Không tự gửi lại thao tác; dùng Kiểm tra kết quả.',{exact:true}).waitFor();assert.equal(dropCount,1);
  for(let n=0;n<2;n++){
   await mp.reload();await mp.getByRole('button',{name:'Kiểm tra kết quả',exact:true}).waitFor();
   const lookup=mp.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/api/v1/admin/intents/'+dropped.intentId);
   await mp.getByRole('button',{name:'Kiểm tra kết quả',exact:true}).click();const absent=await lookup;assert.equal(absent.status(),202);const unknown=await absent.json();assert.equal(unknown.state,'UNKNOWN');
   await mp.getByText('Chưa xác nhận kết quả. Chỉ đọc đối chiếu, không tự gửi lại thao tác.',{exact:true}).waitFor();
   assert.equal(await mp.locator('fieldset[disabled]').count(),1);assert.equal(await mp.getByRole('button',{name:'Xuất bản',exact:true}).isDisabled(),true);
   assert.equal(dropCount,1);const unchanged=await read(missingId);for(const field of ['id','epoch','version','title','description','capacity','schedule','state','active'])assert.deepEqual(unchanged[field],missingBefore[field]);
   evidence.unreceived.push({command:dropped,status:absent.status(),result:unknown,after:missingBefore});
  }
  await mp.unrouteAll({behavior:'wait'});await mp.close();record('matrix-unreceived-POST-real-absent-lookup-UNKNOWN-two-reloads-GET-only-no-replacement');
  // The architecture obligation specifically names CREATE, whose server ID
  // is unknown. Absence cannot be resolved by matching a title or creating anew.
  await sleep(1100);const cp=await a.newPage();await cp.goto(base+'/admin/workshops/new');await cp.locator('fieldset:not([disabled])').waitFor();
  await cp.getByLabel('Tên',{exact:true}).fill('Chưa tới máy chủ CREATE');await cp.getByLabel('Mô tả văn bản thuần').fill('Nội dung giả');await cp.getByLabel('Sức chứa',{exact:true}).fill('10');await cp.getByLabel('Bắt đầu, kèm múi giờ').fill('2026-11-01T09:00:00+07:00');await cp.getByLabel('Kết thúc, kèm múi giờ').fill('2026-11-01T10:00:00+07:00');
  let missingCreate=null,createDrops=0;const createPaths=[];cp.on('request',r=>{if(new URL(r.url()).pathname.startsWith('/api/'))createPaths.push({method:r.method(),path:new URL(r.url()).pathname});});
  await cp.route('**/api/v1/admin/intents',async route=>{createDrops++;missingCreate=route.request().postDataJSON();assert.equal(missingCreate.action,'CREATE');await route.abort('failed');});
  await cp.getByRole('button',{name:'Tạo bản nháp',exact:true}).click();await cp.getByText('Chưa xác nhận kết quả. Không tự gửi lại thao tác; dùng Kiểm tra kết quả.',{exact:true}).waitFor();
  for(let n=0;n<2;n++){
   await cp.reload();await cp.getByRole('button',{name:'Kiểm tra kết quả',exact:true}).waitFor();
   const lookup=cp.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/api/v1/admin/intents/'+missingCreate.intentId);
   await cp.getByRole('button',{name:'Kiểm tra kết quả',exact:true}).click();const absent=await lookup;assert.equal(absent.status(),202);const unknown=await absent.json();assert.equal(unknown.state,'UNKNOWN');
   await cp.getByText('Chưa xác nhận kết quả. Chỉ đọc đối chiếu, không tự gửi lại thao tác.',{exact:true}).waitFor();assert.equal(await cp.locator('fieldset[disabled]').count(),1);assert.equal(createDrops,1);
   assert.equal(await cp.getByRole('link',{name:'Mở bản nháp vừa tạo',exact:true}).count(),0);evidence.unreceived.push({command:missingCreate,status:202,result:unknown,after:null});
  }
  assert.equal(createPaths.filter(r=>r.method==='POST').length,1);assert.equal(createPaths.filter(r=>r.path==='/api/v1/admin/workshops'||r.path.startsWith('/api/v1/admin/workshops/')).length,0);
  evidence.createUnknownPaths=createPaths;await cp.unrouteAll({behavior:'wait'});await cp.close();record('matrix-CREATE-unreceived-real-absent-lookup-UNKNOWN-two-reloads-no-title-search-no-POST-replay');
  // Deliver two real pointer clicks while a request is in flight. Holding the
  // reply makes the busy interval deterministic; the real backend commits once.
  for(const action of ['CREATE','EDIT','STATE']){
   await sleep(1100);const wid=action==='CREATE'?null:await create('DRAFT');const dp=wid?await pageFor(wid):await a.newPage();
   if(!wid){await dp.goto(base+'/admin/workshops/new');await dp.getByLabel('Tên',{exact:true}).waitFor();await dp.locator('fieldset:not([disabled])').waitFor();
    await dp.getByLabel('Tên',{exact:true}).fill('Nhấp đúp CREATE');await dp.getByLabel('Mô tả văn bản thuần').fill('Nội dung giả');await dp.getByLabel('Sức chứa',{exact:true}).fill('10');await dp.getByLabel('Bắt đầu, kèm múi giờ').fill('2026-11-01T09:00:00+07:00');await dp.getByLabel('Kết thúc, kèm múi giờ').fill('2026-11-01T10:00:00+07:00');}
   else if(action==='EDIT')await dp.getByLabel('Tên',{exact:true}).fill('Nhấp đúp EDIT');
   else{await dp.getByRole('button',{name:'Xuất bản',exact:true}).click();await dp.getByRole('dialog').waitFor();}
   const before=wid?await read(wid):null;let releaseReply,arriveReply;const holdReply=new Promise(resolve=>releaseReply=resolve),arrivedReply=new Promise(resolve=>arriveReply=resolve);const captured=[];
   await dp.route('**/api/v1/admin/intents',async route=>{const command=route.request().postDataJSON();assert.equal(command.action,action);captured.push(command);arriveReply();await holdReply;await route.continue();});
   try{
    const button=dp.getByRole('button',{name:action==='STATE'?'Xác nhận thay đổi':action==='CREATE'?'Tạo bản nháp':'Lưu nội dung',exact:true});
    const box=await button.boundingBox();assert.ok(box);const response=postResponse(dp);
    await dp.mouse.click(box.x+box.width/2,box.y+box.height/2);await arrivedReply;
    await dp.mouse.click(box.x+box.width/2,box.y+box.height/2);assert.equal(await dp.locator('fieldset[disabled]').count(),1);
    assert.equal(captured.length,1);releaseReply();const r=await response;assert.equal(r.status(),200);const result=await r.json();assert.equal(result.code,action==='CREATE'?'CREATED':'UPDATED');
    evidence.intents.push({command:captured[0],result});await dp.locator('fieldset:not([disabled])').waitFor();assert.equal(captured.length,1);
    const after=await read(result.workshopId);assert.equal(BigInt(after.version),before?BigInt(before.version)+1n:1n);
    if(action==='CREATE')assert.equal(after.title,'Nhấp đúp CREATE');if(action==='EDIT')assert.equal(after.title,'Nhấp đúp EDIT');if(action==='STATE')assert.equal(after.state,'OPEN');
    const lookup=await a.request.get(base+'/api/v1/admin/intents/'+captured[0].intentId);assert.equal(lookup.status(),200);assert.deepEqual(await lookup.json(),result);
    evidence.doubleClicks.push({action,command:captured[0],before,after,result,posts:captured.length});
   }finally{releaseReply();await dp.unrouteAll({behavior:'wait'});await dp.close();}
   record('matrix-double-pointer-click-'+action+'-one-POST-one-version-durable-result');
  }
 }catch(error){
  for(const [n,p]of a.pages().entries())try{writeFileSync('/out/matrix-failure-'+n+'.html',await p.content());}catch(diagnostic){evidence.diagnosticFailure=diagnostic.message;}
  throw error;
 }finally{
  writeFileSync('/out/matrix-evidence.json',JSON.stringify(evidence,null,2));for(const c of participants.values())await c.close();await a.close();
 }
}

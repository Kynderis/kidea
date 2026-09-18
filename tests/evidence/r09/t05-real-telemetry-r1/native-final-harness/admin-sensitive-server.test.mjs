// Built Web/native Mac Chrome + explicit fake API; not a backend/TLS test.
import test from 'node:test';import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:http';import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';import path from 'node:path';
const web=process.env.WORKSHOP_WEB_ROOT;assert.ok(web&&path.isAbsolute(web));
const {chromium}=createRequire(web+'/package.json')('playwright');
const snapshot={id:'W',epoch:'E',version:'1',state:'DRAFT',title:'Initial title',description:'Fake test content',capacity:10,active:0,remaining:10,observedAt:1,schedule:{start:'2026-11-04T09:00:00+07:00',end:'2026-11-04T10:00:00+07:00'}};
let current={...snapshot},receiptUnavailable=false;const remembered=new Map(),requests=[];
const api=createServer(async(req,res)=>{let raw='';for await(const chunk of req)raw+=chunk;requests.push({method:req.method,url:req.url});res.setHeader('content-type','application/json');const reply=(status,body)=>{res.statusCode=status;res.end(JSON.stringify(body));};
 if(req.url==='/api/v1/session')return reply(200,{actor:'A',epoch:'E',csrf:'FAKE-CSRF-A',admin:true,participant:false});
 if(req.url==='/api/v1/admin/workshops/W')return reply(200,current);
 if(req.url==='/api/v1/admin/intents'&&req.method==='POST'){const c=JSON.parse(raw);if(c.action==='EDIT'){current={...current,...c.fields,version:String(Number(current.version)+1)};const r={state:'FINAL',code:'UPDATED',effect:'APPLIED',workshopId:'W'};remembered.set(c.intentId,r);return reply(200,r);}return reply(503,{state:'UNKNOWN',code:'UNCONFIRMED'});}
 if(req.url?.startsWith('/api/v1/admin/intents/')){const id=req.url.slice('/api/v1/admin/intents/'.length);if(receiptUnavailable&&remembered.has(id))return reply(503,{state:'UNKNOWN',code:'UNCONFIRMED'});return remembered.has(id)?reply(200,remembered.get(id)):reply(202,{state:'UNKNOWN',code:'UNCONFIRMED'});}
 return reply(404,{state:'ERROR',code:'UNAVAILABLE'});
});await new Promise(r=>api.listen(0,'127.0.0.1',r));
const reserve=createServer();await new Promise(r=>reserve.listen(0,'127.0.0.1',r));const port=reserve.address().port;await new Promise(r=>reserve.close(r));const base='http://127.0.0.1:'+port;
const child=spawn(process.execPath,['build/index.js'],{cwd:web,env:{...process.env,HOST:'127.0.0.1',PORT:String(port),ORIGIN:'https://workshop.test',WORKSHOP_BACKEND:'http://127.0.0.1:'+api.address().port},stdio:['ignore','pipe','pipe']});let stdout='',stderr='';child.stdout.on('data',d=>stdout+=d);child.stderr.on('data',d=>stderr+=d);const closed=new Promise(r=>child.on('close',r));let browser;
async function page(){const c=await browser.newContext();await c.addCookies([{name:'workshop_session',value:'FAKE-LAB-A',url:base,httpOnly:true}]);const p=await c.newPage();await p.route('**/api/v1/**',async route=>{const url=new URL(route.request().url());const actual=await route.fetch({url:'http://127.0.0.1:'+api.address().port+url.pathname});await route.fulfill({response:actual});});return {p,c};}
try{
 let ready=false;for(let n=0;n<100;n++){try{ready=(await fetch(base)).ok;}catch{}if(ready)break;await new Promise(r=>setTimeout(r,50));}assert.ok(ready);browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});

 for(const kind of ['capacity','schedule','state-capacity','state-state'])await test('new authoritative socket observation invalidates open '+kind+' confirmation without POST',async()=>{
  current={...snapshot,state:'OPEN',active:1,remaining:9};requests.length=0;const {p,c}=await page();let sendFrame;let serial=0;
  await p.routeWebSocket('**/api/v1/updates',socket=>{sendFrame=message=>socket.send(JSON.stringify({receipt:String(++serial).padStart(32,'0'),message:{epoch:'E',audience:'admin',...message}}));socket.onMessage(raw=>{const v=JSON.parse(String(raw));if(v.type==='SUBSCRIBE')sendFrame({type:'SUBSCRIBED'});});});
  try{
   await p.goto(base+'/admin/workshops/W');await p.locator('fieldset:not([disabled])').waitFor();await p.getByText('Đang đối chiếu cập nhật trực tiếp.',{exact:true}).waitFor();
   if(kind==='capacity')await p.getByLabel('Sức chứa',{exact:true}).fill('8');
   if(kind==='schedule'){await p.getByLabel('Bắt đầu, kèm múi giờ').fill('2026-11-05T09:00:00+07:00');await p.getByLabel('Kết thúc, kèm múi giờ').fill('2026-11-05T10:00:00+07:00');}
   await p.getByRole('button',{name:kind.startsWith('state')?'Tạm dừng':'Lưu nội dung',exact:true}).click();await p.getByRole('dialog').waitFor();
   current={...current,version:'2',capacity:9,remaining:8,...(kind==='state-state'?{state:'PAUSED'}:{})};sendFrame({type:'SNAPSHOT',data:current});
   if(kind.startsWith('state'))await p.waitForFunction(()=>document.querySelector('input[inputmode="numeric"]')?.value==='9');else await p.getByRole('region',{name:'Dữ liệu mới',exact:true}).waitFor();
   assert.equal(await p.locator('dialog[open]').count(),0,'changed confirmed source must close the old dialog');assert.equal(requests.filter(r=>r.method==='POST').length,0);
   if(!kind.startsWith('state'))await p.getByRole('button',{name:'Đã xem bản mới, giữ các trường tôi sửa',exact:true}).click();
   await p.getByRole('button',{name:kind==='state-state'?'Mở lại':kind==='state-capacity'?'Tạm dừng':'Lưu nội dung',exact:true}).click();await p.getByRole('dialog').waitFor();assert.equal(requests.filter(r=>r.method==='POST').length,0);await p.keyboard.press('Escape');assert.equal(requests.filter(r=>r.method==='POST').length,0);
  }catch(error){if(process.env.WORKSHOP_BROWSER_OUT){mkdirSync(process.env.WORKSHOP_BROWSER_OUT,{recursive:true});writeFileSync(path.join(process.env.WORKSHOP_BROWSER_OUT,kind+'-failure.html'),await p.content());await p.screenshot({path:path.join(process.env.WORKSHOP_BROWSER_OUT,kind+'-failure.png'),fullPage:true});}throw error;}
  finally{await p.unrouteAll({behavior:'wait'});await c.close();}
 });
}finally{if(browser)await browser.close();child.kill('SIGTERM');const timer=setTimeout(()=>child.kill('SIGKILL'),10000);await closed;clearTimeout(timer);await new Promise(r=>api.close(r));console.log(JSON.stringify({serverStdout:stdout,serverStderr:stderr,scope:'built Web/native Mac Chrome + explicit fake API; no backend integration/acceptance'}));}

import test from 'node:test';import assert from 'node:assert/strict';import {createServer} from 'node:http';import {spawn} from 'node:child_process';
const snapshot={id:'W',epoch:'E',version:'1',state:'OPEN',title:'<img src=x onerror=alert(1)>',description:'Nội dung riêng ký tự <b>plain</b>',capacity:1,active:0,remaining:1,observedAt:1,schedule:{start:'2026-10-01T09:00:00+07:00',end:'2026-10-01T10:00:00+07:00'}};
const requests=[];let mode='valid';let child;let stdout='',stderr='';
const api=createServer((req,res)=>{requests.push({url:req.url,cookie:req.headers.cookie??null});res.setHeader('content-type','application/json');if(req.url==='/api/v1/workshops/hidden'){res.statusCode=404;res.end(JSON.stringify({private:'DRAFT SECRET'}));return;}if(mode==='malformed'){res.end('{broken');return;}const v={...snapshot,actor:'PRIVATE SENTINEL'};if(mode==='invalid')v.remaining=99;res.end(JSON.stringify(req.url==='/api/v1/workshops'?[v]:v));});
await new Promise(r=>api.listen(0,'127.0.0.1',r));
const reservation=createServer();await new Promise(r=>reservation.listen(0,'127.0.0.1',r));const port=reservation.address().port;await new Promise(r=>reservation.close(r));
const base='http://127.0.0.1:'+port;
child=spawn(process.execPath,['build/index.js'],{cwd:new URL('../..',import.meta.url),env:{...process.env,HOST:'127.0.0.1',PORT:String(port),ORIGIN:'https://workshop.test',WORKSHOP_BACKEND:'http://127.0.0.1:'+api.address().port},stdio:['ignore','pipe','pipe']});child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);const closed=new Promise(r=>child.on('close',r));
try{
 let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch(base)).ok;}catch{/* Bounded startup polling; readiness assertion follows. */}if(ready)break;await new Promise(r=>setTimeout(r,50));}assert.ok(ready,'built server ready');
 await test('intro is prerendered readable HTML with noindex and fixed canonical',async()=>{const r=await fetch(base);const html=await r.text();assert.equal(r.status,200);assert.match(html,/<h1>Workshop thử nghiệm<\/h1>/);assert.match(html,/noindex/);assert.match(html,/https:\/\/workshop.test\//);});
 await test('SSR list escapes title and strips all private fields',async()=>{const r=await fetch(base+'/workshops');const html=await r.text();assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');assert.match(html,/&lt;img/);assert.ok(!html.includes('<img src=x'));assert.ok(!html.includes('PRIVATE SENTINEL'));const links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>new URL(m[1],base+'/workshops').pathname);assert.ok(links.includes('/workshops/W'));assert.match(html,/lang="vi"/);});
 await test('SSR detail retains public schedule and identity link',async()=>{const r=await fetch(base+'/workshops/W');const html=await r.text();assert.equal(r.status,200);assert.match(html,/01\/10\/2026 09:00 UTC\+07:00/);assert.match(html,/https:\/\/workshop.test\/workshops\/W/);assert.ok(!html.includes('PRIVATE SENTINEL'));});
 await test('hidden and missing are generic without private body',async()=>{const r=await fetch(base+'/workshops/hidden');const html=await r.text();assert.equal(r.status,404);assert.ok(!html.includes('DRAFT SECRET'));assert.match(html,/Không thể truy cập workshop này/);});
 await test('concurrent actor cookies never forwarded into public SSR',async()=>{requests.length=0;await Promise.all(['U','V'].map(actor=>fetch(base+'/workshops',{headers:{cookie:'workshop_session='+actor}})));assert.equal(requests.length,2);assert.ok(requests.every(r=>r.cookie===null));});
 for(const m of ['invalid','malformed'])await test('bad backend '+m+' is unavailable, not empty success',async()=>{mode=m;const r=await fetch(base+'/workshops');assert.equal(r.status,503);mode='valid';});

 if(process.env.WORKSHOP_BROWSER_OUT){
  const {chromium}=await import('playwright');const {mkdirSync,writeFileSync}=await import('node:fs');const out=process.env.WORKSHOP_BROWSER_OUT;
  for(const zoom of [1,2]){
   const profile=out+'/profile-'+zoom;mkdirSync(profile+'/Default',{recursive:true});writeFileSync(profile+'/Default/Preferences',JSON.stringify({partition:{default_zoom_level:{x:Math.log(zoom)/Math.log(1.2)}}}));
   const context=await chromium.launchPersistentContext(profile,{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,viewport:null});
   try{for(const width of [360,1280])await test('Chrome public SSR navigation '+width+' zoom '+zoom,async()=>{
    const page=await context.newPage();await page.setViewportSize({width,height:900});const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/workshops');await page.getByRole('heading',{level:1,name:'Danh sách workshop'}).waitFor();await page.getByRole('link',{name:snapshot.title}).click();await page.getByRole('heading',{level:1,name:snapshot.title}).waitFor();
    const metrics=await page.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio,overflow:document.documentElement.scrollWidth>innerWidth+1,lang:document.documentElement.lang}));assert.equal(metrics.width,width/zoom);assert.equal(metrics.dpr,zoom);assert.equal(metrics.overflow,false);assert.equal(metrics.lang,'vi');assert.equal(await page.locator('img').count(),0);assert.deepEqual(errors,[]);
    await page.getByRole('link',{name:'← Danh sách workshop'}).focus();await page.keyboard.press('Enter');await page.getByRole('heading',{level:1,name:'Danh sách workshop'}).waitFor();
    const cdp=await context.newCDPSession(page);const image=await cdp.send('Page.captureScreenshot',{format:'png'});writeFileSync(out+'/public-'+width+'-'+zoom+'.png',Buffer.from(image.data,'base64'));await cdp.detach();await page.close();
   });}finally{await context.close();}
  }
  const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  try{const context=await browser.newContext({javaScriptEnabled:false});await test('Chrome JS disabled list and detail readable',async()=>{const page=await context.newPage();await page.goto(base+'/workshops');await page.getByRole('link',{name:snapshot.title}).click();assert.equal(await page.getByRole('heading',{level:1}).textContent(),snapshot.title);});await context.close();}finally{await browser.close();}
 }
}finally{child.kill('SIGTERM');const timer=setTimeout(()=>child.kill('SIGKILL'),10000);await closed;clearTimeout(timer);await new Promise(r=>api.close(r));console.log(JSON.stringify({serverStdout:stdout,serverStderr:stderr,scope:'Built Web + local fake API contract; not backend integration or product acceptance'}));}

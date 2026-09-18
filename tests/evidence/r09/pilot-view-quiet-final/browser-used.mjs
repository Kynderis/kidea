import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import os from 'node:os';
const {chromium}=await import('/Users/kendrick/Desktop/kidea-workshop-pilot/samples/r05/web/node_modules/playwright/index.mjs');
const out=process.env.KIDEA_VIEW_OUTPUT??import.meta.dirname, file='/Users/kendrick/Desktop/kidea-workshop-pilot/.kidea/views/progress.html';
const hash=()=>createHash('sha256').update(readFileSync(file)).digest('hex');const before=hash();
const results=[],timings=[],requests=[],errors=[];let version;
for(const zoom of [1,2]){
 const profile=out+'/profile-'+zoom;mkdirSync(profile+'/Default',{recursive:true});writeFileSync(profile+'/Default/Preferences',JSON.stringify({partition:{default_zoom_level:{x:Math.log(zoom)/Math.log(1.2)}}}));
 const context=await chromium.launchPersistentContext(profile,{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,viewport:null,offline:true,args:['--window-size=1440,900']});
 const page=context.pages()[0];page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});page.on('pageerror',e=>errors.push(e.message));version=await page.evaluate(()=>navigator.userAgent);
 try{for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  for(let i=0;i<6;i++){
   const start=performance.now();await page.goto(pathToFileURL(file).href);await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const open=performance.now()-start;
   const readyText=await page.locator('body').innerText();assert.ok(readyText.includes('Chưa phân rã'));assert.equal((readyText.match(/Chưa có dữ liệu bản đồ/g)||[]).length,3);
   const got=await page.evaluate(async()=>{
    const measure=async fn=>{const start=performance.now();fn();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-start;};
    const search=await measure(()=>{const e=document.querySelector('#search');e.value='W-001';e.dispatchEvent(new Event('input',{bubbles:true}));});
    const filter=await measure(()=>{const e=document.querySelector('#status-filter');e.value='DONE';e.dispatchEvent(new Event('change',{bubbles:true}));});
    const detail=await measure(()=>{document.querySelector('#item-0').open=true;});
    return {search,filter,detail,width:innerWidth,dpr:devicePixelRatio,overflow:document.documentElement.scrollWidth>innerWidth+1,items:document.querySelectorAll('[id^="item-"]').length,body:document.body.innerText};
   });timings.push({zoom,width,iteration:i,cold:i===0,open,...got,body:undefined});
   assert.ok(open<=5000);for(const v of [got.search,got.filter,got.detail])assert.ok(v<=200);assert.equal(got.overflow,false);assert.equal(got.width,width/zoom);assert.equal(got.dpr,zoom);assert.equal(got.items,10);assert.ok(got.body.includes('W-001'));
  }
  await page.locator('#search').fill('');await page.locator('#status-filter').selectOption('');await page.evaluate(()=>scrollTo(0,0));const cdp=await context.newCDPSession(page);const shot=await cdp.send('Page.captureScreenshot',{format:'png'});writeFileSync(out+`/view-${width}-${zoom}.png`,Buffer.from(shot.data,'base64'));await cdp.detach();results.push({width,zoom,state:'PASS'});
 }}catch(e){results.push({zoom,state:'FAIL',error:e.stack});}finally{await context.close();}
}
assert.equal(hash(),before);const summary={results,timings,requests,errors,version,host:{node:process.version,arch:os.arch(),cpu:os.cpus()[0].model,load:os.loadavg()},sourceHash:before,scope:'Actual 10 unexpanded groups, no map receipts: missing maps must remain UNKNOWN. Current snapshot only, not final R09.'};writeFileSync(out+'/browser.json',JSON.stringify(summary,null,2));console.log(JSON.stringify({results,requests,errors}));if(results.some(r=>r.state==='FAIL')||requests.length||errors.length)process.exitCode=1;

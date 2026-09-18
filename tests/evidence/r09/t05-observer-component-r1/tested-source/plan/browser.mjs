import fs from 'node:fs';import assert from 'node:assert/strict';import{createRequire}from 'node:module';
const require=createRequire('/web/package.json');const{chromium}=require('playwright');
const results=[],timings=[],wire=[],consoleErrors=[];let browser,context,page,controlId=0;
const base='https://observer.test:8443',admin='A'.repeat(48),participant='P'.repeat(48);
const check=(id,details={})=>{results.push({id,status:'PASS',...details});fs.writeFileSync('/out/progress.json',JSON.stringify(results));};
async function control(action){const q={id:++controlId,action,atMs:Date.now()};fs.writeFileSync('/out/control-request.json',JSON.stringify(q));
 for(let i=0;i<200;i++){const f='/out/control-result-'+q.id+'.json';if(fs.existsSync(f)){const r=JSON.parse(fs.readFileSync(f));assert.equal(r.action,action);assert.equal(r.status,'DONE');return r;}await new Promise(r=>setTimeout(r,100));}throw Error('CONTROL_TIMEOUT');}
const snapshot=async()=>{const r=await context.request.get(base+'/api/observation');assert.equal(r.status(),200);return r.json();};
async function waitView(predicate,timeout=20000){const start=Date.now();let v;
 while(Date.now()-start<timeout){try{v=await snapshot();if(predicate(v))return v;}catch{/* observer restarting */}await new Promise(r=>setTimeout(r,100));}throw Error('VIEW_TIMEOUT '+JSON.stringify(v));}
const cookie=token=>[{name:'__Host-workshop_observer',value:token,url:base,secure:true,httpOnly:true,sameSite:'Strict'}];
try{
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--disable-dev-shm-usage','--no-sandbox']});
 context=await browser.newContext({viewport:{width:360,height:900}});page=await context.newPage();
 page.on('request',r=>wire.push({method:r.method(),url:r.url(),atMs:Date.now()}));page.on('pageerror',e=>consoleErrors.push(e.message));
 for(const route of ['/operations','/api/observation','/health/observer']){
  const guest=await context.request.get(base+route);assert.equal(guest.status(),403);assert.equal(await guest.text(),'');
 }
 check('OBS-CHROME-GUEST-DENIED');await context.addCookies(cookie(participant));
 const denied=await context.request.get(base+'/operations',{headers:{'x-role':'admin'}});assert.equal(denied.status(),403);check('OBS-CHROME-PARTICIPANT-FORGED-DENIED');
 await context.clearCookies();await context.addCookies(cookie(admin));await page.goto(base+'/operations');
 await page.waitForSelector('#data');assert.match(await page.locator('h1').innerText(),/màn dự phòng/);assert.ok(!await page.content().then(s=>s.includes(admin)));
 check('OBS-CHROME-ADMIN-SSR-TLS');
 const response=await context.request.get(base+'/api/observation');assert.match(response.headers()['cache-control'],/no-store/);assert.match(response.headers()['x-robots-tag'],/noindex/);
 assert.equal((await context.request.post(base+'/api/observation',{data:{role:'admin'}})).status(),405);
 assert.equal((await context.request.get(base+'/restore')).status(),404);check('OBS-CHROME-PRIVATE-HEADERS-NO-CONTROLS');
 for(const width of [360,1280]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('#refresh').focus();await page.keyboard.press('Enter');check('OBS-CHROME-VIEWPORT-'+width);}
 await page.evaluate(()=>{document.body.style.fontSize='200%';});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));check('OBS-CHROME-200PERCENT');
 const normal=await waitView(v=>v.sources.fast.current&&v.sources.slow.current&&v.probes.application?.ok);
 assert.equal(normal.eligibility.writeReady,false);assert.equal(normal.eligibility.observationReady,false);check('OBS-CHROME-SAME-HOST-READINESS-BLOCKED');
 await page.setViewportSize({width:360,height:900});
 const raised=await control('PENDING_CRITICAL');const critical=await waitView(v=>v.incidents['M1:pending']?.level==='CRITICAL');
 await page.waitForFunction(()=>document.getElementById('data').textContent.includes('M1:pending — Nghiêm trọng'),undefined,{timeout:12000});
 const shown=Date.now(),n=critical.notifications.find(n=>n.key==='M1:pending'&&n.type==='RAISED');
 assert.ok(shown-n.atMs<=5000);assert.ok(shown-raised.changedAtMs<=8000);timings.push({id:'M1',stimulusAtMs:raised.changedAtMs,detectedAtMs:n.atMs,shownAtMs:shown});
 await page.screenshot({path:'/out/critical-360.png',fullPage:true});check('OBS-CHROME-CRITICAL-AT-RECEIVER',timings.at(-1));
 const invalid=await control('INVALID_FAST');const stale=await waitView(v=>!v.sources.fast.current);
 assert.equal(stale.conclusion,'CRITICAL');assert.equal(stale.sources.fast.last.M1.pending,1);assert.ok(!JSON.stringify(stale).includes('FakeSecretMustNotEscape'));
 await page.locator('#refresh').click();await page.waitForFunction(()=>document.getElementById('data').textContent.includes('chưa xác nhận độ mới'));
 check('OBS-CHROME-HTTP200-INVALID-NOT-FRESH',{changedAtMs:invalid.changedAtMs});
 const first=stale.incidents['M1:pending'].firstSeenMs,notified=stale.incidents['M1:pending'].lastNotifiedMs;
 await control('CRASH_RESTART_OBSERVER');const restarted=await waitView(v=>v.restartCount===1);
 assert.equal(restarted.incidents['M1:pending'].firstSeenMs,first);assert.equal(restarted.incidents['M1:pending'].lastNotifiedMs,notified);
 assert.equal(restarted.incidents['M1:pending'].healthy,0);check('OBS-CHROME-SIGKILL-RESTART-DURABLE');
 await control('VALID_FAST');await waitView(v=>v.sources.fast.current);const stopped=await control('STOP_SOURCE');
 const probed=await waitView(v=>v.incidents['M6:application']?.level==='CRITICAL',18000);
 await page.waitForFunction(()=>document.getElementById('data').textContent.includes('M6:application — Nghiêm trọng'),undefined,{timeout:5000});
 const received=Date.now(),pn=probed.notifications.find(n=>n.key==='M6:application'&&n.type==='RAISED');
 assert.ok(received-stopped.changedAtMs<=17000);assert.ok(received-pn.atMs<=5000);
 timings.push({id:'M6',stimulusAtMs:stopped.changedAtMs,detectedAtMs:pn.atMs,shownAtMs:received});check('OBS-CHROME-SOURCE-PROCESS-DOWN-FALLBACK-RECEIVER',timings.at(-1));
 await control('STOP_OBSERVER');await page.waitForFunction(()=>document.getElementById('status').textContent.includes('bộ quan sát không rõ'),undefined,{timeout:12000});
 assert.match(await page.locator('#status').innerText(),/lỗi nghiêm trọng đã biết/);check('OBS-CHROME-OBSERVER-DOWN-NO-FALSE-GREEN');
 await control('RESTART_OBSERVER');await waitView(v=>v.restartCount===2);await page.locator('#refresh').click();
 await control('REVOKE_ADMIN');await page.waitForFunction(()=>document.getElementById('data').textContent===''&&document.getElementById('initial').textContent==='',{timeout:8000});
 assert.match(await page.locator('#status').innerText(),/Không có quyền/);assert.equal((await context.request.get(base+'/operations')).status(),403);
 check('OBS-CHROME-ACTUAL-FALLBACK-SESSION-REVOCATION-CLEAR');assert.deepEqual(consoleErrors,[]);
 assert.ok(wire.every(r=>r.method==='GET'));check('OBS-CHROME-READONLY-WIRE-NO-JS-ERRORS');
 fs.writeFileSync('/out/result.json',JSON.stringify({status:'PASS',checks:results,timings,wire,consoleErrors,scope:'Actual TLS/Chrome/process/durable observer on one Docker/Mac; all source signals synthetic. Not OP runtime coverage, E1, backend-host-loss, Human oncall or verified backup.'},null,2));
}catch(e){fs.writeFileSync('/out/result.json',JSON.stringify({status:'FAIL',error:e.stack,checks:results,timings,wire,consoleErrors},null,2));if(page)try{await page.screenshot({path:'/out/failure.png',fullPage:true});fs.writeFileSync('/out/failure.html',await page.content());}catch{}process.exitCode=1;}
finally{if(browser)await browser.close();}

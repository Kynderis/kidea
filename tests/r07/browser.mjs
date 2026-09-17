// Local Chrome, isolated profiles. No download, server or user-profile mutation.
import {mkdirSync,readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {byteIntegrity} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
const {chromium}=await import(pathToFileURL(process.env.KIDEA_R07_PLAYWRIGHT).href);
const run=process.env.KIDEA_R07_RUN;if(!run||!path.isAbsolute(run))throw Error('KIDEA_R07_RUN_REQUIRED');
const out=path.join(run,'chrome');mkdirSync(out);const results=[],timings=[],requests=[],errors=[];
const files=Object.fromEntries(['S','M'].map(s=>[s,path.join(run,'V12-'+s,'.kidea/views/progress.html')]));
const before=Object.fromEntries(Object.entries(files).map(([s,p])=>[s,byteIntegrity(readFileSync(p))]));
const started=new Date().toISOString();let version;
for(const zoom of [1,2]) {
  const profile=path.join(out,'profile-'+zoom);mkdirSync(path.join(profile,'Default'),{recursive:true});
  // Chromium partition zoom pref; key x is the default (empty relative path).
  // Assert observed viewport + DPR below: a pref alone is not proof of zoom.
  writeFileSync(path.join(profile,'Default/Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(zoom)/Math.log(1.2)}}}));
  const context=await chromium.launchPersistentContext(profile,{executablePath:process.env.KIDEA_R07_CHROME,headless:true,viewport:null,offline:true,args:['--window-size=1440,900']});
  version=context.browser()?.version()??'persistent-context';const page=context.pages()[0];page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
  try {
    for(const viewport of [{width:390,height:844},{width:1440,height:900}])for(const size of ['S','M']) {
      const id=`${size}-${viewport.width}-zoom${zoom}`;
      try {
        await page.setViewportSize(viewport);
        for(let i=0;i<6;i++) {
          const start=performance.now();await page.goto(pathToFileURL(files[size]).href,{waitUntil:'load'});await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');
          await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
          const open=performance.now()-start;
          const metrics=await page.evaluate(()=>({innerWidth,innerHeight,outerWidth,devicePixelRatio,scale:visualViewport.scale,overflow:document.documentElement.scrollWidth>innerWidth+1}));
          assert.equal(metrics.devicePixelRatio,zoom);assert.equal(metrics.innerWidth,viewport.width/zoom);assert.equal(metrics.scale,1);assert.equal(metrics.overflow,false,JSON.stringify(metrics));
          const interaction=await page.evaluate(async()=>{
            const measured=async fn=>{const start=performance.now();fn();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-start;};
            const search=await measured(()=>{const input=document.querySelector('#search');input.value='TEST-1';input.dispatchEvent(new Event('input',{bubbles:true}));});
            const filtering=await measured(()=>{const input=document.querySelector('#status-filter');input.value='DONE';input.dispatchEvent(new Event('change',{bubbles:true}));});
            const detail=await measured(()=>document.querySelector('#item-1').open=true);
            const map=await measured(()=>{const input=document.querySelector('#map-2');input.value='N0';input.dispatchEvent(new Event('change',{bubbles:true}));});
            return {search,filtering,detail,map};
          });
          timings.push({id,iteration:i,cold:i===0,open,interaction,metrics});
          assert.ok(open<=(size==='S'?2000:5000),`open ${open}`);for(const [action,ms]of Object.entries(interaction))assert.ok(ms<=200,`${action} ${ms}`);
        }
        await page.locator('#search').fill('');await page.locator('#status-filter').selectOption('');
        await page.locator('#search').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'status-filter');
        const reverse=await page.locator('.map').nth(2).locator('tr[data-from]:not([hidden])').evaluateAll(rows=>rows.map(r=>({from:r.dataset.from,to:r.dataset.to})));
        assert.ok(reverse.length>0);assert.ok(reverse.every(r=>r.to==='N0'||r.from==='N0'));
        await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,id+'.png')});
        await page.locator('.map').nth(2).scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,id+'-map.png')});
        results.push({id,status:'PASS'});
      }catch(e){results.push({id,status:'FAIL',error:e.stack});}
      writeFileSync(path.join(out,'progress.json'),JSON.stringify({results,timings,requests,errors},null,2));
    }
    if(zoom===1){
      const standalone=path.join(out,'standalone.html');copyFileSync(files.S,standalone);await page.goto(pathToFileURL(standalone).href);await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');assert.ok((await page.locator('body').innerText()).includes('Workshop'));
      await page.goto(pathToFileURL(path.join(run,'V08-escaping/.kidea/views/progress.html')).href);assert.equal(await page.evaluate(()=>globalThis.pwned),undefined);assert.equal(await page.locator('img').count(),0);
      results.push({id:'V07-V08-V10-standalone-xss-offline',status:'PASS'});
    }
  }catch(e){results.push({id:'browser-boundary-'+zoom,status:'FAIL',error:e.stack});}finally{await context.close();}
}
assert.deepEqual(Object.fromEntries(Object.entries(files).map(([s,p])=>[s,byteIntegrity(readFileSync(p))])),before);
if(requests.length||errors.length)results.push({id:'network-or-script-error',status:'FAIL'});
const summary={started,ended:new Date().toISOString(),version,source:before,results,timings,requests,errors,zoomMethod:'Isolated profile default browser zoom; observed DPR and CSS viewport asserted, no CSS/pinch substitute',safari:'OUT_OF_SCOPE_HUMAN_CHROME_ONLY_2026_09_17'};
writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({results,requests,errors}));process.exitCode=results.some(r=>r.status!=='PASS')?1:0;

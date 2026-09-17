import {chromium} from '/Users/kendrick/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const base=path.resolve('tests/evidence/r07/implementation-r1');
const profile=path.resolve('.test-output/r07/visual-followup-profile');mkdirSync(path.join(profile,'Default'),{recursive:true});
writeFileSync(path.join(profile,'Default/Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(2)/Math.log(1.2)}}}));
const c=await chromium.launchPersistentContext(profile,{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,viewport:{width:390,height:844},offline:true});const p=c.pages()[0];
const record=[];
try{for(const size of ['S','M']){
await p.goto(pathToFileURL(path.resolve(`.test-output/r07/final-2026-09-17T05-53-02-534Z/V12-${size}/.kidea/views/progress.html`)).href);
await p.locator('#map-2').fill('N0');await p.locator('#map-2').dispatchEvent('change');
await p.evaluate(()=>document.querySelectorAll('.map')[2].scrollIntoView({block:'start',behavior:'instant'}));
await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
record.push(await p.evaluate(()=>({innerWidth,innerHeight,scrollY,dpr:devicePixelRatio,docHeight:document.documentElement.scrollHeight,rect:document.querySelectorAll('.map')[2].getBoundingClientRect().toJSON(),center:document.elementFromPoint(innerWidth/2,innerHeight/2)?.outerHTML.slice(0,200)})));
await p.screenshot({path:path.join(base,`visual-followup-${size}-map-top.png`)});
await p.locator('#map-2').scrollIntoViewIfNeeded();await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:path.join(base,`visual-followup-${size}-map-control.png`)});
}}finally{await c.close();writeFileSync(path.join(base,'visual-followup.json'),JSON.stringify(record,null,2));}

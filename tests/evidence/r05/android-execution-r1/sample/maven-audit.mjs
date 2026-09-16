import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
const proxy=spawn(process.execPath,['/src/maven-proxy.mjs'],{stdio:['ignore','pipe','inherit']});
await new Promise((resolve,reject)=>{proxy.stdout.on('data',d=>{if(String(d).includes('MAVEN_PROXY_READY'))resolve();});proxy.on('exit',reject);});
const receipts=fs.readFileSync('/out/maven-requests.jsonl','utf8').trim().split('\n').map(JSON.parse);
const binaries=receipts.filter(r=>r.status===200&&/\.(jar|aar)$/.test(r.url));
const cache=url=>'/work/maven-cache/'+crypto.createHash('sha256').update(url).digest('hex');
const local=url=>url.replace('https://dl.google.com/dl/android/maven2/','http://127.0.0.1:18765/google/').replace('https://repo.maven.apache.org/maven2/','http://127.0.0.1:18765/central/');
const results=[];let next=0;
await Promise.all(Array.from({length:6},async()=>{while(next<binaries.length){const b=binaries[next++];let match=false,algorithm,expected;
for(const alg of ['sha256','sha1']){const r=await fetch(local(b.url)+'.'+alg);if(r.status!==200)continue;const value=(await r.text()).trim().split(/\s+/)[0];if(!new RegExp('^[a-fA-F0-9]{'+(alg==='sha256'?64:40)+'}$').test(value))continue;algorithm=alg;expected=value.toLowerCase();match=crypto.createHash(alg).update(fs.readFileSync(cache(b.url))).digest('hex')===expected;break;}
results.push({...b,algorithm,expected,publisherChecksumMatch:match});}}));
const poms=receipts.filter(r=>r.status===200&&r.url.endsWith('.pom')).map(r=>{const xml=fs.readFileSync(cache(r.url),'utf8');return {url:r.url,sha256:r.sha256,licenses:[...xml.matchAll(/<license>([\s\S]*?)<\/license>/g)].map(m=>m[1].replace(/\s+/g,' ').trim()),parent:xml.match(/<parent>([\s\S]*?)<\/parent>/)?.[1].replace(/\s+/g,' ').trim()??null};});
fs.writeFileSync('/out/publisher-checksums.json',JSON.stringify({checkedAt:new Date().toISOString(),artifacts:results},null,2)+'\n');
fs.writeFileSync('/out/pom-license-inventory.json',JSON.stringify(poms,null,2)+'\n');
console.log(JSON.stringify({binaries:results.length,matched:results.filter(r=>r.publisherChecksumMatch).length,poms:poms.length}));
proxy.kill('SIGTERM');await new Promise(resolve=>proxy.on('close',resolve));
process.exitCode=results.every(r=>r.publisherChecksumMatch)?0:1;

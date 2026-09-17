import {spawn,spawnSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync,readdirSync,lstatSync,copyFileSync,existsSync,readlinkSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {byteIntegrity} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
import {visualize} from '../../.agents/skills/kidea/scripts/visualize.mjs';
const repo=path.resolve(import.meta.dirname,'../..');
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const evidence=path.join(repo,'tests/evidence/r07/implementation-r1','final-'+stamp);mkdirSync(evidence);
const run=path.join(repo,'.test-output/r07','final-'+stamp);mkdirSync(run,{recursive:true});
const walk=dir=>!existsSync(dir)?[]:readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?walk(p):e.isFile()?[p]:[];});
const size=dir=>walk(dir).reduce((n,p)=>n+lstatSync(p).size,0);
const r06root=path.join(repo,'.test-output/r06'),coreRoot=path.join(repo,'.test-output/r02-t07');
const baseline={r06:size(r06root),core:size(coreRoot)};
const usage=()=>size(path.join(repo,'.test-output/r07'))+size(path.join(repo,'tests/evidence/r07'))+Math.max(0,size(r06root)-baseline.r06)+Math.max(0,size(coreRoot)-baseline.core);
const sourcePaths=[...new Set(['.agents/skills/kidea','tests/r07','tests/r06','tests/fixtures','tests/support','tests/r02-t07'].flatMap(d=>walk(path.join(repo,d)).filter(p=>/\.(mjs|md|json)$/.test(p))).concat(walk(path.join(repo,'tests')).filter(p=>path.dirname(p)===path.join(repo,'tests')&&p.endsWith('.mjs')),['package.json','package-lock.json'].map(p=>path.join(repo,p))))];
const source=()=>Object.fromEntries(sourcePaths.map(p=>[path.relative(repo,p),byteIntegrity(readFileSync(p))]));
const before=source(),commands=[];
function command(executable,args){const r=spawnSync(executable,args,{cwd:repo,encoding:'utf8',timeout:15000});return {executable,args,status:r.status,stdout:r.stdout,stderr:r.stderr};}
const environment={at:new Date().toISOString(),node:process.version,nodeExecutable:process.execPath,platform:process.platform,arch:process.arch,uid:process.getuid?.(),cpu:os.cpus()[0]?.model,root:repo,commands:[command('git',['rev-parse','HEAD']),command('git',['remote','get-url','origin']),command('git',['status','--short']),command('/usr/bin/sw_vers',[]),command('/bin/df',['-k',repo]),command('/usr/bin/uname',['-m'])],quota:{bytes:512*1024**2,toolTimeoutMs:30*60*1000,round:'final integrated verification after two development cycles',usageAtStart:usage()},source:before};
writeFileSync(path.join(evidence,'start.json'),JSON.stringify(environment,null,2));
const pilot=process.env.KIDEA_R07_PILOT;assert.ok(pilot&&path.isAbsolute(pilot));
const manifest=JSON.parse(readFileSync(path.join(repo,'tests/evidence/r05/web-scope-r1/manifest.json')));
const pilotBefore={};const copy=path.join(run,'pilot-copy');mkdirSync(copy);
for(const [p,entry]of Object.entries(manifest.files)){const b=readFileSync(path.join(pilot,p));assert.equal(byteIntegrity(b).value,entry.after,p);pilotBefore[p]=byteIntegrity(b);mkdirSync(path.dirname(path.join(copy,p)),{recursive:true});writeFileSync(path.join(copy,p),b);}
const pilotHasRecords=existsSync(path.join(pilot,'.kidea'));
// Never synthesize or silently restore pilot coordination records.
const pilotResult=pilotHasRecords?{state:'NOT_RUN',reason:'New pilot records require finite read scope review'}:visualize(copy,{permission:{root:copy,readProject:true,allowReadLocalGit:false,allowViewWrite:true,allowExportMetadata:true,assumptions:{localFilesystem:true,noActiveSync:true,singleKideaRun:true}}});
writeFileSync(path.join(evidence,'pilot.json'),JSON.stringify({pilotHasRecords,pilotBefore,result:pilotResult,performance:'NOT_RUN_NO_VALID_PILOT_COORDINATION_RECORDS'},null,2));
assert.equal(pilotResult.state,'VIEW_NOT_UPDATED');
async function runTool(id,script,extraEnv={}) {
  const stdout=path.join(evidence,id+'.stdout'),stderr=path.join(evidence,id+'.stderr');let out='',err='',killed=null;
  const start=Date.now();const child=spawn(process.execPath,[script],{cwd:repo,env:{...process.env,...extraEnv},detached:true,stdio:['ignore','pipe','pipe']});
  const stop=reason=>{killed=reason;try{process.kill(-child.pid,'SIGTERM');}catch{}};
  const timeout=setTimeout(()=>stop('TOOL_TIME_LIMIT'),30*60*1000);
  const quota=setInterval(()=>{if(usage()>512*1024**2)stop('DISK_LIMIT');},5000);
  child.stdout.on('data',b=>out+=b);child.stderr.on('data',b=>err+=b);
  const status=await new Promise(resolve=>{child.on('error',e=>{err+=e.stack;resolve(null);});child.on('close',resolve);});clearTimeout(timeout);clearInterval(quota);
  writeFileSync(stdout,out);writeFileSync(stderr,err);
  const row={id,script,status,killed,milliseconds:Date.now()-start,usage:usage()};commands.push(row);writeFileSync(path.join(evidence,'commands.json'),JSON.stringify(commands,null,2));console.log(id,status,row.milliseconds+'ms');
  return {row,out};
}
const core=await runTool('core','tests/r02-t07/run-tests.mjs');
const r06=await runTool('r06','tests/r06/run-tests.mjs');
const boundaries=await runTool('r06-boundaries','tests/r06/boundaries.mjs');
const unit=await runTool('r07','tests/r07/run-tests.mjs',{KIDEA_R07_RUN:run});
if(unit.row.status===0)await runTool('chrome','tests/r07/browser.mjs',{KIDEA_R07_RUN:run});
const preserved=Object.fromEntries(Object.keys(pilotBefore).map(p=>[p,byteIntegrity(readFileSync(path.join(pilot,p)))]));assert.deepEqual(preserved,pilotBefore);assert.deepEqual(source(),before);
const archive=[];
function copyTree(from,to){mkdirSync(to,{recursive:true});for(const e of readdirSync(from,{withFileTypes:true})){const p=path.join(from,e.name),q=path.join(to,e.name==='.git'?'git-metadata.snapshot':e.name);if(e.isDirectory()){if(e.name.startsWith('profile-')){const prefs=path.join(p,'Default/Preferences');if(existsSync(prefs)){copyFileSync(prefs,q+'-Preferences.json');archive.push({from:p,to:q+'-Preferences.json',note:'Only isolated test preferences retained; browser cache excluded'});}continue;}copyTree(p,q);}else if(e.isFile()){copyFileSync(p,q);archive.push({from:p,to:path.relative(evidence,q),integrity:byteIntegrity(readFileSync(q))});}else if(e.isSymbolicLink())archive.push({from:p,to:null,symlink:readlinkSync(p),note:'Inert link metadata; not copied as a live link'});}}
copyTree(run,path.join(evidence,'r07-payload'));
for(const [name,result]of [['r06',r06],['r06-boundaries',boundaries]]){const p=result.out.trim().split('\n').at(-1)?.replace(/^Evidence: /,'');if(p&&p.startsWith(r06root+'/')&&existsSync(p))copyTree(p,path.join(evidence,name+'-payload'));}
const latestCore=readdirSync(coreRoot).filter(p=>p.startsWith('regression-')).map(p=>path.join(coreRoot,p)).sort((a,b)=>lstatSync(b).mtimeMs-lstatSync(a).mtimeMs)[0];if(latestCore)copyTree(latestCore,path.join(evidence,'core-payload'));
writeFileSync(path.join(evidence,'archive.json'),JSON.stringify(archive,null,2));
writeFileSync(path.join(evidence,'summary.json'),JSON.stringify({at:new Date().toISOString(),source:before,commands,pilotPreserved:preserved,sourceUnchanged:true,usage:usage(),run,evidence,allExecutedCommandsPassed:commands.every(c=>c.status===0&&!c.killed),pilotPerformance:'NOT_RUN',safari:'OUT_OF_SCOPE_BY_HUMAN'},null,2));
console.log(evidence);process.exitCode=commands.some(c=>c.status!==0||c.killed)?1:0;

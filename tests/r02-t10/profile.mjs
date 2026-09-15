// D3: one public status with Node's built-in CPU profiler. No runtime patch.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync,readdirSync,lstatSync,realpathSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual as same} from 'node:util';
import {timedProcess} from './probe.mjs';
import {assertStatus,hash} from './fixtures.mjs';

const repo=fileURLToPath(new URL('../../',import.meta.url));
export const profileRoot=path.join(repo,'.test-output/r02-t10/profile-r1');
const profiles=path.join(profileRoot,'profiles'),profileName='QF-M-R02.cpuprofile';
const d2root=path.join(repo,'.test-output/r02-t10/probe-r2');
const fixtureRoot=path.join(d2root,'QF-M-R02'),expectedFile=path.join(d2root,'QF-M-R02.expected.json');
const entry=path.join(repo,'.agents/skills/kidea/scripts/kidea.mjs');
const nodeHash='ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32';
const d2ManifestHash='bbe5bae6df558b4f75ea29a1a254182815e2c3d01cc21a000f229a803629f40d';
const d2SummaryHash='f9fde4d6089e7cc8fd51a7f20924054d9e4f5925cc7473dd29a6e7b3af422986';
const suites=['tests/helper.test.mjs','tests/status.test.mjs','tests/r02-t06/cooperative-write.test.mjs','tests/r02-t07/init.test.mjs','tests/r02-t08/approve.test.mjs','tests/r02-t09/resume.test.mjs','tests/r02-t10/probe.test.mjs','tests/r02-t10/profile.test.mjs'];
const save=(name,data)=>writeFileSync(path.join(profileRoot,name),Buffer.isBuffer(data)?data:JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const inside=(base,p)=>{const rel=path.relative(base,p);return rel!=='..'&&!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel);};

function checkPath(p) {
  let here=path.parse(path.resolve(p)).root;
  for(const segment of path.resolve(p).slice(here.length).split(path.sep).filter(Boolean)) {
    here=path.join(here,segment);if(!existsSync(here))break;
    const s=lstatSync(here);assert.ok(!s.isSymbolicLink()&&(s.isDirectory()||s.isFile()&&s.nlink===1),'Unsafe path/alias');
    assert.equal(path.resolve(realpathSync(here)).toLowerCase(),path.resolve(here).toLowerCase(),'Reparse path');
  }
}
function tree(root) {
  checkPath(root);const files={},directories=[];
  function visit(dir) {
    for(const e of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
      const p=path.join(dir,e.name);checkPath(p);const relative=path.relative(root,p).replaceAll('\\','/');
      if(e.isDirectory()){directories.push(relative);visit(p);}else{const b=readFileSync(p);files[relative]={sha256:hash(b),bytes:b.length};}
    }
  }
  visit(root);return {files,directories:directories.sort()};
}
function runtime() {
  assert.equal(process.platform,'win32');assert.equal(process.version,'v24.21.0');assert.equal(hash(readFileSync(process.execPath)),nodeHash);
  assert.equal(path.resolve(process.execPath).toLowerCase(),path.resolve(repo,'.tools/node-v24.21.0-win-x64/node.exe').toLowerCase());
  assert.equal(path.resolve(repo).toLowerCase(),'d:\\code\\kynderis\\kidea');assert.deepEqual(process.execArgv,[]);
  for(const key of ['NODE_OPTIONS','NODE_V8_COVERAGE'])assert.ok(!process.env[key],key+' is not authorized');
  checkPath(repo);
}
function sourceFiles() {
  const list=['proposals/r02-t10-profile-r1.md','KIDEA_DESIGN.md','KIDEA_QUALITY.md','KIDEA_ACCEPTANCE.md','package.json','package-lock.json',...suites,'tests/fixtures/r02-t04/catalog.mjs'];
  for(const dir of ['.agents/skills/kidea','tests/r02-t10','node_modules/jsonc-parser'])for(const p of Object.keys(tree(path.join(repo,dir)).files))list.push(dir+'/'+p);
  return Object.fromEntries(list.sort().map(p=>{const b=readFileSync(path.join(repo,p));return [p,{sha256:hash(b),bytes:b.length}];}));
}
function host() {
  const command=`$ErrorActionPreference='Stop'; $o=Get-CimInstance Win32_OperatingSystem; $v=Get-Volume -DriveLetter D; $d=Get-Partition -DriveLetter D | Get-Disk; [ordered]@{os=@{name=$o.Caption;version=$o.Version;build=$o.BuildNumber;memoryKiB=$o.TotalVisibleMemorySize};cpu=@(Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors);volume=@{fileSystem=$v.FileSystem;driveType=[string]$v.DriveType;health=[string]$v.HealthStatus};disk=@{name=$d.FriendlyName;bus=[string]$d.BusType;number=$d.Number};physical=@(Get-PhysicalDisk | Select-Object FriendlyName,@{Name='MediaType';Expression={[string]$_.MediaType}});syncRoots=@($env:OneDrive,$env:OneDriveConsumer,$env:OneDriveCommercial) | Where-Object { $_ }} | ConvertTo-Json -Depth 6 -Compress`;
  const r=spawnSync('C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe',['-NoProfile','-NonInteractive','-Command',command],{encoding:'utf8',windowsHide:true,timeout:15000});
  assert.equal(r.status,0,'Host inspection failed');const h=JSON.parse(r.stdout);
  assert.equal(h.volume.fileSystem,'NTFS');assert.equal(h.volume.driveType,'Fixed');assert.equal(h.volume.health,'Healthy');
  assert.ok(h.physical.some(d=>d.FriendlyName===h.disk.name&&d.MediaType==='SSD'));
  for(const sync of h.syncRoots)assert.ok(!inside(sync,profileRoot),'Profile root is in a configured sync root');return h;
}
function retainedEvidence() {
  const manifest=readFileSync(path.join(d2root,'manifest.json')),summary=readFileSync(path.join(d2root,'summary.json'));
  assert.equal(hash(manifest),d2ManifestHash,'D2 manifest changed');assert.equal(hash(summary),d2SummaryHash,'D2 summary changed');
  return Object.fromEntries(['probe-r1','probe-r2'].map(n=>[n,tree(path.join(repo,'.test-output/r02-t10',n))]));
}
export function profileCommand() {
  return [process.execPath,'--cpu-prof',`--cpu-prof-dir=${profiles}`,`--cpu-prof-name=${profileName}`,'--cpu-prof-interval=1000',entry,'status'];
}

// Weighted elapsed sampling, not exact CPU/IO time. Inclusive values overlap;
// recursion of the same frame is credited once per sample, never summed twice.
export function summarizeProfile(p) {
  assert.ok(Array.isArray(p.nodes)&&Array.isArray(p.samples)&&Array.isArray(p.timeDeltas),'Missing CPU profile arrays');
  assert.ok(p.samples.length>0&&p.samples.length===p.timeDeltas.length,'Missing/mismatched samples');
  assert.ok(Number.isSafeInteger(p.startTime)&&Number.isSafeInteger(p.endTime)&&p.endTime>p.startTime,'Invalid profile times');
  const nodes=new Map(),parents=new Map(),frames=new Map();
  for(const n of p.nodes) {
    assert.ok(Number.isSafeInteger(n.id)&&n.id>0&&!nodes.has(n.id),'Duplicate/invalid node');
    const f=n.callFrame;assert.ok(f&&typeof f.functionName==='string'&&typeof f.url==='string'&&Number.isInteger(f.lineNumber)&&Number.isInteger(f.columnNumber),'Invalid call frame');
    const key=JSON.stringify([f.url,f.functionName,f.lineNumber,f.columnNumber]);nodes.set(n.id,{...n,key});
    if(!frames.has(key))frames.set(key,{functionName:f.functionName,url:f.url,lineNumber:f.lineNumber,columnNumber:f.columnNumber,selfUs:0,inclusiveUs:0,selfSamples:0,inclusiveSamples:0});
  }
  for(const n of nodes.values())for(const child of n.children??[]) {
    assert.ok(nodes.has(child)&&!parents.has(child),'Missing child or multiple parents');parents.set(child,n.id);
  }
  assert.equal([...nodes.keys()].filter(id=>!parents.has(id)).length,1,'Expected one profile root');
  // Validate even unsampled branches; malformed cycles must not hang analysis.
  for(const id of nodes.keys()){const seen=new Set();let at=id;while(at!==undefined){assert.ok(!seen.has(at),'Profile cycle');seen.add(at);at=parents.get(at);}}
  let sampledUs=0;
  for(let i=0;i<p.samples.length;i++) {
    const id=p.samples[i],delta=p.timeDeltas[i];assert.ok(nodes.has(id),'Sample has unknown node');
    assert.ok(Number.isSafeInteger(delta)&&delta>=0,'Invalid sample delta');sampledUs+=delta;
    const leaf=frames.get(nodes.get(id).key);leaf.selfUs+=delta;leaf.selfSamples++;
    const credited=new Set();let at=id;
    while(at!==undefined){const key=nodes.get(at).key;if(!credited.has(key)){const f=frames.get(key);f.inclusiveUs+=delta;f.inclusiveSamples++;credited.add(key);}at=parents.get(at);}
  }
  const durationUs=p.endTime-p.startTime;assert.ok(sampledUs<=durationUs,'Sample deltas exceed profile duration');
  return {kind:'WEIGHTED_SAMPLING_NOT_EXACT_CPU_OR_IO_TIME',durationUs,sampledUs,unattributedTailUs:durationUs-sampledUs,sampleCount:p.samples.length,
    frames:[...frames.values()].filter(f=>f.inclusiveSamples>0).map(f=>({...f,selfPercent:sampledUs?100*f.selfUs/sampledUs:0,inclusivePercent:sampledUs?100*f.inclusiveUs/sampledUs:0})).sort((a,b)=>b.selfUs-a.selfUs)};
}

function prepare() {
  runtime();checkPath(profileRoot);assert.ok(!existsSync(profileRoot),'Profile root exists; no replacement or retry');
  const retained=retainedEvidence(),d2=JSON.parse(readFileSync(path.join(d2root,'manifest.json'),'utf8'));
  const sources=sourceFiles(),environment=host();assert.deepEqual(environment,d2.environment,'D2 host changed');
  assert.deepEqual({version:process.version,path:process.execPath,sha256:nodeHash},d2.node,'D2 Node changed');
  for(const [p,info]of Object.entries(d2.sources))if(p.startsWith('.agents/skills/kidea/')||['tests/r02-t10/fixtures.mjs','tests/r02-t10/probe.mjs'].includes(p))assert.deepEqual(sources[p],info,'D2 runtime/generator/controller changed: '+p);
  const fixture=d2.fixtures.find(f=>f.id==='QF-M-R02');assert.equal(fixture.root,fixtureRoot);assert.equal(fixture.expectedFile,path.basename(expectedFile));
  assert.deepEqual(tree(fixtureRoot),fixture.inventory);assert.equal(hash(readFileSync(expectedFile)),fixture.expectedHash);
  mkdirSync(profileRoot);mkdirSync(profiles);
  save('preparation-start.json',{at:new Date().toISOString(),authorization:'Human Ok duyệt after 8a2aea3, D3 one profile only',sources,environment,retained});
  console.log(JSON.stringify({stage:'FULL_REGRESSION',suites,profilingAttempts:0}));
  const r=spawnSync(process.execPath,['--test',...suites],{cwd:repo,encoding:'utf8',windowsHide:true,timeout:300000,maxBuffer:32*1024**2});
  save('checks.stdout.txt',Buffer.from(r.stdout??''));save('checks.stderr.txt',Buffer.from(r.stderr??''));
  const checks={at:new Date().toISOString(),exitCode:r.status,error:r.error?.message??null,inputsUnchanged:same(sources,sourceFiles()),stdoutHash:hash(r.stdout??''),stderrHash:hash(r.stderr??'')};save('checks.result.json',checks);
  assert.equal(r.status,0,'Regression failed');assert.equal(checks.inputsUnchanged,true,'Regression sources changed');
  assert.deepEqual(retainedEvidence(),retained,'Old evidence changed');assert.deepEqual(host(),environment,'Host changed');
  save('manifest.json',{schemaVersion:1,authorization:'D3 approved after 8a2aea3',at:new Date().toISOString(),sourceBase:'8a2aea3159eb9137646ae42832e7d8fc6cb02d2a',node:{path:process.execPath,version:process.version,sha256:nodeHash},sources,environment,retained,d2ManifestHash,d2SummaryHash,fixture,expectedFile,command:profileCommand(),cwd:fixtureRoot,profilePath:path.join(profiles,profileName),attempts:1,timeoutMs:30000,retries:0,threshold:null,notes:'One instrumented public status only. Hash reads warm caches. No timing comparison to uninstrumented D1/D2; no per-syscall telemetry.'});
  console.log(JSON.stringify({prepared:profileRoot,manifestHash:hash(readFileSync(path.join(profileRoot,'manifest.json'))),profilingAttempts:0}));
}
async function run(presentedHash) {
  runtime();checkPath(profileRoot);const bytes=readFileSync(path.join(profileRoot,'manifest.json'));
  assert.match(presentedHash??'',/^[a-f0-9]{64}$/);assert.equal(hash(bytes),presentedHash,'Presented manifest changed');const m=JSON.parse(bytes);
  assert.equal(m.schemaVersion,1);assert.equal(m.attempts,1);assert.equal(m.timeoutMs,30000);assert.equal(m.retries,0);assert.equal(m.threshold,null);
  assert.deepEqual(m.command,profileCommand());assert.equal(m.cwd,fixtureRoot);assert.equal(m.profilePath,path.join(profiles,profileName));assert.equal(m.expectedFile,expectedFile);
  assert.deepEqual(sourceFiles(),m.sources);assert.deepEqual(host(),m.environment);assert.deepEqual(retainedEvidence(),m.retained);
  checkPath(profiles);assert.deepEqual(readdirSync(profiles),[],'Profile directory must be empty');
  save('run-start.json',{at:new Date().toISOString(),manifestHash:presentedHash,attempt:1,command:m.command,cwd:m.cwd});
  const result=await timedProcess(process.execPath,m.command.slice(1),m.cwd,{timeoutMs:30000});
  save('status.stdout.txt',result.stdout);save('status.stderr.txt',result.stderr);
  const errors=[];let outputValid=false,profileValid=false,sourcesUnchanged=false,hostUnchanged=false,retainedUnchanged=false,profileHash=null;
  try{assert.equal(result.stderr.length,0);assertStatus(JSON.parse(result.stdout.toString('utf8')),JSON.parse(readFileSync(expectedFile,'utf8')));outputValid=true;}catch(e){errors.push(e.message);}
  try{checkPath(m.profilePath);assert.deepEqual(readdirSync(profiles),[profileName]);const b=readFileSync(m.profilePath);profileHash=hash(b);const analysis=summarizeProfile(JSON.parse(b));save('analysis.json',analysis);profileValid=true;}catch(e){errors.push(e.message);}
  try{sourcesUnchanged=same(sourceFiles(),m.sources)&&hash(readFileSync(path.join(profileRoot,'manifest.json')))===presentedHash;hostUnchanged=same(host(),m.environment);retainedUnchanged=same(retainedEvidence(),m.retained);}catch(e){errors.push(e.message);}
  const {stdout,stderr,...observed}=result;
  const success=result.code===0&&!result.timedOut&&!result.overflow&&!result.error&&result.confirmedStopped&&outputValid&&profileValid&&sourcesUnchanged&&hostUnchanged&&retainedUnchanged;
  const summary={at:new Date().toISOString(),manifestHash:presentedHash,attempted:1,retries:0,success,...observed,outputValid,profileValid,sourcesUnchanged,hostUnchanged,retainedUnchanged,profileHash,stdoutHash:hash(stdout),stderrHash:hash(stderr),errors,verification:'DIAGNOSTIC_ONLY_NOT_PERFORMANCE_ACCEPTANCE'};
  save('summary.json',summary);console.log(JSON.stringify(summary));process.exitCode=success?0:1;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try{if(process.argv[2]==='prepare'){assert.equal(process.argv.length,3);prepare();}else if(process.argv[2]==='run'){assert.equal(process.argv.length,4);await run(process.argv[3]);}else throw new Error('Use prepare or run <manifest hash>; no retry/reset/recovery');}
  catch(e){console.error(JSON.stringify({error:e.message,action:'STOP; retain evidence; no automatic retry'}));process.exitCode=1;}
}

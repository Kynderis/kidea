// Acceptance-r1 only. D1/D2/D3/D4 evidence is read-only; no replacement roots.
// Historical Windows measurement controller: preserve its exact runtime/host and
// authorization guards. Active cross-platform unit tests import only utilities;
// these old measurements are not rerun or certified for a different host.
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync,readdirSync,lstatSync,realpathSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {performance} from 'node:perf_hooks';
import {isDeepStrictEqual as same} from 'node:util';
import {workloads,buildFixture,assertStatus,hash} from './fixtures.mjs';
import {inspectStatusGraph} from '../../.agents/skills/kidea/scripts/status.mjs';

const repo=fileURLToPath(new URL('../../',import.meta.url));
export const runRoot=path.join(repo,'.test-output/r02-t10/acceptance-r1');
const baselineRoot=path.join(repo,'.test-output/r02-t10/probe-r3');
const baselineManifestHash='cfd607a62703e3ff00dacf13642c0d121272396def62dca8ae07ea4b5bc965eb';
const baselineSummaryHash='f6d8e0a7ace1872ea43b6e5aafdec3ce2f906e4cce01f33c2eba61f1fa08101c';
const thresholds=Object.freeze({'QF-S-R02':2000,'QF-M-R02':5000});
const retainedRuns=[
  ['probe-r1','c812d4fdb8cc06c2f6da2dc93e544a8f42c2169322f83d29bf1035e9b71d1fae','0b086738c801241c582cf776675cad9f3bc14a70c85a411c0bd43c5274e0f82a'],
  ['probe-r2','bbe5bae6df558b4f75ea29a1a254182815e2c3d01cc21a000f229a803629f40d','f9fde4d6089e7cc8fd51a7f20924054d9e4f5925cc7473dd29a6e7b3af422986'],
  ['probe-r3',baselineManifestHash,baselineSummaryHash],
  ['profile-r1','9c72b628a4ad22c20cbf385820716c8b38ce9fa5c948d0aec304875fb58dbfbb','f561cfebe3a92c2d653d89243412160664840dc9f2c42cf850d16103aadf86ba'],
];
const nodeHash='ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32';
const entry=path.join(repo,'.agents/skills/kidea/scripts/kidea.mjs');
const proposal='proposals/r02-t10-status-acceptance-r1.md';
const suites=['tests/helper.test.mjs','tests/status.test.mjs','tests/r02-t06/cooperative-write.test.mjs','tests/r02-t07/init.test.mjs','tests/r02-t08/approve.test.mjs','tests/r02-t09/resume.test.mjs','tests/r02-t10/probe.test.mjs','tests/r02-t10/profile.test.mjs'];
const save=(name,data)=>writeFileSync(path.join(runRoot,name),Buffer.isBuffer(data)?data:JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const load=name=>JSON.parse(readFileSync(path.join(runRoot,name),'utf8'));
const fail=code=>{throw new Error(code);};
const inside=(base,p)=>{const relative=path.relative(base,p);return relative!== '..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative);};

function checkPath(p) {
  let here=path.parse(path.resolve(p)).root;
  for(const segment of path.resolve(p).slice(here.length).split(path.sep).filter(Boolean)) {
    here=path.join(here,segment);if(!existsSync(here))break;
    const stat=lstatSync(here);assert.ok(!stat.isSymbolicLink()&&(stat.isDirectory()||stat.isFile()&&stat.nlink===1),'Unsafe path/alias');
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
  visit(root);return {directories:directories.sort(),files};
}
function runtime() {
  assert.equal(process.platform,'win32');assert.equal(process.version,'v24.21.0');assert.equal(hash(readFileSync(process.execPath)),nodeHash);
  assert.equal(path.resolve(process.execPath).toLowerCase(),path.resolve(repo,'.tools/node-v24.21.0-win-x64/node.exe').toLowerCase());
  assert.equal(path.resolve(repo).toLowerCase(),'d:\\code\\kynderis\\kidea');checkPath(repo);
  for(const key of ['NODE_OPTIONS','NODE_V8_COVERAGE'])assert.ok(!process.env[key],key+' is not authorized');
}
function sourceFiles() {
  const list=[proposal,'KIDEA_DESIGN.md','KIDEA_QUALITY.md','KIDEA_ACCEPTANCE.md','package.json','package-lock.json',...suites,'tests/fixtures/r02-t04/catalog.mjs','.tools/node-v24.21.0-win-x64/node.exe',...retainedRuns.flatMap(([name])=>['manifest.json','summary.json'].map(file=>`.test-output/r02-t10/${name}/${file}`))];
  for(const dir of ['.agents/skills/kidea','tests/r02-t10','node_modules/jsonc-parser']) {
    for(const [p]of Object.entries(tree(path.join(repo,dir)).files))list.push(dir+'/'+p);
  }
  return Object.fromEntries(list.sort().map(p=>{const b=readFileSync(path.join(repo,p));return [p,{sha256:hash(b),bytes:b.length}];}));
}
function host() {
  const command=`$ErrorActionPreference='Stop'; $o=Get-CimInstance Win32_OperatingSystem; $v=Get-Volume -DriveLetter D; $d=Get-Partition -DriveLetter D | Get-Disk; [ordered]@{os=@{name=$o.Caption;version=$o.Version;build=$o.BuildNumber;memoryKiB=$o.TotalVisibleMemorySize};cpu=@(Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors);volume=@{fileSystem=$v.FileSystem;driveType=[string]$v.DriveType;health=[string]$v.HealthStatus};disk=@{name=$d.FriendlyName;bus=[string]$d.BusType;number=$d.Number};physical=@(Get-PhysicalDisk | Select-Object FriendlyName,@{Name='MediaType';Expression={[string]$_.MediaType}});syncRoots=@($env:OneDrive,$env:OneDriveConsumer,$env:OneDriveCommercial) | Where-Object { $_ }} | ConvertTo-Json -Depth 6 -Compress`;
  const result=spawnSync('C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe',['-NoProfile','-NonInteractive','-Command',command],{encoding:'utf8',windowsHide:true,timeout:15000});
  assert.equal(result.status,0,'Host inspection failed');const h=JSON.parse(result.stdout);
  assert.equal(h.volume.fileSystem,'NTFS');assert.equal(h.volume.driveType,'Fixed');assert.equal(h.volume.health,'Healthy');
  assert.ok(h.physical.some(d=>d.FriendlyName===h.disk.name&&d.MediaType==='SSD'),'SSD identity not established');
  for(const sync of h.syncRoots)assert.ok(!inside(sync,runRoot),'Run root is inside a configured sync root');
  return h;
}

export function summarize(rows) {
  const values=rows.filter(r=>r.success).map(r=>r.elapsedMs).sort((a,b)=>a-b);
  return {requested:11,attempted:rows.length,successful:values.length,timeouts:rows.filter(r=>r.timedOut).length,errors:rows.filter(r=>!r.success&&!r.timedOut).length,notRun:11-rows.length,
    firstMs:rows[0]?.elapsedMs??null,medianSuccessfulMs:values.length?(values[Math.floor((values.length-1)/2)]+values[Math.floor(values.length/2)])/2:null,maxSuccessfulMs:values.at(-1)??null};
}
export function acceptance(rows,baselineUnchanged,stopReason) {
  const groups=Object.fromEntries(Object.entries(thresholds).map(([id,thresholdMs])=>{
    const samples=rows.filter(r=>r.fixture===id);
    const within=r=>Number.isFinite(r.elapsedMs)&&r.elapsedMs>=0&&r.elapsedMs<=thresholdMs;
    const accepted=samples.length===11&&new Set(samples.map(r=>r.iteration)).size===11&&samples.every(r=>Number.isInteger(r.iteration)&&r.iteration>=1&&r.iteration<=11&&r.success&&r.confirmedStopped&&within(r));
    return [id,{thresholdMs,withinThreshold:samples.filter(within).length,overThreshold:samples.filter(r=>Number.isFinite(r.elapsedMs)&&r.elapsedMs>thresholdMs).length,accepted}];
  }));
  return {groups,accepted:rows.length===22&&baselineUnchanged===true&&stopReason===null&&Object.values(groups).every(g=>g.accepted)};
}
export async function timedProcess(executable,args,cwd,{timeoutMs=30000,maxBytes=32*1024**2}={}) {
  const chunks=[],errors=[];let count=0,timedOut=false,overflow=false,error=null,killed=false;
  const start=performance.now();
  const child=spawn(executable,args,{cwd,windowsHide:true,stdio:['ignore','pipe','pipe']});
  const kill=()=>{if(child.pid&&child.exitCode===null&&child.signalCode===null)killed=child.kill('SIGTERM');};
  const receive=(list,b)=>{count+=b.length;if(count<=maxBytes)list.push(b);else{overflow=true;kill();}};
  child.stdout.on('data',b=>receive(chunks,b));child.stderr.on('data',b=>receive(errors,b));
  child.on('error',e=>{error=e.message;});
  const timer=setTimeout(()=>{timedOut=true;kill();},timeoutMs);
  // Only this fixed status process is measured. The frozen local-only fixture
  // contains no Git/external refs; status never launches project commands.
  const ended=await new Promise(resolve=>child.once('close',(code,signal)=>resolve({code,signal})));
  const elapsedMs=performance.now()-start;clearTimeout(timer);
  return {...ended,pid:child.pid??null,elapsedMs,timedOut,overflow,error,killed,confirmedStopped:true,stdout:Buffer.concat(chunks),stderr:Buffer.concat(errors)};
}
export function mayContinue(result,sourcesMatch,hostMatches,outputValid) {
  return result.confirmedStopped&&!result.overflow&&!result.error&&sourcesMatch&&hostMatches&&(result.timedOut||result.code===0&&outputValid);
}

// Compare regenerated bytes/expected values against the retained D4 manifest,
// never against status output or merely the minimum workload size.
export function assertBaselineFixture(built,baseline) {
  assert.ok(baseline,'Missing D4 workload');
  assert.deepEqual(built.stats,baseline.stats,'D4 workload stats changed');
  assert.deepEqual(Object.fromEntries([...built.files].map(([p,b])=>[p,{sha256:hash(b),bytes:b.length}])),baseline.inventory.files,'D4 fixture bytes changed');
  assert.equal(hash(JSON.stringify(built.expected,null,2)+'\n'),baseline.expectedHash,'D4 expected output changed');
}
function baselineState() {
  const evidence={};
  for(const [name,manifestHash,summaryHash]of retainedRuns){
    const root=path.join(repo,'.test-output/r02-t10',name);checkPath(root);
    assert.equal(hash(readFileSync(path.join(root,'manifest.json'))),manifestHash,name+' manifest changed');
    assert.equal(hash(readFileSync(path.join(root,'summary.json'))),summaryHash,name+' summary changed');evidence[name]=tree(root);
  }
  return {root:baselineRoot,manifestHash:baselineManifestHash,summaryHash:baselineSummaryHash,evidence};
}

function prepare() {
  runtime();checkPath(runRoot);assert.ok(!existsSync(runRoot),'Run root already exists; never overwrite or choose a replacement run');
  const baseline=baselineState(),d4=JSON.parse(readFileSync(path.join(baselineRoot,'manifest.json'),'utf8'));
  const environment=host(),sources=sourceFiles();
  assert.deepEqual(environment,d4.environment,'D4 host identity differs');
  assert.deepEqual({version:process.version,path:process.execPath,sha256:nodeHash},d4.node,'D4 Node identity differs');
  assert.deepEqual(sources['tests/r02-t10/fixtures.mjs'],d4.sources['tests/r02-t10/fixtures.mjs'],'D4 generator changed');
  for(const [file,identity]of Object.entries(d4.sources).filter(([file])=>file.startsWith('.agents/skills/kidea/')))assert.deepEqual(sources[file],identity,'D4 runtime changed: '+file);
  assert.equal(sources['.agents/skills/kidea/scripts/status.mjs'].sha256,'5ccac5c47977f26ff4cf76aa493bddafe324649acf04a7376b0818408b94de13','Approved native runtime changed');
  mkdirSync(path.dirname(runRoot),{recursive:true});mkdirSync(runRoot);
  save('preparation-start.json',{at:new Date().toISOString(),authorization:'Human Duyệt after 85866d9 answer; status acceptance-r1 only',environment,sources,baseline});
  console.log(JSON.stringify({stage:'FULL_REGRESSION_BEFORE_PREPARATION',suites,measurementsStarted:0}));
  const checks=spawnSync(process.execPath,['--test',...suites],{cwd:repo,encoding:'utf8',windowsHide:true,timeout:300000,maxBuffer:32*1024**2});
  save('checks.stdout.txt',Buffer.from(checks.stdout??''));save('checks.stderr.txt',Buffer.from(checks.stderr??''));
  const checkResult={at:new Date().toISOString(),suites,exitCode:checks.status,error:checks.error?.message??null,inputsUnchanged:same(sources,sourceFiles()),stdoutHash:hash(checks.stdout??''),stderrHash:hash(checks.stderr??'')};
  save('checks.result.json',checkResult);assert.equal(checks.status,0,'Full regression failed; no fixture/manifest/measurement');assert.equal(checkResult.inputsUnchanged,true,'Regression inputs changed');
  const fixtures=[];
  for(const w of workloads) {
    const built=buildFixture(w),original=d4.fixtures.find(f=>f.id===w.id),root=path.join(runRoot,w.id);
    assertBaselineFixture(built,original);assert.deepEqual(tree(original.root),original.inventory,'Retained D4 fixture changed');
    mkdirSync(root);
    for(const [p,b]of built.files) {const target=path.join(root,p);assert.ok(inside(root,target));checkPath(target);mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,b,{flag:'wx'});}
    const graph=inspectStatusGraph(root,new Map(),[],{allowGit:false});assertStatus(graph.status,built.expected);
    assert.deepEqual([...graph.reads.keys()].sort(),[...built.files.keys()].sort(),'An input counted toward workload was not read');
    assert.equal(graph.gitReadCount,0);assert.equal(graph.absent.size,0);
    const inventory=tree(root),expectedFile=`${w.id}.expected.json`;save(expectedFile,built.expected);
    assert.deepEqual(inventory,original.inventory,'Regenerated acceptance tree differs from D4');
    const groups={};for(const [p,info]of Object.entries(inventory.files)) {const group=p.startsWith('docs/')?'productDocs':p.includes('/evidence/')?'reviewEvidence':p.startsWith('.kidea/checkpoints/')?'checkpoint':'coordination';groups[group]??={files:0,bytes:0};groups[group].files++;groups[group].bytes+=info.bytes;}
    fixtures.push({id:w.id,root,stats:built.stats,groups,inventory,expectedFile,expectedHash:hash(readFileSync(path.join(runRoot,expectedFile))),preparationReadInventory:[...graph.reads].map(([p,b])=>({path:p,sha256:hash(b),bytes:b.length})).sort((a,b)=>a.path.localeCompare(b.path)),command:[process.execPath,entry,'status'],cwd:root});
  }
  assert.ok(same(sources,sourceFiles()),'Source changed during preparation');assert.ok(same(environment,host()),'Host identity changed');assert.deepEqual(baselineState(),baseline,'Retained evidence changed during preparation');
  save('manifest.json',{schemaVersion:1,at:new Date().toISOString(),authorization:'Status acceptance-r1 approved by Human after 85866d9; no AI/profiler/sandbox/ACL/install',sourceBase:'85866d92de0a05c257818fc1114f46f87ccf896f',baseline,node:{version:process.version,path:process.execPath,sha256:nodeHash},sources,environment,fixtures,iterationsPerFixture:11,totalIterations:22,timeoutMs:30000,retries:0,threshold:thresholds,
    conditions:{cooperative:'Human-approved single cooperative run; exclusive new fixture root, no known other writer; not an OS lock',sync:'Outside configured OneDrive roots; no claim to detect every third-party sync tool',cache:'Fresh child each sample. Preparation and integrity checks read inputs and warm OS caches; no OS-cache eviction. First means first measured sample, not cold disk.',readCoverage:'Unique file read inventory captured by unmodified status engine during preparation, not per-sample OS I/O telemetry'}});
  console.log(JSON.stringify({prepared:runRoot,manifestHash:hash(readFileSync(path.join(runRoot,'manifest.json'))),workloads:fixtures.map(f=>({id:f.id,...f.stats,groups:f.groups})),measurementsStarted:0}));
}

async function run(expectedManifestHash) {
  runtime();checkPath(runRoot);const manifestBytes=readFileSync(path.join(runRoot,'manifest.json'));
  assert.match(expectedManifestHash??'',/^[a-f0-9]{64}$/);assert.equal(hash(manifestBytes),expectedManifestHash,'Presented manifest changed');
  const m=JSON.parse(manifestBytes);assert.equal(m.schemaVersion,1);
  assert.deepEqual(baselineState(),m.baseline,'Retained evidence changed before acceptance run');
  assert.equal(m.totalIterations,22);assert.equal(m.iterationsPerFixture,11);assert.equal(m.timeoutMs,30000);assert.equal(m.retries,0);assert.deepEqual(m.threshold,thresholds);
  assert.deepEqual(m.fixtures.map(f=>f.id),workloads.map(w=>w.id));
  assert.ok(same(m.sources,sourceFiles()),'Frozen sources changed');assert.ok(same(m.environment,host()),'Host changed');
  for(const f of m.fixtures){assert.equal(f.root,path.join(runRoot,f.id));assert.equal(f.expectedFile,`${f.id}.expected.json`);assert.deepEqual(f.command,[process.execPath,entry,'status']);assert.equal(f.cwd,f.root);assert.ok(same(f.inventory,tree(f.root)),'Fixture changed');assert.equal(hash(readFileSync(path.join(runRoot,f.expectedFile))),f.expectedHash);}
  save('run-start.json',{at:new Date().toISOString(),manifestHash:hash(manifestBytes),requested:22});
  const rows=[];let stopReason=null;
  for(const f of m.fixtures) {
    for(let iteration=1;iteration<=11;iteration++) {
      const prefix=`${f.id}-${String(iteration).padStart(2,'0')}`,auditStart=performance.now();
      try {
        assert.equal(hash(readFileSync(path.join(runRoot,'manifest.json'))),hash(manifestBytes));assert.ok(same(m.sources,sourceFiles()),'Sources changed');
        for(const fixture of m.fixtures)assert.ok(same(fixture.inventory,tree(fixture.root)),'Fixture changed');
        assert.ok(same(m.environment,host()),'Host changed');
        assert.equal(hash(readFileSync(path.join(runRoot,f.expectedFile))),f.expectedHash,'Expected changed');
      }catch(e){stopReason=e.message;save(`${prefix}.precheck-failure.json`,{at:new Date().toISOString(),reason:stopReason});break;}
      const precheckMs=performance.now()-auditStart;
      save(`${prefix}.started.json`,{at:new Date().toISOString(),iteration,fixture:f.id,precheckMs,command:f.command,cwd:f.root});
      const result=await timedProcess(process.execPath,[entry,'status'],f.root);
      const verifyStart=performance.now();save(`${prefix}.stdout.txt`,result.stdout);save(`${prefix}.stderr.txt`,result.stderr);
      let outputValid=false,validationError=null;
      try{assert.equal(result.stderr.length,0);assertStatus(JSON.parse(result.stdout.toString('utf8')),load(f.expectedFile));outputValid=true;}catch(e){validationError=e.message;}
      let sourcesMatch=false,hostMatches=false;
      try{sourcesMatch=same(m.sources,sourceFiles())&&m.fixtures.every(fixture=>same(fixture.inventory,tree(fixture.root)))&&hash(readFileSync(path.join(runRoot,f.expectedFile)))===f.expectedHash&&hash(readFileSync(path.join(runRoot,'manifest.json')))===hash(manifestBytes);hostMatches=same(m.environment,host());}catch(e){validationError??=e.message;}
      const {stdout,stderr,...observed}=result;
      const row={fixture:f.id,iteration,...observed,outputValid,validationError,sourcesMatch,hostMatches,success:result.code===0&&!result.timedOut&&!result.error&&!result.overflow&&outputValid&&sourcesMatch&&hostMatches,stdoutHash:hash(stdout),stderrHash:hash(stderr),postcheckMs:performance.now()-verifyStart};
      save(`${prefix}.result.json`,row);rows.push(row);console.log(JSON.stringify({fixture:f.id,iteration,elapsedMs:row.elapsedMs,success:row.success,timedOut:row.timedOut}));
      if(!mayContinue(result,sourcesMatch,hostMatches,outputValid)){stopReason='Precondition/output/termination failure; remaining samples not started';break;}
    }
    if(stopReason)break;
  }
  let baselineUnchanged=false;
  try{baselineUnchanged=same(baselineState(),m.baseline);if(!baselineUnchanged)stopReason??='Retained evidence changed';}catch(e){stopReason??=e.message;}
  const verdict=acceptance(rows,baselineUnchanged,stopReason);
  const summary={at:new Date().toISOString(),manifestHash:hash(manifestBytes),baselineManifestHash,baselineUnchanged,requested:22,attempted:rows.length,notRun:22-rows.length,stopReason,verification:'STATUS_LOCAL_ACCEPTANCE_ONLY',acceptance:verdict,workloads:Object.fromEntries(m.fixtures.map(f=>[f.id,summarize(rows.filter(r=>r.fixture===f.id))])),rows};
  save('summary.json',summary);console.log(JSON.stringify(summary.workloads));
  process.exitCode=verdict.accepted?0:1;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {if(process.argv[2]==='prepare'){assert.equal(process.argv.length,3);prepare();}else if(process.argv[2]==='run'){assert.equal(process.argv.length,4);await run(process.argv[3]);}else fail('Use prepare or run <presented-manifest-sha256> only; no retry/reset/recovery mode');}
  catch(e){console.error(JSON.stringify({error:e.message,action:'STOP; retain all evidence; no automatic retry'}));process.exitCode=1;}
}

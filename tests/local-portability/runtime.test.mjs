// Portable policy and real local-file checks. Mock version strings are not
// evidence of execution on another Node version, OS or CPU architecture.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runtimeInfo,hasLocalAssumptions,assertLocalRoot,portablePathKey,checkedEntryName} from '../../.agents/skills/kidea/scripts/runtime.mjs';
import {resolveGitExecutable} from '../../.agents/skills/kidea/scripts/git-versions.mjs';
import {validPath} from '../../.agents/skills/kidea/scripts/schema.mjs';
import {prepareInit,initialize,initToolIdentity} from '../../.agents/skills/kidea/scripts/init.mjs';
import {readStatus} from '../../.agents/skills/kidea/scripts/status.mjs';
import {prepareBootstrapRequest} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';

const repo=fileURLToPath(new URL('../../',import.meta.url));
const output=path.join(repo,'.test-output/local-portability');fs.mkdirSync(output,{recursive:true});
const run=fs.mkdtempSync(path.join(output,'runtime-'));console.log('Portable runtime evidence: '+run);
const fixture=label=>fs.realpathSync(fs.mkdtempSync(path.join(run,label+'-')));
function request(root) {return {projectName:'Local thử nghiệm',humanRequest:'Synthetic local-only idea',
  featureSource:{mode:'NEW',path:'docs/features.md',anchor:null,confirmed:true},profiles:[],
  permission:{root,metadataRoot:'.kidea/checkpoints',targets:[{path:'.kidea/INDEX.md',action:'CREATE'},{path:'.kidea/work.md',action:'CREATE'},{path:'docs/features.md',action:'CREATE'}],
    createDirectories:['docs'],bootstrap:true,allowRestoreUpdate:false,allowRetireOwnPending:true,
    assumptions:{localFilesystem:true,noActiveSync:true,singleKideaRun:true},statement:'Synthetic Human grant for only these local fixture files and checkpoint metadata.'}};}

test('runtime floor is Node 24, not an exact patch, binary or upper major lock',()=>{
  for(const v of ['24.0.0','24.21.0','24.99.1','26.0.0','30.1.0'])assert.equal(runtimeInfo(v).compatibleVersion,true,v);
  for(const v of ['22.18.0','23.9.0','bad','24','24.0'])assert.equal(runtimeInfo(v).compatibleVersion,false,v);
  assert.equal(runtimeInfo('26.1.0',null).lts,null);
  assert.equal(runtimeInfo('24.1.0','Krypton').lts,'Krypton');
});
test('runtime identity records actual version architecture and executable bytes without old pin',()=>{
  const identity=initToolIdentity(),runtime=identity.components.find(c=>c.name===`node-${process.versions.node}-${process.platform}-${process.arch}`);
  assert.ok(runtime);assert.equal(runtime.integrity.byteLength,fs.statSync(process.execPath).size);
  assert.ok(identity.components.some(c=>c.name==='runtime.mjs'));
});
test('local grant is identical on Windows and both Mac architectures; missing facts never default true',()=>{
  for(const platform of ['win32','darwin'])assert.equal(hasLocalAssumptions({localFilesystem:true,noActiveSync:true,singleKideaRun:true},platform),true);
  for(const key of ['localFilesystem','noActiveSync','singleKideaRun']){
    const a={localFilesystem:true,noActiveSync:true,singleKideaRun:true};delete a[key];assert.equal(hasLocalAssumptions(a),false,key);
  }
  assert.equal(hasLocalAssumptions(null),false);
});
test('legacy localNtfs grants remain Windows-only and cannot override explicit denial',()=>{
  const a={localNtfs:true,noActiveSync:true,singleKideaRun:true};
  assert.equal(hasLocalAssumptions(a,'win32'),true);assert.equal(hasLocalAssumptions(a,'darwin'),false);
  assert.equal(hasLocalAssumptions({...a,localFilesystem:false},'win32'),false);
});
test('network and device namespace roots are rejected by syntax before filesystem reads',()=>{
  for(const p of ['\\\\server\\share','//server/share','\\\\?\\C:\\project','smb://server/share','file://server/share'])assert.throws(()=>assertLocalRoot(p),{code:'LOCAL_DIRECTORY_REQUIRED'});
  assert.doesNotThrow(()=>assertLocalRoot(run));
});
test('record paths exclude nonportable special filenames without rejecting Vietnamese',()=>{
  for(const p of ['x<y','x>y','x"y','x|y','x?y','x*y','CON.md','dir/aux','x.','x ','../x','/x','C:/x','dir\\x'])assert.equal(validPath(p),false,p);
  for(const p of ['docs/Đăng ký.md','files/a-b_1.json'])assert.equal(validPath(p),true,p);
});
test('Unicode comparison preserves disk spelling and never rewrites contents',()=>{
  const root=fixture('unicode'),nfd='Phạm vi.md'.normalize('NFD'),nfc=nfd.normalize('NFC');
  fs.writeFileSync(path.join(root,nfd),'Exact source\r\n');
  const stored=fs.readdirSync(root)[0];assert.equal(checkedEntryName(root,nfc),stored);
  assert.equal(portablePathKey(nfd),portablePathKey(nfc));assert.equal(fs.readFileSync(path.join(root,stored),'utf8'),'Exact source\r\n');
});
test('case and Unicode alias collisions are rejected independent of host filesystem',()=>{
  const root=fixture('alias');fs.writeFileSync(path.join(root,'Rules.md'),'keep');
  assert.throws(()=>checkedEntryName(root,'rules.md'),{code:'AMBIGUOUS_PATH_ALIAS'});
  assert.throws(()=>checkedEntryName(root,'Rules.md',['Rules.md','rules.md']),{code:'AMBIGUOUS_PATH_ALIAS'});
  assert.throws(()=>checkedEntryName(root,'é.md',['é.md','e\u0301.md']),{code:'AMBIGUOUS_PATH_ALIAS'});
});
test('Git discovery uses the trusted absolute host path, never relative or project shadow executables',()=>{
  const root=fixture('git-shadow'),actual=resolveGitExecutable(root),fake=path.join(root,process.platform==='win32'?'git.exe':'git');
  fs.writeFileSync(fake,'must not execute');
  assert.equal(resolveGitExecutable(root,{env:{PATH:[root,'.','relative',path.dirname(actual)].join(path.delimiter)}}),actual);
  assert.equal(resolveGitExecutable(root,{env:{KIDEA_GIT_EXECUTABLE:actual,PATH:''}}),actual);
  for(const env of [{PATH:root},{PATH:'.'},{KIDEA_GIT_EXECUTABLE:fake,PATH:path.dirname(actual)},{KIDEA_GIT_EXECUTABLE:'git',PATH:path.dirname(actual)}])assert.throws(()=>resolveGitExecutable(root,{env}),{code:'GIT_UNAVAILABLE'});
});
test('invalid configured Git cannot fall back and explicit network candidates are rejected',()=>{
  const root=fixture('git-invalid');
  for(const candidate of [path.join(root,'missing'), '\\\\server\\share\\git.exe','//server/share/git'])assert.throws(()=>resolveGitExecutable(root,{env:{...process.env,KIDEA_GIT_EXECUTABLE:candidate}}),{code:'GIT_UNAVAILABLE'});
});
test('new local grant initializes through public API and retains schema and approval gates',async()=>{
  const root=fixture('local-init'),r=request(root),result=await initialize(root,r);
  assert.equal(result.state,'INITIALIZED',JSON.stringify(result));
  assert.equal(readStatus(root).readState,'OK');assert.equal(prepareInit(root,r).state,'ALREADY_INITIALIZED');
  const work=fs.readFileSync(path.join(root,'.kidea/work.md'),'utf8');assert.ok(work.includes('"schemaVersion": 2'));assert.ok(work.includes('"reviewRefs": []'));
});
test('denied local or sync assumptions reject before creating any metadata',()=>{
  for(const key of ['localFilesystem','noActiveSync','singleKideaRun']){
    const root=fixture('denied'),r=request(root);r.permission.assumptions[key]=false;
    assert.throws(()=>prepareInit(root,r),{code:'ENVIRONMENT_NOT_CONFIRMED'});assert.deepEqual(fs.readdirSync(root),[]);
  }
});
test('bootstrap rejects case-alias parent before creating metadata',()=>{
  const root=fixture('case-parent'),r=request(root);fs.mkdirSync(path.join(root,'Docs'));
  assert.throws(()=>prepareInit(root,r),{code:'AMBIGUOUS_PATH_ALIAS'});assert.deepEqual(fs.readdirSync(root),['Docs']);
});
test('public existing-source init resolves Unicode spelling with exact original bytes',async()=>{
  const root=fixture('existing-unicode'),r=request(root),nfd='Phạm vi.md'.normalize('NFD');
  fs.mkdirSync(path.join(root,'docs'));const source=Buffer.from('# Exact idea\r\n');fs.writeFileSync(path.join(root,'docs',nfd),source);
  r.featureSource={mode:'EXISTING',path:'docs/'+nfd.normalize('NFC'),anchor:null,confirmed:true};r.permission.targets.pop();r.permission.createDirectories=[];
  const result=await initialize(root,r);assert.equal(result.state,'INITIALIZED',JSON.stringify(result));
  assert.deepEqual(fs.readFileSync(path.join(root,'docs',fs.readdirSync(path.join(root,'docs'))[0])),source);assert.equal(readStatus(root).readState,'OK');
});

test('CREATE uses actual Unicode parent spelling and creates authorized nested directories',async()=>{
  const root=fixture('unicode-parent'),r=request(root),nfd='Phạm vi'.normalize('NFD'),nfc=nfd.normalize('NFC');
  fs.mkdirSync(path.join(root,nfd));const stored=fs.readdirSync(root)[0];
  r.featureSource.path=nfc+'/nested/features.md';r.permission.targets[2].path=r.featureSource.path;
  r.permission.createDirectories=[nfc+'/nested'];
  const result=await initialize(root,r);assert.equal(result.state,'INITIALIZED',JSON.stringify(result));
  assert.ok(fs.statSync(path.join(root,stored,'nested/features.md')).isFile());
  assert.deepEqual(fs.readdirSync(root).filter(n=>n!=='.kidea'),[stored]);assert.equal(readStatus(root).readState,'OK');
});

test('bootstrap rejects differing new parent spellings before creating either tree',()=>{
  for(const [first,second] of [['new','NEW'],['é','e\u0301']]){
    const root=fixture('new-parent-alias'),r=request(root);
    const targets=['.kidea/INDEX.md','.kidea/work.md',first+'/A.md',second+'/B.md'].map(p=>({path:p,action:'CREATE',plannedBytes:Buffer.from('synthetic')}));
    r.permission.targets=targets.map(({path,action})=>({path,action}));r.permission.createDirectories=[first,second];
    assert.throws(()=>prepareBootstrapRequest({root,authorization:r.permission,context:{},targets,
      bootstrap:{directories:[first,second],evidence:[]},operationId:'11111111-1111-4111-8111-111111111111'}),{code:'AMBIGUOUS_PATH_ALIAS'});
    assert.deepEqual(fs.readdirSync(root),[]);
  }
});

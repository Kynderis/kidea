import {mkdirSync,writeFileSync,readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {readMapSources,traceabilityMap,mapResult} from '../../.agents/skills/kidea/scripts/maps.mjs';
import {webMap} from '../../.agents/skills/kidea/scripts/maps-web.mjs';
import {buildBase} from '../fixtures/r02-t04/catalog.mjs';
import {readChange,prepareChange} from '../../.agents/skills/kidea/scripts/change.mjs';
import {executeInternalWrite} from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import {readStatus} from '../../.agents/skills/kidea/scripts/status.mjs';
import {byteIntegrity} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const root=path.join(repo,'.test-output/r06','boundaries-'+new Date().toISOString().replace(/[:.]/g,'-'));mkdirSync(root);
const sources=()=>Object.fromEntries(readdirSync(path.join(repo,'.agents/skills/kidea/scripts')).filter(p=>p.endsWith('.mjs')).map(p=>[p,byteIntegrity(readFileSync(path.join(repo,'.agents/skills/kidea/scripts',p)))]));
const before=sources(),results=[];const ref=path=>({path,anchor:null});
const put=(base,p,b)=>{mkdirSync(path.dirname(path.join(base,p)),{recursive:true});writeFileSync(path.join(base,p),b);};
async function test(id,fn){const dir=path.join(root,id);mkdirSync(dir);try{await fn(dir);results.push({id,status:'PASS'});}catch(e){results.push({id,status:'FAIL',code:e.code,error:e.stack,diagnostics:e.diagnostics});}console.log(id,results.at(-1).status);put(dir,'result.json',JSON.stringify(results.at(-1),null,2));}
await test('C07-C22-parsing',dir=>{
  const require=createRequire(import.meta.url),ts=require(process.env.KIDEA_R06_TYPESCRIPT),svelte=require(process.env.KIDEA_R06_SVELTE);
  put(dir,'tsconfig.json','{"extends":"./generated/tsconfig.json"}');put(dir,'page.ts',"import type { PageData } from './$types'; export const broken = ;");put(dir,'Page.svelte','<script>let value = ;</script><div>');
  const map=webMap(readMapSources(dir,['tsconfig.json','page.ts','Page.svelte']),{ts,svelte,tool:{components:[{name:'trusted test parser'}]},tsconfig:'tsconfig.json'});
  put(dir,'map.json',JSON.stringify(map,null,2));
  for(const code of ['TSCONFIG_EXTENDS_UNRESOLVED','MODULE_UNRESOLVED','TYPESCRIPT_PARSE_ERROR','SVELTE_PARSE_ERROR'])assert.ok(map.diagnostics.some(d=>d.code===code),code);
  assert.equal(map.completeness,'INCOMPLETE');
});
await test('C13-C22-stale-map',dir=>{
  put(dir,'a.md','Scope');const input=readMapSources(dir,['a.md']),map=mapResult(input,{name:'test'},null,[{id:'a.md'}],[]);
  assert.throws(()=>traceabilityMap(input,{...map,digest:'forged'},[]),{code:'IMPLEMENTATION_MAP_RECEIPT_INVALID'});
  put(dir,'a.md','Changed scope');const result=traceabilityMap(readMapSources(dir,['a.md']),map,[]);assert.ok(result.diagnostics.some(d=>d.code==='IMPLEMENTATION_MAP_STALE_OR_OUTSIDE_SCOPE'));
});
for(const fault of ['AFTER_PARTIAL_WRITE','AFTER_CREATE','RETIRE_FAILURE'])await test('C20-'+fault,async dir=>{
  const {world}=buildBase();for(const [p,b]of Object.entries(world.files))put(dir,p,b);
  const graph={format:'kidea-impact-graph-r1',nodes:[{id:'one',name:'One',scopeRef:ref('docs/notes.md'),inputRefs:[ref('docs/notes.md')],completionRef:ref('docs/notes.md')}],edges:[],seeds:['one'],diagnostics:[]};
  const permission={root:dir,readProject:true,allowReadLocalGit:false,allowImpactWrite:true,roundId:'ROUND-001',ownerId:'W-002',statement:'Synthetic impact-only write grant.',assumptions:{localFilesystem:true,noActiveSync:true,singleKideaRun:true}};
  const request={operation:'READ',permission,graph},read=readChange(dir,request);
  const {prepared}=prepareChange(dir,{...request,operation:'OPEN',expectedBasis:read.basis,expectedProjectId:read.context.projectId,expectedRoundId:'ROUND-001',expectedOwnerId:'W-002',expectedGit:null});
  const result=await executeInternalWrite(prepared,{testFault:fault});put(dir,'writer-result.json',JSON.stringify(result,null,2));assert.equal(result.state,'PENDING');
  const current=readChange(dir,{operation:'READ',permission});assert.equal(current.state,'RECONCILIATION_REQUIRED');assert.notEqual(readStatus(dir).readState,'OK');
});
assert.deepEqual(sources(),before);
put(root,'summary.json',JSON.stringify({source:before,results,scope:'R06 adversarial parser/write fixtures; not production evidence.'},null,2));console.log(root);process.exitCode=results.some(r=>r.status==='FAIL')?1:0;

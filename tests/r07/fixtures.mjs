import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import path from 'node:path';
import {buildBase,edit,paths,ref,envelope,dataAt} from '../fixtures/r02-t04/catalog.mjs';
import {readMapSources,mapResult,traceabilityMap} from '../../.agents/skills/kidea/scripts/maps.mjs';
export const put=(root,file,b)=>{mkdirSync(path.dirname(path.join(root,file)),{recursive:true});writeFileSync(path.join(root,file),b);};
export const request=root=>({permission:{root,readProject:true,allowReadLocalGit:false,allowViewWrite:true,allowExportMetadata:true,assumptions:{localFilesystem:true,noActiveSync:true,singleKideaRun:true}},maps:{specification:'maps/spec.json',implementation:'maps/impl.json',responsibility:'maps/trace.json'}});
export function fixture(root,count=4,edges=12) {
  const {world}=buildBase();
  edit(world,paths.index,r=>r.projectName='Workshop · hồ sơ giả R07');
  edit(world,paths.work,w=>{
    w.rounds[0].targetVersion='2.0.0';w.nextAction='Chờ Human review; không tự thực thi.';
    const base=structuredClone(w.items[1]);
    for(let i=1;i<count;i++)w.items.push({...structuredClone(base),id:'TEST-'+i,name:'Kiểm trách nhiệm '+i,gateIds:[],executionStatus:i===1?'DONE':'TODO',resultRefs:i===1?[ref('docs/notes.md')]:[]});
    w.items.push({...structuredClone(w.items[0]),id:'UNEXPANDED',name:'Phần chưa phân rã',decomposition:'UNEXPANDED'});
    w.blockers.push({itemId:'W-002',reason:'Cần review đúng phiên bản',needed:'Human xem bằng chứng'});
  });
  // Unreferenced prose: must never be exported as a side effect of reading a record.
  world.files[paths.index]+='\nSECRET_SENTINEL_NOT_AUTHORIZED\n';
  for(const [p,b]of Object.entries(world.files))put(root,p,b);
  put(root,'docs/map.md','<a id="rule"></a>Fixture map scope; no real application claim.');
  put(root,'src/map.ts','export const fixture=true;');
  const input=readMapSources(root,['docs/map.md','src/map.ts']);
  const nodes=Array.from({length:count},(_,i)=>({id:'N'+i,name:'Node '+i,path:'src/map.ts',kind:'symbol'}));
  const each=Math.floor(edges/3),links=Array.from({length:each},(_,i)=>({from:'N'+i%count,to:'N'+(i+1)%count,kind:'synthetic-dependency'}));
  const impl=mapResult(input,{name:'synthetic-oracle'}, {secret:'SECRET_MAP_CONFIGURATION'},nodes,links,[{code:'DYNAMIC_SCOPE_UNKNOWN'}],['Synthetic fixture, no extracted production behavior.']);
  const spec=mapResult(input,{name:'synthetic-doc-oracle'},null,nodes,links);
  const trace=traceabilityMap(input,impl,Array.from({length:edges-2*each},(_,i)=>({id:'R'+i,spec:ref('docs/map.md','rule'),targets:['N'+i%count],purpose:'Enforce ownership '+i,conditions:'Synthetic cancellation',evidence:[ref('docs/map.md','rule')]})));
  put(root,'maps/spec.json',JSON.stringify(spec));put(root,'maps/impl.json',JSON.stringify(impl));put(root,'maps/trace.json',JSON.stringify(trace));
  return {world,request:request(root)};
}
export function mutateRecord(root,file,fn){const world={files:{[file]:readFileSync(path.join(root,file),'utf8')}};const data=dataAt(world,file);fn(data);put(root,file,envelope(data));}

export type Operations={schema:1;profile:'outbox-telemetry-r1';sampledAtMs:number;actor:string;epoch:string;writeReady:false;unknown:string[];signals:{M1:{state:'KNOWN'|'BOUNDED'|'UNKNOWN';countState?:'KNOWN';pending?:number;oldestAgeUpperMs?:number|null;oldestAgeLowerMs?:number|null;ageBasis?:'EMPTY_NA'|'TRANSACTION_START_UPPER_BOUND'};M2:{state:'KNOWN'|'UNKNOWN';catalogState?:'KNOWN';open:{code:'PROCESSING'|'RECONCILE'|'INVARIANT';count:number;firstSeenMs:number}[]};M4:{state:'KNOWN'|'UNKNOWN';timeBasis?:'PROCESSING_TRANSACTION_TIME';lastSuccess?:null|{atMs:number;epoch:string;workshop:string;version:string}}}};
const integer=(v:unknown):v is number=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0;
const record=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const keys=(v:Record<string,unknown>,allowed:string[],required=allowed)=>Object.keys(v).every(k=>allowed.includes(k))&&required.every(k=>k in v);
const opaque=(v:unknown):v is string=>typeof v==='string'&&v.length>0&&v.length<=256;
const unknownIds=['M3','M5','M6','M7','M8','M9','BACKEND_ADMISSION_NOT_WIRED'];
export function decodeOperations(raw:unknown,owner:{actor:string;epoch:string},now=Date.now()):Operations|null {
 if(!record(raw)||!keys(raw,['schema','profile','sampledAtMs','actor','epoch','writeReady','unknown','signals'])||raw.schema!==1||raw.profile!=='outbox-telemetry-r1'||!integer(raw.sampledAtMs)||raw.sampledAtMs>now||now-raw.sampledAtMs>5000||!opaque(raw.actor)||!opaque(raw.epoch)||raw.actor!==owner.actor||raw.epoch!==owner.epoch||raw.writeReady!==false||!Array.isArray(raw.unknown)||raw.unknown.length!==unknownIds.length||new Set(raw.unknown).size!==unknownIds.length||!raw.unknown.every(v=>typeof v==='string'&&unknownIds.includes(v))||!record(raw.signals)||!keys(raw.signals,['M1','M2','M4']))return null;
 const {M1:a,M2:b,M4:c}=raw.signals;
 if(!record(a)||!keys(a,['state','countState','pending','oldestAgeUpperMs','oldestAgeLowerMs','ageBasis'],['state'])||!['KNOWN','BOUNDED','UNKNOWN'].includes(String(a.state)))return null;
 if(a.countState!==undefined&&(a.countState!=='KNOWN'||!integer(a.pending)))return null;
 if(a.countState===undefined&&('pending'in a||'oldestAgeUpperMs'in a||'oldestAgeLowerMs'in a||'ageBasis'in a))return null;
 if(a.state==='KNOWN'&&(a.pending!==0||a.countState!=='KNOWN'||a.oldestAgeUpperMs!==null||a.oldestAgeLowerMs!==null||a.ageBasis!=='EMPTY_NA'))return null;
 if(a.state==='BOUNDED'&&(a.countState!=='KNOWN'||!integer(a.pending)||a.pending===0||!integer(a.oldestAgeUpperMs)||a.ageBasis!=='TRANSACTION_START_UPPER_BOUND'))return null;
 if(a.oldestAgeLowerMs!==undefined&&a.oldestAgeLowerMs!==null&&(!integer(a.oldestAgeLowerMs)||!integer(a.oldestAgeUpperMs)||a.oldestAgeLowerMs>a.oldestAgeUpperMs))return null;
 if(a.state==='UNKNOWN'&&('ageBasis'in a||a.oldestAgeUpperMs!==undefined&&a.oldestAgeUpperMs!==null))return null;
 if(!record(b)||!keys(b,['state','catalogState','open'],['state','open'])||!['KNOWN','UNKNOWN'].includes(String(b.state))||b.catalogState!==undefined&&b.catalogState!=='KNOWN'||b.state==='KNOWN'&&b.catalogState!=='KNOWN'||!Array.isArray(b.open)||b.open.length>3)return null;
 const codes=new Set();for(const e of b.open){if(!record(e)||!keys(e,['code','count','firstSeenMs'])||!['PROCESSING','RECONCILE','INVARIANT'].includes(String(e.code))||codes.has(e.code)||!integer(e.count)||e.count===0||!integer(e.firstSeenMs)||e.firstSeenMs>raw.sampledAtMs)return null;codes.add(e.code);}
 if(b.catalogState===undefined&&b.open.length!==0)return null;
 if(!record(c)||!keys(c,['state','timeBasis','lastSuccess'],['state'])||!['KNOWN','UNKNOWN'].includes(String(c.state)))return null;
 if(c.state==='KNOWN'){
  if(c.timeBasis!=='PROCESSING_TRANSACTION_TIME'||!('lastSuccess'in c))return null;
  if(c.lastSuccess!==null){const v=c.lastSuccess;if(!record(v)||!keys(v,['atMs','epoch','workshop','version'])||!integer(v.atMs)||v.atMs>raw.sampledAtMs||!opaque(v.epoch)||!opaque(v.workshop)||typeof v.version!=='string'||!/^[1-9][0-9]*$/.test(v.version)||BigInt(v.version)>18446744073709551615n)return null;}
 }else if('lastSuccess'in c||'timeBasis'in c)return null;
 return structuredClone(raw) as Operations;
}
export class OperationsCritical {
 private pending=false;private healthy=0;private lastHealthy:number|null=null;
 ingest(value:Operations){
  const m=value.signals.M1;
  if(m.state==='BOUNDED'&&(m.oldestAgeLowerMs??0)>=30000){this.pending=true;this.healthy=0;this.lastHealthy=null;}
  else if(this.pending){
   const clear=m.state==='KNOWN'&&m.pending===0||m.state==='BOUNDED'&&(m.oldestAgeUpperMs??Infinity)<=5000;
   if(!clear){this.healthy=0;this.lastHealthy=null;}
   else if(this.lastHealthy===null||value.sampledAtMs-this.lastHealthy>=2000){this.healthy++;this.lastHealthy=value.sampledAtMs;if(this.healthy>=3)this.pending=false;}
  }
 }
 unknown(){this.healthy=0;this.lastHealthy=null;}
 conclusion(value:Operations|null):'CRITICAL'|'UNKNOWN'{return this.pending||value?.signals.M2.open.some(e=>e.code==='INVARIANT')?'CRITICAL':'UNKNOWN';}
}

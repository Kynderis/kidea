// T03 client boundary. Server remains the authority for permission and mutations.
export type Context = {actor:string; epoch:string; generation:number};
export type Registration = {id:string;state:'ACTIVE'|'CANCELLED'};
export type History = {actor:string;epoch:string;workshopId:string;workshopVersion:string;registrations:Registration[]};
export type Snapshot = {id:string;epoch:string;version:string;state:'OPEN'|'PAUSED';title:string;description:string;capacity:number;active:number;remaining:number;observedAt:number;schedule:{start:string;end:string}};
const record=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const text=(v:unknown):v is string=>typeof v==='string'&&v.length>0;
export const version=(v:unknown):v is string=>typeof v==='string'&&/^(0|[1-9][0-9]{0,19})$/.test(v)&&BigInt(v)<=18446744073709551615n;
const integer=(v:unknown):v is number=>typeof v==='number'&&Number.isSafeInteger(v);
export function decodeSnapshot(v:unknown):Snapshot|null {
 if(!record(v)||!text(v.id)||!text(v.epoch)||!version(v.version)||(v.state!=='OPEN'&&v.state!=='PAUSED')||!text(v.title)||!text(v.description)||!integer(v.capacity)||v.capacity<1||v.capacity>1000||!integer(v.active)||v.active<0||v.active>v.capacity||!integer(v.remaining)||v.remaining!==v.capacity-v.active||!integer(v.observedAt)||!record(v.schedule)||!text(v.schedule.start)||!text(v.schedule.end))return null;
 if([...v.title].length>120||[...v.description].length>5000||![v.schedule.start,v.schedule.end].every(s=>/([+-]\d\d:\d\d|Z)$/.test(s)&&Number.isFinite(Date.parse(s)))||Date.parse(v.schedule.end)<=Date.parse(v.schedule.start))return null;
 return {id:v.id,epoch:v.epoch,version:v.version,state:v.state,title:v.title,description:v.description,capacity:v.capacity,active:v.active,remaining:v.remaining,observedAt:v.observedAt,schedule:{start:v.schedule.start,end:v.schedule.end}};
}
export function decodeHistory(v:unknown):History|null {
 if(!record(v)||!text(v.actor)||!text(v.epoch)||!text(v.workshopId)||!version(v.workshopVersion)||!Array.isArray(v.registrations))return null;
 const registrations:Registration[]=[];const ids=new Set<string>();let active=0;
 for(const r of v.registrations){if(!record(r)||!text(r.id)||(r.state!=='ACTIVE'&&r.state!=='CANCELLED')||ids.has(r.id))return null;ids.add(r.id);if(r.state==='ACTIVE')active++;registrations.push({id:r.id,state:r.state});}
 if(active>1)return null;
 return {actor:v.actor,epoch:v.epoch,workshopId:v.workshopId,workshopVersion:v.workshopVersion,registrations};
}
function historyContent(h:History):string{return JSON.stringify([...h.registrations].sort((a,b)=>a.id.localeCompare(b.id)));}
export class ClientState {
 context:Context; mounted=true; readonly history=new Map<string,History>();readonly uncertain=new Set<string>();
 constructor(actor:string,epoch:string){this.context={actor,epoch,generation:1};}
 reset(actor:string,epoch:string){this.context={actor,epoch,generation:this.context.generation+1};this.history.clear();this.uncertain.clear();}
 unmount(){this.mounted=false;this.context={...this.context,generation:this.context.generation+1};}
 accepts(c:Context){return this.mounted&&c.actor===this.context.actor&&c.epoch===this.context.epoch&&c.generation===this.context.generation;}
 merge(raw:unknown,c:Context):'UPDATED'|'IGNORED'|'UNKNOWN'{
  if(!this.accepts(c))return 'IGNORED';const next=decodeHistory(raw);
  if(!next||next.actor!==c.actor||next.epoch!==c.epoch)return 'UNKNOWN';
  const previous=this.history.get(next.workshopId);
  if(previous){const a=BigInt(next.workshopVersion),b=BigInt(previous.workshopVersion);if(a<b)return 'IGNORED';if(a===b){if(historyContent(next)!==historyContent(previous)){this.uncertain.add(next.workshopId);return 'UNKNOWN';}return this.uncertain.has(next.workshopId)?'UNKNOWN':'IGNORED';}}
  this.history.set(next.workshopId,next);this.uncertain.delete(next.workshopId);return 'UPDATED';
 }
 // A missing group in an older collection cannot delete known history.
 collection(raw:unknown,c:Context){if(!this.accepts(c))return 'IGNORED';if(!Array.isArray(raw))return 'UNKNOWN';let state='IGNORED';for(const v of raw){const result=this.merge(v,c);if(result==='UNKNOWN')state='UNKNOWN';else if(result==='UPDATED'&&state!=='UNKNOWN')state='UPDATED';}return state;}
}
export type Intent = {actor:string;epoch:string;requestId:string;workshopId:string;registrationId:string|null;sent:boolean;state:'UNKNOWN'|'FINAL'};
export function decodeIntent(raw:string,actor:string,epoch:string):Intent|null {
 let v:unknown;try{v=JSON.parse(raw);}catch{return null;}
 if(!record(v)||v.actor!==actor||v.epoch!==epoch||!text(v.requestId)||!text(v.workshopId)||(v.registrationId!==null&&!text(v.registrationId))||typeof v.sent!=='boolean'||(v.state!=='UNKNOWN'&&v.state!=='FINAL'))return null;
 return {actor,epoch,requestId:v.requestId,workshopId:v.workshopId,registrationId:v.registrationId,sent:v.sent,state:v.state};
}
// Persist sent=true BEFORE network I/O. Storage failure prevents POST. Reload only GETs.
export function prepareSend(intent:Intent,persist:(value:string)=>void):'POST'|'GET'{
 if(intent.sent)return 'GET';const next={...intent,sent:true};persist(JSON.stringify(next));intent.sent=true;return 'POST';
}
export function freshness(lastAlive:number|null,now:number,disconnected:boolean):'UNKNOWN'|'OBSERVED'{return disconnected||lastAlive===null||!Number.isFinite(lastAlive)||!Number.isFinite(now)||now<lastAlive||now-lastAlive>5000?'UNKNOWN':'OBSERVED';}

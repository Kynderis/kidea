import {decodeAdmin,compareAdminObservation,type AdminSnapshot} from './admin.ts';
import {decodeSnapshot,type Snapshot} from './state.ts';
import {PublicUpdates,openUpdates,type UpdateStatus,type UpdateWire} from './updates.ts';
export type Session={actor:string;epoch:string;csrf:string};
export type Audience='public'|'admin'|'private';
const object=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
export function decodeSession(raw:unknown,audience:Audience):Session|null {
 if(!object(raw)||typeof raw.actor!=='string'||!raw.actor||typeof raw.epoch!=='string'||!raw.epoch||typeof raw.csrf!=='string'||!raw.csrf||audience==='admin'&&raw.admin!==true||audience==='private'&&raw.participant!==true)return null;
 return {actor:raw.actor,epoch:raw.epoch,csrf:raw.csrf};
}
// Each page owns its identity/generation. Temporary transport failures never
// grant visibility; terminal permission/identity changes erase retained data.
export class LiveIdentity {
 who:Session|null=null;confirmed=false;active=true;generation=1;
 readonly audience:Audience;readonly epoch:string|undefined;readonly read:()=>Promise<Response>;readonly change:(confirmed:boolean,terminal:boolean)=>void;
 constructor(audience:Audience,epoch:string|undefined,read:()=>Promise<Response>,change:(confirmed:boolean,terminal:boolean)=>void){this.audience=audience;this.epoch=epoch;this.read=read;this.change=change;}
 end(){if(!this.active)return;this.active=false;this.generation++;this.who=null;this.confirmed=false;this.change(false,true);}
 private temporary(){this.confirmed=false;this.change(false,false);return false;}
 async validate():Promise<boolean>{
  const g=this.generation;if(!this.active)return false;
  try{const r=await this.read();if(!this.active||g!==this.generation)return false;
   let next:Session|null;
   if(r.status===401&&this.audience==='public'&&this.epoch)next={actor:'',epoch:this.epoch,csrf:''};
   else if(r.status===401||r.status===403){this.end();return false;}
   else if(!r.ok)return this.temporary();
   else {let raw:unknown;try{raw=await r.json();}catch{if(this.active&&g===this.generation)this.end();return false;}if(!this.active||g!==this.generation)return false;next=decodeSession(raw,this.audience);}
   if(!next||this.epoch&&next.epoch!==this.epoch||this.who&&(next.actor!==this.who.actor||next.epoch!==this.who.epoch)){this.end();return false;}
   this.who=next;this.confirmed=true;this.change(true,false);return true;
  }catch{if(!this.active||g!==this.generation)return false;return this.temporary();}
 }
}
export class AdminUpdates {
 readonly snapshots=new Map<string,AdminSnapshot>();readonly uncertain=new Set<string>();
 readonly epoch:string;
 constructor(epoch:string,initial:AdminSnapshot[]){this.epoch=epoch;for(const w of initial)if(w.epoch===epoch)this.snapshots.set(w.id,w);}
 merge(raw:unknown,source:'HTTP'|'SOCKET'):boolean {
  if(!Array.isArray(raw))return false;const next:AdminSnapshot[]=[];const ids=new Set<string>();
  for(const v of raw){const w=decodeAdmin(v);if(!w||w.epoch!==this.epoch||ids.has(w.id))return false;ids.add(w.id);next.push(w);}
  for(const w of next){const previous=this.snapshots.get(w.id);if(previous){const order=compareAdminObservation(previous,w);if(order==='OLDER')continue;if(order==='CONFLICT'&&source==='SOCKET'){this.uncertain.add(w.id);continue;}if(order==='SAME'&&source==='SOCKET'&&this.uncertain.has(w.id))continue;}
   this.snapshots.set(w.id,w);this.uncertain.delete(w.id);
  }return this.uncertain.size===0;
 }
}
export type CollectionSnapshot=Snapshot|AdminSnapshot;
export function collectionEpoch(raw:unknown,audience:'public'|'admin'):string|null {
 if(!Array.isArray(raw)||!raw.length)return null;let epoch:string|null=null;const ids=new Set<string>();
 for(const value of raw){const w=(audience==='public'?decodeSnapshot:decodeAdmin)(value);if(!w||ids.has(w.id)||epoch!==null&&epoch!==w.epoch)return null;ids.add(w.id);epoch=w.epoch;}return epoch;
}
export function watchCollection(options:{audience:'public'|'admin';initial:CollectionSnapshot[];session:()=>Promise<Response>;read:()=>Promise<unknown>;snapshots:(values:CollectionSnapshot[])=>void;status:(value:UpdateStatus)=>void;visibility:(confirmed:boolean,terminal?:boolean)=>void;factory?:()=>UpdateWire;bootstrapMs?:number}):()=>void {
 let stopped=false,stopSocket:(()=>void)|null=null,identity:LiveIdentity|null=null,timer:ReturnType<typeof setTimeout>|null=null;
 const terminal=()=>{options.snapshots([]);options.visibility(false,true);stopSocket?.();options.status('UNKNOWN');};
 async function start(){
  if(stopped)return;options.status('UNKNOWN');options.visibility(options.audience==='public');
  let seed=options.initial,epoch=collectionEpoch(seed,options.audience);
  try{
   if(!epoch&&options.audience==='public'){
    const raw=await options.read();if(stopped)return;if(!Array.isArray(raw))throw Error('COLLECTION');
    epoch=collectionEpoch(raw,'public');if(!epoch){if(raw.length)throw Error('COLLECTION');timer=setTimeout(()=>void start(),options.bootstrapMs??2000);return;}seed=raw.map(decodeSnapshot).filter((w):w is Snapshot=>w!==null);
   }
   identity=new LiveIdentity(options.audience,epoch??undefined,options.session,(confirmed,lost)=>{if(stopped)return;options.visibility(options.audience==='public'||confirmed);if(lost)terminal();});
   if(!await identity.validate()){if(!stopped&&identity.active)timer=setTimeout(()=>void start(),options.bootstrapMs??2000);return;}
   if(stopped||!identity.who)return;epoch=identity.who.epoch;
   const model=options.audience==='public'?new PublicUpdates(epoch,seed as Snapshot[]):new AdminUpdates(epoch,seed as AdminSnapshot[]);
   const currentIdentity=identity;
   stopSocket=openUpdates({audience:options.audience,epoch,workshopId:'*',csrf:()=>currentIdentity.who?.csrf??'',validate:()=>currentIdentity.validate(),read:options.read,snapshot:(raw,source)=>{if(stopped||!currentIdentity.active||!currentIdentity.confirmed)return false;if(!Array.isArray(raw))return false;const ok=model.merge(raw,source);options.snapshots([...model.snapshots.values()]);return ok;},status:options.status,factory:options.factory});
  }catch{if(!stopped)timer=setTimeout(()=>void start(),options.bootstrapMs??2000);}
 }
 void start();return()=>{if(stopped)return;stopped=true;if(timer!==null)clearTimeout(timer);stopSocket?.();identity?.end();};
}

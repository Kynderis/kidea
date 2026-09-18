<script lang="ts">
 import {onMount,flushSync} from 'svelte';import {resolve} from '$app/paths';import {scheduleLabel} from '$lib/display';
 import {LiveIdentity,watchCollection} from '$lib/collections';import {ClientState,type History,type Snapshot,type Registration} from '$lib/state';
 import {openUpdates,mergeHistory,reconcileHistory,type UpdateStatus} from '$lib/updates';
 let {initial}:{initial:{workshop:Snapshot;registrations:Registration[]}[]}=$props();
 let hydrated=$state(false),visible=$state(true),known=$state(false),ended=$state(false),histories=$state<History[]>([]),workshops=$state<Snapshot[]>([]),channel=$state<UpdateStatus>('UNKNOWN'),publicChannel=$state<UpdateStatus>('UNKNOWN');
 const groups=$derived(hydrated?histories.map(h=>({id:h.workshopId,workshop:workshops.find(w=>w.id===h.workshopId),registrations:h.registrations})):initial.map(g=>({id:g.workshop.id,...g})));
 onMount(()=>{let disposed=false;const abort=new AbortController(),client=new ClientState('','');let stopPrivate:(()=>void)|null=null,stopPublic:(()=>void)|null=null,bootstrap:ReturnType<typeof setTimeout>|null=null;
  const signal=()=>AbortSignal.any([abort.signal,AbortSignal.timeout(5000)]);
  flushSync(()=>{hydrated=true;visible=false;histories=[];});
  const identity=new LiveIdentity('private',undefined,()=>fetch('/api/v1/session',{cache:'no-store',signal:signal()}),(confirmed,lost)=>{if(disposed)return;visible=confirmed;if(lost){ended=true;known=false;histories=[];client.unmount();stopPrivate?.();stopPublic?.();channel='UNKNOWN';}});
  async function read(){const r=await fetch('/api/v1/me/registrations',{cache:'no-store',signal:signal()});if(!r.ok)throw Error('UNKNOWN');return r.json();}
  function apply(raw:unknown,source:'HTTP'|'SOCKET'){if(disposed||!identity.active||!identity.confirmed)return false;const c={...client.context};const ok=source==='HTTP'?reconcileHistory(client,raw,c):mergeHistory(client,raw,c);known=ok;histories=[...client.history.values()];return ok;}
  async function begin(){try{if(!await identity.validate()){if(!disposed&&identity.active)bootstrap=setTimeout(()=>void begin(),2000);return;}if(disposed||!identity.who)return;const who=identity.who;client.reset(who.actor,who.epoch);
   stopPublic=watchCollection({audience:'public',initial:initial.map(g=>g.workshop),session:()=>fetch('/api/v1/session',{cache:'no-store',signal:signal()}),read:async()=>{const r=await fetch('/api/v1/workshops',{cache:'no-store',signal:signal()});if(!r.ok)throw Error('UNKNOWN');return r.json();},snapshots:values=>{if(!disposed)workshops=values as Snapshot[];},status:value=>{if(!disposed)publicChannel=value;},visibility:()=>{}});
   // This initial HTTP-only observation also works when WSS is unavailable.
   // SUBSCRIBED still forces a fresh GET before the live status becomes OBSERVED.
   try{const raw=await read();if(!disposed&&await identity.validate())apply(raw,'HTTP');}catch{if(!disposed)known=false;}
   if(disposed||!identity.active||!identity.who)return;
   stopPrivate=openUpdates({audience:'private',epoch:who.epoch,csrf:()=>identity.who?.csrf??'',validate:()=>identity.validate(),read,snapshot:apply,status:value=>{if(!disposed)channel=value;}});
  }catch{if(!disposed){visible=false;known=false;if(identity.active)bootstrap=setTimeout(()=>void begin(),2000);}}}void begin();
  const hide=()=>{if(bootstrap!==null)clearTimeout(bootstrap);flushSync(()=>{visible=false;histories=[];known=false;});identity.end();stopPrivate?.();stopPublic?.();abort.abort();};
  const show=(e:{persisted:boolean})=>{if(e.persisted){hide();window.location.reload();}};
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);
  return()=>{disposed=true;if(bootstrap!==null)clearTimeout(bootstrap);stopPrivate?.();stopPublic?.();identity.end();client.unmount();abort.abort();window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);};
 });
</script>
<p role="status">{channel==='OBSERVED'?'Đang đối chiếu đăng ký trực tiếp.':'Chưa xác nhận đăng ký trực tiếp. Dữ liệu là lần quan sát trước.'}</p>
{#if visible&&(!hydrated||known)}{#each groups as g(g.id)}<article><h2><a href={resolve('/workshops/[id]',{id:g.id})}>{g.workshop?.title??'Workshop'}</a></h2>{#if g.workshop}<p>{scheduleLabel(g.workshop.schedule.start)} — {scheduleLabel(g.workshop.schedule.end)}</p>{:else}<p>Chưa xác nhận tên và lịch hiện tại; mở chi tiết để đối chiếu.</p>{/if}{#if hydrated&&publicChannel!=='OBSERVED'}<p>Tên và lịch theo lần quan sát trước.</p>{/if}<ul>{#each g.registrations as r(r.id)}<li>{r.id} · {r.state==='ACTIVE'?'Đã đăng ký':'Đã hủy'}</li>{/each}</ul></article>{:else}<p>Chưa có đăng ký trong phiên hiện tại.</p>{/each}{:else}<p role="status">{ended?'Phiên đã thay đổi hoặc hết quyền. Dữ liệu riêng đã được ẩn; hãy tải lại trang.':'Đang kiểm tra lại phiên và đối chiếu đăng ký trước khi hiển thị.'}</p>{/if}
<style>li{overflow-wrap:anywhere}</style>

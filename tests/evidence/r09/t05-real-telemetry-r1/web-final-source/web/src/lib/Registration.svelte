<script lang="ts">
 import {resolve} from '$app/paths';
 import {onMount} from 'svelte';import {openUpdates,reconcileHistory,mergeHistory,type UpdateStatus} from '$lib/updates';
 import {ClientState,decodeIntent,prepareSend} from '$lib/state';
 import type {Snapshot,History,Intent} from '$lib/state';
 import {decodeReply,resultLabel} from '$lib/reply';
 let {workshop}:{workshop:Snapshot}=$props();
 let session=$state<{actor:string;epoch:string;csrf:string;participant:boolean}|null>(null);
 let history=$state<History|null>(null),pending=$state<Intent|null>(null),message=$state('Cần phiên tài khoản thử hợp lệ.'),busy=$state(false);
 let cancelId=$state<string|null>(null);let dialog:HTMLDialogElement;let generation=0;let mounted=false;let stopUpdates:(()=>void)|null=null;let channel=$state<UpdateStatus>('UNKNOWN');let historyKnown=$state(false);let contextAbort=new AbortController();
 const signal=()=>AbortSignal.any([contextAbort.signal,AbortSignal.timeout(5000)]);
 const clientState=new ClientState('','');
 const key=()=>session?'workshop-intent:'+JSON.stringify([session.actor,session.epoch,workshop.id]):'';
 const save=(value:string)=>localStorage.setItem(key(),value);
 async function validateIdentity(g:number){
  if(!mounted||g!==generation||!session?.participant)return false;const expected={actor:session.actor,epoch:session.epoch};
  const r=await fetch('/api/v1/session',{cache:'no-store',signal:signal()});if(!mounted||g!==generation)return false;
  if(!r.ok&&r.status!==401&&r.status!==403){historyKnown=false;channel='UNKNOWN';message='Chưa kiểm tra được phiên. Chỉ đọc đối chiếu lại, không tự gửi thao tác.';return false;}
  const raw:unknown=await r.json();if(!mounted||g!==generation)return false;
  if(!r.ok||typeof raw!=='object'||raw===null||!('actor'in raw)||raw.actor!==expected.actor||!('epoch'in raw)||raw.epoch!==expected.epoch||!('participant'in raw)||raw.participant!==true||!('csrf'in raw)||typeof raw.csrf!=='string'||!raw.csrf){
   stopUpdates?.();stopUpdates=null;generation++;channel='UNKNOWN';historyKnown=false;session=null;history=null;pending=null;cancelId=null;busy=false;clientState.reset('','');dialog?.close();message='Phiên đã thay đổi hoặc hết quyền. Dữ liệu riêng đã được ẩn.';return false;
  }
  if(session)session.csrf=raw.csrf;if(message==='Chưa kiểm tra được phiên. Chỉ đọc đối chiếu lại, không tự gửi thao tác.')message='';return true;
 }
 async function loadHistory(g:number){
  const c={...clientState.context};try{const r=await fetch('/api/v1/me/registrations',{cache:'no-store',signal:signal()});if(!mounted||g!==generation)return;if(!r.ok){history=null;message='Không thể đọc dữ liệu riêng. Cần kiểm tra phiên.';return;}const raw:unknown=await r.json();if(!mounted||g!==generation)return;if(!await validateIdentity(g))return;const confirmed=reconcileHistory(clientState,raw,c);historyKnown=confirmed;history=confirmed?clientState.history.get(workshop.id)??null:null;}catch{if(mounted&&g===generation){history=null;message='Chưa tải được đăng ký hiện tại.';}}
 }
 async function refresh(){
  stopUpdates?.();stopUpdates=null;channel='UNKNOWN';historyKnown=false;const g=++generation;dialog?.close();cancelId=null;contextAbort.abort();contextAbort=new AbortController();session=null;history=null;pending=null;clientState.reset('','');busy=false;
  try{const r=await fetch('/api/v1/session',{cache:'no-store',signal:signal()});const v:unknown=await r.json();if(!mounted||g!==generation)return;
   if(!r.ok||typeof v!=='object'||v===null||!('actor'in v)||typeof v.actor!=='string'||!v.actor||!('epoch'in v)||v.epoch!==workshop.epoch||!('csrf'in v)||typeof v.csrf!=='string'||!v.csrf||!('participant'in v)||typeof v.participant!=='boolean'){message='Cần phiên tài khoản thử hợp lệ.';return;}
   session={actor:v.actor,epoch:v.epoch,csrf:v.csrf,participant:v.participant};clientState.reset(v.actor,v.epoch);message='';
   try{const saved=localStorage.getItem(key());if(saved){pending=decodeIntent(saved,v.actor,v.epoch);if(!pending||pending.workshopId!==workshop.id){pending=null;message='Không thể khôi phục ý định cũ. Cần đối chiếu trước thao tác mới.';session=null;return;}if(pending.state==='UNKNOWN')message='Chưa xác nhận kết quả của ý định đã lưu.';}}
   catch{session=null;message='Không thể lưu ý định an toàn trong trình duyệt. Chưa gửi thao tác.';return;}
   const epoch=v.epoch;const validate=()=>validateIdentity(g);
   // Seed an authoritative HTTP-only observation while the live handshake is
   // pending/unavailable. SUBSCRIBED always triggers another GET before live status.
   if(session.participant)await loadHistory(g);if(!mounted||g!==generation||!session)return;
   if(session.participant){stopUpdates=openUpdates({audience:'private',epoch,csrf:()=>session?.csrf??'',validate,read:async()=>{const r=await fetch('/api/v1/me/registrations',{cache:'no-store',signal:signal()});if(!r.ok)throw Error('UNKNOWN');return r.json();},snapshot:(raw,source)=>{const c={...clientState.context};if(!mounted||g!==generation)return false;const confirmed=source==='HTTP'?reconcileHistory(clientState,raw,c):mergeHistory(clientState,raw,c);historyKnown=confirmed;history=confirmed?clientState.history.get(workshop.id)??null:null;return confirmed;},status:value=>{if(mounted&&g===generation)channel=value;}});}

  }catch{if(mounted&&g===generation)message='Chưa kiểm tra được phiên tài khoản thử.';}
 }
 async function execute(intent:Intent,readOnly=false){
  if(!session||!session.participant||busy)return;const g=generation;busy=true;
  try{
   const method=readOnly?'GET':prepareSend(intent,save);pending={...intent};message=method==='POST'?'Đang gửi…':'Đang kiểm tra kết quả…';
   const route=method==='GET'?'/requests/'+encodeURIComponent(intent.requestId):intent.registrationId?'/registrations/'+encodeURIComponent(intent.registrationId)+'/cancel':'/registrations';
   const r=await fetch('/api/v1'+route,{method,cache:'no-store',signal:signal(),headers:method==='POST'?{'content-type':'application/json','x-csrf-token':session.csrf}:{},body:method==='POST'?JSON.stringify({epoch:intent.epoch,requestId:intent.requestId,workshopId:intent.workshopId}):undefined});
   const raw:unknown=await r.json();if(!mounted||g!==generation)return;
   if(r.status===401||r.status===403){session=null;history=null;pending=null;message='Phiên đã hết quyền. Chưa xác nhận hiệu lực thao tác.';return;}
   if(!await validateIdentity(g))return;const result=r.ok?decodeReply(raw,intent):null;
   if(!result){message='Chưa xác nhận kết quả. Chỉ kiểm tra lại cùng ý định.';return;}
   intent.state='FINAL';save(JSON.stringify(intent));pending={...intent};message=resultLabel[result.code]+' Đang đối chiếu đăng ký hiện tại.';await loadHistory(g);
  }catch{if(mounted&&g===generation)message='Chưa xác nhận kết quả. Không tự gửi lại thao tác.';}
  finally{if(mounted&&g===generation)busy=false;}
 }
 function begin(registrationId:string|null){if(!session||!historyKnown||busy||pending?.state==='UNKNOWN')return;const intent:Intent={actor:session.actor,epoch:session.epoch,requestId:crypto.randomUUID(),workshopId:workshop.id,registrationId,sent:false,state:'UNKNOWN'};void execute(intent);}
 onMount(()=>{mounted=true;void refresh();const show=()=>{void refresh();};window.addEventListener('pageshow',show);return()=>{mounted=false;generation++;contextAbort.abort();stopUpdates?.();clientState.unmount();window.removeEventListener('pageshow',show);};});
 const active=$derived(history?.registrations.find(r=>r.state==='ACTIVE'));
</script>
<section aria-label="Đăng ký của bạn"><h2>Đăng ký của bạn</h2>{#if session?.participant}<p role="status">{channel==='OBSERVED'?'Đang đối chiếu đăng ký trực tiếp.':'Chưa xác nhận cập nhật đăng ký trực tiếp.'}</p>{/if}<p role="status">{message}</p>
{#if history}<ul>{#each history.registrations as r (r.id)}<li>{r.id} · {r.state==='ACTIVE'?'Đã đăng ký':'Đã hủy'}</li>{/each}</ul>{/if}
{#if session?.participant}
 <p><a href={resolve('/me')}>Xem đăng ký của tôi</a></p>
 {#if pending?.state==='UNKNOWN'}<button disabled={busy} onclick={()=>{if(pending)void execute(pending,true);}}>Kiểm tra kết quả</button>
 {:else if workshop.state==='OPEN'&&historyKnown}
  {#if active}<button disabled={busy} onclick={()=>{cancelId=active?.id??null;dialog.showModal();}}>Hủy đăng ký</button>{:else}<button disabled={busy} onclick={()=>begin(null)}>{workshop.remaining===0?'Kiểm tra và đăng ký':'Đăng ký'}</button>{/if}
 {:else}<p>{workshop.state==='PAUSED'?'Workshop tạm dừng nhận thao tác mới.':'Chưa xác nhận đăng ký hiện tại. Hãy đọc đối chiếu trước thao tác mới.'}</p>{/if}
{/if}
<button disabled={busy} onclick={()=>{void refresh();}}>Kiểm tra phiên và tải lại dữ liệu</button>
<dialog bind:this={dialog} aria-labelledby="cancel-title" oncancel={()=>{cancelId=null;}}><h2 id="cancel-title">Hủy chỗ này?</h2><p>{workshop.title}</p><button onclick={()=>{cancelId=null;dialog.close();}}>Giữ chỗ</button><button onclick={()=>{const id=cancelId;cancelId=null;dialog.close();if(id)begin(id);}}>Xác nhận hủy</button></dialog>
</section>
<style>button{font:inherit;padding:.6rem .8rem;margin:.3rem .4rem .3rem 0;max-width:100%;white-space:normal}section{margin-top:1rem}dialog{max-width:calc(100% - 2rem);border:1px solid #9aadb9;border-radius:.6rem}li{overflow-wrap:anywhere}</style>

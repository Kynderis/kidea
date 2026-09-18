<script lang="ts">
 import {onMount} from 'svelte';import {resolve} from '$app/paths';import {scheduleLabel,observationLabel} from '$lib/display';
 import {watchCollection,type CollectionSnapshot} from '$lib/collections';import type {UpdateStatus} from '$lib/updates';
 let {initial,audience}:{initial:CollectionSnapshot[];audience:'public'|'admin'}=$props();
 let rows=$state<CollectionSnapshot[]|null>(null),channel=$state<UpdateStatus>('UNKNOWN'),visible=$state(true),ended=$state(false);
 const current=$derived(rows??initial);
 onMount(()=>{const abort=new AbortController();let disposed=false;const signal=()=>AbortSignal.any([abort.signal,AbortSignal.timeout(5000)]);
  const stop=watchCollection({audience,initial,session:()=>fetch('/api/v1/session',{cache:'no-store',signal:signal()}),read:async()=>{const r=await fetch('/api/v1/'+(audience==='public'?'workshops':'admin/workshops'),{cache:'no-store',signal:signal()});if(!r.ok)throw Error('UNKNOWN');return r.json();},snapshots:values=>{if(!disposed)rows=values;},status:value=>{if(!disposed)channel=value;},visibility:(value,terminal)=>{if(!disposed){visible=value;if(terminal)ended=true;}}});
  const hide=()=>{visible=false;rows=[];stop();abort.abort();};const show=(e:{persisted:boolean})=>{if(e.persisted){hide();window.location.reload();}};
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);
  return()=>{disposed=true;stop();abort.abort();window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);};
 });
</script>
<p role="status">{channel==='OBSERVED'?'Đang đối chiếu danh sách trực tiếp.':'Chưa xác nhận danh sách trực tiếp. Số liệu là lần quan sát trước.'}</p>
{#if visible}{#each current as w(w.id)}<article><h2><a href={audience==='admin'?resolve('/admin/workshops/[id]',{id:w.id}):resolve('/workshops/[id]',{id:w.id})}>{w.title}</a></h2><p>{w.state==='DRAFT'?'Bản nháp':w.state==='OPEN'?'Mở đăng ký':'Tạm dừng'}</p><p>{scheduleLabel(w.schedule.start)} — {scheduleLabel(w.schedule.end)}</p>{#if audience==='admin'}<p>Sức chứa {w.capacity} · Đăng ký hiệu lực {w.active}</p>{:else}<p>{w.remaining}/{w.capacity} chỗ còn theo lần quan sát. Không phải cam kết giữ chỗ.</p>{/if}<p>Quan sát lúc {observationLabel(w.observedAt)}</p></article>{:else}<p>{audience==='public'?'Chưa có workshop được công bố.':'Chưa có workshop.'}</p>{/each}{:else}<p role="status">{ended?'Phiên đã thay đổi hoặc hết quyền. Dữ liệu riêng đã được ẩn; hãy tải lại trang.':'Chưa kiểm tra được phiên. Dữ liệu đang tạm ẩn trong lúc đối chiếu.'}</p>{/if}

<script lang="ts">
 import {onMount,flushSync} from 'svelte';import {resolve} from '$app/paths';
 let {children}=$props();let visible=$state(true),retained=$state(true),unavailable=$state(false);
 onMount(()=>{let stopped=false;let identity:string|null=null;let busy=false;
  const hide=()=>flushSync(()=>{visible=false;retained=false;unavailable=false;});
  const pause=()=>flushSync(()=>{visible=false;unavailable=true;});
  async function check(){if(busy||stopped||!retained)return;busy=true;try{const r=await fetch('/api/v1/session',{cache:'no-store',signal:AbortSignal.timeout(5000)});if(stopped)return;if(!r.ok){if(r.status===401||r.status===403)hide();else pause();return;}const v:unknown=await r.json();if(stopped)return;if(typeof v!=='object'||v===null||!('admin'in v)||v.admin!==true||!('actor'in v)||typeof v.actor!=='string'||!v.actor||!('epoch'in v)||typeof v.epoch!=='string'||!v.epoch||!('csrf'in v)||typeof v.csrf!=='string'||!v.csrf){hide();return;}const next=JSON.stringify([v.actor,v.epoch]);if(identity!==null&&identity!==next){hide();window.location.reload();return;}identity=next;visible=true;unavailable=false;}catch{if(!stopped&&retained)pause();}finally{busy=false;}}
  const show=(e:{persisted:boolean})=>{if(e.persisted){hide();window.location.reload();}};window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);void check();const timer=window.setInterval(()=>void check(),2000);
  return()=>{stopped=true;window.clearInterval(timer);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);};
 });
</script>
{#if retained}<div hidden={!visible} inert={!visible}><nav aria-label="Quản trị"><a href={resolve('/admin/workshops')}>Quản trị workshop</a> <a href={resolve('/operations')}>Vận hành lab</a></nav>{@render children()}</div>{/if}
{#if unavailable}<h1>Chưa xác nhận phiên quản trị</h1><p role="status">Dữ liệu đang tạm ẩn. Chỉ đọc đối chiếu lại, không tự gửi thao tác.</p>{:else if !retained}<h1>Cần kiểm tra lại phiên quản trị</h1><p role="status">Dữ liệu riêng đã được ẩn. Tải lại trang sau khi có phiên hợp lệ.</p>{/if}

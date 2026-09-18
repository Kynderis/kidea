<script lang="ts">
 import {onMount,flushSync,untrack} from 'svelte';
 import {decodeOperations,OperationsCritical,type Operations} from '$lib/operations';
 let {data}=$props();const initial=untrack(()=>data);let remembered:Operations['signals']['M2']['open']=$state(initial.operations.signals.M2.open);let current:Operations|null=$state(initial.operations),fresh=$state(true),allowed=$state(true),paused=$state(false);
 const incidents=new OperationsCritical();incidents.ingest(initial.operations);let conclusion=$state(incidents.conclusion(initial.operations));
 let refresh:()=>void=()=>{};let invalidate:()=>void=()=>{allowed=false;current=null;remembered=[];fresh=false;};
 $effect(()=>{if(data.owner.actor!==initial.owner.actor||data.owner.epoch!==initial.owner.epoch)invalidate();});
 onMount(()=>{let generation=0,stopped=false,busy=false,last=window.performance.now();let controller:AbortController|null=null;
  const clear=()=>{generation++;controller?.abort();flushSync(()=>{allowed=false;fresh=false;current=null;remembered=[];});};
  invalidate=clear;
  const unknown=()=>{fresh=false;incidents.unknown();};
  async function read(){if(stopped||busy||!allowed||paused)return;busy=true;const mine=generation;controller=new AbortController();const timeout=setTimeout(()=>controller?.abort(),2000);
   try{const r=await fetch('/api/v1/admin/operations',{cache:'no-store',redirect:'error',signal:controller.signal});if(stopped||mine!==generation||!allowed)return;
    if([401,403,404].includes(r.status)){clear();return;}if(!r.ok){unknown();return;}
    const raw:unknown=await r.json();if(stopped||mine!==generation||!allowed)return;
    if(typeof raw==='object'&&raw!==null&&('actor'in raw&&raw.actor!==initial.owner.actor||'epoch'in raw&&raw.epoch!==initial.owner.epoch)){clear();return;}
    const next=decodeOperations(raw,initial.owner);if(!next||current&&next.sampledAtMs<=current.sampledAtMs){unknown();return;}
    if(next.signals.M2.catalogState==='KNOWN')remembered=[...next.signals.M2.open,...remembered.filter(e=>e.code==='INVARIANT'&&!next.signals.M2.open.some(v=>v.code===e.code))];
    incidents.ingest(next);current=next;conclusion=incidents.conclusion(current);fresh=true;last=window.performance.now();
   }catch{if(!stopped&&mine===generation&&allowed)unknown();}finally{clearTimeout(timeout);busy=false;controller=null;}
  }
  refresh=()=>void read();
  const timer=window.setInterval(()=>{if(window.performance.now()-last>5000)unknown();void read();},2000);
  const hide=()=>{clear();};const show=(event:{persisted:boolean})=>{if(event.persisted){clear();window.location.reload();}};
  const visibility=()=>{if(window.document.hidden){generation++;controller?.abort();flushSync(()=>{paused=true;fresh=false;current=null;});}else{paused=false;void read();}};
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);window.document.addEventListener('visibilitychange',visibility);
  return()=>{stopped=true;generation++;controller?.abort();window.clearInterval(timer);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);window.document.removeEventListener('visibilitychange',visibility);refresh=()=>{};};
 });
 const label:Record<string,string>={PROCESSING:'Lỗi xử lý cập nhật',RECONCILE:'Cần đối chiếu dữ liệu',INVARIANT:'Sai tính toàn vẹn dữ liệu'};
</script>
<svelte:head><title>Vận hành lab • Workshop</title></svelte:head>
<h1>Vận hành lab</h1>
{#if !allowed}<p role="alert">Cần kiểm tra lại phiên quản trị. Dữ liệu riêng đã được xóa khỏi màn hình.</p>
{:else if paused}<p role="status">Đang tạm ẩn dữ liệu. Cần đọc lại khi trở về màn hình.</p>
{:else}
 <p role="status">{conclusion==='CRITICAL'?'Có lỗi nghiêm trọng đã biết':'Không rõ — chưa đủ các nguồn quan sát'}</p>
 <p>Ngoài phiên thử có người trực — chưa có cam kết giám sát.</p>
 <button type="button" onclick={()=>refresh()}>Làm mới dữ liệu</button>
 {#if !fresh}<p role="alert">Không có quan sát mới hợp lệ. Số liệu dưới đây là lần đọc trước; lỗi đã biết vẫn được giữ.</p>{/if}
 {#if current}
  <p>Mẫu gần nhất: {new Date(current.sampledAtMs).toLocaleString('vi-VN')}</p>
  <article><h2>Cập nhật dữ liệu</h2><dl>
   <dt>Tồn đọng</dt><dd>{current.signals.M1.countState==='KNOWN'?current.signals.M1.pending:'Không rõ'}</dd>
   <dt>Tuổi tồn đọng</dt><dd>{current.signals.M1.ageBasis==='EMPTY_NA'?'Không áp dụng — đã xác nhận rỗng':current.signals.M1.state==='BOUNDED'?(current.signals.M1.oldestAgeLowerMs===null?'Tối đa ':Math.floor((current.signals.M1.oldestAgeLowerMs??0)/1000)+'–')+Math.ceil((current.signals.M1.oldestAgeUpperMs??0)/1000)+' giây':'Không rõ'}</dd>
   <dt>Đối chiếu lỗi</dt><dd>{current.signals.M2.state==='KNOWN'?'Đã đọc sổ lỗi xử lý':'Không rõ — đường xử lý chưa được xác nhận'}</dd>
   <dt>Xử lý thành công cuối</dt><dd>{current.signals.M4.state!=='KNOWN'?'Không rõ':current.signals.M4.lastSuccess?new Date(current.signals.M4.lastSuccess.atMs).toLocaleString('vi-VN')+' • phiên bản '+current.signals.M4.lastSuccess.version:'Chưa có'}</dd>
  </dl><p>Tuổi tối đa dùng mốc đã ghi trong giao dịch; chưa phải phép đo chính xác thời điểm ghi hoàn tất. Xử lý xong chưa chứng minh trình duyệt đã nhận.</p></article>
  <article><h2>Lỗi chưa giải quyết</h2>{#if current.signals.M2.catalogState!=='KNOWN'}<p>Sổ lỗi hiện tại chưa đọc được; giữ các lỗi đã biết từ lần quan sát trước.</p>{/if}{#if remembered.length}<ul>{#each remembered as e(e.code)}<li>{label[e.code]} • {e.count} bản ghi • từ {new Date(e.firstSeenMs).toLocaleString('vi-VN')}</li>{/each}</ul>{:else}<p>{current.signals.M2.catalogState==='KNOWN'?'Sổ lỗi đã đọc không có lỗi mở trong phạm vi xử lý cập nhật.':'Không rõ — chưa đọc được sổ lỗi.'}</p>{/if}</article>
 {/if}
 <article><h2>Phần chưa được xác nhận</h2><p>Độ trễ đến màn hình, toàn bộ lỗi đối chiếu, sức khỏe kênh dự phòng, đo tải, dung lượng đủ các đích và bản sao phục hồi chưa được kiểm ở màn này.</p><p>Chưa đủ điều kiện xác nhận sẵn sàng ghi hoặc vận hành.</p></article>
{/if}
<style>dl{display:grid;grid-template-columns:minmax(7rem,1fr) minmax(0,2fr);gap:.6rem}dd{margin:0;overflow-wrap:anywhere}button{font:inherit;padding:.5rem 1rem;max-width:100%}@media(max-width:30rem){dl{display:block}dt{font-weight:600}dd{margin-bottom:.75rem}}</style>

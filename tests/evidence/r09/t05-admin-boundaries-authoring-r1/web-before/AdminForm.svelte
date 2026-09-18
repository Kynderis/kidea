<script lang="ts">
 import {onMount} from 'svelte';import {openUpdates,type UpdateStatus} from '$lib/updates';import {resolve} from '$app/paths';import {observationLabel} from '$lib/display';
 import {decodeAdmin,formOf,changedFields,fieldErrors,confirmation,sameObservation,compareAdminObservation,rebaseDraft,decodeAdminIntent,prepareAdminSend,decodeAdminResult,adminResultText,type AdminSnapshot,type AdminIntent,type Command,type Draft} from '$lib/admin';
 let {initial}:{initial:AdminSnapshot|null}=$props();
 let base=$state<AdminSnapshot|null>(null),draft=$state<Draft>(formOf(null)),latest=$state<AdminSnapshot|null>(null);
 let who=$state<{actor:string;epoch:string;csrf:string}|null>(null),intent=$state<AdminIntent|null>(null),busy=$state(false),ready=$state(false),message=$state('Đang kiểm tra phiên quản trị…'),outcomeMessage=$state(''),errors=$state<Record<string,string>>({}),created=$state<string|null>(null);
 let dialog:HTMLDialogElement;let confirmationLines=$state<string[]>([]),candidate=$state<Command|null>(null);let mounted=false,generation=0;let key='';let polling=false;let channel=$state<UpdateStatus>('UNKNOWN');let stopUpdates:(()=>void)|null=null;let conflicted=$state(false);
 const dirty=$derived(Object.keys(changedFields(base,draft)).length>0);
 const unresolved=$derived(intent!==null&&intent.state==='UNKNOWN');
 async function json(route:string,options:NonNullable<Parameters<typeof fetch>[1]>={}):Promise<unknown>{const response=await fetch('/api/v1'+route,{...options,cache:'no-store',signal:AbortSignal.timeout(8000)});if(!response.ok)throw new Error('UNCONFIRMED');return response.json();}
 async function identity(){const response=await fetch('/api/v1/session',{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!response.ok)throw new Error(response.status===401||response.status===403?'PERMISSION':'UNCONFIRMED');const v:unknown=await response.json();if(typeof v!=='object'||v===null||!('admin'in v)||v.admin!==true||!('actor'in v)||typeof v.actor!=='string'||!v.actor||!('epoch'in v)||typeof v.epoch!=='string'||!v.epoch||!('csrf'in v)||typeof v.csrf!=='string'||!v.csrf)throw new Error('PERMISSION');return {actor:v.actor,epoch:v.epoch,csrf:v.csrf};}
 function clear(){stopUpdates?.();stopUpdates=null;channel='UNKNOWN';generation++;who=null;base=null;latest=null;draft=formOf(null);intent=null;candidate=null;ready=false;created=null;outcomeMessage='';errors={};dialog?.close();}
 function blockConflict(){conflicted=true;latest=null;candidate=null;dialog?.close();message='Cùng phiên bản nhưng nội dung khác nhau. Chưa xác nhận dữ liệu; hãy tải và đối chiếu trước khi lưu.';}
 function persist(value:string){sessionStorage.setItem(key,value);}
 async function currentIdentity(){const g=generation;let next;try{next=await identity();}catch(error){if(!mounted||g!==generation)throw error;if(error instanceof Error&&error.message==='PERMISSION'){clear();message='Chưa xác nhận được quyền quản trị. Dữ liệu riêng đã được ẩn.';}else{channel='UNKNOWN';message='Chưa kiểm tra được phiên quản trị. Chỉ đọc đối chiếu lại, không tự gửi thao tác.';}throw error;}if(!mounted||g!==generation)throw new Error('SESSION_CHANGED');if(!who||next.actor!==who.actor||next.epoch!==who.epoch){clear();message='Phiên đã thay đổi. Dữ liệu cũ đã được ẩn; hãy tải lại trang.';throw new Error('SESSION_CHANGED');}who=next;if(message==='Chưa kiểm tra được phiên quản trị. Chỉ đọc đối chiếu lại, không tự gửi thao tác.')message='Đã kiểm tra lại phiên quản trị. Thao tác vẫn được đối chiếu trước khi gửi.';}
 async function snapshot(){if(!initial)return null;const v=decodeAdmin(await json('/admin/workshops/'+encodeURIComponent(initial.id)));if(!v||v.id!==initial.id||v.epoch!==who?.epoch)throw new Error('SNAPSHOT');return v;}
 async function refresh(replace=false,background=false){const g=generation;await currentIdentity();const next=await snapshot();if(!mounted||g!==generation||background&&busy)return false;return observe(next,replace,background);}
 function observe(next:AdminSnapshot|null,replace=false,background=false){
  if(base&&next){const order=compareAdminObservation(base,next);if(order==='OLDER')return false;if(order==='CONFLICT'){blockConflict();return false;}}
  if(conflicted&&background)return false;conflicted=false;
  if(base&&next&&!sameObservation(base,next)&&dirty&&!replace){latest=next;candidate=null;dialog?.close();message='Dữ liệu đã thay đổi. Phần bạn nhập vẫn được giữ; xem bản mới trước khi lưu.';return false;}
  if(next){if(replace||!dirty)draft=formOf(next);base=next;}latest=null;return true;
 }
 function reviewLatest(){if(!base||!latest)return;draft=rebaseDraft(base,latest,draft);base=latest;latest=null;message='Đã đối chiếu bản mới và giữ riêng các trường bạn sửa. Kiểm tra rồi lưu lại.';}
 async function reload(){if(busy||!who)return;busy=true;try{await refresh();}catch{message='Chưa tải được bản mới. Không có thao tác nào được gửi.';}finally{busy=false;}}
 function discard(){if(!base||unresolved)return;draft=formOf(latest??base);base=latest??base;latest=null;errors={};message='Đã bỏ phần chưa lưu.';}
 async function lookup(){if(!intent||busy||!who)return;busy=true;const g=generation;try{await currentIdentity();const old=intent;const raw=await json('/admin/intents/'+encodeURIComponent(old.command.intentId));await currentIdentity();if(!mounted||g!==generation)return;await accept(raw,old);}catch{if(mounted&&g===generation)message='Chưa xác nhận kết quả. Chỉ đọc đối chiếu, không tự gửi lại thao tác.';}finally{busy=false;}}
 async function accept(raw:unknown,pending:AdminIntent){const result=decodeAdminResult(raw,pending);if(!result)throw new Error('UNCONFIRMED');const g=generation;pending.state='FINAL';intent=pending;persist(JSON.stringify(pending));outcomeMessage=adminResultText(result);message='';errors=result.code==='BELOW_ACTIVE'?{capacity:outcomeMessage}:{};if(pending.command.action==='CREATE'&&result.code==='CREATED')created=result.workshopId??null;
  // A newer observation cannot replace the validated historical result. A
  // confirmed identity loss clears both; stale refreshes cannot add old text.
  if(initial){try{await refresh(result.effect!=='REJECTED');}catch{if(mounted&&g===generation&&who)message='Chưa tải được trạng thái hiện tại.';}}
 }
 async function send(command:Command){if(!who||unresolved)return;const g=generation;const pending:AdminIntent={actor:who.actor,epoch:who.epoch,command,sent:false,state:'UNKNOWN'};
  // Commit the local correlation marker before the only POST. A reload only GETs.
  try{prepareAdminSend(pending,persist);}catch{message='Không lưu được mã đối chiếu trên trình duyệt. Chưa gửi thao tác.';return;}intent=pending;outcomeMessage='';message='Đang gửi thao tác…';
  try{const raw=await json('/admin/intents',{method:'POST',headers:{'content-type':'application/json','x-csrf-token':who.csrf},body:JSON.stringify(command)});await currentIdentity();if(!mounted||g!==generation)return;await accept(raw,pending);}catch{if(mounted&&g===generation)message='Chưa xác nhận kết quả. Không tự gửi lại thao tác; dùng Kiểm tra kết quả.';}
 }
 async function begin(target?:'OPEN'|'PAUSED'){
  if(busy||unresolved||conflicted||!ready||!who||latest)return;busy=true;candidate=null;
  try{if(target&&dirty){message='Hãy lưu hoặc bỏ phần chưa lưu trước khi đổi trạng thái.';return;}errors=target?{}:fieldErrors(draft);if(Object.keys(errors).length){message='Hãy kiểm tra các trường được ghi lỗi.';return;}
   if(!await refresh())return;if(!who)return;const fields=changedFields(base,draft);if(!target&&base&&!Object.keys(fields).length){message='Không có trường nào được sửa.';return;}
   const command:Command={epoch:who.epoch,intentId:crypto.randomUUID(),action:target?'STATE':base?'EDIT':'CREATE',...(base?{workshopId:base.id}:{}),...(target?{targetState:target}:{fields})};
   confirmationLines=target?[target==='PAUSED'?'Tạm dừng đăng ký và hủy mới; giữ các đăng ký hiện có.':base?.state==='DRAFT'?'Công khai workshop và mở nhận đăng ký.':'Mở lại nhận đăng ký và hủy mới; không gửi lại yêu cầu cũ.']:base?confirmation(base,fields):[];
   if(confirmationLines.length){candidate=command;dialog.showModal();return;}await send(command);
  }catch{message='Chưa xác nhận phiên hoặc dữ liệu hiện tại. Chưa gửi thao tác.';}finally{busy=false;}
 }
 async function confirm(){if(!candidate||busy||!base||!who)return;busy=true;const command=candidate;const before=base;candidate=null;dialog.close();
  try{await currentIdentity();const current=await snapshot();if(current&&compareAdminObservation(before,current)==='CONFLICT'){blockConflict();return;}if(!current||!sameObservation(before,current)){latest=current;message='Dữ liệu thay đổi trong lúc xác nhận. Hãy xem lại trước khi gửi.';return;}await send(command);}catch{message='Chưa xác nhận dữ liệu mới. Chưa gửi thao tác.';}finally{busy=false;}
 }
 onMount(()=>{mounted=true;const g=++generation;
  void(async()=>{try{const session=await identity();if(!mounted||g!==generation)return;who=session;key='workshop-admin:'+session.actor+':'+session.epoch+':'+(initial?.id??'CREATE');base=await snapshot();await currentIdentity();if(!mounted||g!==generation)return;draft=formOf(base);const saved=sessionStorage.getItem(key);if(saved){const restored=decodeAdminIntent(saved,session.actor,session.epoch);if(!restored){message='Mã đối chiếu đã lưu không hợp lệ. Chưa thể tạo thao tác thay thế.';return;}intent=restored;}ready=true;if(initial){stopUpdates=openUpdates({audience:'admin',epoch:session.epoch,workshopId:initial.id,csrf:()=>who?.csrf??'',validate:async()=>{const before=generation;await currentIdentity();return mounted&&before===generation;},read:()=>json('/admin/workshops/'+encodeURIComponent(initial.id)),snapshot:(raw,source)=>{const next=decodeAdmin(raw);if(!next||next.id!==initial.id||next.epoch!==who?.epoch||busy)return false;return observe(next,false,source==='SOCKET');},status:value=>{if(mounted)channel=value;}});}message=unresolved?'Có thao tác chưa xác nhận. Chỉ đọc kết quả cùng mã; không gửi lại.':'Có thể chỉnh sửa. Trạng thái được kiểm lại trước khi gửi.';}catch{if(mounted&&g===generation){clear();message='Chưa xác nhận được phiên hoặc dữ liệu quản trị.';}}})();
  const timer=window.setInterval(()=>{if(ready&&!initial&&!busy&&!polling&&who){polling=true;void refresh(false,true).catch(()=>{if(mounted)message='Chưa đối chiếu được dữ liệu mới. Hãy tải lại trước khi thao tác.';}).finally(()=>{polling=false;});}},2000);
  return()=>{mounted=false;generation++;stopUpdates?.();window.clearInterval(timer);};
 });
</script>
<h1>{initial?'Sửa workshop':'Tạo bản nháp'}</h1><p role="status">{message}</p>
{#if outcomeMessage}<p role="status">{outcomeMessage}</p>{/if}
{#if ready&&who}
 {#if base}<p role="status">{channel==='OBSERVED'?'Đang đối chiếu cập nhật trực tiếp.':'Chưa xác nhận cập nhật trực tiếp; tải và đối chiếu trước khi dựa vào số liệu.'}</p><p>{base.title} · {base.state==='DRAFT'?'Bản nháp':base.state==='OPEN'?'Đang mở':'Tạm dừng'}</p><p>Đăng ký hiệu lực: {base.active} · Sức chứa: {base.capacity} · Quan sát {observationLabel(base.observedAt)}</p>{/if}
 {#if created}<p><a href={resolve('/admin/workshops/[id]',{id:created})}>Mở bản nháp vừa tạo</a></p>{/if}
 {#if unresolved}<p>Thao tác {intent?.command.action} đang chờ đối chiếu.</p><button disabled={busy} onclick={()=>void lookup()}>Kiểm tra kết quả</button>{/if}
 {#if latest}<section aria-label="Dữ liệu mới"><h2>Bản mới từ máy chủ</h2><p>{latest.title} · {latest.description}</p><p>Sức chứa {latest.capacity}, đăng ký hiệu lực {latest.active}, trạng thái {latest.state}</p><p>{latest.schedule.start} — {latest.schedule.end}</p><button disabled={busy||unresolved} onclick={reviewLatest}>Đã xem bản mới, giữ các trường tôi sửa</button></section>{/if}
 <form onsubmit={(e)=>{e.preventDefault();void begin();}}>
 <fieldset disabled={busy||unresolved}><legend>Nội dung workshop</legend>
 <label>Tên<input bind:value={draft.title} aria-invalid={!!errors.title} aria-describedby="title-error" /></label><p id="title-error">{errors.title??''}</p>
 <label>Mô tả văn bản thuần<textarea bind:value={draft.description} rows="5" aria-invalid={!!errors.description} aria-describedby="description-error"></textarea></label><p id="description-error">{errors.description??''}</p>
 <label>Sức chứa<input bind:value={draft.capacity} inputmode="numeric" aria-invalid={!!errors.capacity} aria-describedby="capacity-error" /></label><p id="capacity-error">{errors.capacity??''}</p>
 <label>Bắt đầu, kèm múi giờ<input bind:value={draft.start} placeholder="2026-10-01T09:00:00+07:00" aria-invalid={!!errors.start} aria-describedby="start-error" /></label><p id="start-error">{errors.start??''}</p>
 <label>Kết thúc, kèm múi giờ<input bind:value={draft.end} placeholder="2026-10-01T10:00:00+07:00" aria-invalid={!!errors.end} aria-describedby="end-error" /></label><p id="end-error">{errors.end??''}</p>
 <button type="submit" disabled={!!latest||conflicted}>{base?'Lưu nội dung':'Tạo bản nháp'}</button>{#if base}<button type="button" onclick={discard}>Bỏ phần chưa lưu</button>{/if}
 </fieldset></form>
 {#if base}<button disabled={busy||unresolved||conflicted||dirty||!!latest} onclick={()=>void begin(base?.state==='OPEN'?'PAUSED':'OPEN')}>{base.state==='DRAFT'?'Xuất bản':base.state==='OPEN'?'Tạm dừng':'Mở lại'}</button>{/if}
 <button disabled={busy} onclick={()=>void reload()}>Tải và đối chiếu</button>
{/if}
<dialog bind:this={dialog} oncancel={()=>{candidate=null;}}><h2>Xác nhận thay đổi</h2><p>{base?.title} · {base?.id}</p><p>Quan sát {base?observationLabel(base.observedAt):''}</p>{#each confirmationLines as line(line)}<p>{line}</p>{/each}<button onclick={()=>{candidate=null;dialog.close();}}>Quay lại</button><button disabled={busy} onclick={()=>void confirm()}>Xác nhận thay đổi</button></dialog>
<style>label{display:grid;gap:.3rem;margin-top:.8rem}input,textarea{width:100%;min-width:0;font:inherit;padding:.5rem}fieldset{border:1px solid #c9d6df;padding:1rem}button{font:inherit;padding:.6rem;margin:.4rem .5rem .4rem 0;max-width:100%;white-space:normal}dialog{max-width:min(92vw,40rem);max-height:85vh;overflow:auto}section{border:2px solid #9b5100;padding:1rem;margin:1rem 0}p{overflow-wrap:anywhere}[aria-invalid=true]{border:2px solid #a22828}</style>

<script lang="ts">
 import {onMount} from 'svelte';import Registration from '$lib/Registration.svelte';import {scheduleLabel,observationLabel} from '$lib/display';
 import {PublicUpdates,openUpdates,type UpdateStatus} from '$lib/updates';import type {Snapshot} from '$lib/state';
 let {initial}:{initial:Snapshot}=$props();let received=$state<Snapshot|null>(null),channel=$state<UpdateStatus>('UNKNOWN');const current=$derived(received??initial);
 onMount(()=>{const state=new PublicUpdates(initial.epoch,[initial]);let actor:string|undefined,csrf='';
  async function validate(){const r=await fetch('/api/v1/session',{cache:'no-store',signal:AbortSignal.timeout(5000)});let next='';
   if(r.ok){const raw:unknown=await r.json();if(typeof raw!=='object'||raw===null||!('actor'in raw)||typeof raw.actor!=='string'||!('epoch'in raw)||raw.epoch!==initial.epoch||!('csrf'in raw)||typeof raw.csrf!=='string')return false;next=raw.actor;csrf=raw.csrf;}else if(r.status===401){csrf='';}else return false;
   if(actor!==undefined&&actor!==next){window.location.reload();return false;}actor=next;return true;
  }
  return openUpdates({audience:'public',epoch:initial.epoch,workshopId:initial.id,csrf:()=>csrf,validate,read:async()=>{const r=await fetch('/api/v1/workshops/'+encodeURIComponent(initial.id),{cache:'no-store',signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('UNKNOWN');return r.json();},snapshot:(raw,source)=>{const ok=state.merge(raw,source);received=state.snapshots.get(initial.id)??null;return ok;},status:value=>{channel=value;}});
 });
</script>
<svelte:head><title>{current.title} – Workshop thử nghiệm</title><meta name="description" content={current.description.slice(0,160)} /></svelte:head>
<h1>{current.title}</h1><article><p class="description">{current.description}</p><p>{scheduleLabel(current.schedule.start)} — {scheduleLabel(current.schedule.end)}</p><p>{current.state==='OPEN'?'Mở đăng ký':'Tạm dừng'}</p><p>{current.remaining}/{current.capacity} chỗ còn theo lần quan sát.</p><p role="status">{channel==='OBSERVED'?'Đang đối chiếu cập nhật trực tiếp.':'Chưa xác nhận cập nhật trực tiếp. Số liệu dưới đây là lần quan sát trước.'}</p><p>Quan sát lúc {observationLabel(current.observedAt)} · Không phải cam kết giữ chỗ</p></article>
<Registration workshop={current} />
<style>.description{white-space:pre-wrap}</style>

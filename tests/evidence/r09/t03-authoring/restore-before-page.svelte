<script lang="ts">import {resolve} from '$app/paths';import {scheduleLabel} from '$lib/display';import type {PageData} from './$types';let {data}:{data:PageData}=$props();</script>
<svelte:head><title>Đăng ký của tôi – Workshop thử nghiệm</title><meta name="description" content="Đăng ký trong phiên tài khoản thử hiện tại." /></svelte:head>
<h1>Đăng ký của tôi</h1><p>Đây là dữ liệu tại lần đọc hiện tại. Mở chi tiết để đối chiếu và thao tác.</p>
{#each data.groups as group (group.workshop.id)}<article><h2><a href={resolve('/workshops/[id]',{id:group.workshop.id})}>{group.workshop.title}</a></h2><p>{scheduleLabel(group.workshop.schedule.start)} — {scheduleLabel(group.workshop.schedule.end)}</p><ul>{#each group.registrations as r (r.id)}<li>{r.id} · {r.state==='ACTIVE'?'Đã đăng ký':'Đã hủy'}</li>{/each}</ul></article>{:else}<p>Chưa có đăng ký trong phiên hiện tại.</p>{/each}
<style>li{overflow-wrap:anywhere}</style>

<script lang="ts">import {resolve} from '$app/paths';import LiveCollection from '$lib/LiveCollection.svelte';import type {PageData} from './$types';let {data}:{data:PageData}=$props();</script>
<svelte:head><title>Quản trị workshop – Workshop thử nghiệm</title></svelte:head>
<h1>Quản trị workshop</h1><p><a href={resolve('/admin/workshops/new')}>Tạo bản nháp</a></p><p>Dữ liệu theo lần đọc hiện tại. Mở workshop để đối chiếu và chỉnh sửa.</p>
<LiveCollection initial={data.workshops} audience="admin" />

<script lang="ts">import LiveHistory from '$lib/LiveHistory.svelte';import type {PageData} from './$types';let {data}:{data:PageData}=$props();</script>
<svelte:head><title>Đăng ký của tôi – Workshop thử nghiệm</title><meta name="description" content="Đăng ký trong phiên tài khoản thử hiện tại." /></svelte:head>
<h1>Đăng ký của tôi</h1><p>Mở chi tiết để đối chiếu và thao tác.</p><LiveHistory initial={data.groups} />

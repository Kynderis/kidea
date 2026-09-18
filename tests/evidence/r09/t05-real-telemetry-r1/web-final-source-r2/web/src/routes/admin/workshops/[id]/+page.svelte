<script lang="ts">import AdminForm from '$lib/AdminForm.svelte';import type {PageData} from './$types';let {data}:{data:PageData}=$props();</script>
<svelte:head><title>Sửa workshop – Workshop thử nghiệm</title></svelte:head>
{#key data.workshop.id}<AdminForm initial={data.workshop} />{/key}

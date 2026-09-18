<script lang="ts">import LiveWorkshop from '$lib/LiveWorkshop.svelte';import {resolve} from '$app/paths';import type {PageData} from './$types';let {data}:{data:PageData}=$props();</script>
<svelte:head><link rel="canonical" href={'https://workshop.test/workshops/'+encodeURIComponent(data.workshop.id)} /></svelte:head>
<a href={resolve('/workshops')}>← Danh sách workshop</a>
{#key JSON.stringify([data.workshop.id,data.workshop.epoch])}<LiveWorkshop initial={data.workshop} />{/key}

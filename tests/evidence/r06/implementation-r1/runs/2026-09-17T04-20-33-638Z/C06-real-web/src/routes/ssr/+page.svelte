<script lang="ts">let {data} = $props();</script>
<svelte:head><title>Private SSR fixture</title><meta name="robots" content="noindex,nofollow"/></svelte:head>
<h1>Fake actor {data.actor}</h1><p data-testid="private">{data.privateValue}</p>

{#each data.audiences as item (item.audience)}<p data-testid={item.audience+"-audience"}>{item.version}:{item.value}</p>{/each}

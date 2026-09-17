<script lang="ts">
 import { onDestroy } from 'svelte';
 import { ViewState } from './model';
 let {register, report}: {register:(fn:()=>void)=>void; report:(s:string)=>void} = $props();
 const view = new ViewState();
 onDestroy(() => view.unmount());
 function start() {
  const response = {...view.context,workshop:'W1',audience:'private',version:'1',value:'PRIVATE_U_ONLY'};
  register(() => {const accepted=view.apply(response);report(JSON.stringify({accepted,values:[...view.values.values()]}));});
 }
</script>
<button onclick={start}>Start child callback</button>

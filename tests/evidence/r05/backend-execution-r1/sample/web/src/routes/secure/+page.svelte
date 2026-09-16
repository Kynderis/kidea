<script lang="ts">
 import type { PageData } from './$types';
 let {data}:{data:PageData}=$props();
 let result=$state('');
 async function write(){
  const response=await fetch('/api/write',{method:'POST',headers:{'content-type':'application/json','x-csrf-token':data.csrf},body:JSON.stringify({id:crypto.randomUUID(),value:'Mẫu kiểm HTTPS',version:'1'})});
  result=response.ok?'Đã ghi':'Bị từ chối';
 }
</script>
<svelte:head><title>Kiểm phiên HTTPS</title><meta name="robots" content="noindex,nofollow" /></svelte:head>
<main>
 <h1>Phiên {data.actor}</h1>
 <p data-testid="private-sentinel">{data.sentinel}</p>
 <button onclick={write}>Ghi dữ liệu thử</button>
 <p aria-live="polite">{result}</p>
</main>

<script lang="ts">
 import DataLab from '$lib/DataLab.svelte';
 import AsyncChild from '$lib/AsyncChild.svelte';
 import { ViewState, AdminIntent, type Snapshot } from '$lib/model';
 let output = $state('ready');
 let childMounted = $state(true);
 let releaseChild = () => {};
 let childOutput = $state('ready');
 let pending: Snapshot | undefined;
 const view = new ViewState();
 const intent = new AdminIntent('X');
 const hostile = '<img src=x onerror=alert(1)> & Workshop';
 function start() { pending = {...view.context, workshop:'W1',audience:'private',version:'1',value:'PRIVATE_U_ONLY'}; output='pending U'; }
 function switchActor() { view.switchActor('V'); output='actor V'; }
 function finish() { const accepted = pending ? view.apply(pending) : false; output=JSON.stringify({actor:view.context.actor,accepted,values:[...view.values.values()]}); }
 function intentAttempt() {
  const saved=sessionStorage.getItem('lab-intent');
  if(saved !== null) {
   intent.sent=true;
   try { const data: unknown=JSON.parse(saved); if(typeof data==='object' && data!==null && 'calls' in data && Array.isArray(data.calls) && data.calls.every(c=>c==='POST'||c==='GET')) intent.calls=data.calls; } catch { /* Damaged persisted intent stays UNKNOWN and is reconciled, never replayed. */ }
  }
  intent.attempt(); sessionStorage.setItem('lab-intent',JSON.stringify({sent:intent.sent,calls:intent.calls}));
  output=JSON.stringify({state:intent.state,calls:intent.calls});
 }
 function staleHistory() {
  const history = new ViewState();
  const common = {...history.context,workshop:'W1',audience:'private'};
  history.apply({...common,version:'20',value:'A CANCELLED; B ACTIVE'});
  history.apply({...common,version:'19',value:'A ACTIVE'});
  output=[...history.values.values()][0].value;
 }
</script>
<svelte:head><title>R05 Web sample</title><meta name="robots" content="noindex,nofollow"/></svelte:head>
<main id="content"><h1>R05 synthetic Web sample</h1><p>Fake transport. This is not the Workshop application.</p>
<p data-testid="literal">{hostile}</p>
<button onclick={start}>Start U response</button><button onclick={switchActor}>Switch to V</button><button onclick={finish}>Release response</button>
<button onclick={() => {view.unmount(); output='unmounted';}}>Unmount model</button>
<button onclick={intentAttempt}>Send or reconcile admin X</button>
<output data-testid="result">{output}</output>

{#if childMounted}<AsyncChild register={(fn: () => void) => {releaseChild=fn;}} report={(value: string) => {childOutput=value;}}/>{/if}
<button onclick={() => {childMounted=false;}}>Destroy child component</button>
<button onclick={() => releaseChild()}>Release child callback</button>
<output data-testid="child-result">{childOutput}</output>

<button onclick={staleHistory}>Release stale history</button>
<button onclick={() => {intent.reconcile("FINAL"); output=JSON.stringify({state:intent.state,calls:intent.calls});}}>Resolve admin X FINAL</button>

<DataLab/>
</main>
<style> :global(html){font-size:100%;} :global(body){margin:0;font-family:system-ui,sans-serif;line-height:1.5;} main{max-width:60rem;margin:auto;padding:1rem;overflow-wrap:anywhere;} :global(button),:global(textarea){font:inherit;max-width:100%;box-sizing:border-box;} :global(button){min-height:2.75rem;margin:.25rem;padding:.4rem .7rem;white-space:normal;} :global(output){display:block;overflow-wrap:anywhere;} :global(:focus-visible){outline:3px solid #155eef;outline-offset:2px;} </style>

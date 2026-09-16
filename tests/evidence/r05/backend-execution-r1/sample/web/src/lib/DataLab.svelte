<script lang="ts">
 import { ViewState,decodeReply } from './model';
 const view=new ViewState();
 let input=$state('');
 let result=$state('UNKNOWN');
 let actor=$state('U');
 let epoch=$state('E1');
 let generation=$state(1);
 let open=$state(false);
 let dialog: HTMLDialogElement;
 let opener: HTMLButtonElement;
 function apply(){result=view.receive(input)?'SNAPSHOT_ACCEPTED':'UNKNOWN';}
 function reply(){result=decodeReply(input,view.context,'X');}
 function change(){actor=actor==='U'?'V':'U';view.switchActor(actor,epoch);generation=view.context.generation;result='UNKNOWN';}
 function reset(){epoch=epoch==='E1'?'E2':'E1';view.switchActor(actor,epoch);generation=view.context.generation;result='UNKNOWN';}
 function show(){open=true;dialog.showModal();}
 function close(){open=false;dialog.close();opener.focus();}
</script>
<section aria-labelledby="data-heading"><h2 id="data-heading">Data and session lab</h2>
<p data-testid="context">{actor}/{epoch}/{generation}</p>
<label for="payload">Fake API JSON</label><textarea id="payload" rows="4" bind:value={input}></textarea>
<button onclick={apply}>Validate snapshot</button><button onclick={reply}>Validate intent reply</button>
<button onclick={change}>Change API actor</button><button onclick={reset}>Change API epoch</button>
<output data-testid="api-result" aria-live="polite">{result}</output>
<button bind:this={opener} onclick={show} aria-haspopup="dialog" aria-expanded={open}>Review fake action</button>
<dialog bind:this={dialog} oncancel={(event)=>{event.preventDefault();close();}} aria-labelledby="dialog-heading">
<h2 id="dialog-heading">Review only</h2><p>No mutation is sent by this dialog.</p><button onclick={close}>Close review</button>
</dialog>
</section>
<style>textarea{display:block;width:100%;}dialog{max-width:calc(100% - 4rem);box-sizing:border-box;}</style>

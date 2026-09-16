import type {RequestHandler} from './$types';
export const GET: RequestHandler = ({url}) => {
 const stuck=url.searchParams.get('stuck')==='1';
 let timer: ReturnType<typeof setTimeout>;
 const stream=new ReadableStream<Uint8Array>({start(controller){controller.enqueue(new TextEncoder().encode('START\n'));if(!stuck)timer=setTimeout(()=>{controller.enqueue(new TextEncoder().encode('DONE\n'));controller.close();},800);},cancel(){clearTimeout(timer);}});
 return new Response(stream,{headers:{'content-type':'text/plain','cache-control':'no-store'}});
};

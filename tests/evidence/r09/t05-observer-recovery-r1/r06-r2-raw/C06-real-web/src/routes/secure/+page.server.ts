import { error } from '@sveltejs/kit';
import { request as httpRequest } from 'node:http';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ request, setHeaders }) => {
 setHeaders({'cache-control':'no-store'});
 // A fixed internal target; preserve the explicitly required Host and caller cookie.
 // Fetch does not preserve the Host override on this runtime.
 const response=await new Promise<{status:number,body:string}>((resolve,reject)=>{
  const upstream=httpRequest({hostname:'backend',port:8080,path:'/api/session',headers:{host:'localhost:8443',cookie:request.headers.get('cookie')??''}},res=>{
   let body='';
   res.setEncoding('utf8');
   res.on('data',(chunk:string)=>{body+=chunk;if(Buffer.byteLength(body)>16384)upstream.destroy(new Error('Oversize session response'));});
   res.on('end',()=>resolve({status:res.statusCode??502,body}));
   res.on('error',reject);
  });
  upstream.setTimeout(5000,()=>upstream.destroy(new Error('Session request timeout')));
  upstream.on('error',reject);upstream.end();
 });
 if(response.status!==200)error(response.status,'Session unavailable');
 const value:unknown=JSON.parse(response.body);
 if(typeof value!=='object'||value===null||!('actor' in value)||typeof value.actor!=='string'||!('sentinel' in value)||typeof value.sentinel!=='string'||!('csrf' in value)||typeof value.csrf!=='string')error(502,'Invalid backend session');
 return {actor:value.actor,sentinel:value.sentinel,csrf:value.csrf};
};

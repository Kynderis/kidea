import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
export const handle: Handle = async ({event,resolve}) => {
 // Direct loopback sample has no trusted reverse proxy. Do not infer trust from client headers.
 const headers=event.request.headers;
 const trusted=env.KIDEA_INTEGRATION==='1'
  ? headers.get('host')==='localhost:8443' && !headers.has('forwarded') && headers.get('x-forwarded-host')==='localhost:8443' && headers.get('x-forwarded-proto')==='https'
  : headers.get('host')==='127.0.0.1:4173' && !['forwarded','x-forwarded-host','x-forwarded-proto','x-forwarded-for'].some(h=>headers.has(h));
 if(!trusted)return new Response('Untrusted authority/proxy headers',{status:400});
 const response=await resolve(event);
 response.headers.set('x-robots-tag','noindex, nofollow');
 return response;
};

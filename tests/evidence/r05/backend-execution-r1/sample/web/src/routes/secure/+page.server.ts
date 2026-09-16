import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ request, fetch, setHeaders }) => {
 setHeaders({'cache-control':'no-store'});
 const response=await fetch('http://backend:8080/api/session',{headers:{host:'localhost:8443',cookie:request.headers.get('cookie')??''}});
 if(!response.ok)error(response.status,'Session unavailable');
 const value:unknown=await response.json();
 if(typeof value!=='object'||value===null||!('actor' in value)||typeof value.actor!=='string'||!('sentinel' in value)||typeof value.sentinel!=='string'||!('csrf' in value)||typeof value.csrf!=='string')error(502,'Invalid backend session');
 return {actor:value.actor,sentinel:value.sentinel,csrf:value.csrf};
};

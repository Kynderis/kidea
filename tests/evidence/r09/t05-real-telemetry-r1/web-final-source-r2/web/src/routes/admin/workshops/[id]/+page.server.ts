import {readAdmin} from '$lib/server/admin';
export const load=async({cookies,params,setHeaders})=>{setHeaders({'cache-control':'no-store'});return {workshop:(await readAdmin(cookies.get('workshop_session'),params.id))[0]};};

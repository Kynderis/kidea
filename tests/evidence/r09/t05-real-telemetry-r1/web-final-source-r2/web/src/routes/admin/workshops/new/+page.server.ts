import {readAdmin} from '$lib/server/admin';
export const load=async({cookies,setHeaders})=>{setHeaders({'cache-control':'no-store'});await readAdmin(cookies.get('workshop_session'));return {};};

import {readAdmin} from '$lib/server/admin';
export const load=async({cookies,setHeaders})=>{setHeaders({'cache-control':'no-store'});return {workshops:await readAdmin(cookies.get('workshop_session'))};};

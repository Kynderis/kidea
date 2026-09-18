import {readOperations} from '$lib/server/operations';
export const load=async({cookies,setHeaders})=>{setHeaders({'cache-control':'no-store'});return readOperations(cookies.get('workshop_session'));};

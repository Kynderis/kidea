import {readPublic} from '$lib/server/public';
export const load=async ({setHeaders})=>{setHeaders({'cache-control':'no-store'});return {workshops:await readPublic()};};

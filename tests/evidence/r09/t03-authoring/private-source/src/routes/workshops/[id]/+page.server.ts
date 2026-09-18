import {readPublic} from '$lib/server/public';import {error} from '@sveltejs/kit';
export const load=async ({params,setHeaders})=>{setHeaders({'cache-control':'no-store'});const [workshop]=await readPublic(params.id);if(!workshop||workshop.id!==params.id)error(404,'Không thể truy cập workshop này');return {workshop};};

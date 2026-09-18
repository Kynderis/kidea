import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = ({cookies}) => json({actor:cookies.get('lab_actor') ?? null},{headers:{'cache-control':'no-store'}});
export const POST: RequestHandler = async ({request,cookies}) => {
 const {actor}=await request.json();
 if(actor!=='U' && actor!=='V')return json({error:'BAD_ACTOR'},{status:400});
 cookies.set('lab_actor',actor,{path:'/',httpOnly:true,secure:true,sameSite:'strict'});
 return json({set:actor},{headers:{'cache-control':'no-store'}});
};
export const DELETE: RequestHandler = ({cookies}) => {cookies.delete('lab_actor',{path:'/'});return json({deleted:true});};

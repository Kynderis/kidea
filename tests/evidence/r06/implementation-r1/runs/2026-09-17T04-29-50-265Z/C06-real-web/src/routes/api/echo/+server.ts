import {json,error} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
export const POST: RequestHandler = async ({request}) => {
 try {const body=await request.arrayBuffer();return json({bytes:body.byteLength});}
 catch(e: unknown){if(typeof e==='object' && e!==null && 'status' in e && e.status===413)error(413,'Body too large');throw e;}
};
export const GET: RequestHandler = ({url}) => json({origin:url.origin},{headers:{'cache-control':'no-store'}});

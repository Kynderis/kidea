import {error} from '@sveltejs/kit';
import {env} from '$env/dynamic/private';
import {decodeHistory} from '$lib/state';
import {readPublic} from '$lib/server/public';
export const load=async ({cookies,setHeaders})=>{
 setHeaders({'cache-control':'no-store'});
 const token=cookies.get('workshop_session');if(!token)error(401,'Cần phiên tài khoản thử hợp lệ');
 const base=env.WORKSHOP_BACKEND;if(!base||!/^http:\/\/(127\.0\.0\.1|localhost):[0-9]+$/.test(base))error(503,'Chưa cấu hình kết nối workshop');
 async function get(route:string):Promise<unknown>{
  let response:Response;try{response=await fetch(base+'/api/v1'+route,{headers:{cookie:'workshop_session='+encodeURIComponent(token??''),accept:'application/json'},signal:AbortSignal.timeout(5000),redirect:'error'});}catch{error(503,'Chưa tải được đăng ký hiện tại');}
  if(response.status===401||response.status===403||response.status===404)error(401,'Cần phiên tài khoản thử hợp lệ');if(!response.ok)error(503,'Chưa tải được đăng ký hiện tại');try{return await response.json();}catch{error(503,'Chưa xác nhận dữ liệu đăng ký');}
 }
 const who=await get('/session');if(typeof who!=='object'||who===null||!('actor'in who)||typeof who.actor!=='string'||!who.actor||!('epoch'in who)||typeof who.epoch!=='string'||!who.epoch||!('participant'in who)||who.participant!==true)error(401,'Cần phiên người tham gia hợp lệ');
 const raw=await get('/me/registrations');if(!Array.isArray(raw))error(503,'Chưa xác nhận dữ liệu đăng ký');
 const groups=[];
 for(const value of raw){const history=decodeHistory(value);if(!history||history.actor!==who.actor||history.epoch!==who.epoch)error(503,'Chưa xác nhận dữ liệu đăng ký');const [workshop]=await readPublic(history.workshopId);if(!workshop||workshop.epoch!==history.epoch)error(503,'Chưa xác nhận dữ liệu đăng ký');groups.push({workshop,registrations:history.registrations});}
 // No token, CSRF, request ID or actor identifier in SSR data or metadata.
 return {groups};
};

import {error} from '@sveltejs/kit';
import {env} from '$env/dynamic/private';
import {decodeOperations} from '$lib/operations';
export async function readOperations(token:string|undefined){
 if(!token)error(401,'Cần phiên quản trị hợp lệ');
 const base=env.WORKSHOP_BACKEND;if(!base||!/^http:\/\/(127\.0\.0\.1|localhost):[0-9]+$/.test(base))error(503,'Chưa cấu hình kết nối workshop');
 async function get(route:string):Promise<unknown>{let r:Response;try{r=await fetch(base+'/api/v1'+route,{cache:'no-store',redirect:'error',signal:AbortSignal.timeout(2000),headers:{cookie:'workshop_session='+encodeURIComponent(token??''),accept:'application/json'}});}catch{error(503,'Chưa xác nhận dữ liệu vận hành');}if(r.status===401)error(401,'Cần phiên quản trị hợp lệ');if(r.status===403||r.status===404)error(404,'Không thể truy cập nội dung này');if(!r.ok)error(503,'Chưa xác nhận dữ liệu vận hành');try{return await r.json();}catch{error(503,'Chưa xác nhận dữ liệu vận hành');}}
 function who(v:unknown){if(typeof v!=='object'||v===null||!('admin'in v)||v.admin!==true||!('actor'in v)||typeof v.actor!=='string'||!v.actor||!('epoch'in v)||typeof v.epoch!=='string'||!v.epoch)error(404,'Không thể truy cập nội dung này');return {actor:v.actor,epoch:v.epoch};}
 const owner=who(await get('/session'));const raw=await get('/admin/operations');const after=who(await get('/session'));
 if(owner.actor!==after.actor||owner.epoch!==after.epoch)error(401,'Cần kiểm tra lại phiên quản trị');
 const operations=decodeOperations(raw,owner);if(!operations)error(503,'Chưa xác nhận dữ liệu vận hành');
 return {operations,owner};
}

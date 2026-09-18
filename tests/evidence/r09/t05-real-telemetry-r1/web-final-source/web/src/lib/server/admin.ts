import {error} from '@sveltejs/kit';
import {env} from '$env/dynamic/private';
import {decodeAdmin,type AdminSnapshot} from '$lib/admin';
export async function readAdmin(token:string|undefined,id?:string):Promise<AdminSnapshot[]> {
 if(!token)error(401,'Cần phiên quản trị hợp lệ');
 const base=env.WORKSHOP_BACKEND;if(!base||!/^http:\/\/(127\.0\.0\.1|localhost):[0-9]+$/.test(base))error(503,'Chưa cấu hình kết nối workshop');
 async function get(route:string):Promise<unknown>{
  let response:Response;try{response=await fetch(base+'/api/v1'+route,{headers:{cookie:'workshop_session='+encodeURIComponent(token??''),accept:'application/json'},signal:AbortSignal.timeout(5000),redirect:'error'});}catch{error(503,'Chưa tải được dữ liệu quản trị');}
  if(response.status===401)error(401,'Cần phiên quản trị hợp lệ');if(response.status===403||response.status===404)error(404,'Không thể truy cập nội dung này');if(!response.ok)error(503,'Chưa tải được dữ liệu quản trị');try{return await response.json();}catch{error(503,'Chưa xác nhận dữ liệu quản trị');}
 }
 const who=await get('/session');if(typeof who!=='object'||who===null||!('admin'in who)||who.admin!==true||!('epoch'in who)||typeof who.epoch!=='string')error(404,'Không thể truy cập nội dung này');
 const raw=await get('/admin/workshops'+(id?'/'+encodeURIComponent(id):''));const values=id?[raw]:raw;if(!Array.isArray(values))error(503,'Chưa xác nhận dữ liệu quản trị');
 return values.map(v=>{const w=decodeAdmin(v);if(!w||w.epoch!==who.epoch||id&&w.id!==id)error(503,'Chưa xác nhận dữ liệu quản trị');return w;});
}

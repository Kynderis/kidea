import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { decodeSnapshot } from '$lib/state';
export async function readPublic(id?:string) {
 const base=env.WORKSHOP_BACKEND;
 if(!base||!/^http:\/\/(127\.0\.0\.1|localhost):[0-9]+$/.test(base))error(503,'Chưa cấu hình kết nối workshop');
 let response:Response;
 try { response=await fetch(base+'/api/v1/workshops'+(id?'/'+encodeURIComponent(id):''),{signal:AbortSignal.timeout(5000),redirect:'error',headers:{accept:'application/json'}}); }
 catch {error(503,'Chưa tải được workshop');}
 if(response.status===404)error(404,'Không thể truy cập workshop này');
 if(!response.ok)error(503,'Chưa tải được workshop');
 let raw:unknown;try{raw=await response.json();}catch{error(503,'Chưa xác nhận dữ liệu workshop');}
 const values=id?[raw]:raw;if(!Array.isArray(values))error(503,'Chưa xác nhận dữ liệu workshop');
 const decoded=values.map(decodeSnapshot);if(decoded.some(v=>v===null))error(503,'Chưa xác nhận dữ liệu workshop');
 return decoded.filter(v=>v!==null);
}

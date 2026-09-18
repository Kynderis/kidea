import type {Intent} from './state';
const effects:Record<string,string>={REGISTERED:'APPLIED',ALREADY_REGISTERED:'NO_CHANGE',FULL:'REJECTED',PAUSED:'REJECTED',CANCELLED:'APPLIED',ALREADY_CANCELLED:'NO_CHANGE'};
export type FinalReply={state:'FINAL';code:string;registrationId:string|null};
export function decodeReply(raw:unknown,intent:Intent):FinalReply|null {
 if(typeof raw!=='object'||raw===null||Array.isArray(raw))return null;
 const v=raw as Record<string,unknown>;
 if(v.state!=='FINAL'||typeof v.code!=='string'||!Object.hasOwn(effects,v.code)||v.effect!==effects[v.code]||v.workshopId!==intent.workshopId)return null;
 const cancel=intent.registrationId!==null;
 if(cancel&&['REGISTERED','ALREADY_REGISTERED','FULL'].includes(v.code))return null;
 if(!cancel&&['CANCELLED','ALREADY_CANCELLED'].includes(v.code))return null;
 if(!['PAUSED','FULL'].includes(v.code)&&(typeof v.registrationId!=='string'||!v.registrationId))return null;
 if(cancel&&v.code!=='PAUSED'&&v.registrationId!==intent.registrationId)return null;
 return {state:'FINAL',code:v.code,registrationId:typeof v.registrationId==='string'?v.registrationId:null};
}
export const resultLabel:Record<string,string>={REGISTERED:'Lần đó đăng ký thành công.',ALREADY_REGISTERED:'Bạn đã có đăng ký tại thời điểm xử lý.',FULL:'Không còn chỗ tại thời điểm xử lý.',PAUSED:'Workshop tạm dừng tại thời điểm xử lý.',CANCELLED:'Lần đó hủy đăng ký thành công.',ALREADY_CANCELLED:'Đăng ký đó đã được hủy trước khi xử lý.'};

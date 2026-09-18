import {decodeSnapshot,type Snapshot} from './state.ts';
export type AdminSnapshot=Omit<Snapshot,'state'>&{state:'DRAFT'|'OPEN'|'PAUSED'};
export type Fields={title:string;description:string;capacity:number;schedule:{start:string;end:string}};
export type Draft={title:string;description:string;capacity:string;start:string;end:string};
export type Command={epoch:string;intentId:string;action:'CREATE'|'EDIT'|'STATE';workshopId?:string;fields?:Partial<Fields>;targetState?:'OPEN'|'PAUSED'};
export type AdminIntent={actor:string;epoch:string;command:Command;sent:boolean;state:'UNKNOWN'|'FINAL'};
const object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const text=(v:unknown):v is string=>typeof v==='string'&&v.length>0;
export function decodeAdmin(v:unknown):AdminSnapshot|null {
 if(!object(v)||!['DRAFT','OPEN','PAUSED'].includes(String(v.state)))return null;
 const parsed=decodeSnapshot({...v,state:v.state==='DRAFT'?'OPEN':v.state});
 return parsed?{...parsed,state:v.state as AdminSnapshot['state']}:null;
}
export function formOf(v:AdminSnapshot|null):Draft{return v?{title:v.title,description:v.description,capacity:String(v.capacity),start:v.schedule.start,end:v.schedule.end}:{title:'',description:'',capacity:'10',start:'',end:''};}
export function changedFields(base:AdminSnapshot|null,draft:Draft):Partial<Fields>{
 const fields:Partial<Fields>={};
 if(!base||draft.title!==base.title)fields.title=draft.title;
 if(!base||draft.description!==base.description)fields.description=draft.description;
 if(!base||draft.capacity!==String(base.capacity))fields.capacity=Number(draft.capacity);
 if(!base||draft.start!==base.schedule.start||draft.end!==base.schedule.end)fields.schedule={start:draft.start,end:draft.end};
 return fields;
}
export function fieldErrors(draft:Draft):Record<string,string>{
 const errors:Record<string,string>={};
 if(!draft.title.trim()||[...draft.title.trim()].length>120||/[\r\n\u0085\u2028\u2029]/u.test(draft.title))errors.title='Tên cần 1–120 ký tự, trên một dòng.';
 if(!draft.description.trim()||[...draft.description.trim()].length>5000)errors.description='Mô tả cần 1–5.000 ký tự văn bản thuần.';
 if(!/^\d+$/.test(draft.capacity)||!Number.isSafeInteger(Number(draft.capacity))||Number(draft.capacity)<1||Number(draft.capacity)>1000)errors.capacity='Sức chứa cần là số nguyên từ 1 đến 1.000.';
 for(const key of ['start','end'] as const)if(!/(Z|[+-]\d\d:\d\d)$/.test(draft[key])||!Number.isFinite(Date.parse(draft[key])))errors[key]='Nhập ngày giờ có múi giờ, ví dụ 2026-10-01T09:00:00+07:00.';
 if(!errors.start&&!errors.end&&Date.parse(draft.end)<=Date.parse(draft.start))errors.end='Kết thúc phải sau bắt đầu.';
 return errors;
}
export function confirmation(base:AdminSnapshot,patch:Partial<Fields>):string[]{
 const rows:string[]=[];
 if(patch.capacity!==undefined&&patch.capacity<base.capacity)rows.push(`Giảm sức chứa: ${base.capacity} → ${patch.capacity}; đang có ${base.active} đăng ký theo lần quan sát.`);
 if(patch.schedule&&base.active>0)rows.push(`Đổi lịch: ${base.schedule.start} — ${base.schedule.end} → ${patch.schedule.start} — ${patch.schedule.end}. Giữ các đăng ký hiện có; không gửi thông báo tự động.`);
 return rows;
}
export function sameObservation(a:AdminSnapshot,b:AdminSnapshot):boolean {
 const strip=({observedAt:_,...v}:AdminSnapshot)=>{void _;return JSON.stringify(v);};return strip(a)===strip(b);
}
export function decodeAdminIntent(raw:string,actor:string,epoch:string):AdminIntent|null{
 let v:unknown;try{v=JSON.parse(raw);}catch{return null;}
 if(!object(v)||v.actor!==actor||v.epoch!==epoch||!object(v.command)||v.command.epoch!==epoch||!text(v.command.intentId)||!['CREATE','EDIT','STATE'].includes(String(v.command.action))||typeof v.sent!=='boolean'||!['UNKNOWN','FINAL'].includes(String(v.state)))return null;
 const c=v.command;if(c.action!=='CREATE'&&!text(c.workshopId))return null;
 if(c.action==='STATE'&&!['OPEN','PAUSED'].includes(String(c.targetState)))return null;
 if(c.action!=='STATE'&&!object(c.fields))return null;
 // Recovered content is retained for lookup only; it is never replayed as POST.
 return {actor,epoch,command:c as Command,sent:v.sent,state:v.state as AdminIntent['state']};
}
export function prepareAdminSend(intent:AdminIntent,persist:(text:string)=>void):'POST'|'GET'{
 if(intent.sent)return 'GET';persist(JSON.stringify({...intent,sent:true}));intent.sent=true;return 'POST';
}
export type AdminResult={state:'FINAL';code:string;effect:'APPLIED'|'NO_CHANGE'|'REJECTED';workshopId?:string};
export function decodeAdminResult(raw:unknown,intent:AdminIntent):AdminResult|null {
 if(!object(raw)||raw.state!=='FINAL')return null;
 const codes:Record<string,string>={CREATED:'APPLIED',UPDATED:'APPLIED',UNCHANGED:'NO_CHANGE',INVALID_FIELDS:'REJECTED',BELOW_ACTIVE:'REJECTED',STATE_REJECTED:'REJECTED'};
 if(typeof raw.code!=='string'||codes[raw.code]!==raw.effect)return null;
 const action=intent.command.action;
 if(action==='CREATE'&&!['CREATED','INVALID_FIELDS'].includes(raw.code)||action==='EDIT'&&!['UPDATED','UNCHANGED','INVALID_FIELDS','BELOW_ACTIVE'].includes(raw.code)||action==='STATE'&&!['UPDATED','UNCHANGED','STATE_REJECTED'].includes(raw.code))return null;
 if(action!=='CREATE'&&raw.workshopId!==intent.command.workshopId||raw.code==='CREATED'&&!text(raw.workshopId))return null;
 return {state:'FINAL',code:raw.code,effect:raw.effect as AdminResult['effect'],...(typeof raw.workshopId==='string'?{workshopId:raw.workshopId}:{})};
}
export function adminResultText(result:AdminResult):string{return ({CREATED:'Lần đó đã tạo bản nháp.',UPDATED:'Lần đó đã lưu thay đổi.',UNCHANGED:'Lần đó không có thay đổi.',INVALID_FIELDS:'Lần đó bị từ chối: hãy kiểm tra tên, mô tả văn bản thuần, sức chứa và lịch.',BELOW_ACTIVE:'Lần đó bị từ chối: sức chứa thấp hơn số đăng ký đang hiệu lực.',STATE_REJECTED:'Lần đó bị từ chối: không thể chuyển trạng thái như yêu cầu.'} as Record<string,string>)[result.code];}

export function rebaseDraft(before:AdminSnapshot,latest:AdminSnapshot,draft:Draft):Draft{
 const changed=changedFields(before,draft),next=formOf(latest);
 if(changed.title!==undefined)next.title=draft.title;if(changed.description!==undefined)next.description=draft.description;if(changed.capacity!==undefined)next.capacity=draft.capacity;if(changed.schedule){next.start=draft.start;next.end=draft.end;}return next;
}

export function compareAdminObservation(before:AdminSnapshot,next:AdminSnapshot):'OLDER'|'SAME'|'NEWER'|'CONFLICT'{
 if(before.id!==next.id||before.epoch!==next.epoch)return 'CONFLICT';
 if(BigInt(next.version)<BigInt(before.version))return 'OLDER';
 if(BigInt(next.version)>BigInt(before.version))return 'NEWER';
 return sameObservation(before,next)?'SAME':'CONFLICT';
}

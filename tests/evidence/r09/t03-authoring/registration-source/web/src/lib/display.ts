// Preserve the original offset and each date; never silently turn a past date into closed.
export function scheduleLabel(iso:string):string {
 const match=/^(\d{4})-(\d\d)-(\d\d)T(\d\d:\d\d)(?::\d\d(?:\.\d+)?)?(Z|[+-]\d\d:\d\d)$/.exec(iso);
 if(!match)return iso;
 return `${match[3]}/${match[2]}/${match[1]} ${match[4]} UTC${match[5]==='Z'?'+00:00':match[5]}`;
}
export function observationLabel(seconds:number):string {
 const date=new Date(seconds*1000);return Number.isNaN(date.valueOf())?'Chưa xác nhận thời điểm':date.toISOString().replace('T',' ').replace('.000Z',' UTC');
}

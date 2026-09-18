export function describe(view) {
  if (!view.sources) return 'Không rõ — bộ quan sát không lưu được trạng thái. Các lỗi đã biết giữ trong bản quan sát bền vững gần nhất.';
  const f=view.sources.fast,s=view.sources.slow;
  const label=(source,text)=>text+(source.current?'':' — giá trị cuối, chưa xác nhận độ mới');
  const lines=[];
  if(f.last){const v=f.last;lines.push(label(f,'Nghĩa vụ còn chờ: '+v.M1.pending+'; cũ nhất: '+(v.M1.oldestAgeMs===null?'Không áp dụng':v.M1.oldestAgeMs+' ms')));
   lines.push(label(f,'Lỗi xử lý/đối chiếu còn mở: '+v.M2.open.reduce((n,e)=>n+e.count,0)));
   lines.push(label(f,'Độ trễ cập nhật: '+(v.M3.measured?v.M3.samplesMs.length+' mẫu, '+v.M3.uncoveredAgeMs.length+' chưa bao phủ':'Chưa đo')));
   lines.push(label(f,'Xử lý thành công cuối: '+(v.M4.lastSuccess?new Date(v.M4.lastSuccess.atMs).toISOString():'Chưa có')));
   lines.push(label(f,'Yêu cầu đọc/ghi đã lên lịch: '+(v.M7.measured?v.M7.read.scheduled+'/'+v.M7.write.scheduled:'Chưa đo')));
  }else lines.push('Chưa có quan sát hợp lệ về xử lý.');
  lines.push('Nguồn xử lý: '+(f.current?'Có mẫu hợp lệ':'Không rõ')+'; nguồn dung lượng/backup: '+(s.current?'Có mẫu hợp lệ':'Không rõ'));
  for(const target of ['application','dashboard'])lines.push((target==='application'?'Đường đọc ứng dụng':'Màn vận hành chính')+': '+(view.unknown.includes('M6:'+target)?'Không rõ':view.probes[target]?.ok?'Phản hồi hợp lệ':'Probe lỗi'));
  if(s.last){const v=s.last;lines.push(label(s,'Dữ liệu + log + backup + bản tạm: '+v.M8.targets.reduce((n,t)=>n+t.bytes,0)+' byte / 2 GiB'+(v.M8.complete?'':' — còn thiếu đích')));
   lines.push(label(s,'Mốc backup: '+(v.M9.verified?new Date(v.M9.recoveryPointMs).toISOString():'Chưa có bản verified')));
  }else lines.push('Chưa có quan sát hợp lệ về dung lượng và backup.');
  lines.push('Mở ghi: Chưa sẵn sàng — còn thiếu tích hợp điều kiện ở backend.');
  if(!view.eligibility.observationReady)lines.push('Đường quan sát chưa đáp ứng đủ điều kiện phiên thử.');
  const open=Object.entries(view.incidents).filter(([,i])=>i.recoveredAtMs===null);
  lines.push('Cảnh báo còn mở: '+open.length);
  for(const [key,i]of open)lines.push(key+' — '+(i.level==='CRITICAL'?'Nghiêm trọng':'Cảnh báo')+'; count='+i.count+'; lần đầu '+new Date(i.firstSeenMs).toISOString());
  lines.push('Lịch sử thông báo: '+view.notifications.length+'; chưa đo giao cảnh báo tại đầu nhận.');
  return lines.join('\n');
}
export const conclusionText = value => ({OUTSIDE_RUN:'Ngoài phiên thử — không có cam kết giám sát',CRITICAL:'Có lỗi nghiêm trọng đã biết',
 UNKNOWN:'Không rõ',WARNING:'Có cảnh báo',NORMAL_IN_OBSERVED_SCOPE:'Bình thường trong phạm vi đã đo'}[value]??'Không rõ');

// Source-only completion, never authenticated Human approval or execution rights.
// GROUP state is derived from its complete decomposition, not a stored DONE label.
export function isRecordedComplete(id,items,approvedReviewIds) {
  const byId=new Map(items.map(item=>[item.id,item]));
  function visit(key,seen) {
    const item=byId.get(key);
    if(!item||seen.has(key)||!item.gateIds.every(g=>approvedReviewIds.has(g)))return false;
    if(item.shape==='LEAF')return item.executionStatus==='DONE'&&item.resultRefs.length>0;
    if(item.shape!=='GROUP'||item.decomposition!=='COMPLETE')return false;
    const children=items.filter(i=>i.parentId===key);
    return children.length>0&&children.every(i=>visit(i.id,new Set([...seen,key])));
  }
  return visit(id,new Set());
}

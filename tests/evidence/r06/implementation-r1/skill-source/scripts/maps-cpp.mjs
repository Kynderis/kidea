import path from 'node:path';
import {mapResult} from './maps.mjs';

// Consumes a Clang JSON AST receipt from a trusted, bounded runner. Project
// compile commands are data to review, never commands for this helper to run.
export function clangMap(input,receipt) {
  const nodes=[],edges=[],diagnostics=[],byClangId=new Map(),seen=new Set();
  const configuration=receipt?.configuration??null;
  const issue=(code,detail)=>diagnostics.push({code,detail});
  if(!receipt||receipt.inputBasis!==input.basis||!receipt.tool?.components?.length||!Array.isArray(receipt.ast)||!Array.isArray(receipt.diagnostics)||!configuration?.target) {
    return mapResult(input,{name:'clang-json',version:null},configuration,[],[],[{code:'CLANG_RECEIPT_MISSING_OR_STALE'}]);
  }
  diagnostics.push(...receipt.diagnostics);
  if(receipt.exitCode!==0)issue('CLANG_FAILED',receipt.exitCode);
  const add=n=>{if(!seen.has(n.id)){seen.add(n.id);nodes.push(n);}};
  for(const [file,bytes]of input.contents) {
    add({id:file,path:file,kind:'file'});
    for(const match of bytes.toString('utf8').matchAll(/^\s*#\s*include\s*([<"])([^>"\n]+)[>"]/gm)) {
      const target=path.posix.normalize(path.posix.join(path.posix.dirname(file),match[2]));
      if(match[1]==='"'&&input.contents.has(target))edges.push({from:file,to:target,kind:'include-source-directive'});
      else issue('INCLUDE_OUTSIDE_LOCAL_SCOPE',file+':'+match[2]);
    }
    if(/^\s*#\s*(?:if|ifdef|ifndef|define)\b/m.test(bytes.toString('utf8')))issue('CONDITIONAL_SCOPE_TARGET_SPECIFIC',file);
  }
  const fileAt=(node,inherited)=>{
    const raw=node.loc?.expansionLoc?.file??node.loc?.file??node.range?.begin?.expansionLoc?.file??node.range?.begin?.file;
    if(!raw)return inherited;
    const file=path.isAbsolute(raw)?path.relative(input.root,raw).split(path.sep).join('/'):raw;
    return input.contents.has(file)?file:null;
  };
  function declarations(node,file,scope=[]) {
    if(!node||typeof node!=='object')return;
    file=fileAt(node,file);
    const namedScope=['NamespaceDecl','CXXRecordDecl','RecordDecl'].includes(node.kind)&&node.name;
    const qualified=[...scope,node.name].filter(Boolean).join('::');
    if(file&&node.name&&['FunctionDecl','CXXMethodDecl','CXXConstructorDecl','CXXDestructorDecl','VarDecl','FieldDecl','CXXRecordDecl','EnumDecl'].includes(node.kind)) {
      const signature=node.type?.qualType??node.kind,id=file+'#'+qualified+' '+signature;
      byClangId.set(node.id,id);add({id,path:file,name:qualified,signature,kind:'symbol',offset:node.loc?.offset??null});
      if(node.virtual)issue('VIRTUAL_DISPATCH_REQUIRES_REVIEW',id);
    }
    for(const child of node.inner??[])declarations(child,file,namedScope?[...scope,node.name]:scope);
  }
  for(const ast of receipt.ast)declarations(ast,configuration.translationUnit);
  const declRef=node=>node?.referencedDecl?.id??node?.referencedMemberDecl??null;
  function callee(node) {
    if(!node)return null;
    if(declRef(node))return declRef(node);
    if(['ImplicitCastExpr','ParenExpr','MemberExpr'].includes(node.kind))return callee(node.inner?.[0]);
    return null;
  }
  function calls(node,file,owner=null) {
    if(!node||typeof node!=='object')return;
    file=fileAt(node,file);if(byClangId.has(node.id))owner=byClangId.get(node.id);
    if(file&&['CallExpr','CXXMemberCallExpr','CXXOperatorCallExpr'].includes(node.kind)) {
      const candidate=byClangId.get(callee(node.inner?.[0]));
      const target=candidate&&nodes.find(n=>n.id===candidate)?.signature?.includes('(*)')?null:candidate;
      if(target&&owner)edges.push({from:owner,to:target,kind:'resolved-declaration-call',offset:node.range?.begin?.offset??null});
      else issue('INDIRECT_OR_EXTERNAL_CALL_UNRESOLVED',owner??file);
    }
    for(const child of node.inner??[])calls(child,file,owner);
  }
  for(const ast of receipt.ast)calls(ast,configuration.translationUnit);
  return mapResult(input,{name:'clang-json',version:receipt.tool.version,tool:receipt.tool},configuration,nodes,edges,diagnostics,
    ['One translation unit and compile target; include directives are not proof of active preprocessing.',
     'Resolved declaration calls do not prove virtual/callback runtime dispatch; external headers remain outside this local graph.']);
}

// Clang's filtered dump can contain several adjacent JSON values.
export function parseClangJson(text) {
  const values=[];let start=-1,depth=0,string=false,escaped=false;
  for(let i=0;i<text.length;i++) {
    const c=text[i];
    if(start===-1){if(/\s/.test(c))continue;if(c!=='{')throw new Error('INVALID_CLANG_JSON');start=i;depth=1;continue;}
    if(string){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')string=false;continue;}
    if(c==='"')string=true;else if(c==='{')depth++;else if(c==='}'&&--depth===0){values.push(JSON.parse(text.slice(start,i+1)));start=-1;}
  }
  if(start!==-1||!values.length)throw new Error('INCOMPLETE_CLANG_JSON');return values;
}

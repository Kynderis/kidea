import path from 'node:path';
import {mapResult} from './maps.mjs';

// ts and svelte are trusted, preloaded parser capabilities supplied by the
// caller. Never import a parser, plugin or config selected by project content.
export function webMap(input,{ts,svelte,tool,tsconfig=null}) {
  const nodes=[],edges=[],diagnostics=[],seen=new Set();
  const add=n=>{if(!seen.has(n.id)){seen.add(n.id);nodes.push(n);}};
  const issue=(code,file,detail)=>diagnostics.push({code,file,detail});
  if(!ts?.createSourceFile||!svelte?.parse||!tool?.components?.length)return mapResult(input,{name:'web',version:null},{tsconfig},[],[],[{code:'PARSER_UNAVAILABLE'}]);
  let config={};
  if(tsconfig) {
    const text=input.contents.get(tsconfig)?.toString('utf8');
    if(text===undefined)issue('TSCONFIG_MISSING',tsconfig);
    else {
      const parsed=ts.parseConfigFileTextToJson(tsconfig,text);
      if(parsed.error)issue('TSCONFIG_PARSE_ERROR',tsconfig);
      else {config=parsed.config??{};if(config.extends)issue('TSCONFIG_EXTENDS_UNRESOLVED',tsconfig,config.extends);}
    }
  }
  const resolve=(file,specifier)=>{
    const candidates=[];
    if(specifier.startsWith('.'))candidates.push(path.posix.normalize(path.posix.join(path.posix.dirname(file),specifier)));
    else {
      const base=path.posix.join(tsconfig?path.posix.dirname(tsconfig):'.',config.compilerOptions?.baseUrl??'.');
      for(const [alias,targets]of Object.entries(config.compilerOptions?.paths??{})) {
        const [prefix,suffix='']=alias.split('*');
        if((!alias.includes('*')&&specifier===alias)||(alias.includes('*')&&specifier.startsWith(prefix)&&specifier.endsWith(suffix))) {
          const value=alias.includes('*')?specifier.slice(prefix.length,suffix.length?-suffix.length:undefined):'';
          if(Array.isArray(targets))for(const t of targets)if(typeof t==='string')candidates.push(path.posix.normalize(path.posix.join(base,t.replace('*',value))));
        }
      }
    }
    const matches=new Set();
    for(const candidate of candidates)for(const p of [candidate,...['.ts','.tsx','.js','.svelte','/index.ts','/index.js'].map(s=>candidate+s),candidate.replace(/\.js$/,'.ts')])if(input.contents.has(p))matches.add(p);
    if(matches.size!==1){issue(matches.size?'MODULE_AMBIGUOUS':'MODULE_UNRESOLVED',file,specifier);return null;}
    return [...matches][0];
  };
  const script=(file,source,suffix='')=>{
    const ast=ts.createSourceFile(file+suffix,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    for(const d of ast.parseDiagnostics)issue('TYPESCRIPT_PARSE_ERROR',file,ts.flattenDiagnosticMessageText(d.messageText,' '));
    const declarations=new Map();
    function declare(node) {
      if((ts.isFunctionDeclaration(node)||ts.isClassDeclaration(node)||ts.isInterfaceDeclaration(node)||ts.isTypeAliasDeclaration(node)||ts.isVariableDeclaration(node))&&node.name&&ts.isIdentifier(node.name)) {
        const name=node.name.text,id=file+'#'+name;
        if(declarations.has(name))issue('SYMBOL_REQUIRES_SCOPE_OR_OVERLOAD_REVIEW',file,name);
        declarations.set(name,id);add({id,path:file,name,kind:'symbol',offset:node.pos});
      }
      ts.forEachChild(node,declare);
    }
    declare(ast);
    function visit(node,owner=file) {
      if(ts.isFunctionDeclaration(node)&&node.name)owner=declarations.get(node.name.text)??file;
      if(ts.isImportDeclaration(node)||ts.isExportDeclaration(node)) {
        const spec=node.moduleSpecifier;
        if(spec&&ts.isStringLiteral(spec)) {
          const destination=resolve(file,spec.text);
          if(destination)edges.push({from:file,to:destination,kind:ts.isImportDeclaration(node)?'import':'export',specifier:spec.text});
        }
      }
      if(ts.isCallExpression(node)) {
        if(node.expression.kind===ts.SyntaxKind.ImportKeyword)issue('DYNAMIC_IMPORT_REQUIRES_REVIEW',file,node.getText(ast));
        else if(ts.isIdentifier(node.expression)&&declarations.has(node.expression.text))edges.push({from:owner,to:declarations.get(node.expression.text),kind:'lexical-call-candidate',offset:node.pos});
        else issue('CALL_TARGET_UNRESOLVED',file,node.expression.getText(ast));
      }
      if(ts.isStringLiteral(node)&&/^(?:https?:\/\/|\/api\/)/.test(node.text))issue('URL_RELATION_REQUIRES_REVIEW',file,node.text);
      ts.forEachChild(node,child=>visit(child,owner));
    }
    visit(ast);
  };
  for(const [file,bytes]of input.contents) {
    add({id:file,path:file,kind:/\/(?:\+page|\+server|\+layout)[.]/.test('/'+file)?'route':/(?:config|package\.json|lock)/.test(file)?'configuration':'file'});
    if(/(?:^|\/)(?:svelte|vite)\.config\.[cm]?js$/.test(file)){issue('EXECUTABLE_CONFIG_NOT_EXECUTED',file);continue;}
    if(file.endsWith('.svelte')) {
      const source=bytes.toString('utf8');
      try {
        const ast=svelte.parse(source,{modern:true});
        for(const block of [ast.instance,ast.module].filter(Boolean))script(file,source.slice(block.content.start,block.content.end),'.ts');
        const visited=new WeakSet();
        function walk(node) {
          if(!node||typeof node!=='object'||visited.has(node))return;visited.add(node);
          if(node.type==='ExpressionTag'||node.type==='EventHandler'||node.type==='OnDirective'||node.type==='BindDirective'||node.type==='Component') {
            const id=file+'#markup@'+node.start;add({id,path:file,kind:'markup',offset:node.start});
            edges.push({from:file,to:id,kind:'markup-expression'});
            issue('SVELTE_REACTIVE_OR_EVENT_RELATION_REQUIRES_REVIEW',file,source.slice(node.start,node.end));
          }
          for(const value of Object.values(node))if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')walk(value);
        }
        walk(ast.fragment);
      }catch(error){issue('SVELTE_PARSE_ERROR',file,error.message);}
    } else if(/\.[cm]?[jt]sx?$/.test(file))script(file,bytes.toString('utf8'));
  }
  return mapResult(input,{name:'typescript-svelte',version:ts.version,versions:{typescript:ts.version,svelte:svelte.VERSION??null},tool},{tsconfig,options:config.compilerOptions??{}},nodes,edges,diagnostics,
    ['Static local module resolution only; package exports/generated files outside the read scope remain unresolved.',
     'Lexical call candidates are not type-resolved dispatch. Markup/reactivity and indirect consumers require review.']);
}

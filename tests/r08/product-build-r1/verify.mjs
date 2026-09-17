import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
export const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export function verify(root,files,{packageManifest=false}={}){
 const found=[];function walk(dir,prefix=''){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isSymbolicLink())throw Error('SYMLINK');if(entry.isDirectory())walk(path.join(dir,entry.name),name+'/');else if(!(packageManifest&&name==='manifest.json'))found.push(name);}}walk(root);
 if(JSON.stringify(found.sort())!==JSON.stringify(Object.keys(files).sort()))throw Error('FILE_SET');
 for(const [name,value] of Object.entries(files)){const p=path.join(root,name);if(path.isAbsolute(name)||name.split('/').includes('..')||fs.lstatSync(p).isSymbolicLink()||hash(p)!==(value.sha256??value))throw Error(`INPUT_CHANGED:${name}`);}}
export function authorize(args,manifestHash){if(args.length!==4||args[0]!=='--approved-manifest'||args[1]!==manifestHash||args[2]!=='--approved-exception'||args[3]!=='R08-TIDY-01')throw Error('EXACT_EXECUTION_AND_EXCEPTION_APPROVAL_REQUIRED');}

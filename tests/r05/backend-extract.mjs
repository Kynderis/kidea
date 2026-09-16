import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const sample=path.resolve(import.meta.dirname,'../../../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const manifest=JSON.parse(fs.readFileSync(path.join(sample,'manifest.json')));
for(const source of manifest.sourceArchives){
 const archive=path.join(sample,'downloads',source.name==='sqlite'?'sqlite-bounded.zip':source.name+'.tar.gz');
 const list=spawnSync('/usr/bin/tar',['-tf',archive],{encoding:'utf8'});
 if(list.status!==0)throw Error(list.stderr);
 for(const name of list.stdout.trim().split('\n'))if(name.startsWith('/')||name.split('/').includes('..'))throw Error('Unsafe archive path');
 const verbose=spawnSync('/usr/bin/tar',['-tvf',archive],{encoding:'utf8'});
 if(verbose.status!==0||verbose.stdout.trim().split('\n').some(line=>!['-','d'].includes(line[0])))throw Error('Archive contains nonregular entry');
 const target=path.join(sample,'vendor',source.name);
 fs.mkdirSync(target);
 const extract=spawnSync('/usr/bin/tar',['-xf',archive,'--strip-components','1','-C',target],{encoding:'utf8'});
 if(extract.status!==0)throw Error(extract.stderr);
}
console.log('Validated and extracted four locked source archives');

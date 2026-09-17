import assert from 'node:assert/strict';
export function deployment({target,component,name,network,image,mounts,command,env=[]}) {
 assert.ok(['lab-dev','lab-prod'].includes(target),'LAB_TARGET_ONLY');
 assert.ok(['backend','web','caddy','check'].includes(component),'COMPONENT');
 assert.match(name,/^kidea-r08-b2-[a-z0-9-]+$/);
 assert.match(network,/^(container:)?kidea-r08-b2-[a-z0-9-]+$/);
 assert.match(image,/^sha256:[a-f0-9]{64}$/);
 const resources={backend:['0.5','768m'],web:['0.5','768m'],caddy:['0.25','512m'],check:['0.75','2g']}[component];
 const args=['run','--detach','--name',name,'--pull=never','--platform=linux/amd64',
  '--label','kidea.r08.owner=b2-r1','--label',`kidea.r08.target=${target}`,
  '--network',network,'--cpus',resources[0],'--memory',resources[1],'--memory-swap',resources[1],
  '--pids-limit=256','--read-only','--cap-drop=ALL','--security-opt=no-new-privileges',
  '--user=1000:1000','--tmpfs=/tmp:rw,nosuid,size=256m','--shm-size=256m',
  '--log-opt=max-size=8m','--log-opt=max-file=2'];
 if(component!=='check')args.push('--network-alias',component);
 for(const [src,dst,readonly=true] of mounts)args.push('--mount',`type=bind,src=${src},dst=${dst}${readonly?',readonly':''}`);
 for(const e of env)args.push('--env',e);
 return [...args,'--entrypoint=/usr/bin/timeout',image,'--signal=TERM','--kill-after=10',component==='check'?'180':'3300',...command];
}
export function compatible(actual,expected) {
 assert.equal(actual.schemaHex,expected.schemaHex,'SCHEMA_MISMATCH');
 assert.equal(actual.integrity,'ok','DATABASE_INTEGRITY');
 assert.equal(actual.version,expected.version,'SCHEMA_VERSION');
}

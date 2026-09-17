// Child deployment operation: same logic for both LAB targets. Never a product executor.
export function containerArgs({name,run,target,web,fault,image,source,data}) {
  if(!/^kidea-r08-[a-z0-9-]+$/.test(name)||!['lab-dev','lab-prod'].includes(target)||!['web-a','web-b'].includes(web)||!['none','web-fail'].includes(fault))throw Error('DEPLOY_INPUT');
  return ['run','--detach','--pull=never','--platform=linux/amd64','--name',name,'--label',`kidea.r08.run=${run}`,'--network=none','--cpus=1','--memory=512m','--memory-swap=512m','--pids-limit=64','--read-only','--cap-drop=ALL','--security-opt=no-new-privileges','--user=1000:1000','--tmpfs=/tmp:rw,noexec,nosuid,size=16m','--log-driver=json-file','--log-opt=max-size=1m','--log-opt=max-file=2','--mount',`type=bind,src=${source},dst=/src,readonly`,'--mount',`type=bind,src=${data},dst=/data`,'--env',`LAB_TARGET=${target}`,'--env',`LAB_WEB=${web}`,'--env',`LAB_FAULT=${fault}`,'--entrypoint=node',image,'/src/entry.mjs'];
}

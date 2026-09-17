// Small host boundary. Source records never select tools or establish permission.
import { readdirSync } from 'node:fs';

const fail=code=>{throw Object.assign(new Error(code),{code});};

export function runtimeInfo(version=process.versions.node,lts=process.release.lts) {
  const match=/^(\d+)\.(\d+)\.(\d+)(?:-[\w.-]+)?$/.exec(version??'');
  const supported=!!match&&Number(match[1])>=24;
  return {version,minimumMajor:24,compatibleVersion:supported,lts:typeof lts==='string'?lts:null,
    recommendation:'Use a maintained LTS release. Compatibility is not evidence that this host/version was tested.'};
}
export function assertRuntime() {
  if(!runtimeInfo().compatibleVersion)fail('UNSUPPORTED_RUNTIME');
}

export function hasLocalAssumptions(assumptions,platform=process.platform) {
  // Legacy requests remain usable on their original Windows scope only. An
  // explicit false new value must never be overridden by the legacy field.
  const local=Object.hasOwn(assumptions??{},'localFilesystem')
    ? assumptions.localFilesystem===true
    : platform==='win32'&&assumptions?.localNtfs===true;
  return local&&assumptions?.noActiveSync===true&&assumptions?.singleKideaRun===true;
}
export function assertLocalRoot(root) {
  // Reject explicit remote/device namespaces before any filesystem access.
  // Mapped mounts and sync clients still require the caller's environment check;
  // neither a path name nor a stored permission record proves local storage.
  if(typeof root!=='string'||/^(?:\\\\|\/\/|[a-z][a-z0-9+.-]*:\/\/)/i.test(root))fail('LOCAL_DIRECTORY_REQUIRED');
}

export const portablePathKey=value=>value.normalize('NFC').toLowerCase();
export function checkedEntryName(parent,name,entries=readdirSync(parent)) {
  const matches=entries.filter(entry=>portablePathKey(entry)===portablePathKey(name));
  if(matches.length>1||matches.length===1&&matches[0].normalize('NFC')!==name.normalize('NFC'))fail('AMBIGUOUS_PATH_ALIAS');
  // Preserve disk spelling, including decomposed Unicode names on macOS.
  return matches[0]??name;
}

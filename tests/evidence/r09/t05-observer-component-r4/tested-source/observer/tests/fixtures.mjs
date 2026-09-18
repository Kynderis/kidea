export const originMs = 1800000000000;
export const time = t => ({ wallMs: originMs + t, monoMs: t });
export const config = () => ({ run: { id: 'component', operator: 'FixtureOperator', confirmed: true,
  startMs: originMs, endMs: originMs + 3600000 }, sources: Object.fromEntries(['fast','slow'].map(g =>
  [g,{ id:g,clock:{offsetMs:0,uncertaintyMs:0,measuredAtMs:originMs,validForMs:3600000}}])),
  storageTargets:['data','logs','backup','temp'],topology:{independentHostVerified:false,receiverVerified:false} });
export function sample(group, seq, t=0, changes={}) {
  const fast = { M1:{pending:0,oldestAgeMs:null}, M2:{open:[],resolved:[]},
    M3:{measured:true,basis:'SINGLE_OBSERVER',windowMs:60000,samplesMs:[],uncoveredAgeMs:[]},
    M4:{lastSuccess:null}, M7:{measured:true,basis:'SINGLE_OBSERVER',windowMs:60000,
      read:{scheduled:0,samplesMs:[],technicalErrors:0,missedOffers:0},
      write:{scheduled:0,samplesMs:[],technicalErrors:0,missedOffers:0}} };
  const slow = { M8:{complete:true,targets:config().storageTargets.map(name=>({name,bytes:0,freeBytes:10000000,headroomBytes:1000000}))},
    M9:{verified:true,independent:true,destination:'backup',recoveryPointMs:originMs+t,sha256:'a'.repeat(64),durable:true,integrity:true} };
  return {schema:1,source:group,boot:'boot1',sequence:seq,nonce:'nonce'+seq,sampledAtMs:originMs+t,
    signals:{...(group==='fast'?fast:slow),...changes}};
}
export function ingest(o,g,seq,t=0,changes={}) {const s=sample(g,seq,t,changes);return o.ingest(g,s,s.nonce,time(t));}
export function ready(o,t=0) {ingest(o,'fast',1,t);ingest(o,'slow',1,t);o.probe('application',true,time(t));o.probe('dashboard',true,time(t));}

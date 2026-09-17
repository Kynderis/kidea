import http from 'node:http';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { migrate } from './migration.mjs';
const hash = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const db = new DatabaseSync('/data/state.sqlite');
db.exec('CREATE TABLE IF NOT EXISTS metadata(schema_version INTEGER); INSERT INTO metadata SELECT 1 WHERE NOT EXISTS(SELECT 1 FROM metadata); CREATE TABLE IF NOT EXISTS records(id INTEGER PRIMARY KEY, value TEXT, role TEXT); INSERT OR IGNORE INTO records VALUES(1,\'fixture-original\',\'admin\'); CREATE TABLE IF NOT EXISTS migrations(id TEXT PRIMARY KEY);');
const config = JSON.parse(fs.readFileSync(`/src/${process.env.LAB_TARGET}.json`));
const state = () => ({ schema: db.prepare('SELECT schema_version FROM metadata').get().schema_version, rows: db.prepare('SELECT * FROM records ORDER BY id').all(), migrations: db.prepare('SELECT id FROM migrations ORDER BY id').all() });
http.createServer(async (req,res) => {
  const send = (code, value) => { res.writeHead(code, {'content-type':'application/json'}); res.end(JSON.stringify(value)); };
  try {
    if(req.method==='GET' && req.url==='/state') return send(200,{...state(),artifact:hash('/src/backend.mjs'),config:hash(`/src/${process.env.LAB_TARGET}.json`),target:config.target,at:new Date().toISOString()});
    if(req.method==='GET' && req.url==='/admin') return send(200,{allowed:state().rows[0]?.role==='admin',value:state().rows[0]?.value});
    if(req.method!=='POST' || req.headers['x-lab-token']!==config.syntheticToken) return send(403,{error:'LAB_AUTHORITY_REQUIRED'});
    if(req.url==='/backup') { if(fs.existsSync('/data/backup.json'))return send(409,{error:'BACKUP_EXISTS'});fs.writeFileSync('/data/backup.json',JSON.stringify(state()),{flag:'wx'});return send(200,{backup:hash('/data/backup.json')}); }
    if(req.url==='/migrate-drop') { migrate(db);req.socket.destroy();return; }
    if(req.url==='/restore') {
      const saved=JSON.parse(fs.readFileSync('/data/backup.json'));
      db.exec('BEGIN IMMEDIATE');
      try { db.prepare('UPDATE metadata SET schema_version=?').run(saved.schema);db.exec('DELETE FROM records; DELETE FROM migrations');for(const r of saved.rows)db.prepare('INSERT INTO records VALUES(?,?,?)').run(r.id,r.value,r.role);for(const m of saved.migrations)db.prepare('INSERT INTO migrations VALUES(?)').run(m.id);db.exec('COMMIT'); }catch(e){db.exec('ROLLBACK');throw e;}
      return send(200,state());
    }
    return send(404,{error:'NO_ROUTE'});
  } catch(e) { send(500,{error:e.message}); }
}).listen(8011,'127.0.0.1');

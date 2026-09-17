// One durable migration; replay is an error rather than silently counted twice.
export function migrate(db) {
  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare('INSERT INTO migrations VALUES(?)').run('fixture-schema-2');
    db.exec("UPDATE metadata SET schema_version=2; UPDATE records SET value='fixture-migrated',role='reader' WHERE id=1; COMMIT");
  } catch(e) { db.exec('ROLLBACK'); throw e; }
}

// changed

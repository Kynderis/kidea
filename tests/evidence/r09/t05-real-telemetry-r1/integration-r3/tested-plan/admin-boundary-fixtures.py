"""Owned fake integration DB only; never use against a project database."""
import sqlite3

db = sqlite3.connect('/out/workshop.sqlite', timeout=1)
db.execute("""CREATE TRIGGER boundary_publication_audit_abort
BEFORE INSERT ON admin_audit
WHEN NEW.action='STATE' AND NEW.workshop IN
 (SELECT id FROM workshops WHERE title='FAKE-BOUNDARY-SAVED-EDIT')
BEGIN SELECT RAISE(ABORT,'FAKE boundary publication audit failure'); END""")
db.commit()
db.close()

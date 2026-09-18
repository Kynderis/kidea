#include <sqlite3.h>
#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv) {
  if (argc != 2) return 2;
  FILE *f = fopen(argv[1], "rb");
  if (!f) return 2;
  char schema[65536];
  size_t n = fread(schema, 1, sizeof(schema)-1, f);
  if (ferror(f) || !feof(f)) { fclose(f); return 2; }
  fclose(f); schema[n] = 0;
  sqlite3 *db = NULL;
  if (sqlite3_open(":memory:", &db) != SQLITE_OK) return 2;
  if (sqlite3_exec(db, schema, NULL, NULL, NULL) != SQLITE_OK) return 3;
  sqlite3_stmt *q = NULL;
  const char *sql = "EXPLAIN QUERY PLAN SELECT count(*) FROM registrations WHERE actor=? AND state='ACTIVE'";
  if (sqlite3_prepare_v2(db, sql, -1, &q, NULL) != SQLITE_OK) return 4;
  printf("SQLite %s\n", sqlite3_libversion());
  int code, rows = 0;
  while ((code = sqlite3_step(q)) == SQLITE_ROW) {
    printf("%s\n", sqlite3_column_text(q, 3)); rows++;
  }
  sqlite3_finalize(q); sqlite3_close(db);
  return code == SQLITE_DONE && rows > 0 ? 0 : 5;
}

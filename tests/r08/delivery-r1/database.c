// Lab-only SQLite backup/restore helper, linked to B1's SQLite 3.53.4 library.
#include <sqlite3.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
static void die(sqlite3 *db) { fprintf(stderr,"SQLite operation failed: %s\n",sqlite3_errmsg(db)); exit(1); }
static sqlite3 *open_db(const char *p,int flags) {sqlite3 *db=NULL;if(sqlite3_open_v2(p,&db,flags,NULL)!=SQLITE_OK)die(db);sqlite3_busy_timeout(db,1000);return db;}
static void scalar(sqlite3 *db,const char *sql) {sqlite3_stmt *s=NULL;if(sqlite3_prepare_v2(db,sql,-1,&s,NULL)!=SQLITE_OK)die(db);if(sqlite3_step(s)!=SQLITE_ROW)die(db);const unsigned char *v=sqlite3_column_text(s,0);printf("%s",v?(const char*)v:"");sqlite3_finalize(s);}
int main(int argc,char **argv) {
 if(argc<3)return 2;
 if(strcmp(argv[1],"inspect")==0&&argc==3){
  sqlite3 *db=open_db(argv[2],SQLITE_OPEN_READONLY);
  printf("{\"sqlite\":\"%s\",\"integrity\":\"",sqlite3_libversion());scalar(db,"PRAGMA integrity_check");
  printf("\",\"schemaHex\":\"");scalar(db,"SELECT hex(group_concat(sql,';')) FROM (SELECT sql FROM sqlite_schema WHERE type='table' ORDER BY name)");
  printf("\",\"version\":");scalar(db,"PRAGMA user_version");
  printf(",\"domain\":");scalar(db,"SELECT count(*) FROM domain");
  printf(",\"result\":");scalar(db,"SELECT count(*) FROM results");
  printf(",\"audit\":");scalar(db,"SELECT count(*) FROM audit");
  printf(",\"outbox\":");scalar(db,"SELECT count(*) FROM outbox");printf("}\n");sqlite3_close(db);return 0;
 }
 if(strcmp(argv[1],"incompatible")==0&&argc==3){sqlite3 *db=open_db(argv[2],SQLITE_OPEN_READWRITE);if(sqlite3_exec(db,"BEGIN IMMEDIATE; ALTER TABLE domain ADD COLUMN incompatible TEXT; PRAGMA user_version=1; COMMIT;",NULL,NULL,NULL)!=SQLITE_OK)die(db);sqlite3_close(db);return 0;}
 if(strcmp(argv[1],"backup")!=0||argc!=4)return 2;
 int fd=open(argv[3],O_CREAT|O_EXCL|O_WRONLY,0600);if(fd<0){perror("CREATE_ONLY_BACKUP");return 1;}close(fd);
 sqlite3 *src=open_db(argv[2],SQLITE_OPEN_READONLY),*dst=open_db(argv[3],SQLITE_OPEN_READWRITE);
 sqlite3_backup *b=sqlite3_backup_init(dst,"main",src,"main");if(!b)die(dst);
 int code=SQLITE_OK;for(int i=0;i<1000;i++){code=sqlite3_backup_step(b,16);if(code==SQLITE_DONE)break;if(code!=SQLITE_OK&&code!=SQLITE_BUSY&&code!=SQLITE_LOCKED)break;sqlite3_sleep(10);}
 int finish=sqlite3_backup_finish(b);if(code!=SQLITE_DONE||finish!=SQLITE_OK)die(dst);
 sqlite3_close(src);sqlite3_close(dst);return 0;
}

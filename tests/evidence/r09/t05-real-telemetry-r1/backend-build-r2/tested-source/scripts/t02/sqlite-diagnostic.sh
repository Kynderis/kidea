#!/bin/sh
set -eu
[ "$(id -u)" = 1000 ]
[ ! -e /build/sqlite.o ]
{
  id
  uname -a
  gcc-13 --version
  g++-13 --version
  timeout --version
} > /out/toolchain.txt 2>&1
cp /opt/package-inventory.tsv /out/package-inventory.tsv
# Exactly the existing GCC/SQLite sanitizer instrumentation; no suppression.
gcc-13 -g -O0 -fsanitize=thread -fno-omit-frame-pointer -fPIC -DSQLITE_THREADSAFE=1 -DSQLITE_DQS=0 -DSQLITE_DEFAULT_FOREIGN_KEYS=1 -c /vendor/sqlite/sqlite3.c -o /build/sqlite.o > /out/compile-sqlite.stdout.txt 2> /out/compile-sqlite.stderr.txt
g++-13 -std=c++20 -g -O0 -fsanitize=thread -fno-omit-frame-pointer -Wall -Wextra -Wpedantic -Werror -I/vendor/sqlite /src/tests/t02/sqlite-diagnostic.cpp /build/sqlite.o -pthread -ldl -o /build/sqlite-diagnostic > /out/compile-probe.stdout.txt 2> /out/compile-probe.stderr.txt
export TSAN_OPTIONS=halt_on_error=0:exitcode=66:report_bugs=1
printf '%s\n' "TSAN_OPTIONS=$TSAN_OPTIONS" >> /out/toolchain.txt
# All four observations are collected, including the deliberately failing control.
# These are diagnostic observations, not substitutes for the 46 application tests.
for mode in detector-control wal-parallel delete-parallel wal-serial; do
  mkdir "/out/$mode"
  if timeout --kill-after=5s 90s /build/sqlite-diagnostic "$mode" "/out/$mode/db.sqlite" > "/out/$mode/stdout.txt" 2> "/out/$mode/stderr.txt"; then code=0; else code=$?; fi
  printf '%s\n' "$code" > "/out/$mode/exit-code.txt"
done
sha256sum /build/sqlite.o /build/sqlite-diagnostic > /out/artifacts.sha256

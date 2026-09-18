#!/bin/sh
set -eu
# Container-only entry, gated by run.mjs exact manifest/approval.
case "${1:-}" in dev|asan-ubsan|tsan|release) preset="$1";; *) exit 2;; esac
[ "$(id -u)" = 1000 ]
[ ! -e "/build/$preset" ]
cd /src/backend
mkdir -p "/out/$preset/cases"
export WORKSHOP_CASE_ROOT="/out/$preset/cases"
case "$preset" in
asan-ubsan) export ASAN_OPTIONS=detect_leaks=1:halt_on_error=1:detect_stack_use_after_return=1; export UBSAN_OPTIONS=halt_on_error=1:print_stacktrace=1;;
tsan) export TSAN_OPTIONS=halt_on_error=0:exitcode=66:report_bugs=1; export WORKSHOP_CAPTURE_ROOT=/out/tsan/raw-cases; mkdir "$WORKSHOP_CAPTURE_ROOT";;
esac
{
  id
  uname -a
  gcc-13 --version
  g++-13 --version
  cmake --version
  ninja --version
  node --version
  clang-format-18 --version
  clang-tidy-18 --version
} > "/out/$preset/toolchain.txt" 2>&1
if [ "$preset" = tsan ]; then
  printf '%s\n' "TSAN_OPTIONS=$TSAN_OPTIONS" >> /out/tsan/toolchain.txt
  node /src/scripts/t02/tsan-context.mjs
fi
cp /opt/package-inventory.tsv "/out/$preset/package-inventory.tsv"
if [ "$preset" = dev ]; then
  clang-format-18 --dry-run --Werror /src/backend/src/*.cpp /src/backend/include/workshop/*.hpp /src/backend/tests/tests.cpp > /out/dev/format.stdout.txt 2> /out/dev/format.stderr.txt
fi
cmake --preset "$preset" > "/out/$preset/configure.stdout.txt" 2> "/out/$preset/configure.stderr.txt"
cmake --build --preset "$preset" > "/out/$preset/build.stdout.txt" 2> "/out/$preset/build.stderr.txt"
if [ "$preset" = tsan ]; then
  node /src/scripts/t02/tsan-controls.mjs
  node /src/scripts/t02/tsan-gate.mjs controls /out/tsan
  if ctest --preset "$preset" --output-on-failure --output-junit "/out/$preset/ctest.xml" > "/out/$preset/ctest.stdout.txt" 2> "/out/$preset/ctest.stderr.txt"; then code=0; else code=$?; fi
  printf '%s\n' "$code" > /out/tsan/ctest.exit.txt
  node /src/scripts/t02/tsan-gate.mjs cases /out/tsan > /out/tsan/collect.stdout.txt 2> /out/tsan/collect.stderr.txt
else
  ctest --preset "$preset" --output-on-failure --output-junit "/out/$preset/ctest.xml" > "/out/$preset/ctest.stdout.txt" 2> "/out/$preset/ctest.stderr.txt"
  node /src/scripts/t02/collect.mjs "$preset" > "/out/$preset/collect.stdout.txt" 2> "/out/$preset/collect.stderr.txt"
fi
if [ "$preset" = dev ]; then
  for file in model store executor main; do
    clang-tidy-18 "/src/backend/src/$file.cpp" -p /build/dev --config-file=/src/docs/t02/clang-tidy.yml > "/out/dev/tidy-$file.stdout.txt" 2> "/out/dev/tidy-$file.stderr.txt"
  done
  clang-tidy-18 /src/backend/tests/tests.cpp -p /build/dev --config-file=/src/docs/t02/clang-tidy.yml > /out/dev/tidy-tests.stdout.txt 2> /out/dev/tidy-tests.stderr.txt
fi
if [ "$preset" = tsan ]; then
  if node /src/backend/tests/http.mjs "/build/$preset/workshop_backend" "/out/$preset/http" > "/out/$preset/http.stdout.txt" 2> "/out/$preset/http.stderr.txt"; then code=0; else code=$?; fi
  printf '%s\n' "$code" > /out/tsan/http.exit.txt
  node /src/scripts/t02/tsan-gate.mjs http /out/tsan
else
  node /src/backend/tests/http.mjs "/build/$preset/workshop_backend" "/out/$preset/http" > "/out/$preset/http.stdout.txt" 2> "/out/$preset/http.stderr.txt"
fi
node /src/backend/tests/shutdown.mjs "/build/$preset/workshop_backend" "/out/$preset/shutdown" > "/out/$preset/shutdown.stdout.txt" 2> "/out/$preset/shutdown.stderr.txt"
sha256sum "/build/$preset/workshop_backend" "/build/$preset/workshop_tests" > "/out/$preset/artifacts.sha256"

#!/bin/sh
set -eu
preset="$1"
sh /src/scripts/t02/build.sh "$preset"
# The inherited script is a child shell; its exports cannot configure this shell.
export WORKSHOP_CASE_ROOT="/out/$preset/cases"
case "$preset" in
asan-ubsan) export ASAN_OPTIONS=detect_leaks=1:halt_on_error=1:detect_stack_use_after_return=1; export UBSAN_OPTIONS=halt_on_error=1:print_stacktrace=1;;
tsan) export TSAN_OPTIONS=halt_on_error=0:exitcode=66:report_bugs=1;;
esac
# Extra tests never substitute/filter any of the 50 existing CTest cases.
if /build/$preset/workshop_updates_tests > /out/$preset/updates.stdout.txt 2> /out/$preset/updates.stderr.txt; then code=0; else code=$?; fi
printf '%s\n' "$code" > /out/$preset/updates.exit.txt
[ "$code" = 0 ]
# New code must be sanitizer-clean; no new exception is inferred from EX r2.
if grep -E 'ThreadSanitizer|AddressSanitizer|runtime error:' /out/$preset/updates.stderr.txt; then exit 1; fi
if [ "$preset" = dev ]; then
 for file in updates update_transport; do
  clang-tidy-18 /src/backend/src/$file.cpp -p /build/dev --config-file=/src/docs/t02/clang-tidy.yml > /out/dev/tidy-$file.stdout.txt 2> /out/dev/tidy-$file.stderr.txt
 done
 clang-tidy-18 /src/backend/tests/updates.cpp -p /build/dev --config-file=/src/docs/t02/clang-tidy.yml > /out/dev/tidy-updates-tests.stdout.txt 2> /out/dev/tidy-updates-tests.stderr.txt
fi
sha256sum /build/$preset/workshop_updates_tests > /out/$preset/updates-artifacts.sha256

# Telemetry is additional; the original 50 CTest and updates remain intact.
/build/$preset/workshop_telemetry_tests > /out/$preset/telemetry.stdout.txt 2> /out/$preset/telemetry.stderr.txt
if grep -E 'ThreadSanitizer|AddressSanitizer|runtime error:' /out/$preset/telemetry.stderr.txt; then exit 1; fi
sha256sum /build/$preset/workshop_telemetry_tests > /out/$preset/telemetry-artifacts.sha256
if [ "$preset" = dev ]; then
 clang-tidy-18 /src/backend/src/telemetry.cpp -p /build/dev --config-file=/src/docs/t02/clang-tidy.yml > /out/dev/tidy-telemetry.stdout.txt 2> /out/dev/tidy-telemetry.stderr.txt
 clang-tidy-18 /src/backend/tests/telemetry.cpp -p /build/dev --config-file=/src/docs/t02/clang-tidy.yml > /out/dev/tidy-telemetry-tests.stdout.txt 2> /out/dev/tidy-telemetry-tests.stderr.txt
fi

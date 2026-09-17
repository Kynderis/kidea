#!/bin/sh
set -eu
# Fixed profile fixture only. No package download, source edits or old output reuse.
case "$1" in
cpp)
  cd /src
  test ! -e /build/dev
  node --version
  gcc-13 --version
  cmake --version
  clang-tidy-18 --version
  clang-format-18 --dry-run --Werror /src/cpp/*.cpp /src/cpp/*.hpp
  for preset in dev asan-ubsan tsan release; do
    sh /src/scripts/cpp-preset.sh "$preset"
  done
  for file in domain input tests server; do
    clang-tidy-18 "/src/cpp/$file.cpp" -p /build/dev
  done
  sha256sum /build/release/backend /build/release/domain_tests > /out/cpp-artifacts.sha256
  ;;
web)
  test ! -e /work/package.json
  cp -R /src/web/. /work/
  tar --no-same-owner -xf /inputs/npm-cache.tar -C /work
  cd /work
  node --version
  npm ci --offline --ignore-scripts --audit=false --fund=false --cache /work/.npm-cache
  node node_modules/@sveltejs/kit/svelte-kit.js sync
  node node_modules/svelte-check/bin/svelte-check --tsconfig ./tsconfig.json --fail-on-warnings
  node node_modules/eslint/bin/eslint.js . --max-warnings 0
  node --test tests/unit/*.test.mjs
  node node_modules/vite/bin/vite.js build
  node --test tests/server/*.test.mjs
  ;;
browser)
  cd /work
  node node_modules/@playwright/test/cli.js test --project=chromium --workers=1 --retries=0 --forbid-only
  ;;
*) exit 2 ;;
esac

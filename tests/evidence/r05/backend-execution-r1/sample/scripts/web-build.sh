#!/bin/sh
set -eu
cp -R /src/web/. /work/
cd /work
npm ci --ignore-scripts --audit=false --fund=false --cache /work/.npm-cache
node node_modules/@sveltejs/kit/svelte-kit.js sync
node node_modules/svelte-check/bin/svelte-check --tsconfig ./tsconfig.json --fail-on-warnings
node node_modules/eslint/bin/eslint.js . --max-warnings 0
node --test tests/unit/*.test.mjs
node node_modules/vite/bin/vite.js build

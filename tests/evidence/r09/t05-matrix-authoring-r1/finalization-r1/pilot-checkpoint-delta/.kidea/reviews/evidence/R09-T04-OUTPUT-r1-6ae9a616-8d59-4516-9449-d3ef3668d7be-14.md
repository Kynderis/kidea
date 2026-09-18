#!/bin/sh
set -eu
browser_home=$(mktemp -d /tmp/r09-browser-XXXXXX)
mkdir -p "$browser_home/.pki/nssdb"
: > "$browser_home/empty-password"
timeout 10s certutil -N --empty-password -d "sql:$browser_home/.pki/nssdb" < /dev/null
timeout 10s certutil -A -d "sql:$browser_home/.pki/nssdb" -f "$browser_home/empty-password" -n r09-lab -t 'C,,' -i /fixtures/root.crt < /dev/null
exec env HOME="$browser_home" NODE_EXTRA_CA_CERTS=/fixtures/root.crt node /plan/browser.mjs

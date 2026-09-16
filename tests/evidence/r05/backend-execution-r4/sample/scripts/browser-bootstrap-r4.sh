#!/bin/sh
set -eu
# Never recreate an existing NSS DB: certutil can prompt forever without a TTY.
browser_home=$(mktemp -d /tmp/kidea-browser-XXXXXX)
mkdir -p "$browser_home/.pki/nssdb"
: > "$browser_home/empty-password"
timeout 10s certutil -N --empty-password -d "sql:$browser_home/.pki/nssdb" < /dev/null
timeout 10s certutil -A -d "sql:$browser_home/.pki/nssdb" -f "$browser_home/empty-password" -n kidea-lab -t 'C,,' -i /fixtures/root.crt < /dev/null
exec env HOME="$browser_home" node /check.mjs

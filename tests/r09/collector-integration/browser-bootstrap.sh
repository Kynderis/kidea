#!/bin/sh
set -eu
collector_browser_home=$(mktemp -d /tmp/collector-browser-XXXXXX)
mkdir -p "$collector_browser_home/.pki/nssdb"
: > "$collector_browser_home/empty-password"
timeout 10s certutil -N --empty-password -d "sql:$collector_browser_home/.pki/nssdb" < /dev/null
timeout 10s certutil -A -d "sql:$collector_browser_home/.pki/nssdb" -f "$collector_browser_home/empty-password" -n collector-integration -t 'C,,' -i /config/cert.pem < /dev/null
exec env HOME="$collector_browser_home" NODE_EXTRA_CA_CERTS=/config/cert.pem node /plan/browser.mjs

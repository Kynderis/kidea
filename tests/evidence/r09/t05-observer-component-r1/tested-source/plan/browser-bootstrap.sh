#!/bin/sh
set -eu
observer_browser_home=$(mktemp -d /tmp/observer-browser-XXXXXX)
mkdir -p "$observer_browser_home/.pki/nssdb"
: > "$observer_browser_home/empty-password"
timeout 10s certutil -N --empty-password -d "sql:$observer_browser_home/.pki/nssdb" < /dev/null
timeout 10s certutil -A -d "sql:$observer_browser_home/.pki/nssdb" -f "$observer_browser_home/empty-password" -n observer-component -t 'C,,' -i /config/cert.pem < /dev/null
exec env HOME="$observer_browser_home" NODE_EXTRA_CA_CERTS=/config/cert.pem node /plan/browser.mjs

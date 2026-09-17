#!/bin/sh
set -eu
# Lab regression for COS noexec data mounts versus Docker-managed payload volume.
cp /source/caddy /blocked/caddy
chmod 755 /blocked/caddy
set +e
/blocked/caddy version > /tmp/blocked.stdout 2>/tmp/blocked.stderr
code=$?
set -e
test "$code" = 126
cat /tmp/blocked.stderr
cp -R /blocked/. /payload/
chmod -R a+rX /payload
expected=07f440f3a7421623b3340aaf8e212b8c326579b7fc203b037e538fa3d99c7b1e
actual=$(sha256sum /payload/caddy)
test "${actual%% *}" = "$expected"
/payload/caddy version
echo 'PASS: same Caddy bytes blocked on noexec; executable in Docker-managed volume'

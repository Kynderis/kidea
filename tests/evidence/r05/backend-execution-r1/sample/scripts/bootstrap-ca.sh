#!/bin/sh
set -eu
gpgv --keyring /usr/share/keyrings/ubuntu-archive-keyring.gpg /input/downloads/bootstrap-InRelease
expected_index=$(awk '/^SHA256:/{inside=1;next} inside && /^ [a-f0-9]+/ && $3=="main/binary-amd64/Packages" {print $1;exit}' /input/downloads/bootstrap-InRelease)
test -n "$expected_index"
printf '%s  %s\n' "$expected_index" /input/downloads/bootstrap-Packages | sha256sum -c -
expected_package=$(awk 'BEGIN{RS="";FS="\n"} /^Package: ca-certificates\n/ {for(i=1;i<=NF;i++) if($i ~ /^SHA256: /){sub(/^SHA256: /,"",$i);print $i;exit}}' /input/downloads/bootstrap-Packages)
test -n "$expected_package"
printf '%s  %s\n' "$expected_package" /input/downloads/ca-certificates.deb | sha256sum -c -
mkdir -p /tmp/kidea-bootstrap-ca
dpkg-deb -x /input/downloads/ca-certificates.deb /tmp/kidea-bootstrap-ca
cat /tmp/kidea-bootstrap-ca/usr/share/ca-certificates/mozilla/*.crt > /tmp/kidea-bootstrap-ca/ca.pem

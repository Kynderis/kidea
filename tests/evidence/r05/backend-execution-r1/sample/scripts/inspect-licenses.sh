#!/bin/sh
set -eu
mkdir -p /tmp/kidea-package-inspection /output/licenses
for deb in /input/downloads/debs/*.deb; do
  name=$(basename "$deb" .deb)
  mkdir -p "/tmp/kidea-package-inspection/$name"
  dpkg-deb -x "$deb" "/tmp/kidea-package-inspection/$name"
  find "/tmp/kidea-package-inspection/$name/usr/share/doc" -name copyright -type f -exec cat {} \; > "/output/licenses/$name.txt"
  if test ! -s "/output/licenses/$name.txt"; then
    find "/tmp/kidea-package-inspection/$name/usr/share/doc" -type l -ls > "/output/licenses/$name-symlinks.txt"
  fi
done
printf 'Inspected copyright files without executing package scripts\n'

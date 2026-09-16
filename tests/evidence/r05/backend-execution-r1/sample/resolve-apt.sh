#!/bin/sh
set -eu
cp /input/ubuntu.sources /etc/apt/sources.list.d/ubuntu.sources
sh /input/scripts/bootstrap-ca.sh
apt-get -o Acquire::https::CaInfo=/tmp/kidea-bootstrap-ca/ca.pem -o APT::Update::Error-Mode=any update
dpkg-query -W -f='${Package}\t${Version}\t${Architecture}\n' > /output/base-packages.tsv
# Package strings are pinned input generated from the reviewed manifest, not shell code.
set -- $(cat /input/apt-packages.txt)
apt-get --simulate --no-install-recommends install "$@" > /output/apt-simulation.txt
apt-get --print-uris --yes --no-install-recommends install "$@" > /output/apt-uris.txt
sed -n 's/^Inst \([^ ]*\).*/\1/p' /output/apt-simulation.txt > /output/apt-package-names.txt
xargs -r apt-cache show --no-all-versions < /output/apt-package-names.txt > /output/apt-resolved-records.txt
cp /var/lib/apt/lists/*InRelease /output/
cat /output/apt-simulation.txt

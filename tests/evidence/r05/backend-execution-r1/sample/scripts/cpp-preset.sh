#!/bin/sh
set -eu
cd /src
case "$1" in dev|asan-ubsan|tsan|release) ;; *) exit 2;; esac
cmake --preset "$1"
cmake --build --preset "$1"
ctest --preset "$1" --output-on-failure --output-junit "/build/$1/results.xml"

#!/bin/sh
set -eu
mkdir -p /work/sdk /work/cache /work/modcache
tar -xzf /candidate/go.tar.gz -C /work/sdk
export PATH=/work/sdk/go/bin:$PATH
export GOTOOLCHAIN=local GOCACHE=/work/cache GOMODCACHE=/work/modcache GOPROXY=https://proxy.golang.org GOSUMDB=sum.golang.org
if ! test -f /work/source/go.mod; then cp -a /candidate/source /work/source; fi
cd /work/source
go version
go get golang.org/x/crypto@v0.56.0 google.golang.org/grpc@v1.83.2 github.com/google/cel-go@v0.30.0 github.com/go-chi/chi/v5@v5.3.0 github.com/klauspost/compress@v1.18.7 go.opentelemetry.io/otel@v1.44.0
go mod tidy
go mod download -json > /work/downloads.json
go mod verify
go list -m -json all > /work/modules.json
cp go.mod go.sum /out/
cp /work/downloads.json /work/modules.json /out/
du -sk /work

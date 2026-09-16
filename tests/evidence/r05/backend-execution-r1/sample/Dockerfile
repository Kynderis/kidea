FROM docker.io/library/ubuntu@sha256:496754492fb28b4d3049432f2ca787449331e23fb14f0dd3fffea86bf5a93eb4 AS toolchain
COPY downloads/debs/ /debs/
COPY downloads/debs.sha256 /debs.sha256
COPY downloads/node.tar.xz /node.tar.xz
RUN sha256sum -c /debs.sha256 && \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes --no-install-recommends /debs/*.deb && \
    printf '%s  %s\n' '14b342e71204f811bde6153be8e04b62aef63c236fef92b55f9c83154b409647' /node.tar.xz | sha256sum -c - && \
    mkdir -p /opt/node /build /work /out /data && \
    tar -xJf /node.tar.xz --strip-components=1 -C /opt/node && \
    chown 1000:1000 /build /work /out /data && \
    dpkg-query -W -f='${Package}\t${Version}\t${Architecture}\n' > /opt/package-inventory.tsv
ENV PATH="/opt/node/bin:${PATH}"
USER 1000:1000
WORKDIR /work

FROM mcr.microsoft.com/playwright@sha256:bc6ab0d6d44ff4826e4cb8c1e6d801e185bfc42bb0753f8e2a30efc70db054c7 AS browser
COPY --from=toolchain /usr/bin/certutil /usr/local/bin/certutil
USER pwuser
WORKDIR /work

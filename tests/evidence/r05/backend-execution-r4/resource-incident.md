# Resource incident — execution halted

At 2026-09-16 15:21 UTC the agent restarted the existing browser container. Its command attempted `certutil -N` on an already existing isolated NSS database, entered a noninteractive password-prompt loop, and did not launch Chromium. No host Keychain/CA or real password was involved.

The agent then incorrectly launched the edge-drain check before confirming browser exit. With backend/Web/Caddy each at 0.5 CPU/1 GiB, the remaining browser and a drain client made aggregate **configured quotas 2.5 CPU/5 GiB**, exceeding the approved **2 CPU/4 GiB**. This is an orchestration error, not additional authorization. Actual CPU/RAM consumption was not sampled precisely; configured ceilings, not observed consumption, are reported.

Docker timestamps identify two overlap intervals, approximately **18.1 seconds total**:

- normal drain client: 15:21:29.480837811–15:21:31.023759196 UTC;
- stuck drain client while browser remained live: 15:21:33.305320408–15:21:49.886101788 UTC.

The browser was explicitly killed (137). The drain client/Caddy were then killed and remaining services stopped. The final edge-drain stage exits 1; it is **not accepted**, even though an earlier source/config stage had passed normal/stuck edge checks. No more Docker workload was started after the incident. Subsequent Docker operations only inspect/copy retained evidence. Host core/guard/document checks are separate from resuming the Docker run.

Browser stderr contains 173,680,568 raw bytes of repeated prompt errors. It is retained losslessly as `browser-https-sealed-6RzIfm/stderr.log.gz`, with original SHA/length and local raw path in `stderr.log.receipt.json`; this is compression, not filtering/truncation. Credential scans include the decompressed content.

Prepared corrections, **Docker integration not yet revalidated**:

1. Runner and drain launcher acquire a common filesystem lock and calculate active + planned owned-container quotas before `run/start/restart`. A stale lock or unknown quota fails closed. Unit tests include exactly the offending extra-client topology and both independent quota limits.
2. A timed-out managed Docker check also stops its validated owned targets; killing only the attached CLI is insufficient.
3. Browser bootstrap creates a fresh isolated NSS directory per invocation, supplies an empty password file explicitly, and bounds certutil commands to 10 seconds. It retains normal TLS validation and only imports the public lab CA.

Continuation stays within the same approved quotas. Do not restart `kidea-r05-e2-r4-browser-https` with its old command. Create the replacement client using `scripts/browser-bootstrap-r4.sh`, run through the managed wrapper, finish real HTTPS cookie-override/browser coverage, then final edge drain and evidence collection. Do not classify r4 as a fully valid resource-compliant run or R05 complete.

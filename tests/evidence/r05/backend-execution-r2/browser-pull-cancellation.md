# Browser image pull cancellation

The pinned Playwright image pull was started while the Caddy build was pending. It had not completed when Caddy failed compatibility. At 2026-09-16T13:32Z approximately, only the owned Docker pull process PID 23498 (verified by ps with the exact pinned image command) was sent SIGTERM to stop further download/disk use for the blocked HTTPS branch.

Raw stage result is exit 143, timedOut false. This is an intentional cancellation, not PASS or a skipped test. No browser tests ran. Partial Docker download/cache was retained; no prune or image deletion. Filesystem free-space reduction since E2 r1 start was approximately 12.37 GiB at cancellation, under the 16 GiB ceiling but leaving limited headroom; the delta includes unrelated host activity and Docker allocation overhead, so it is a conservative observation, not exact workload attribution.

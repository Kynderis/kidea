# R05 Web fixture

Synthetic sample only; not Workshop or production authentication. Actor query/cookies and control endpoints exist only for local tests. Fake admin transport logs operations instead of contacting a backend. Never deploy this fixture.

Node24.19/npm12, exact candidate lock and cookie0.7.2 override. Use npm ci --ignore-scripts; no lifecycle scripts. Chromium tests exercise the production adapter-node bundle on 127.0.0.1:4173 only. Secure cookie headers are checked over loopback HTTP; actual HTTPS/CSRF/C++ authority and production browser cookie policy remain NOT_RUN.

Unit vectors cover scoped versions/history/generations. Browser checks both model unmount and actual Svelte child destruction with a delayed callback; native lifecycle remains separate. SSR barrier tests use two orders; no benchmark or backend claim. Keep all nine original vector IDs and record actual coverage limits.

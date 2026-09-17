# Offline progress view

Use `node scripts/kidea.mjs visualize` from the selected local project with a trusted JSON stdin request. Node ≥24. The only managed output is `.kidea/views/progress.html`; no product execution, publishing, approvals or record edits.

The request has `permission` and optional `maps`. Permission fields: `root` (absolute canonical selected root), `readProject:true`, `allowReadLocalGit` (explicit boolean), `allowViewWrite:true`, `allowExportMetadata:true`, and `assumptions:{localFilesystem:true,noActiveSync:true,singleKideaRun:true}`. Obtain these from the actual user/session, never a project file. Export permission covers the displayed schema metadata (names, IDs, refs, task/review/blocker/release/operation descriptions) and selected map labels/relations. Review sharing scope before export; do not include secrets in these fields. The helper excludes arbitrary Markdown prose, raw config, source and map configuration, but is not a secret detector.

`maps` optionally maps `specification`, `implementation`, `responsibility` to explicit relative JSON receipt paths from R06. Do not invent paths, scan outside scope, or run extractors to fill missing data without the relevant authorization. Receipt digests/source versions are checked; stale maps show warnings, missing maps show unknown. Review meaning/assertions separately. Reverse relations derive from the same edges.

`VIEW_UPDATED` reports path, time, input basis, output integrity and warnings. Open the local file when requested; it works without a server/network. It is an immutable-in-meaning snapshot until regenerated, not live health or authority to continue blocked work. When copied alone the metadata remains readable, source links need the original relative project files.

`VIEW_NOT_UPDATED` preserves prior output where safe and reports diagnostics/recovery. Missing/invalid/stale required sources, pending/conflict, unsafe links, foreign output and changed inputs/target block export. Do not repair records, delete markers or force overwrite as a workaround. `RECONCILIATION_REQUIRED` needs inspection before retry. Keep evidence and current user work.

The offline Kidea interface targets Chrome under the current approved scope. This does not narrow a product project's Web browser matrix. Actual R07 browser/host coverage is recorded in repository evidence; availability of the action does not imply Human acceptance or untested-host PASS.

"""Collect bootstrap receipts only after all owned host processes have stopped."""
import datetime
import hashlib
import importlib.util
import json
import pathlib
import re
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
E = ROOT / 'tests/evidence/r05/android-sim-bootstrap-r1'
LAB = pathlib.Path('/Users/kendrick/Desktop/kidea-native-lab/android-sim-r1')
assert not (E / 'final-verification.json').exists(), 'CREATE-only final receipt'
spec = importlib.util.spec_from_file_location('boot', ROOT / 'tests/r05/android-sim-bootstrap.py')
boot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(boot)
assert not boot.lab_processes(), 'lab still running'
assert not (ROOT / '.test-output/r05/docker-budget.lock').exists()
state = json.loads((E / 'state.json').read_text())
assert state['lastStageStatus'] == 'PASS' and state['bootResult']['status'] == 'PASS'
boot.STATE = state
boot.guard()


def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        while data := f.read(1024 * 1024):
            h.update(data)
    return h.hexdigest()


archives = []
for item in state['artifacts']:
    p = LAB / 'downloads' / item['url'].rsplit('/', 1)[1]
    assert p.stat().st_size == item['bytes'] and digest(p) == item['sha256']
    archives.append({'file': p.name, 'bytes': p.stat().st_size, 'sha256': item['sha256'], 'publisherSha1Matched': item['sha1'] == item['publisherSha1']})

old = ROOT / 'tests/evidence/r05/android-execution-r1'
sources = json.loads((old / 'manifest.json').read_text())['sources']
for f, value in sources.items():
    assert digest(old / 'sample' / f) == value['sha256']
    assert digest(ROOT.parent / 'kidea-workshop-pilot/samples/r05/android-r1' / f) == value['sha256']
profiles = json.loads((old / 'pilot-amendment-sdk37.json').read_text())['allAfterHashes']
for f, value in profiles.items():
    assert digest(ROOT.parent / 'kidea-workshop-pilot' / f) == value

# Preserve original logs outside Git; only public ADB keys are redacted in Git.
# Private keys or auth token values are never intentionally collected.
raw_dir = LAB / ('evidence/raw-logs-' + str(len(list(LAB.glob('evidence/raw-logs*'))) + 1))
raw_dir.mkdir(exist_ok=False)
redactions = []
for p in E.rglob('*.log'):
    data = p.read_bytes()
    if data.startswith(b'\x89PNG'):
        continue
    assert not re.search(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----', data), p
    pattern = rb'Sending adb public key \[[^\r\n]*\]'
    if re.search(pattern, data):
        dest = raw_dir / p.relative_to(E)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(p, dest)
        redacted = re.sub(pattern, b'Sending adb public key [REDACTED; original retained in lab]', data)
        p.write_bytes(redacted)
        redactions.append({'file': str(p.relative_to(E)), 'originalSha256': hashlib.sha256(data).hexdigest(),
                           'redactedSha256': hashlib.sha256(redacted).hexdigest(), 'originalLocalPath': str(dest)})

result = subprocess.run(['python3', '-B', str(ROOT / 'tests/r05/android-sim-bootstrap.test.py')], capture_output=True, text=True)
(E / 'guard-tests.stdout.log').write_text(result.stdout)
(E / 'guard-tests.stderr.log').write_text(result.stderr)
assert result.returncode == 0
attempts = []
for p in sorted(E.glob('boot-*/resource-samples.json')):
    record = json.loads(p.read_text())
    attempts.append({'folder': p.parent.name, 'samples': len(record['samples']),
                     'peakRssBytes': max((x['rssBytes'] for x in record['samples']), default=0),
                     'monitorErrors': record['monitorErrors']})
listeners = subprocess.run(['/usr/sbin/lsof', '-nP', '-iTCP:5037', '-iTCP:5554', '-iTCP:5555', '-sTCP:LISTEN'], capture_output=True, text=True)
assert listeners.returncode == 1 and not listeners.stdout, 'lab ports still occupied'
free = shutil.disk_usage(ROOT).free
report = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'status': 'PASS_BOOTSTRAP_ONLY',
          'bootResult': state['bootResult'], 'bootAttempts': attempts, 'historicalFailures': state.get('failures', []),
          'archives': archives, 'archivePayloadBytes': state['downloadBytes'],
          'unmeteredMetadataHeadroomBytes': 64 * 1024 ** 2,
          'networkMeasurementLimit': 'Archive stream bytes metered; OS trust-service/background network not packet-captured. 64MiB headroom reserved, not a measurement.',
          'additionalDiskBytes': state['startFreeBytes'] - free, 'cumulativeE2DiskBytes': state['e2FreeBytes'] - free,
          'freeBytes': free, 'elapsedSeconds': __import__('time').time() - state['startEpoch'],
          'guardTests': {'exitCode': result.returncode, 'tests': 10}, 'noOwnedProcessesOrListeners': True,
          'a1SampleFilesPreserved': len(sources), 'pilotFilesPreserved': len(profiles),
          'publicKeyRedactions': redactions,
          'helperHashes': {f: digest(ROOT / 'tests/r05' / f) for f in ['android-sim-bootstrap.py', 'android-sim-bootstrap.test.py', 'collect-android-sim-bootstrap.py']},
          'limitations': ['No application APK installed', 'N01-N08 application runtime groups not run', 'iOS direction approved but no installer available', 'Apple Silicon not run']}
assert report['archivePayloadBytes'] + report['unmeteredMetadataHeadroomBytes'] < 2 * boot.GIB
assert report['additionalDiskBytes'] <= 12 * boot.GIB and report['cumulativeE2DiskBytes'] <= 47 * boot.GIB
(E / 'final-verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: report[k] for k in ['status', 'additionalDiskBytes', 'cumulativeE2DiskBytes', 'freeBytes', 'elapsedSeconds']}, indent=2))

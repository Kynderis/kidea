"""Read-only source/host checks and bounded Apple metadata fetch; no lab execution."""
import datetime
import hashlib
import json
from pathlib import Path
import plistlib
import subprocess
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'tests/evidence/r05/native-runtime-plan-r1'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def command(*args):
    p = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, timeout=30)
    return dict(argv=list(args), exitCode=p.returncode, stdout=p.stdout, stderr=p.stderr)


def main():
    OUT.mkdir(exist_ok=False)
    snapshot = ROOT / 'tests/evidence/r05/android-execution-r1/sample'
    live = ROOT.parent / 'kidea-workshop-pilot/samples/r05/android-r1'
    sources = []
    for p in sorted(snapshot.rglob('*')):
        if p.is_file():
            rel = p.relative_to(snapshot)
            other = live / rel
            sources.append(dict(path=str(rel), snapshotSha256=sha(p),
                                liveSha256=sha(other) if other.is_file() else None))
    gate = json.loads((ROOT / 'tests/evidence/r05/android-execution-r1/dependency-gate.json').read_text())
    pilot_manifest = json.loads((ROOT / 'tests/evidence/r05/android-execution-r1/pilot-amendment-sdk37.json').read_text())
    receipt = dict(at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                   head=command('git', 'rev-parse', 'HEAD'), sources=sources,
                   sourceMatch=all(x['snapshotSha256'] == x['liveSha256'] for x in sources),
                   pilotManifestSha256=sha(ROOT / 'tests/evidence/r05/android-execution-r1/pilot-amendment-sdk37.json'),
                   previousDependencyGate=dict(status=gate['status'],
                       uniqueAdvisories=gate['uniqueAdvisories'],
                       affectedCoordinates=gate['advisoryMatchedCoordinates'],
                       disposition='REASSESS_BEFORE_RUNTIME_NOT_INHERITED'),
                   environment=[command('sw_vers'), command('uname', '-m'),
                                command('id', '-u'), command('df', '-k', '.'),
                                command('xcode-select', '-p')],
                   execution='PREPARATION_ONLY; no Docker/ADB/emulator/build/install/signing')
    # Preserve only public response metadata, never cookies or authentication headers.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *args):
            return None
    url = 'https://download.developer.apple.com/Developer_Tools/Xcode_16.2/Xcode_16.2.xip'
    try:
        with urllib.request.build_opener(NoRedirect()).open(
                urllib.request.Request(url, method='HEAD'), timeout=30) as r:
            probe = dict(status=r.status, contentLength=r.headers.get('Content-Length'))
    except urllib.error.HTTPError as e:
        probe = dict(status=e.code, location=e.headers.get('Location'))
    except urllib.error.URLError as e:
        probe = dict(error=str(e.reason))
    receipt['xcode'] = dict(url=url, probe=probe, archiveBytes=None, publisherDigest=None,
                            status='NOT_INSTALL_READY', binaryDownloaded=False)
    index_url = 'https://devimages-cdn.apple.com/downloads/xcode/simulators/index2.dvtdownloadableindex'
    try:
        with urllib.request.urlopen(index_url, timeout=30) as r:
            data = r.read(8 * 1024 * 1024 + 1)
        if len(data) > 8 * 1024 * 1024:
            raise ValueError('Metadata exceeds 8 MiB ceiling')
        (OUT / 'apple-index.plist').write_bytes(data)
        entries = [v for v in plistlib.loads(data)['downloadables']
                   if v.get('identifier') == 'com.apple.dmg.iPhoneSimulatorSDK18_2']
        receipt['iosRuntime'] = dict(url=index_url, bytes=len(data),
            sha256=hashlib.sha256(data).hexdigest(), entries=entries,
            status='INDEX_ONLY_UNIVERSAL_VARIANT_UNVERIFIED')
    except (urllib.error.URLError, ValueError) as e:
        receipt['iosRuntime'] = dict(url=index_url, error=str(e), status='METADATA_FAILED')
    receipt['scriptSha256'] = sha(Path(__file__))
    (OUT / 'receipt.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(dict(sourceFiles=len(sources), sourceMatch=receipt['sourceMatch'],
                         xcode=receipt['xcode'], iosStatus=receipt['iosRuntime']['status']), indent=2))
    if not receipt['sourceMatch']:
        raise SystemExit('Source drift: stop before preparing execution against this baseline')


if __name__ == '__main__':
    main()

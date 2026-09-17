"""Read publisher metadata only; never download tools or start a simulator."""
import datetime
import hashlib
import json
import pathlib
import plistlib
import subprocess
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'tests/evidence/r05/simulator-plan-r1'
OUT.mkdir(exist_ok=False)


def fetch(url, name):
    with urllib.request.urlopen(url, timeout=30) as response:
        data = response.read(8 * 1024 * 1024 + 1)
        assert len(data) <= 8 * 1024 * 1024, 'metadata limit exceeded'
        receipt = {'url': url, 'finalUrl': response.url, 'bytes': len(data),
                   'sha256': hashlib.sha256(data).hexdigest(), 'file': name}
    (OUT / name).write_bytes(data)
    return data, receipt


repo, repo_receipt = fetch('https://dl.google.com/android/repository/repository2-3.xml', 'google-repository.xml')
images, image_receipt = fetch('https://dl.google.com/android/repository/sys-img/android/sys-img2-3.xml', 'google-system-images.xml')
apple, apple_receipt = fetch('https://devimages-cdn.apple.com/downloads/xcode/simulators/index2.dvtdownloadableindex', 'apple-simulator-index.plist')
wanted = {'emulator': '37.1.11', 'platform-tools': '37.0.1', 'cmdline-tools;23.0': '23.0',
          'system-images;android-36;default;x86_64': '2'}
artifacts = []
for data, receipt in [(repo, repo_receipt), (images, image_receipt)]:
    for package in ET.fromstring(data).findall('remotePackage'):
        path = package.attrib['path']
        version = '.'.join(c.text for c in package.find('revision'))
        if path not in wanted or version != wanted[path]:
            continue
        assert package.find('channelRef').get('ref') == 'channel-0'
        for archive in package.findall('./archives/archive'):
            if archive.findtext('host-os') not in (None, 'macosx'):
                continue
            if archive.findtext('host-arch') not in (None, 'x64', 'x86_64'):
                continue
            complete = archive.find('complete')
            relative = complete.findtext('url')
            if 'arm64' in relative or 'aarch64' in relative:
                continue
            artifacts.append({'package': path, 'version': version,
                              'url': receipt['url'].rsplit('/', 1)[0] + '/' + relative,
                              'bytes': int(complete.findtext('size')),
                              'publisherSha1': complete.findtext('checksum'),
                              'metadata': receipt['file'], 'binaryDownloaded': False})
assert len(artifacts) == 4 and {a['package'] for a in artifacts} == set(wanted)
runtime = [d for d in plistlib.loads(apple)['downloadables']
           if d.get('identifier') == 'com.apple.dmg.iPhoneSimulatorSDK18_2']
assert len(runtime) == 1 and runtime[0]['simulatorVersion']['buildUpdate'] == '22C150'


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


xcode_url = 'https://download.developer.apple.com/Developer_Tools/Xcode_16.2/Xcode_16.2.xip'
try:
    with urllib.request.build_opener(NoRedirect()).open(
            urllib.request.Request(xcode_url, method='HEAD'), timeout=30) as response:
        xcode = {'url': xcode_url, 'httpStatus': response.status}
except urllib.error.HTTPError as error:
    xcode = {'url': xcode_url, 'httpStatus': error.code,
             'location': error.headers.get('Location')}
xcode.update({'binaryDownloaded': False, 'verifiedArchiveBytes': None,
              'verifiedArchiveHash': None, 'status': 'NOT_INSTALL_READY'})


def command(*args):
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, check=False)
    return {'command': list(args), 'exitCode': result.returncode,
            'stdout': result.stdout, 'stderr': result.stderr}


manifest = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'source': command('git', 'rev-parse', 'HEAD'),
            'metadata': [repo_receipt, image_receipt, apple_receipt],
            'androidArtifacts': artifacts,
            'androidArchiveBytes': sum(a['bytes'] for a in artifacts),
            'iosRuntimeIndexEntry': runtime[0],
            'iosRuntimeLimitation': 'Index size only; universal Intel variant, asset URL/hash and install size not yet verified.',
            'xcodeArchiveProbe': xcode,
            'environment': [command('sw_vers'), command('uname', '-m'),
                            command('sysctl', '-n', 'hw.model', 'hw.memsize', 'kern.hv_support'),
                            command('xcode-select', '-p'), command('/usr/libexec/java_home', '-V'),
                            command('df', '-k', '.')],
            'execution': 'METADATA_ONLY; no install, license acceptance, build or simulator run'}
(OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'status': 'PASS_METADATA_SELECTION', 'androidArchiveBytes': manifest['androidArchiveBytes'],
                  'xcodeArchiveProbe': xcode, 'output': str(OUT)}, indent=2))

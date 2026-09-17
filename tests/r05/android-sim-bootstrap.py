"""Approved A-SIM-BOOT r1. Persistent quotas; host tools confined to a lab root."""
import datetime
import hashlib
import json
import os
import pathlib
import shutil
import signal
import stat
import subprocess
import sys
import time
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
import io
import socket
import threading

ROOT = pathlib.Path(__file__).resolve().parents[2]
LAB = pathlib.Path('/Users/kendrick/Desktop/kidea-native-lab/android-sim-r1')
EVIDENCE = ROOT / 'tests/evidence/r05/android-sim-bootstrap-r1'
PLAN = ROOT / 'tests/evidence/r05/simulator-plan-r1/manifest.json'
LOCK = ROOT / '.test-output/r05/docker-budget.lock'
GIB = 1024 ** 3
STATE = None


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def save():
    (EVIDENCE / 'state.json').write_text(json.dumps(STATE, indent=2) + '\n')


def guard():
    free = shutil.disk_usage(ROOT).free
    assert time.time() < STATE['deadlineEpoch'], '90-minute deadline reached'
    assert STATE['downloadBytes'] <= 2 * GIB, 'download budget exceeded'
    assert free >= 100 * GIB, 'free disk below floor'
    assert STATE['startFreeBytes'] - free <= 12 * GIB, 'additional disk budget exceeded'
    assert STATE['e2FreeBytes'] - free <= 47 * GIB, 'cumulative disk budget exceeded'


def env():
    e = os.environ.copy()
    e.update({'HOME': str(LAB / 'user-home'), 'ANDROID_USER_HOME': str(LAB / 'user-home/.android'),
              'ANDROID_AVD_HOME': str(LAB / 'avd'), 'ANDROID_SDK_ROOT': str(LAB / 'sdk'),
              'ANDROID_HOME': str(LAB / 'sdk'), 'ANDROID_EMULATOR_HOME': str(LAB / 'user-home/.android'),
              'JAVA_HOME': STATE['javaHome'], 'ADB_SERVER_SOCKET': 'tcp:5037',
              'ADB_MDNS_AUTO_CONNECT': '', 'ADB_LOCAL_TRANSPORT_MAX_PORT': '5555'})
    e['PATH'] = STATE['javaHome'] + '/bin:/usr/bin:/bin:/usr/sbin:/sbin'
    return e


def proc_memory(pid):
    rows = subprocess.check_output(['/bin/ps', '-axo', 'pid=,ppid=,rss='], text=True)
    table = [list(map(int, x.split())) for x in rows.splitlines() if x.strip()]
    owned = {pid}
    for _ in range(len(table)):
        added = {p for p, parent, rss in table if parent in owned} - owned
        if not added:
            break
        owned |= added
    return sum(rss * 1024 for p, parent, rss in table if p in owned)


def lab_processes():
    result = subprocess.check_output(['/bin/ps', '-axo', 'pid=,ppid=,rss=,comm='], text=True)
    rows = []
    for line in result.splitlines():
        fields = line.split(None, 3)
        if len(fields) == 4 and fields[3].startswith(str(LAB) + '/'):
            rows.append({'pid': int(fields[0]), 'ppid': int(fields[1]), 'rssBytes': int(fields[2]) * 1024,
                         'executable': fields[3]})
    return rows


def validate_guest_config(content):
    settings = dict((k.strip(), v.strip()) for k, v in
                    (line.split('=', 1) for line in content.splitlines() if '=' in line))
    assert int(settings['hw.ramSize']) <= 2048, 'emulator raised guest RAM above2048MiB'
    assert int(settings['hw.cpu.ncore']) <= 2, 'emulator raised guest CPU count'
    return settings


def run(label, args, timeout=120, stdin=None, allowed=(0,)):
    guard()
    folder = EVIDENCE / f'{len(STATE["commands"]):03}-{label}'
    folder.mkdir()
    receipt = {'at': now(), 'args': list(map(str, args)), 'label': label}
    STATE['commands'].append(receipt)
    save()
    with (folder / 'stdout.log').open('wb') as out, (folder / 'stderr.log').open('wb') as err:
        p = subprocess.Popen(args, env=env(), cwd=LAB, stdin=subprocess.PIPE if stdin else subprocess.DEVNULL,
                             stdout=out, stderr=err, start_new_session=True)
        receipt['pid'] = p.pid
        if stdin:
            p.stdin.write(stdin.encode())
            p.stdin.close()
        started = time.monotonic()
        try:
            while p.poll() is None:
                guard()
                rss = proc_memory(p.pid)
                receipt['maxRssBytes'] = max(receipt.get('maxRssBytes', 0), rss)
                assert rss <= 4 * GIB, 'process tree RSS exceeded 4GiB'
                pressure = subprocess.run(['/usr/sbin/sysctl', '-n', 'kern.memorystatus_vm_pressure_level'], capture_output=True, text=True)
                if pressure.returncode == 0:
                    assert pressure.stdout.strip() != '4', 'critical memory pressure'
                assert time.monotonic() - started < timeout, 'command timeout'
                time.sleep(0.5)
        except BaseException:
            os.killpg(p.pid, signal.SIGTERM)
            try:
                p.wait(5)
            except subprocess.TimeoutExpired:
                os.killpg(p.pid, signal.SIGKILL)
                p.wait()
            raise
        finally:
            receipt['exitCode'] = p.poll()
            receipt['elapsedSeconds'] = time.monotonic() - started
            save()
    assert p.returncode in allowed, f'{label}: exit {p.returncode}, see {folder}'
    return (folder / 'stdout.log').read_text(errors='replace')


def init():
    global STATE
    assert os.getuid() != 0, 'must run as normal user'
    assert not LAB.exists() and not EVIDENCE.exists(), 'CREATE-only destination exists'
    assert LAB.parent.parent.resolve() == pathlib.Path('/Users/kendrick/Desktop'), 'unexpected parent'
    LAB.mkdir(parents=True)
    EVIDENCE.mkdir()
    for part in ['downloads', 'sdk', 'avd', 'user-home', 'evidence']:
        (LAB / part).mkdir()
    (LAB / 'user-home/.android').mkdir(mode=0o700)
    STATE = {'startedAt': now(), 'startEpoch': time.time(), 'deadlineEpoch': time.time() + 5400,
             'sourceHead': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
             'approval': 'Human: tôi hiểu rồi, làm đi nhé; annotation approves Android package and iOS lab direction after bbe490e.',
             'planSha256': hashlib.sha256(PLAN.read_bytes()).hexdigest(),
             'startFreeBytes': shutil.disk_usage(ROOT).free,
             'e2FreeBytes': json.loads((ROOT / 'tests/evidence/r05/backend-execution-r1/start.json').read_text())['freeBytes'],
             'downloadBytes': 0, 'artifacts': [], 'commands': [],
             'javaHome': subprocess.check_output(['/usr/libexec/java_home'], text=True).strip()}
    save()
    run('environment', ['/usr/bin/sw_vers'])
    run('disk', ['/usr/sbin/diskutil', 'info', '/System/Volumes/Data'])
    run('host', ['/usr/sbin/sysctl', '-n', 'hw.model', 'hw.memsize', 'kern.hv_support'])
    run('listeners-before', ['/usr/sbin/lsof', '-nP', '-iTCP', '-sTCP:LISTEN'])
    run('processes-before', ['/bin/ps', '-axo', 'pid,ppid,rss,comm'])


def fetch_extract():
    for item in json.loads(PLAN.read_text())['androidArtifacts']:
        guard()
        archive = LAB / 'downloads' / item['url'].rsplit('/', 1)[1]
        assert not archive.exists(), 'never overwrite/retry without inspecting receipt'
        receipt = dict(item, startedAt=now(), receivedBytes=0)
        STATE['artifacts'].append(receipt)
        save()
        sha1, sha256 = hashlib.sha1(), hashlib.sha256()
        with urllib.request.urlopen(item['url'], timeout=30) as response, archive.open('xb') as out:
            receipt['finalUrl'] = response.url
            assert response.url.startswith('https://dl.google.com/'), 'unapproved redirect'
            while True:
                guard()
                chunk = response.read(min(1024 * 1024, 2 * GIB - STATE['downloadBytes'] + 1))
                if not chunk:
                    break
                STATE['downloadBytes'] += len(chunk)
                receipt['receivedBytes'] += len(chunk)
                save()
                assert receipt['receivedBytes'] <= item['bytes'], 'unexpected archive size'
                guard()
                out.write(chunk)
                sha1.update(chunk)
                sha256.update(chunk)
        receipt.update({'sha1': sha1.hexdigest(), 'sha256': sha256.hexdigest()})
        save()
        assert receipt['receivedBytes'] == item['bytes'] and receipt['sha1'] == item['publisherSha1'], 'publisher mismatch'
        base = LAB / 'sdk'
        if item['package'].startswith('cmdline-tools;'):
            base = base / 'cmdline-tools/23.0'
        elif item['package'].startswith('system-images;'):
            base = base / 'system-images/android-36/default'
        with zipfile.ZipFile(archive) as z:
            receipt['uncompressedBytes'] = sum(i.file_size for i in z.infolist())
            assert receipt['uncompressedBytes'] + STATE['startFreeBytes'] - shutil.disk_usage(ROOT).free <= 12 * GIB
            if item['package'] == 'emulator':
                for i in z.infolist():
                    relative = pathlib.PurePosixPath(i.filename)
                    assert not relative.is_absolute() and '..' not in relative.parts and relative.parts[0] == 'emulator'
                    if stat.S_ISLNK(i.external_attr >> 16):
                        link = z.read(i).decode()
                        assert not pathlib.Path(link).is_absolute()
                        assert (base / relative.parent / link).resolve().is_relative_to(base.resolve())
                assert not (base / 'emulator').exists()
                run('extract-emulator-with-metadata', ['/usr/bin/ditto', '-x', '-k', '--rsrc', '--extattr', str(archive), str(base)], timeout=180)
                receipt['extractedAt'] = now()
                receipt['binaryDownloaded'] = True
                save()
                continue
            for i in z.infolist():
                relative = pathlib.PurePosixPath(i.filename)
                assert not relative.is_absolute() and '..' not in relative.parts, 'unsafe zip path'
                if item['package'].startswith('cmdline-tools;'):
                    assert relative.parts[0] == 'cmdline-tools'
                    relative = pathlib.PurePosixPath(*relative.parts[1:])
                target = base / relative
                assert target.resolve().is_relative_to(base.resolve()), 'zip escape'
                if i.is_dir():
                    target.mkdir(parents=True, exist_ok=True)
                    continue
                assert not target.exists() and not target.is_symlink(), 'zip collision'
                target.parent.mkdir(parents=True, exist_ok=True)
                mode = i.external_attr >> 16
                if stat.S_ISLNK(mode):
                    link = z.read(i).decode()
                    assert not pathlib.Path(link).is_absolute()
                    assert (target.parent / link).resolve().is_relative_to(base.resolve()), 'symlink escape'
                    target.symlink_to(link)
                else:
                    with z.open(i) as source, target.open('xb') as out:
                        while True:
                            chunk = source.read(1024 * 1024)
                            if not chunk:
                                break
                            guard()
                            out.write(chunk)
                    target.chmod((mode & 0o777) or 0o644)
            receipt['extractedAt'] = now()
            save()
        print(f'Verified/extracted {item["package"]}: {receipt["receivedBytes"]} bytes', flush=True)


def probe():
    for receipt in STATE['artifacts']:
        receipt['binaryDownloaded'] = True
    save()
    for name, binary in [('adb', LAB / 'sdk/platform-tools/adb'),
                         ('emulator', LAB / 'sdk/emulator/emulator'),
                         ('qemu', LAB / 'sdk/emulator/qemu/darwin-x86_64/qemu-system-x86_64'),
                         ('qemu-headless', LAB / 'sdk/emulator/qemu/darwin-x86_64/qemu-system-x86_64-headless')]:
        run('file-' + name, ['/usr/bin/file', str(binary)])
        run('signature-' + name, ['/usr/bin/codesign', '-dv', '--verbose=4', str(binary)])
        run('notarization-' + name, ['/usr/bin/codesign', '--verify', '--strict', '--verbose=4',
                                     '-R=notarized', '--check-notarization', str(binary)])
    run('gatekeeper-status', ['/usr/sbin/spctl', '--status'])
    run('adb-version', [str(LAB / 'sdk/platform-tools/adb'), 'version'])
    run('emulator-version', [str(LAB / 'sdk/emulator/emulator'), '-version'])
    run('acceleration', [str(LAB / 'sdk/emulator/emulator'), '-accel-check'])
    run('emulator-options', [str(LAB / 'sdk/emulator/emulator'), '-help-all'])


def avd():
    # Register exact publisher package metadata locally; no sdkmanager install/update.
    for receipt in STATE['artifacts']:
        data = (PLAN.parent / receipt['metadata']).read_bytes()
        namespaces = {}
        for event, pair in ET.iterparse(io.BytesIO(data), events=['start-ns']):
            namespaces[pair[0]] = pair[1]
        for prefix, uri in namespaces.items():
            ET.register_namespace(prefix, uri)
        root = ET.fromstring(data)
        remote = next(p for p in root.findall('remotePackage') if p.attrib['path'] == receipt['package']
                      and '.'.join(c.text for c in p.find('revision')) == receipt['version'])
        package_root = ET.Element(root.tag)
        local = ET.SubElement(package_root, 'localPackage', {'path': receipt['package'], 'obsolete': 'false'})
        for child in remote:
            if child.tag in ['type-details', 'revision', 'display-name', 'uses-license', 'dependencies']:
                local.append(child)
        for license_element in root.findall('license'):
            package_root.insert(0, license_element)
        # xsi:type values use prefixes that ElementTree otherwise drops.
        for prefix, uri in namespaces.items():
            if prefix and prefix not in ['xsi'] and not root.tag.startswith('{' + uri + '}'):
                package_root.set('xmlns:' + prefix, uri)
        package_dir = LAB / 'sdk' / receipt['package'].replace(';', '/')
        target = package_dir / 'package.xml'
        assert package_dir.exists()
        content = ET.tostring(package_root, encoding='utf-8', xml_declaration=True)
        if target.exists():
            assert target.read_bytes() == content, 'existing metadata differs'
        else:
            target.write_bytes(content)
    tool = str(LAB / 'sdk/cmdline-tools/23.0/bin/avdmanager')
    # avdmanager requires package registration; Google's signed emulator folder
    # rejects an extra package.xml. Only the Java metadata tool runs while this
    # generated file is present. Preserve it outside the signed folder afterward,
    # then revalidate the complete original bundle before any emulator execution.
    try:
        run('list-devices', [tool, 'list', 'device'])
        run('create-avd', [tool, 'create', 'avd', '--name', 'kidea-r05-api36-x64-r1',
                           '--package', 'system-images;android-36;default;x86_64',
                           '--path', str(LAB / 'avd/kidea-r05-api36-x64-r1.avd')], stdin='no\n')
    finally:
        generated = LAB / 'sdk/emulator/package.xml'
        preserved = LAB / 'evidence/emulator-package-registration.xml'
        assert not preserved.exists()
        generated.rename(preserved)
        run('signature-restored-after-registration', ['/usr/bin/codesign', '--verify', '--strict', '--verbose=4',
                                                      '-R=notarized', '--check-notarization', str(LAB / 'sdk/emulator/emulator')])
    config = LAB / 'avd/kidea-r05-api36-x64-r1.avd/config.ini'
    values = {}
    for line in config.read_text().splitlines():
        if '=' in line:
            k, v = line.split('=', 1)
            values[k] = v
    values.update({'hw.cpu.ncore': '2', 'hw.ramSize': '2048', 'hw.lcd.width': '720',
                   'hw.lcd.height': '1280', 'hw.lcd.density': '320', 'disk.dataPartition.size': '2G',
                   'hw.keyboard': 'yes', 'hw.gpu.enabled': 'yes', 'hw.gpu.mode': 'software',
                   'hw.camera.back': 'none', 'hw.camera.front': 'none', 'showDeviceFrame': 'no'})
    config.write_text(''.join(f'{k}={v}\n' for k, v in values.items()))
    shutil.copyfile(config, EVIDENCE / 'avd-config.ini')


def repair_extraction():
    archive = LAB / 'downloads/emulator-darwin_x64-15917651.zip'
    old = LAB / 'sdk/emulator'
    preserved = LAB / 'evidence/emulator-extraction-attempt1'
    assert old.is_dir() and not preserved.exists()
    # Preserve the failed extraction. ditto restores Google's AppleDouble signing
    # metadata; it does not remove quarantine, re-sign or change publisher bytes.
    with zipfile.ZipFile(archive) as z:
        for item in z.infolist():
            path = pathlib.PurePosixPath(item.filename)
            assert path.parts[0] == 'emulator' and '..' not in path.parts and not path.is_absolute()
    old.rename(preserved)
    run('extract-appledouble', ['/usr/bin/ditto', '-x', '-k', '--rsrc', '--extattr', str(archive), str(LAB / 'sdk')], timeout=180)
    run('appledouble-restored', ['/usr/bin/xattr', str(LAB / 'sdk/emulator/NOTICE.csv')])


def boot():
    guard()
    assert not lab_processes(), 'previous lab processes still running'
    for port in [5037, 5554, 5555]:
        with socket.socket() as s:
            s.bind(('127.0.0.1', port))
    run('signature-before-boot', ['/usr/bin/codesign', '--verify', '--deep', '--strict', '--verbose=4',
                                  '-R=notarized', '--check-notarization', str(LAB / 'sdk/emulator/emulator')])
    adb = str(LAB / 'sdk/platform-tools/adb')
    emulator = str(LAB / 'sdk/emulator/emulator')
    folder = EVIDENCE / f'boot-{len(STATE["commands"]):03}'
    folder.mkdir()
    streams = []
    processes = []
    errors = []
    samples = []
    stopped = threading.Event()
    started = time.monotonic()
    launch_epoch = time.time()
    hardware = LAB / 'avd/kidea-r05-api36-x64-r1.avd/hardware-qemu.ini'

    def spawn(name, args):
        out = (folder / f'{name}.stdout.log').open('wb')
        err = (folder / f'{name}.stderr.log').open('wb')
        streams.extend([out, err])
        p = subprocess.Popen(args, cwd=LAB, env=env(), stdin=subprocess.DEVNULL,
                             stdout=out, stderr=err, start_new_session=True)
        processes.append((name, p))
        STATE.setdefault('bootProcesses', []).append({'name': name, 'pid': p.pid, 'args': args, 'at': now()})
        save()
        return p

    def monitor():
        try:
            while not stopped.wait(0.5):
                guard()
                owned = lab_processes()  # Includes reparented crashpad helpers.
                rss = sum(p['rssBytes'] for p in owned)
                samples.append({'seconds': round(time.monotonic() - started, 2), 'rssBytes': rss})
                assert rss <= 4 * GIB, 'lab process RSS exceeds4GiB'
                if hardware.exists() and hardware.stat().st_mtime >= launch_epoch:
                    validate_guest_config(hardware.read_text())
                assert time.monotonic() - started < 600, 'boot smoke timeout10minutes'
                pressure = subprocess.run(['/usr/sbin/sysctl', '-n', 'kern.memorystatus_vm_pressure_level'], capture_output=True, text=True)
                assert pressure.returncode != 0 or pressure.stdout.strip() != '4', 'critical memory pressure'
                # Detect any unexpected publicly-bound TCP listener in our process trees.
                listeners = subprocess.run(['/usr/sbin/lsof', '-nP', '-a', '-p', ','.join(str(p['pid']) for p in owned),
                                            '-iTCP', '-sTCP:LISTEN'], capture_output=True, text=True)
                for line in listeners.stdout.splitlines()[1:]:
                    if '(LISTEN)' in line:
                        assert '127.0.0.1:' in line or '[::1]:' in line, 'non-loopback listener: ' + line
        except BaseException as error:
            errors.append(repr(error))
            for _, p in processes:
                if p.poll() is None:
                    os.killpg(p.pid, signal.SIGTERM)

    watcher = threading.Thread(target=monitor, daemon=True)
    try:
        server = spawn('adb-server', [adb, '-L', 'tcp:5037', '--one-device', 'emulator-5554', 'server', 'nodaemon'])
        watcher.start()
        time.sleep(1)
        assert server.poll() is None
        qemu = spawn('emulator', [emulator, '-avd', 'kidea-r05-api36-x64-r1', '-ports', '5554,5555',
                                  '-no-window', '-no-audio', '-no-boot-anim', '-no-snapshot', '-no-metrics',
                                  '-gpu', 'host', '-memory', '2048', '-cores', '2', '-lowram'])
        serial = 'emulator-5554'
        ready = False
        for index in range(120):
            assert not errors, errors
            assert qemu.poll() is None, f'emulator exited {qemu.poll()}'
            result = run(f'boot-property-{index:03}', [adb, '-s', serial, 'shell', 'getprop', 'sys.boot_completed'], timeout=15, allowed=(0, 1))
            if result.strip() == '1':
                ready = True
                break
            time.sleep(2)
        assert ready and not errors, 'boot did not complete'
        validate_guest_config(hardware.read_text())
        api = run('guest-api', [adb, '-s', serial, 'shell', 'getprop', 'ro.build.version.sdk']).strip()
        abi = run('guest-abi', [adb, '-s', serial, 'shell', 'getprop', 'ro.product.cpu.abi']).strip()
        assert api == '36' and abi == 'x86_64', (api, abi)
        run('guest-build', [adb, '-s', serial, 'shell', 'getprop', 'ro.build.fingerprint'])
        memory = run('guest-memory', [adb, '-s', serial, 'shell', 'cat', '/proc/meminfo'])
        total = int(next(line for line in memory.splitlines() if line.startswith('MemTotal:')).split()[1]) * 1024
        assert GIB <= total <= 2 * GIB, 'unexpected guest physical memory'
        cpus = run('guest-cpus', [adb, '-s', serial, 'shell', 'getconf', '_NPROCESSORS_ONLN']).strip()
        assert cpus == '2', 'unexpected guest CPU count'
        run('guest-lowram', [adb, '-s', serial, 'shell', 'getprop', 'ro.config.low_ram'])
        run('guest-packages', [adb, '-s', serial, 'shell', 'pm', 'list', 'packages'])
        run('guest-wake', [adb, '-s', serial, 'shell', 'input', 'keyevent', '224'])
        run('guest-dismiss-keyguard', [adb, '-s', serial, 'shell', 'wm', 'dismiss-keyguard'])
        run('guest-home', [adb, '-s', serial, 'shell', 'input', 'keyevent', '3'])
        time.sleep(5)
        power = run('guest-power', [adb, '-s', serial, 'shell', 'dumpsys', 'power'])
        assert 'mWakefulness=Awake' in power, 'screen is not awake'
        activity = run('guest-activity', [adb, '-s', serial, 'shell', 'dumpsys', 'activity', 'activities'])
        assert any('ResumedActivity' in line and 'launcher' in line.lower() for line in activity.splitlines()), 'launcher not resumed'
        index = len(STATE['commands'])
        run('guest-screenshot', [adb, '-s', serial, 'exec-out', 'screencap', '-p'])
        png = (EVIDENCE / f'{index:03}-guest-screenshot/stdout.log').read_bytes()
        assert png.startswith(b'\x89PNG\r\n\x1a\n')
        (EVIDENCE / 'android-home.png').write_bytes(png)
        run('listeners-booted', ['/usr/sbin/lsof', '-nP', '-iTCP', '-sTCP:LISTEN'])
        assert not errors, errors
        STATE['bootResult'] = {'status': 'PASS', 'api': api, 'abi': abi, 'serial': serial,
                               'guestMemoryBytes': total, 'guestCpus': int(cpus), 'lowramFlag': True,
                               'screenshotSha256': hashlib.sha256(png).hexdigest(), 'at': now()}
        save()
        run('emulator-shutdown', [adb, '-s', serial, 'emu', 'kill'])
        qemu.wait(timeout=30)
    finally:
        stopped.set()
        if watcher.is_alive():
            watcher.join(5)
        for name, p in reversed(processes):
            if p.poll() is None:
                os.killpg(p.pid, signal.SIGTERM)
                try:
                    p.wait(10)
                except subprocess.TimeoutExpired:
                    os.killpg(p.pid, signal.SIGKILL)
                    p.wait()
            STATE.setdefault('bootCleanup', []).append({'name': name, 'pid': p.pid, 'exitCode': p.returncode})
        for stream in streams:
            stream.close()
        for owned in lab_processes():
            # This exclusive lab path had no processes at entry; stop only tools
            # whose current executable still matches it, never other crashpad/ADB.
            if any(p['pid'] == owned['pid'] and p['executable'] == owned['executable'] for p in lab_processes()):
                os.kill(owned['pid'], signal.SIGTERM)
        time.sleep(1)
        STATE['remainingLabProcesses'] = lab_processes()
        (folder / 'resource-samples.json').write_text(json.dumps({'samples': samples, 'monitorErrors': errors}, indent=2) + '\n')
        if hardware.exists():
            shutil.copyfile(hardware, folder / 'hardware-qemu.ini')
        STATE['maxBootRssBytes'] = max((s['rssBytes'] for s in samples), default=0)
        STATE['finalFreeBytes'] = shutil.disk_usage(ROOT).free
        STATE['elapsedSeconds'] = time.time() - STATE['startEpoch']
        save()
    assert not errors, errors
    assert not STATE['remainingLabProcesses'], 'owned processes remain after cleanup'
    run('listeners-after', ['/usr/sbin/lsof', '-nP', '-iTCP', '-sTCP:LISTEN'])


if __name__ == '__main__':
    assert len(sys.argv) == 2 and sys.argv[1] in ['init', 'fetch', 'probe', 'avd', 'repair-extraction', 'boot']
    LOCK.parent.mkdir(parents=True, exist_ok=True)
    LOCK.mkdir()
    (LOCK / 'owner.json').write_text(json.dumps({'pid': os.getpid(), 'at': now(), 'action': 'A-SIM-BOOT-r1'}))
    try:
        if sys.argv[1] == 'init':
            init()
        else:
            STATE = json.loads((EVIDENCE / 'state.json').read_text())
        active = subprocess.check_output(['/Applications/Docker.app/Contents/Resources/bin/docker', 'ps', '-q'], text=True).strip()
        assert not active, 'Docker workload active'
        guard()
        if sys.argv[1] == 'fetch':
            fetch_extract()
        elif sys.argv[1] == 'probe':
            probe()
        elif sys.argv[1] == 'avd':
            avd()
        elif sys.argv[1] == 'repair-extraction':
            repair_extraction()
        elif sys.argv[1] == 'boot':
            boot()
        STATE['lastStage'] = sys.argv[1]
        STATE['lastStageStatus'] = 'PASS'
        save()
    except BaseException as error:
        if STATE is not None:
            STATE.setdefault('failures', []).append({'at': now(), 'stage': sys.argv[1], 'error': repr(error)})
            STATE['lastStageStatus'] = 'FAIL'
            save()
        raise
    finally:
        (LOCK / 'owner.json').unlink()
        LOCK.rmdir()

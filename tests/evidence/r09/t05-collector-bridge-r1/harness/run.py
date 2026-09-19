"""CREATE-only actual collector -> private TLS -> observer -> Chrome proof."""
from pathlib import Path
import datetime
import hashlib
import json
import os
import shutil
import subprocess
import threading
import time
import traceback
import uuid

root = Path(__file__).resolve().parents[3]
pilot = root.parent / "kidea-workshop-pilot"
plan = Path(__file__).parent
authority = json.loads((root / "tests/evidence/r09/full-scope/authorization.json").read_text())
build = Path(os.environ["KIDEA_COLLECTOR_BUILD_RUN"]).resolve()
build_result = json.loads((build / "results.json").read_text())
assert build_result["state"] == "EVIDENCE_READY_WITH_TSAN_LIMITATION_REVIEW_REQUIRED"
assert len(build_result["results"]) == 4 and all(item["code"] == 0 and item["reason"] is None for item in build_result["results"])
backend = build / "release/artifacts/workshop_backend"
assert backend.is_file()

toolchain_image = "sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92"
browser_image = "sha256:bc6ab0d6d44ff4826e4cb8c1e6d801e185bfc42bb0753f8e2a30efc70db054c7"
tools = root / ".test-output/r08-delivery-inputs-r1"
node = tools / "node"
certutil = tools / "certutil"
caddy = tools / "caddy"
run_id = "r09-collector-" + str(uuid.uuid4())
work = root / ".test-output" / run_id
work.mkdir(mode=0o700)
for name in ["config", "backend-config", "caddy-config", "browser-config", "app", "observer", "state", "browser", "control", "logs"]:
    (work / name).mkdir(mode=0o700)
(work / "state/private").mkdir(mode=0o700)

started = time.monotonic()
owned = []
network = False
serial = 0
error = None
controller = None
closed = threading.Event()
control_errors = []


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write(path, value, mode=0o600):
    path = Path(path)
    temp = path.with_name(path.name + ".tmp")
    temp.write_text(json.dumps(value))
    temp.chmod(mode)
    temp.replace(path)


def budget():
    deltas = {}
    for path, baseline in authority["baselineAllocatedBytes"].items():
        allocated = int(subprocess.check_output(["/usr/bin/du", "-sk", path], text=True, timeout=30).split()[0]) * 1024
        deltas[path] = max(0, allocated - baseline)
    stats = os.statvfs(root)
    free = stats.f_bavail * stats.f_frsize
    assert sum(deltas.values()) + 128 * 1024**2 < authority["cumulativeNewDiskLimitBytes"], "CUMULATIVE_DISK_LIMIT"
    assert free >= authority["minimumFreeBytes"], "FREE_DISK_LIMIT"
    assert time.monotonic() - started < 600, "INTEGRATION_DEADLINE"
    return {"deltas": deltas, "newBytes": sum(deltas.values()), "freeBytes": free, "sameBaseline": True}


def command(args, timeout=60, check=True, log=True):
    global serial
    result = subprocess.run(list(map(str, args)), capture_output=True, timeout=timeout)
    if log:
        serial += 1
        (work / "logs" / f"{serial:03d}.json").write_text(json.dumps({
            "command": list(map(str, args)),
            "exit": result.returncode,
            "stdout": result.stdout.decode(errors="replace"),
            "stderr": result.stderr.decode(errors="replace"),
        }, indent=2) + "\n")
    if check:
        assert result.returncode == 0, (args, result.stderr.decode(errors="replace"))
    return result.stdout.decode().strip()


def create(role, image, args, mounts, entrypoint="timeout", env=None):
    name = f"{run_id}-{role}"
    docker_args = [
        "docker", "create", "--pull=never", "--name", name,
        "--label", f"kidea.r09.owner={run_id}", "--network", run_id,
        "--network-alias", f"{role}.test", "--user", f"{os.getuid()}:{os.getgid()}",
        "--cpus", "1", "--memory", "2g", "--memory-swap", "2g", "--pids-limit", "256",
        "--read-only", "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
        "--tmpfs", "/tmp:rw,nosuid,size=256m", "--shm-size", "256m",
        "--log-opt", "max-size=4m", "--log-opt", "max-file=2",
    ]
    for source, target, writable in mounts:
        docker_args += ["--mount", f"type=bind,src={source},dst={target}" + ("" if writable else ",readonly")]
    for key, value in (env or {}).items():
        docker_args += ["-e", f"{key}={value}"]
    docker_args += ["--entrypoint", entrypoint, image]
    if entrypoint == "timeout":
        docker_args += ["--signal=TERM", "--kill-after=35", "540"]
    docker_args += args
    command(docker_args)
    owned.append((role, name))
    command(["docker", "start", name])
    return name


try:
    assert os.getuid() != 0
    before = budget()
    assert command(["docker", "ps", "-q"]) == "", "OTHER_ACTIVE_WORKLOAD"
    for image in [toolchain_image, browser_image]:
        assert command(["docker", "image", "inspect", image, "--format", "{{.Id}}"]) == image
    openssl = shutil.which("openssl")
    assert openssl and Path(openssl).is_absolute()
    command([
        openssl, "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1",
        "-subj", "/CN=collector-integration",
        "-addext", "subjectAltName=DNS:source.test,DNS:observer.test,DNS:localhost,IP:127.0.0.1",
        "-keyout", work / "config/key.pem", "-out", work / "config/cert.pem",
    ])
    (work / "config/key.pem").chmod(0o600)
    (work / "config/cert.pem").chmod(0o600)
    for directory in ["caddy-config", "browser-config"]:
        shutil.copy2(work / "config/cert.pem", work / directory / "cert.pem")
        (work / directory / "cert.pem").chmod(0o600)
    shutil.copy2(work / "config/key.pem", work / "caddy-config/key.pem")
    (work / "caddy-config/key.pem").chmod(0o600)
    (work / "backend-config/collector-token").write_text("CollectorIntegrationToken_0123456789_ABCDEF")
    (work / "backend-config/collector-token").chmod(0o600)
    write(work / "config/headers.json", {"authorization": "Bearer CollectorIntegrationToken_0123456789_ABCDEF"})
    now = int(time.time() * 1000)
    model = {
        "run": {"id": "collector-" + run_id[-36:], "operator": "SyntheticFixtureOperator", "confirmed": True, "startMs": now, "endMs": now + 540000},
        "sources": {
            "fast": {"id": "backend_fast", "clock": {"offsetMs": 0, "uncertaintyMs": 0, "measuredAtMs": now, "validForMs": 540000}},
            "slow": {"id": "backend_slow", "clock": {"offsetMs": 0, "uncertaintyMs": 0, "measuredAtMs": now, "validForMs": 540000}},
        },
        "storageTargets": ["data", "logs", "backup", "temp"],
        "topology": {"independentHostVerified": False, "receiverVerified": False},
    }
    write(work / "config/sessions.json", [
        {"token": "A" * 48, "role": "admin", "expiresAtMs": now + 540000},
        {"token": "P" * 48, "role": "participant", "expiresAtMs": now + 540000},
    ])
    write(work / "config/observer.json", {
        "model": model,
        "stateDirectory": "/state/private",
        "sessionsFile": "/config/sessions.json",
        "keyFile": "/config/key.pem",
        "certFile": "/config/cert.pem",
        "caFile": "/config/cert.pem",
        "port": 8443,
        "bind": "0.0.0.0",
        "targets": {
            "fast": {"url": "https://source.test:8444/internal/observer/sample/fast", "headersFile": "/config/headers.json"},
            "slow": {"url": "https://source.test:8444/internal/observer/sample/slow", "headersFile": "/config/headers.json"},
            "application": {"url": "https://source.test:8444/internal/observer/probe/application", "headersFile": "/config/headers.json"},
            "dashboard": {"url": "https://source.test:8444/internal/observer/probe/dashboard", "headersFile": "/config/headers.json"},
        },
    })
    (work / "caddy-config/Caddyfile").write_text("""{
  admin off
  auto_https off
}
https://source.test:8444 {
  tls /configfiles/cert.pem /configfiles/key.pem
  handle /internal/observer/probe/dashboard {
    header Content-Type application/json
    respond `{"schema":1,"component":"dashboard","status":"READ_READY"}` 200
  }
  handle {
    reverse_proxy backend.test:8080
  }
}
""")
    source_files = {}
    for directory in [pilot / "observer", plan]:
        for path in sorted(directory.rglob("*")):
            if path.is_file() and "node_modules" not in path.parts and "__pycache__" not in path.parts:
                source_files[str(path)] = sha(path)
    for path in [backend, build / "manifest.json", build / "results.json", pilot / "backend/schema/001.sql", pilot / "tests/t02/seed.json", node, certutil, caddy]:
        source_files[str(path)] = sha(path)
    manifest = {
        "runId": run_id,
        "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "sourceFiles": source_files,
        "images": [toolchain_image, browser_image],
        "uid": os.getuid(), "gid": os.getgid(),
        "perContainerCPU": 1, "perContainerMemoryBytes": 2 * 1024**3,
        "publishedHostPorts": [], "maxAttemptSeconds": 600, "containerDeadlineSeconds": 540,
        "buildRun": str(build), "buildResult": build_result,
        "budgetBefore": before,
        "scope": "Actual C++ collector through private Caddy TLS into observer and Chrome on one Docker/Mac. Dashboard is a declared fixed fixture. No independent host, backup, WQ, Human oncall, admission, release, Apple Silicon or Windows claim.",
        "clockBasis": "Backend, observer and browser share one Docker Linux kernel clock; this is not cross-host calibration or E1.",
        "fakeCredentialsOnly": True,
    }
    write(work / "manifest.json", manifest)
    write(work / "frozen-manifest-sha.json", {"sha256": sha(work / "manifest.json")})
    command(["docker", "network", "create", "--internal", "--label", f"kidea.r09.owner={run_id}", run_id])
    network = True
    common_tool = [(node, "/opt/node/bin/node", False)]
    backend_name = create("backend", toolchain_image, ["node", "/plan/backend-manager.mjs"], [
        (plan, "/plan", False), (backend, "/backend", False),
        (pilot / "backend/schema/001.sql", "/fixture/001.sql", False),
        (pilot / "tests/t02/seed.json", "/fixture/seed.json", False),
        (work / "backend-config", "/config", False), (work / "control", "/control", False),
        (work / "app", "/out", True), *common_tool,
    ], env={"PATH": "/opt/node/bin:/usr/local/bin:/usr/bin:/bin"})
    for _ in range(150):
        if (work / "app/backend-ready.json").exists():
            break
        time.sleep(0.1)
    else:
        raise RuntimeError("BACKEND_START_TIMEOUT")
    caddy_name = create("source", toolchain_image, ["caddy", "run", "--config", "/configfiles/Caddyfile", "--adapter", "caddyfile"], [
        (work / "caddy-config", "/configfiles", False), (caddy, "/opt/caddy/bin/caddy", False),
    ], env={"PATH": "/opt/caddy/bin:/usr/local/bin:/usr/bin:/bin", "XDG_CONFIG_HOME": "/tmp/config", "XDG_DATA_HOME": "/tmp/data"})
    observer_name = create("observer", toolchain_image, ["node", "/observer/src/main.mjs", "/config/observer.json"], [
        (plan, "/plan", False), (pilot / "observer", "/observer", False),
        (work / "config", "/config", False), (work / "state", "/state", True),
        (work / "observer", "/out", True), *common_tool,
    ], env={"PATH": "/opt/node/bin:/usr/local/bin:/usr/bin:/bin"})
    tls_ok = False
    for _ in range(30):
        probe = command(["docker", "exec", "-e", "NODE_EXTRA_CA_CERTS=/config/cert.pem", observer_name, "node", "/plan/tls-probe.mjs"], timeout=10, check=False)
        if (work / "observer/raw-tls-sample.json").exists():
            tls_ok = True
            break
        time.sleep(0.2)
    assert tls_ok, "TLS_PROBE_TIMEOUT"

    def control_loop():
        last = 0
        backend_generation = 0
        while not closed.wait(0.05):
            request_file = work / "browser/control-request.json"
            if not request_file.exists():
                continue
            try:
                try:
                    request = json.loads(request_file.read_text())
                except json.JSONDecodeError:
                    continue
                if request["id"] <= last:
                    continue
                assert request["id"] == last + 1 and set(request) == {"id", "action", "atMs"}
                action = request["action"]
                detail = {}
                if action in ["RESTART_BACKEND", "STOP_BACKEND"]:
                    backend_generation += 1
                    write(work / "control/backend.json", {"generation": backend_generation, "action": "RESTART" if action == "RESTART_BACKEND" else "STOP"})
                    result_file = work / f"app/control-{backend_generation}.json"
                    for _ in range(200):
                        if result_file.exists():
                            break
                        time.sleep(0.1)
                    else:
                        raise RuntimeError("BACKEND_CONTROL_TIMEOUT")
                    detail = json.loads(result_file.read_text())
                elif action == "REVOKE_ADMIN":
                    write(work / "config/sessions.json", [])
                else:
                    raise RuntimeError("CONTROL_ACTION")
                write(work / "browser" / f"control-result-{request['id']}.json", {**detail, "id": request["id"], "action": action, "status": "DONE", "atMs": int(time.time() * 1000)})
                last = request["id"]
            except Exception:
                control_errors.append(traceback.format_exc())
                closed.set()

    controller = threading.Thread(target=control_loop)
    controller.start()
    browser_name = create("browser", browser_image, ["sh", "/plan/browser-bootstrap.sh"], [
        (plan, "/plan", False), (pilot / "web", "/web", False),
        (work / "browser-config", "/config", False), (work / "browser", "/out", True),
        (work / "app", "/backend-out", False), (node, "/opt/node/bin/node", False),
        (certutil, "/usr/local/bin/certutil", False),
    ], env={"PATH": "/opt/node/bin:/usr/local/bin:/usr/bin:/bin"})
    assert command(["docker", "wait", browser_name], timeout=180) == "0", "BROWSER_EXIT"
    assert not control_errors, control_errors
    browser_result = json.loads((work / "browser/result.json").read_text())
    assert browser_result["status"] == "PASS"
    for path, expected in source_files.items():
        assert sha(path) == expected, path
    after = budget()
    write(work / "budget-final.json", after)
except Exception:
    error = traceback.format_exc()
finally:
    closed.set()
    if controller:
        controller.join(timeout=20)
    for role, name in reversed(owned):
        try:
            info = json.loads(command(["docker", "inspect", name]))[0]
            assert info["Config"]["Labels"]["kidea.r09.owner"] == run_id
            if info["State"]["Running"]:
                command(["docker", "stop", "--time=35", name])
            (work / "logs" / f"{role}.txt").write_text(command(["docker", "logs", name]))
            write(work / "logs" / f"{role}-state.json", info)
            command(["docker", "rm", name])
        except Exception:
            error = (error or "") + "\nCLEANUP " + traceback.format_exc()
    if network:
        try:
            command(["docker", "network", "rm", run_id])
        except Exception:
            error = (error or "") + "\nNETWORK " + traceback.format_exc()
    write(work / "result.json", {
        "status": "FAIL" if error else "PASS",
        "runId": run_id,
        "manifestHash": sha(work / "manifest.json") if (work / "manifest.json").exists() else None,
        "elapsedSeconds": time.monotonic() - started,
        "error": error,
        "controlErrors": control_errors,
        "noProductAcceptance": True,
    })
    print(work, flush=True)
    if error:
        print(error, flush=True)

if error:
    raise SystemExit(1)

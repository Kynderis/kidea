import hashlib
import json
import os
import platform
import socket
import sqlite3
import stat
import sys
import urllib.request
from pathlib import Path

snapshot = Path(sys.argv[1]).resolve()
expected_sha = sys.argv[2]
watermark = sys.argv[3]
created_at_ms = int(sys.argv[4])
receipt_path = Path(sys.argv[5]).resolve()
status = os.lstat(snapshot)
if stat.S_ISLNK(status.st_mode) or not stat.S_ISREG(status.st_mode):
    raise SystemExit("SNAPSHOT_NOT_REGULAR")
if status.st_uid != os.geteuid() or stat.S_IMODE(status.st_mode) != 0o600:
    raise SystemExit("SNAPSHOT_NOT_PRIVATE_OR_OWNED")
sha = hashlib.sha256(snapshot.read_bytes()).hexdigest()
if sha != expected_sha:
    raise SystemExit("SNAPSHOT_HASH_MISMATCH")
uri = "file:" + str(snapshot) + "?mode=ro&immutable=1"
connection = sqlite3.connect(uri, uri=True)
try:
    quick = [row[0] for row in connection.execute("PRAGMA quick_check")]
    if quick != ["ok"]:
        raise SystemExit("SNAPSHOT_QUICK_CHECK_FAILED")
    journal_mode = connection.execute("PRAGMA journal_mode").fetchone()[0]
    row = connection.execute(
        "SELECT created_at_ms,(SELECT value FROM metadata WHERE key='epoch') "
        "FROM backup_watermarks WHERE id=?", (watermark,)
    ).fetchone()
    if row is None or int(row[0]) != created_at_ms or not row[1]:
        raise SystemExit("SNAPSHOT_WATERMARK_MISMATCH")
    epoch = row[1]
finally:
    connection.close()
file_fd = os.open(snapshot, os.O_RDONLY | os.O_CLOEXEC)
try:
    os.fsync(file_fd)
finally:
    os.close(file_fd)
dir_fd = os.open(snapshot.parent, os.O_RDONLY | os.O_DIRECTORY | os.O_CLOEXEC)
try:
    os.fsync(dir_fd)
finally:
    os.close(dir_fd)

def metadata(path):
    request = urllib.request.Request(
        "http://metadata.google.internal/computeMetadata/v1/" + path,
        headers={"Metadata-Flavor": "Google"},
    )
    with urllib.request.urlopen(request, timeout=3) as response:
        return response.read().decode("utf-8")

receipt = {
    "schema": 1,
    "state": "INDEPENDENT_HOST_SNAPSHOT_VERIFIED",
    "sha256": sha,
    "bytes": status.st_size,
    "mode": oct(stat.S_IMODE(status.st_mode)),
    "watermark": watermark,
    "createdAtMs": created_at_ms,
    "epoch": epoch,
    "quickCheck": quick,
    "journalMode": journal_mode,
    "immutableRead": True,
    "fileFsync": True,
    "directoryFsync": True,
    "receiver": {
        "hostname": socket.gethostname(),
        "bootId": Path("/proc/sys/kernel/random/boot_id").read_text().strip(),
        "projectId": metadata("project/project-id"),
        "instanceId": metadata("instance/id"),
        "zone": metadata("instance/zone").rsplit("/", 1)[-1],
        "architecture": platform.machine(),
        "kernel": platform.release(),
        "uid": os.geteuid(),
    },
    "labRecoveryPointEligible": True,
    "productionRecoveryPointEligible": False,
    "limitation": "One authenticated lab transfer and verification; scheduling, retention, restore and production operations are not proven.",
}
receipt_path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
temporary = receipt_path.with_suffix(receipt_path.suffix + ".partial")
with open(temporary, "x", encoding="utf-8") as output:
    os.chmod(temporary, 0o600)
    json.dump(receipt, output, indent=2, sort_keys=True)
    output.write("\n")
    output.flush()
    os.fsync(output.fileno())
os.replace(temporary, receipt_path)
dir_fd = os.open(receipt_path.parent, os.O_RDONLY | os.O_DIRECTORY | os.O_CLOEXEC)
try:
    os.fsync(dir_fd)
finally:
    os.close(dir_fd)
print(json.dumps(receipt, sort_keys=True))

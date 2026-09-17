"""R05 N08 preparation: validate a supplied run index, not certify its producer.

Expected context and required case IDs come from a separately frozen manifest.
Raw evidence is hashed; runtime truth still requires the device-side collector.
"""
import hashlib
from pathlib import Path
import re

CONTEXT = ('sourceSha256', 'configSha256', 'dependencySha256', 'artifactSha256',
           'runtime', 'abi', 'variant', 'toolchain')


def validate(index, expected, required, evidence_root):
    errors = []
    root = Path(evidence_root).resolve()
    if not required or len(set(required)) != len(required):
        return ['invalid required case inventory']
    for field in CONTEXT:
        value = expected.get(field)
        if not isinstance(value, str) or not value:
            errors.append('missing expected ' + field)
        elif field.endswith('Sha256') and not re.fullmatch(r'[0-9a-f]{64}', value):
            errors.append('invalid expected hash ' + field)
        if index.get('context', {}).get(field) != value:
            errors.append('context mismatch ' + field)
    records = index.get('cases', [])
    if not isinstance(records, list):
        return errors + ['cases is not a list']
    ids = [r.get('id') for r in records if isinstance(r, dict)]
    if len(ids) != len(records) or sorted(map(str, ids)) != sorted(required):
        errors.append('case inventory mismatch or duplicate')
    for record in records:
        if not isinstance(record, dict):
            continue
        name = str(record.get('id'))
        if record.get('status') != 'PASS' or type(record.get('exitCode')) is not int or record['exitCode'] != 0:
            errors.append(name + ': incomplete or failed positive')
        if record.get('skipped') != 0 or type(record.get('skipped')) is not int:
            errors.append(name + ': skipped or missing count')
        files = record.get('evidence', [])
        if not isinstance(files, list) or not files:
            errors.append(name + ': missing raw evidence')
            continue
        for item in files:
            try:
                relative = Path(item['path'])
                if relative.is_absolute() or '..' in relative.parts:
                    raise ValueError('unsafe path')
                target = (root / relative).resolve(strict=True)
                if not target.is_relative_to(root) or not target.is_file():
                    raise ValueError('evidence outside root')
                if hashlib.sha256(target.read_bytes()).hexdigest() != item['sha256']:
                    raise ValueError('evidence hash mismatch')
            except (KeyError, TypeError, ValueError, OSError) as error:
                errors.append(name + ': invalid raw evidence: ' + str(error))
    return errors


def detected_mutant(result, expected_oracle):
    """A compiler/tool failure cannot stand in for the intended failing assertion."""
    return (bool(expected_oracle) and result.get('buildStatus') == 'PASS'
            and result.get('testStatus') == 'FAIL'
            and result.get('failureKind') == 'ASSERTION'
            and result.get('failedOracles') == [expected_oracle]
            and type(result.get('skipped')) is int and result['skipped'] == 0)

import copy
import hashlib
import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('gate', Path(__file__).with_name('native-evidence-gate.py'))
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


class GateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'raw.txt').write_text('synthetic assertion output\n')
        self.context = {key: 'a' * 64 if key.endswith('Sha256') else 'fixed-' + key
                        for key in gate.CONTEXT}
        self.index = dict(context=copy.deepcopy(self.context), cases=[dict(
            id='N02-lifecycle', status='PASS', exitCode=0, skipped=0,
            evidence=[dict(path='raw.txt', sha256=hashlib.sha256((self.root / 'raw.txt').read_bytes()).hexdigest())])])

    def check(self):
        return gate.validate(self.index, self.context, ['N02-lifecycle'], self.root)

    def test_exact_record(self):
        self.assertEqual(self.check(), [])

    def test_every_context_dimension(self):
        for field in gate.CONTEXT:
            with self.subTest(field=field):
                previous = self.index['context'][field]
                self.index['context'][field] = 'different'
                self.assertTrue(self.check())
                self.index['context'][field] = previous

    def test_missing_tool_or_skip_or_fail(self):
        for status in ['NOT_RUN', 'BLOCKED_TOOL', 'SKIP', 'FAIL']:
            self.index['cases'][0]['status'] = status
            self.assertTrue(self.check())

    def test_skipped_count(self):
        self.index['cases'][0]['skipped'] = 1
        self.assertTrue(self.check())

    def test_nonzero_exit(self):
        self.index['cases'][0]['exitCode'] = 1
        self.assertTrue(self.check())

    def test_missing_case(self):
        self.index['cases'] = []
        self.assertTrue(self.check())

    def test_duplicate_case(self):
        self.index['cases'] *= 2
        self.assertTrue(self.check())

    def test_tampered_evidence(self):
        (self.root / 'raw.txt').write_text('different output')
        self.assertTrue(self.check())

    def test_missing_evidence(self):
        self.index['cases'][0]['evidence'] = []
        self.assertTrue(self.check())

    def test_path_escape(self):
        self.index['cases'][0]['evidence'][0]['path'] = '../raw.txt'
        self.assertTrue(self.check())

    def test_missing_expected_context(self):
        self.context.pop('runtime')
        self.assertTrue(self.check())

    def test_mutant_oracle(self):
        result = dict(buildStatus='PASS', testStatus='FAIL', failureKind='ASSERTION',
                      failedOracles=['old_actor_rejected'], skipped=0)
        self.assertTrue(gate.detected_mutant(result, 'old_actor_rejected'))
        for field, value in [('buildStatus', 'FAIL'), ('failureKind', 'COMPILE'),
                             ('testStatus', 'NOT_RUN'), ('skipped', 1),
                             ('failedOracles', ['unrelated_failure'])]:
            bad = dict(result, **{field: value})
            self.assertFalse(gate.detected_mutant(bad, 'old_actor_rejected'))


if __name__ == '__main__':
    unittest.main(verbosity=2)

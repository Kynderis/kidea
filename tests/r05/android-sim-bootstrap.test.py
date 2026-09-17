"""Negative resource guards; no tools, network or guest are launched."""
import importlib.util
import pathlib
import types
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('bootstrap', pathlib.Path(__file__).with_name('android-sim-bootstrap.py'))
boot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(boot)


class Guards(unittest.TestCase):
    def setUp(self):
        boot.STATE = {'deadlineEpoch': 200, 'downloadBytes': boot.GIB,
                      'startFreeBytes': 205 * boot.GIB, 'e2FreeBytes': 225 * boot.GIB}
        self.free = patch.object(boot.shutil, 'disk_usage', return_value=types.SimpleNamespace(free=200 * boot.GIB))
        self.clock = patch.object(boot.time, 'time', return_value=100)
        self.free.start()
        self.clock.start()
        self.addCleanup(self.free.stop)
        self.addCleanup(self.clock.stop)

    def test_valid_budget(self):
        boot.guard()

    def test_expired_deadline(self):
        boot.STATE['deadlineEpoch'] = 100
        with self.assertRaisesRegex(AssertionError, 'deadline'):
            boot.guard()

    def test_download_overrun(self):
        boot.STATE['downloadBytes'] = 2 * boot.GIB + 1
        with self.assertRaisesRegex(AssertionError, 'download'):
            boot.guard()

    def test_additional_disk_overrun(self):
        boot.STATE['startFreeBytes'] = 213 * boot.GIB
        with self.assertRaisesRegex(AssertionError, 'additional disk'):
            boot.guard()

    def test_cumulative_disk_overrun(self):
        boot.STATE['e2FreeBytes'] = 248 * boot.GIB
        with self.assertRaisesRegex(AssertionError, 'cumulative disk'):
            boot.guard()

    def test_free_disk_floor(self):
        with patch.object(boot.shutil, 'disk_usage', return_value=types.SimpleNamespace(free=99 * boot.GIB)):
            with self.assertRaisesRegex(AssertionError, 'floor'):
                boot.guard()

    def test_guest_auto_increase_with_real_ini_spacing(self):
        with self.assertRaisesRegex(AssertionError, 'guest RAM'):
            boot.validate_guest_config('hw.ramSize = 2560\nhw.cpu.ncore = 2\n')

    def test_guest_cpu_increase(self):
        with self.assertRaisesRegex(AssertionError, 'CPU'):
            boot.validate_guest_config('hw.ramSize = 2048\nhw.cpu.ncore = 4\n')

    def test_guest_missing_values_fail_closed(self):
        with self.assertRaises(KeyError):
            boot.validate_guest_config('hw.cpu.ncore = 2\n')

    def test_guest_expected_values(self):
        boot.validate_guest_config('hw.ramSize = 2048\nhw.cpu.ncore = 2\n')


if __name__ == '__main__':
    unittest.main()

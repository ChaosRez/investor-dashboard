"""
Unit tests for ApexETF Unified Command-Line Interface (CLI).
"""

import io
import unittest
from unittest.mock import patch
import argparse

from apex_etf.cli import cmd_status, cmd_audit, cmd_optimize, cmd_stress_test, cmd_teardown, cmd_platforms

class TestCliCommands(unittest.TestCase):
    def test_cmd_status_output(self):
        with patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            args = argparse.Namespace()
            cmd_status(args)
            output = mock_stdout.getvalue()
            self.assertIn("ApexETF Dashboard", output)
            self.assertIn("tracked instruments", output)

    def test_cmd_audit_output(self):
        with patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            args = argparse.Namespace(etfs=["VWCE:70", "QDVE:30"])
            cmd_audit(args)
            output = mock_stdout.getvalue()
            self.assertIn("Quantitative Overlap Audit", output)
            self.assertIn("Weighted TER", output)

    def test_cmd_optimize_output(self):
        with patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            args = argparse.Namespace(etfs=["VWCE", "AGGU", "XEON"], method="all")
            cmd_optimize(args)
            output = mock_stdout.getvalue()
            self.assertIn("Robust Optimization Suite", output)
            self.assertIn("HRP", output)
            self.assertIn("RiskParity", output)

    def test_cmd_stress_test_output(self):
        with patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            args = argparse.Namespace(etfs=["VWCE:60", "AGGU:40"], tolerance=-20.0)
            cmd_stress_test(args)
            output = mock_stdout.getvalue()
            self.assertIn("Crisis Stress-Test", output)
            self.assertIn("Lehman", output)
            self.assertIn("2022", output)

    def test_cmd_teardown_output(self):
        with patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            args = argparse.Namespace(etfs=["VWCE:60", "AGGU:40"])
            cmd_teardown(args)
            output = mock_stdout.getvalue()
            self.assertIn("QuantStats Downside Teardown", output)
            self.assertIn("Ulcer Index", output)
            self.assertIn("Safe Withdrawal Rate", output)

    def test_cmd_platforms_output(self):
        with patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            args = argparse.Namespace()
            cmd_platforms(args)
            output = mock_stdout.getvalue()
            self.assertIn("PyPortfolioOpt", output)
            self.assertIn("Riskfolio-Lib", output)
            self.assertIn("QuantStats", output)
            self.assertIn("Portfolio Visualizer", output)
            self.assertIn("Testfol.io", output)
            self.assertIn("Portfolio Charts", output)

if __name__ == "__main__":
    unittest.main()

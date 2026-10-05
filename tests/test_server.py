"""
Unit tests for ApexETF HTTP Server and REST API Handlers
"""

import json
import threading
import time
import unittest
import urllib.request
import urllib.error
from unittest import mock

from apex_etf import sync as sync_module
from apex_etf.server import create_server

class TestServerEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Bind to port 0 to get an ephemeral OS-assigned free port
        cls.httpd = create_server(0, "127.0.0.1")
        cls.port = cls.httpd.server_address[1]
        cls.base_url = f"http://127.0.0.1:{cls.port}"
        
        cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.server_thread.start()
        time.sleep(0.1)

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def get_json(self, path: str):
        url = f"{self.base_url}{path}"
        req = urllib.request.Request(url, headers={"User-Agent": "ApexETF-Test"})
        with urllib.request.urlopen(req, timeout=3.0) as resp:
            self.assertEqual(resp.status, 200)
            return json.loads(resp.read().decode("utf-8"))

    def post_json(self, path: str, payload: dict):
        url = f"{self.base_url}{path}"
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json", "User-Agent": "ApexETF-Test"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=3.0) as resp:
            self.assertEqual(resp.status, 200)
            return json.loads(resp.read().decode("utf-8"))

    def test_get_market_status(self):
        data = self.get_json("/api/market-status")
        self.assertIn("status", data)
        self.assertEqual(data["status"], "online")
        self.assertIn("trackedEtfCount", data)
        self.assertGreaterEqual(data["trackedEtfCount"], 10)

    def test_get_all_etfs(self):
        data = self.get_json("/api/etfs")
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 10)
        tickers = [e["ticker"] for e in data]
        self.assertIn("VWCE", tickers)
        self.assertIn("IWDA", tickers)
        self.assertIn("SXR8", tickers)

    def test_get_single_etf_by_ticker(self):
        data = self.get_json("/api/etfs?ticker=VWCE")
        self.assertIsInstance(data, dict)
        self.assertEqual(data.get("ticker"), "VWCE")
        self.assertEqual(data.get("isin"), "IE00BK5BQT80")
        self.assertIn("topHoldings", data)

    def test_get_unknown_etf_404(self):
        url = f"{self.base_url}/api/etfs?ticker=NONEXISTENT_XYZ"
        req = urllib.request.Request(url)
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            urllib.request.urlopen(req)
        self.assertEqual(ctx.exception.code, 404)

    def test_get_correlations(self):
        data = self.get_json("/api/correlations")
        self.assertIsInstance(data, (dict, list))

    def test_get_news(self):
        data = self.get_json("/api/news")
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_post_overlap_calculation(self):
        payload = {"portfolio": {"VWCE": 80, "QDVE": 20}}
        data = self.post_json("/api/overlap", payload)
        self.assertIn("summary", data)
        self.assertIn("topAggregatedHoldings", data)
        self.assertEqual(data["summary"]["etfCount"], 2)

    def test_post_backtest_simulation(self):
        payload = {
            "initialDeposit": 5000,
            "monthlyDca": 300,
            "years": 5,
            "portfolio": {"VWCE": 100}
        }
        data = self.post_json("/api/portfolio/backtest", payload)
        self.assertIn("curvoMetrics", data)
        self.assertIn("results", data)
        self.assertEqual(data["results"]["totalInvested"], 5000 + 300 * 60)

    def test_get_portfolio_regimes(self):
        data = self.get_json("/api/portfolio/regimes")
        self.assertIn("taxonomy", data)
        self.assertIn("presets", data)
        self.assertIn("growth_equity", data["taxonomy"])
        self.assertIn("all_weather", data["presets"])

    def test_get_portfolio_platforms(self):
        data = self.get_json("/api/portfolio/platforms")
        self.assertIn("platforms", data)
        p_ids = [p["id"] for p in data["platforms"]]
        self.assertIn("portfoliovisualizer", p_ids)
        self.assertIn("riskfolio", p_ids)

    def test_get_portfolio_crises(self):
        data = self.get_json("/api/portfolio/crises")
        self.assertIn("crises", data)
        self.assertEqual(len(data["crises"]), 5)

    def test_post_portfolio_optimize(self):
        payload = {"tickers": ["VWCE", "AGGU", "XEON"], "method": "all"}
        data = self.post_json("/api/portfolio/optimize", payload)
        self.assertIn("methods", data)
        self.assertIn("hrp", data["methods"])
        self.assertIn("equalRiskContribution", data["methods"])
        self.assertIn("meanCvar", data["methods"])

    def test_post_portfolio_stress_test(self):
        payload = {"portfolio": {"VWCE": 70, "AGGU": 30}, "behavioralTolerance": -25.0}
        data = self.post_json("/api/portfolio/stress-test", payload)
        self.assertIn("crises", data)
        self.assertEqual(len(data["crises"]), 5)
        self.assertIn("worstHistoricalDrawdown", data)
        self.assertIn("remedyAdvice", data)

    def test_post_portfolio_teardown(self):
        payload = {"portfolio": {"VWCE": 60, "AGGU": 40}}
        data = self.post_json("/api/portfolio/teardown", payload)
        self.assertIn("metrics", data)
        self.assertIn("cagr", data["metrics"])
        self.assertIn("ulcerIndex", data["metrics"])
        self.assertIn("swr30Y", data["metrics"])

    def test_post_portfolio_code_snippets(self):
        payload = {"portfolio": {"VWCE": 60, "AGGU": 40}}
        data = self.post_json("/api/portfolio/code-snippets", payload)
        self.assertIn("pyportfolioopt", data)
        self.assertIn("riskfolio", data)
        self.assertIn("quantstats", data)

    def test_post_sync_passes_partial_results_through(self):
        partial = {"status": "partial", "quotesUpdated": 0, "warnings": ["Yahoo Finance: 21 of 21 price requests failed (HTTP 429)."]}
        with mock.patch("apex_etf.server.run_full_sync", return_value=partial), \
             mock.patch("apex_etf.server.reload_datasets"):
            self.assertEqual(self.post_json("/api/sync", {}), partial)

    def test_post_sync_error_result_is_not_a_200(self):
        # {"error": ...} used to be returned with HTTP 200, so clients checking res.ok saw "success"
        with mock.patch("apex_etf.server.run_full_sync", return_value={"error": "etfs.json not found"}), \
             mock.patch("apex_etf.server.reload_datasets"):
            req = urllib.request.Request(f"{self.base_url}/api/sync", data=b"{}", method="POST",
                                         headers={"Content-Type": "application/json"})
            with self.assertRaises(urllib.error.HTTPError) as ctx:
                urllib.request.urlopen(req, timeout=3.0)
        self.assertEqual(ctx.exception.code, 500)
        self.assertEqual(json.loads(ctx.exception.read().decode("utf-8")), {"error": "etfs.json not found"})

    def test_get_planner_dataset_and_risk(self):
        data = self.get_json("/api/planner")
        ids = [i["id"] for i in data["dataset"]["instruments"]]
        self.assertIn("CASH", ids)
        self.assertIn("AII", ids)
        self.assertIn("AII", data["risk"]["instruments"])
        self.assertTrue(data["risk"]["episodes"])

    def test_post_planner_analyze(self):
        payload = {"holdings": {"CASH": 15000, "BTC": 250}, "targets": {"AII": 1000},
                   "scenario": {"benchmarkMove": -10}, "execution": {"strategy": "tranches", "tranches": 2}}
        data = self.post_json("/api/planner/analyze", payload)
        self.assertEqual(data["total"], 15250)
        self.assertLess(data["stress"]["totals"]["beta"], 0)
        self.assertEqual(data["execution"]["summary"]["orderCount"], 2)

    def test_post_planner_analyze_explains_a_bad_request_with_400(self):
        req = urllib.request.Request(f"{self.base_url}/api/planner/analyze", method="POST",
                                     data=json.dumps({"holdings": {"CASH": 100}, "targets": {"AII": 500}}).encode(),
                                     headers={"Content-Type": "application/json"})
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            urllib.request.urlopen(req, timeout=3.0)
        self.assertEqual(ctx.exception.code, 400)
        self.assertIn("more than everything you hold", json.loads(ctx.exception.read().decode("utf-8"))["error"])

    def test_post_planner_refresh_reports_a_running_refresh_with_409(self):
        from apex_etf.planner import RiskRefreshInProgress
        with mock.patch("apex_etf.server.refresh_planner_risk", side_effect=RiskRefreshInProgress("busy")):
            req = urllib.request.Request(f"{self.base_url}/api/planner/refresh-risk", data=b"{}", method="POST",
                                         headers={"Content-Type": "application/json"})
            with self.assertRaises(urllib.error.HTTPError) as ctx:
                urllib.request.urlopen(req, timeout=3.0)
        self.assertEqual(ctx.exception.code, 409)

class TestServerStaysResponsiveDuringSync(unittest.TestCase):
    """A Live Sync takes ~15 s. On the old single-threaded server it froze every other request."""

    @classmethod
    def setUpClass(cls):
        cls.httpd = create_server(0, "127.0.0.1")
        cls.base_url = f"http://127.0.0.1:{cls.httpd.server_address[1]}"
        threading.Thread(target=cls.httpd.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def post_sync(self):
        req = urllib.request.Request(f"{self.base_url}/api/sync", data=b"{}", method="POST",
                                     headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                return resp.status, json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as err:
            return err.code, json.loads(err.read().decode("utf-8"))

    def test_requests_are_served_during_a_sync_and_a_second_sync_gets_409(self):
        started, release = threading.Event(), threading.Event()

        def slow_sync():
            started.set()
            release.wait(10)
            return {"status": "success", "quotesUpdated": 1}

        results = {}
        with mock.patch.object(sync_module, "_run_full_sync", slow_sync), \
             mock.patch("apex_etf.server.reload_datasets"):
            first = threading.Thread(target=lambda: results.update(first=self.post_sync()))
            first.start()
            try:
                self.assertTrue(started.wait(3), "the first sync never started")

                began = time.monotonic()
                with urllib.request.urlopen(f"{self.base_url}/api/market-status", timeout=3) as resp:
                    self.assertEqual(resp.status, 200)
                self.assertLess(time.monotonic() - began, 1.5, "a plain GET waited for the sync")

                status, body = self.post_sync()  # the first sync still holds the lock
                self.assertEqual(status, 409)
                self.assertEqual(body["code"], "sync_in_progress")
            finally:
                release.set()
                first.join(5)
        self.assertEqual(results["first"][0], 200)


if __name__ == "__main__":
    unittest.main()

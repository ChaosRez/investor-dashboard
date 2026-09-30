"""
Unit tests for ApexETF HTTP Server and REST API Handlers
"""

import json
import socketserver
import threading
import time
import unittest
import urllib.request
import urllib.error

from apex_etf.server import ETFHandler

class TestServerEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Bind to port 0 to get an ephemeral OS-assigned free port
        cls.httpd = socketserver.TCPServer(("127.0.0.1", 0), ETFHandler)
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

if __name__ == "__main__":
    unittest.main()

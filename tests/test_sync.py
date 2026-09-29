"""
Unit tests for ApexETF Synchronization and Configuration Module
"""

import unittest
from apex_etf.config import ETF_MARKET_MAP, WATCHLIST_TICKERS, PUBLIC_DIR, DATA_DIR
from apex_etf.macro_news import VERIFIED_MACRO_NEWS
from apex_etf.sync import fetch_json, fetch_url

class TestSyncModule(unittest.TestCase):
    def test_watchlist_tickers_configured(self):
        self.assertGreaterEqual(len(WATCHLIST_TICKERS), 10)
        # All 10 user watchlist tickers must be mapped
        for t in ["XEON", "AII", "WTAI", "BATT", "RARE", "XCS6", "IMAE", "IUSQ", "SXR8", "VHYL"]:
            self.assertIn(t, WATCHLIST_TICKERS)
            self.assertIn(t, ETF_MARKET_MAP)

    def test_market_map_structure(self):
        for ticker, meta in ETF_MARKET_MAP.items():
            self.assertIn("symbol", meta, f"Missing symbol for {ticker}")
            self.assertIn("exchange", meta, f"Missing exchange for {ticker}")
            self.assertIn("isin", meta, f"Missing isin for {ticker}")
            self.assertTrue(meta["isin"].startswith(("IE", "LU", "DE", "FR")), f"Invalid ISIN prefix for {ticker}")

    def test_macro_news_grounding(self):
        self.assertGreater(len(VERIFIED_MACRO_NEWS), 0)
        for news in VERIFIED_MACRO_NEWS:
            self.assertIn("id", news)
            self.assertIn("title", news)
            self.assertIn("source", news)
            self.assertIn("relatedEtfs", news)
            self.assertIn("retailAction", news)
            for rel in news["relatedEtfs"]:
                self.assertIn("ticker", rel)
                self.assertIn("relation", rel)

    def test_fetch_resilience_on_invalid_url(self):
        # Invalid URLs should return None safely without raising unhandled exceptions
        res_str = fetch_url("http://invalid-nonexistent-domain-xyz-12345.org", timeout=1)
        self.assertIsNone(res_str)
        res_json = fetch_json("http://invalid-nonexistent-domain-xyz-12345.org", timeout=1)
        self.assertIsNone(res_json)

if __name__ == "__main__":
    unittest.main()

"""
Unit tests for ApexETF Synchronization and Configuration Module
"""

import json
import os
import ssl
import tempfile
import unittest
import urllib.error
from datetime import datetime, timezone
from unittest import mock

from apex_etf import sync
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

def _epoch(y, m, d, h=7, mi=0, sec=0):
    return int(datetime(y, m, d, h, mi, sec, tzinfo=timezone.utc).timestamp())


def yahoo_chart(closes, trade=(2026, 10, 2, 15, 36, 10), price=171.14, chart_previous_close=169.74):
    """Trimmed v8/chart?range=5d&interval=1d payload (VWCE.DE shape): one daily bar per close."""
    days = [(2026, 9, 28), (2026, 9, 29), (2026, 9, 30), (2026, 10, 1), (2026, 10, 2)][-len(closes):]
    return {"chart": {"result": [{
        "meta": {
            "currency": "EUR", "regularMarketPrice": price, "chartPreviousClose": chart_previous_close,
            "regularMarketTime": _epoch(*trade), "fiftyTwoWeekHigh": 171.5, "fiftyTwoWeekLow": 138.24,
        },
        "timestamp": [_epoch(*d) for d in days],
        "indicators": {"quote": [{"close": closes}]},
    }]}}


class _FakeResponse:
    def __init__(self, body=b"ok"):
        self._body = body

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def read(self):
        return self._body


class TestFetching(unittest.TestCase):
    def test_requests_identify_honestly(self):
        # Yahoo answers HTTP 429 to browser-spoofing and urllib default User-Agents.
        seen = {}

        def fake_urlopen(req, timeout=None):
            seen["ua"] = req.get_header("User-agent")
            return _FakeResponse()

        with mock.patch("urllib.request.urlopen", fake_urlopen):
            self.assertEqual(fetch_url("https://example.test"), "ok")
        self.assertTrue(seen["ua"].startswith("ApexETF/"))
        self.assertNotIn("Chrome", seen["ua"])

    def test_failures_report_a_reason(self):
        cases = [
            (urllib.error.HTTPError("u", 429, "Too Many Requests", {}, None), "HTTP 429"),
            (urllib.error.URLError(ssl.SSLCertVerificationError("unable to get local issuer certificate")),
             "TLS certificate could not be verified"),
            (urllib.error.URLError(TimeoutError("timed out")), "timed out"),
            (urllib.error.URLError(ConnectionRefusedError()), "network unreachable"),
        ]
        for exc, expected in cases:
            with self.subTest(expected=expected), mock.patch("urllib.request.urlopen", side_effect=exc):
                errors = []
                self.assertIsNone(fetch_url("https://example.test", errors=errors))
                self.assertEqual(errors, [expected])

    def test_invalid_json_is_reported(self):
        errors = []
        with mock.patch("urllib.request.urlopen", return_value=_FakeResponse(b"<html>not json</html>")):
            self.assertIsNone(fetch_json("https://example.test", errors=errors))
        self.assertEqual(errors, ["invalid JSON"])


class TestDailyChange(unittest.TestCase):
    def test_uses_previous_session_close_not_range_start(self):
        # chartPreviousClose (169.74) is the close *before the 5-day range*; the real prior close is 169.38.
        payload = yahoo_chart([169.12, 169.40, 169.78, 169.38, None])
        with mock.patch.object(sync, "fetch_json", return_value=payload):
            quote = sync.sync_etf_market_data("VWCE")
        self.assertEqual(quote["previousClose"], 169.38)
        self.assertEqual(quote["dayChange"], 1.76)
        self.assertEqual(quote["dayChangePercent"], 1.04)  # not the 0.82% five-session move

    def test_ignores_todays_in_progress_bar(self):
        # While the market is open today's bar already carries a close (== the current price).
        payload = yahoo_chart([169.12, 169.40, 169.78, 169.38, 170.90], price=170.90)
        self.assertEqual(sync.previous_session_close(payload["chart"]["result"][0]), 169.38)

    def test_falls_back_to_range_level_field_without_daily_bars(self):
        result = {"meta": {"regularMarketPrice": 10.0, "chartPreviousClose": 9.5}}
        self.assertEqual(sync.previous_session_close(result), 9.5)

    def test_quote_carries_the_timestamp_name_the_dashboard_reads(self):
        with mock.patch.object(sync, "fetch_json", return_value=yahoo_chart([169.12, 169.40, 169.78, 169.38, None])):
            quote = sync.sync_etf_market_data("VWCE")
        self.assertTrue(quote["lastPriceUpdated"])
        self.assertEqual(quote["lastPriceUpdated"], quote["marketTime"])

    def test_http_429_is_reported_not_swallowed(self):
        errors = []
        with mock.patch("urllib.request.urlopen",
                        side_effect=urllib.error.HTTPError("u", 429, "Too Many Requests", {}, None)):
            self.assertIsNone(sync.sync_etf_market_data("VWCE", errors=errors))
        self.assertEqual(errors, ["HTTP 429"])


class TestJustEtfParsing(unittest.TestCase):
    CURRENT = (
        '<tr><td class="vallabel" data-testid="etf-basics_label_fund-size"> Fund size </td> '
        '<td> <div> EUR 53,011 m <span class="indicator-3"></span> </div> </td></tr>'
        '<tr><td class="vallabel" data-testid="etf-basics_label_ter"> Total expense ratio </td> '
        '<td> <div class="val" data-testid="tl_etf-basics_value_ter">0.14% p.a.</div> </td></tr>'
    )
    LEGACY = "<div>Fund size</div><div>130,706 m EUR</div><div>Total expense ratio</div><div>0.22% p.a.</div>"

    def scrape(self, html, errors=None):
        with mock.patch.object(sync, "fetch_url", return_value=html):
            return sync.scrape_justetf_fund_data("IE00BK5BQT80", errors=errors)

    def test_current_markup(self):
        self.assertEqual(self.scrape(self.CURRENT), {"aumMillionsEUR": 53011.0, "ter": 0.14})

    def test_legacy_markup_still_parses(self):
        self.assertEqual(self.scrape(self.LEGACY), {"aumMillionsEUR": 130706.0, "ter": 0.22})

    def test_unrecognised_layout_is_reported(self):
        errors = []
        self.assertIsNone(self.scrape("<html><body>cookie wall</body></html>", errors))
        self.assertEqual(errors, ["page layout not recognised"])


class TestRunFullSyncReporting(unittest.TestCase):
    """run_full_sync must say what actually refreshed instead of always claiming success."""

    QUOTE = {"livePrice": 123.45, "currency": "EUR", "previousClose": 120.0, "dayChange": 3.45,
             "dayChangePercent": 2.88, "fiftyTwoWeekHigh": 130.0, "fiftyTwoWeekLow": 100.0,
             "exchange": "XETRA (Frankfurt)", "marketTime": "2026-10-03T10:00:00+00:00",
             "lastPriceUpdated": "2026-10-03T10:00:00+00:00"}
    NEWS = [{"id": "n1", "title": "t", "isLiveStream": True}]

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.data_dir = os.path.join(self.tmp.name, "public", "data")
        os.makedirs(self.data_dir)
        os.makedirs(os.path.join(self.tmp.name, "public", "js"))
        etfs = [
            {"ticker": "VWCE", "isin": "IE00BK5BQT80", "currentPriceEUR": 100.0, "aumMillionsEUR": 1.0, "ter": 0.3},
            {"ticker": "SGLD", "isin": "IE00B579F325"},  # no Yahoo symbol configured
        ]
        with open(os.path.join(self.data_dir, "etfs.json"), "w", encoding="utf-8") as f:
            json.dump(etfs, f)
        for patcher in (
            mock.patch.object(sync, "DATA_DIR", self.data_dir),
            mock.patch.object(sync, "BASE_DIR", self.tmp.name),
            mock.patch.object(sync.time, "sleep"),
        ):
            patcher.start()
            self.addCleanup(patcher.stop)

    def run_sync(self, quote="ok", fund="ok", ecb="ok", mw="ok"):
        def quote_fn(ticker, errors=None):
            if quote == "ok":
                return dict(self.QUOTE)
            errors.append("HTTP 429")
            return None

        def fund_fn(isin, errors=None):
            if fund == "ok":
                return {"aumMillionsEUR": 2.0, "ter": 0.2}
            errors.append("page layout not recognised")
            return None

        def feed(state, reason):
            def fn(errors=None):
                if state == "ok":
                    return list(self.NEWS)
                errors.append(reason)
                return []
            return fn

        with mock.patch.object(sync, "sync_etf_market_data", quote_fn), \
             mock.patch.object(sync, "scrape_justetf_fund_data", fund_fn), \
             mock.patch.object(sync, "sync_live_ecb_news", feed(ecb, "TLS certificate could not be verified")), \
             mock.patch.object(sync, "sync_live_marketwatch_news", feed(mw, "HTTP 503")):
            return sync.run_full_sync()

    def etfs_on_disk(self):
        with open(os.path.join(self.data_dir, "etfs.json"), encoding="utf-8") as f:
            return {e["ticker"]: e for e in json.load(f)}

    def test_everything_delivered_is_success(self):
        result = self.run_sync()
        self.assertEqual(result["status"], "success")
        self.assertEqual(result["warnings"], [])
        self.assertEqual(result["quotesUpdated"], 1)
        self.assertEqual(result["quotesSkipped"], ["SGLD"])  # unmapped is not a failure
        self.assertEqual(result["fundDataUpdated"], 2)
        self.assertEqual(result["newsSources"], {"ecb": 1, "marketwatch": 1})
        self.assertEqual(len(result["sources"]), 4)
        saved = self.etfs_on_disk()["VWCE"]
        self.assertEqual(saved["currentPriceEUR"], 123.45)
        self.assertEqual(saved["aumMillionsEUR"], 2.0)
        self.assertTrue(os.path.exists(os.path.join(self.tmp.name, "public", "js", "data-store.js")))

    def test_rejected_quotes_are_not_reported_as_synced(self):
        result = self.run_sync(quote="fail")
        self.assertEqual(result["status"], "partial")
        self.assertEqual(result["etfsSynced"], 2)  # legacy field: ETFs processed
        self.assertEqual(result["quotesUpdated"], 0)
        self.assertEqual(result["quotesFailed"], ["VWCE"])
        self.assertIn("Yahoo Finance: 1 of 1 price requests failed (HTTP 429).", result["warnings"])
        self.assertNotIn("Yahoo", " ".join(result["sources"]))
        self.assertFalse(next(d for d in result["details"] if d["ticker"] == "VWCE")["quoteUpdated"])
        self.assertEqual(self.etfs_on_disk()["VWCE"]["currentPriceEUR"], 100.0)  # untouched

    def test_feed_failures_are_named(self):
        result = self.run_sync(ecb="fail", mw="fail")
        self.assertIn("ECB feed: no headlines (TLS certificate could not be verified).", result["warnings"])
        self.assertIn("MarketWatch feed: no headlines (HTTP 503).", result["warnings"])
        self.assertEqual(result["liveNewsItemsFetched"], 0)

    def test_nothing_refreshed_is_failed(self):
        result = self.run_sync(quote="fail", fund="fail", ecb="fail", mw="fail")
        self.assertEqual(result["status"], "failed")
        self.assertEqual(result["sources"], [])
        self.assertEqual(len(result["warnings"]), 4)

    def test_missing_dataset_is_an_error(self):
        os.remove(os.path.join(self.data_dir, "etfs.json"))
        self.assertEqual(sync.run_full_sync(), {"error": "etfs.json not found"})


if __name__ == "__main__":
    unittest.main()
